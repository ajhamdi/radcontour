// Interactive 3D viewer of RadContour masks (three.js).
// Scene data: static/data/scene_<name>.json + static/assets/3d/<name>.bin (website/scripts/build_assets.py).
// Mesh frame: X = patient left, Y = posterior, Z = superior (mm, centred). three.js frame: (X, Z, -Y), so a camera on
// +z looks at the patient from the front (patient's right on the viewer's left), y is up.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $ = (id) => document.getElementById(id);
const stage = $('v3d-stage');
const canvas = $('v3d-canvas');
if (stage && canvas) init();

function init() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    $('v3d-loading').hidden = true;
    $('v3d-fallback').hidden = false;
    return;
  }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.localClippingEnabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 1, 5000);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;
  controls.enablePan = true;

  scene.add(new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(1, 1.4, 1.2);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5eead4, 0.55);
  rim.position.set(-1.2, 0.4, -1);
  scene.add(rim);
  camera.add(new THREE.PointLight(0xffffff, 0.35, 0, 0));
  scene.add(camera);

  const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  const ui = {
    view2d: 'compare',
    mode: 'ours', split: 0.5, cut: false, showPlane: true, slice: 0, asm: 1, hidden: new Set(), hover: null,
  };
  let S = null;                 // current scene state
  const cache = {};             // scene name -> {data, groups}
  let visible = true;
  let pending = false;          // a redraw is requested

  // ------------------------------------------------------------- loading --
  async function loadScene(name) {
    if (cache[name]) return cache[name];
    const data = await (await fetch(`static/data/scene_${name}.json`)).json();
    const buf = await (await fetch(data.bin)).arrayBuffer();
    const ours = new THREE.Group(), gt = new THREE.Group();
    const meshes = [];
    for (const m of data.meshes) {
      const q = new Int16Array(buf, m.ov, m.nv * 3);
      const pos = new Float32Array(m.nv * 3);
      for (let i = 0; i < m.nv; i++) {
        pos[3 * i] = q[3 * i] * data.scale;
        pos[3 * i + 1] = q[3 * i + 2] * data.scale;
        pos[3 * i + 2] = -q[3 * i + 1] * data.scale;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setIndex(new THREE.BufferAttribute(new Uint32Array(buf, m.of, m.nf * 3), 1));
      geo.computeVertexNormals();
      const color = new THREE.Color(`rgb(${m.rgb.join(',')})`);
      const mat = new THREE.MeshStandardMaterial({
        color, roughness: 0.42, metalness: 0.05, side: THREE.DoubleSide, clippingPlanes: [clip],
        transparent: name === 'spleen', opacity: 1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { slug: m.slug, label: m.label, set: m.set, dice: m.dice, color };
      (m.set === 'gt' ? gt : ours).add(mesh);
      meshes.push(mesh);
    }
    const root = new THREE.Group();
    root.add(ours, gt);

    // CT plane: one quad, texture swapped per slice. Image row 0 = most posterior, column 0 = x0.
    let plane = null, textures = [];
    if (data.plane) {
      const p = data.plane;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        p.x0, 0, -p.y0, p.x1, 0, -p.y0, p.x0, 0, -p.y1, p.x1, 0, -p.y1]), 3));
      g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), 2));
      g.setIndex([0, 2, 1, 1, 2, 3]);
      const mat = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false, opacity: 0.92 });
      plane = new THREE.Mesh(g, mat);
      plane.renderOrder = 2;
      root.add(plane);
      textures = new Array(p.n).fill(null);
    }

    // Keyframe outlines (spleen): one tube per traced loop.
    let rings = null;
    if (data.rings) {
      rings = new THREE.Group();
      const rmat = new THREE.MeshBasicMaterial({ color: 0x2ee59d, transparent: true, opacity: 1 });
      const sorted = [...data.rings].sort((a, b) => a.z - b.z);
      for (const kf of sorted) {
        for (const loop of kf.loops) {
          const pts = loop.map(([x, y]) => new THREE.Vector3(x, kf.z, -y));
          if (pts.length < 3) continue;
          const curve = new THREE.CatmullRomCurve3(pts, true, 'centripetal');
          const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, pts.length * 6, 0.45, 6, true), rmat);
          tube.userData.z = kf.z;
          rings.add(tube);
        }
      }
      root.add(rings);
    }
    cache[name] = { data, root, ours, gt, meshes, plane, textures, rings };
    return cache[name];
  }

  function texFor(i) {
    if (!S.plane) return null;
    if (!S.textures[i]) {
      const t = new THREE.TextureLoader().load(`${S.data.tex}${String(i).padStart(3, '0')}.webp`, () => draw());
      t.colorSpace = THREE.SRGBColorSpace;
      S.textures[i] = t;
    }
    return S.textures[i];
  }

  // ------------------------------------------------------------- scenes --
  async function show(name) {
    document.querySelectorAll('.v3d-tab').forEach((t) => t.classList.toggle('is-active', t.dataset.scene === name));
    $('v3d-loading').hidden = false;
    let st;
    try {
      st = await loadScene(name);
    } catch (e) {
      $('v3d-loading').hidden = true;
      $('v3d-fallback').hidden = false;
      return;
    }
    $('v3d-loading').hidden = true;
    if (S) scene.remove(S.root);
    S = st;
    scene.add(S.root);
    ui.hidden = new Set();
    const d = S.data;
    $('v3d-title').textContent = d.title;
    $('v3d-dice').textContent = d.dice_total ? `Dice ${d.dice_total.toFixed(1)}` : '';

    // mode buttons: GT / compare / overlay need ground truth
    document.querySelectorAll('#v3d-modes button').forEach((b) => {
      b.disabled = !d.has_gt && b.dataset.mode !== 'ours';
      b.style.opacity = b.disabled ? 0.35 : 1;
    });
    if (!d.has_gt) setMode('ours');
    else if (ui.mode === 'ours' && name !== 'spleen') setMode('ours');
    else setMode(ui.mode);

    $('v3d-assembly').hidden = !S.rings;
    $('v3d-slicegrp').hidden = !S.plane;
    if (S.rings) { ui.asm = 1; $('v3d-asm').value = 100; applyAsm(); }
    if (S.plane) {
      const n = d.plane.n;
      $('v3d-slice').max = n - 1;
      ui.slice = Math.round(n * 0.42);
      $('v3d-slice').value = ui.slice;
      // preload slice textures and roll images in the background
      setTimeout(() => { for (let i = 0; i < n; i++) texFor(i); preloadRoll(); }, 300);
    }
    applySlice();
    buildLegend();
    fitCamera();
    draw();
  }

  function fitCamera() {
    const [sx, sy, sz] = S.data.size;
    const r = 0.5 * Math.sqrt(sx * sx + sy * sy + sz * sz);
    const dist = r / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * 0.8;
    camera.position.set(dist * 0.18, dist * 0.22, dist * 0.96);
    camera.near = dist / 50; camera.far = dist * 10;
    camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    controls.update();
  }

  // ---------------------------------------------------------------- modes --
  function setMode(mode) {
    ui.mode = mode;
    document.querySelectorAll('#v3d-modes button').forEach((b) => b.classList.toggle('is-active', b.dataset.mode === mode));
    $('v3d-split').hidden = mode !== 'split';
    if (!S) return;
    for (const m of S.meshes) {
      const isGt = m.userData.set === 'gt';
      const mat = m.material;
      if (mode === 'overlay' && isGt) {
        mat.transparent = true; mat.opacity = 0.22; mat.depthWrite = false;
        mat.color.set(0xe2e8f0); mat.wireframe = false;
      } else {
        mat.transparent = S.data.name === 'spleen'; mat.opacity = 1; mat.depthWrite = true;
        mat.color.copy(m.userData.color);
      }
      mat.needsUpdate = true;
    }
    applyVisibility();
    if (S.rings) applyAsm();
    draw();
  }

  function applyVisibility(which) {
    if (!S) return;
    const mode = ui.mode;
    for (const m of S.meshes) {
      const isGt = m.userData.set === 'gt';
      let on;
      if (which) on = which === m.userData.set;
      else if (mode === 'gt') on = isGt;
      else if (mode === 'ours') on = !isGt;
      else on = true;               // overlay: both; split: decided per half
      m.visible = on && !ui.hidden.has(m.userData.slug);
    }
  }

  // --------------------------------------------------------------- slices --
  function applySlice() {
    if (!S) return;
    const on = !!S.plane;
    if (on) {
      const z = S.data.plane.z[ui.slice];
      S.plane.position.y = z;
      S.plane.visible = ui.showPlane;
      S.plane.material.map = texFor(ui.slice);
      S.plane.material.needsUpdate = true;
      clip.constant = ui.cut ? z + 0.01 : 1e6;
      $('v3d-slice-val').textContent = `${ui.slice + 1} / ${S.data.plane.n}`;
      const r = S.data.roll;
      const f = String(ui.slice).padStart(3, '0');
      $('v3d-img-ours').src = `${r.dir}ours_${f}.jpg`;
      $('v3d-img-gt').src = `${r.dir}gt_${f}.jpg`;
      if (ui.view2d !== 'compare') $('v3d-img-single').src = `${r.dir}${ui.view2d}_${f}.jpg`;
    } else {
      clip.constant = 1e6;
    }
  }
  function preloadRoll() {
    const r = S.data.roll;
    for (let i = 0; i < r.n; i++) {
      const f = String(i).padStart(3, '0');
      for (const p of ['ours', 'gt', 'input']) { const im = new Image(); im.src = `${r.dir}${p}_${f}.jpg`; }
    }
  }

  function applyAsm() {
    if (!S || !S.rings) return;
    const a = ui.asm;
    const tRings = Math.min(1, a / 0.55);
    const kids = S.rings.children;
    const zs = kids.map((k) => k.userData.z);
    const zmin = Math.min(...zs), zmax = Math.max(...zs);
    for (const k of kids) k.visible = (k.userData.z - zmin) / Math.max(1e-6, zmax - zmin) <= tRings + 1e-6;
    const fade = Math.max(0, Math.min(1, (a - 0.55) / 0.4));
    for (const m of S.meshes) { m.material.opacity = fade; m.visible = fade > 0.01; m.material.depthWrite = fade > 0.95; }
    S.rings.children.forEach((k) => { k.material.opacity = 1 - 0.7 * fade; });
    $('v3d-asm-val').textContent = a < 0.55 ? `${kids.filter((k) => k.visible).length} outlines` : 'surface';
  }

  // --------------------------------------------------------------- legend --
  function buildLegend() {
    const host = $('v3d-legend');
    host.innerHTML = '';
    const seen = new Set();
    for (const m of S.meshes) {
      const u = m.userData;
      if (seen.has(u.slug)) continue;
      seen.add(u.slug);
      const ours = S.meshes.find((x) => x.userData.slug === u.slug && x.userData.set === 'ours');
      const item = document.createElement('div');
      item.className = 'lg-item';
      item.innerHTML = `<i class="lg-sw" style="background:#${u.color.getHexString()}"></i>
        <span class="lg-name">${u.label}</span><span class="lg-dice">${ours && ours.userData.dice != null ? ours.userData.dice.toFixed(1) : ''}</span>`;
      item.addEventListener('click', () => {
        if (ui.hidden.has(u.slug)) ui.hidden.delete(u.slug); else ui.hidden.add(u.slug);
        item.classList.toggle('is-off', ui.hidden.has(u.slug));
        applyVisibility(); if (S.rings) applyAsm(); draw();
      });
      item.addEventListener('mouseenter', () => highlight(u.slug));
      item.addEventListener('mouseleave', () => highlight(null));
      host.appendChild(item);
    }
  }
  function highlight(slug) {
    if (!S) return;
    for (const m of S.meshes) {
      m.material.emissive = new THREE.Color(slug && m.userData.slug === slug ? 0x334155 : 0x000000);
    }
    draw();
  }

  // ---------------------------------------------------------------- hover --
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  const tip = $('v3d-tip');
  canvas.addEventListener('pointermove', (e) => {
    if (!S || e.buttons) { tip.hidden = true; return; }
    const r = canvas.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    // in compare mode, test the set that is drawn under the pointer
    if (ui.mode === 'split') applyVisibility((e.clientX - r.left) / r.width < ui.split ? 'gt' : 'ours');
    ray.setFromCamera(ptr, camera);
    const hits = ray.intersectObjects(S.meshes.filter((m) => m.visible), false)
      .filter((h) => !ui.cut || !S.plane || h.point.y <= clip.constant);
    if (ui.mode === 'split') applyVisibility();
    if (hits.length) {
      const u = hits[0].object.userData;
      const ours = S.meshes.find((x) => x.userData.slug === u.slug && x.userData.set === 'ours');
      const who = u.set === 'gt' ? 'ground truth' : 'RadContour';
      tip.innerHTML = `${u.label} <span style="color:#94a3b8">(${who})</span>` +
        (ours && ours.userData.dice != null ? ` &middot; Dice <b>${ours.userData.dice.toFixed(1)}</b>` : '');
      tip.style.left = `${e.clientX - r.left}px`;
      tip.style.top = `${e.clientY - r.top}px`;
      tip.hidden = false;
    } else tip.hidden = true;
  });
  canvas.addEventListener('pointerleave', () => { tip.hidden = true; });

  // ------------------------------------------------------------- controls --
  document.querySelectorAll('.v3d-tab').forEach((t) => t.addEventListener('click', () => show(t.dataset.scene)));
  document.querySelectorAll('#v3d-modes button').forEach((b) => b.addEventListener('click', () => { if (!b.disabled) setMode(b.dataset.mode); }));
  $('v3d-slice').addEventListener('input', (e) => { ui.slice = +e.target.value; applySlice(); draw(); });
  $('v3d-cut').addEventListener('change', (e) => { ui.cut = e.target.checked; applySlice(); draw(); });
  $('v3d-plane').addEventListener('change', (e) => { ui.showPlane = e.target.checked; applySlice(); draw(); });
  $('v3d-asm').addEventListener('input', (e) => { ui.asm = +e.target.value / 100; applyAsm(); draw(); });
  const spinBtn = $('v3d-spin');
  spinBtn.classList.add('is-active');
  spinBtn.addEventListener('click', () => {
    controls.autoRotate = !controls.autoRotate;
    spinBtn.classList.toggle('is-active', controls.autoRotate);
  });
  $('v3d-reset').addEventListener('click', () => { if (S) fitCamera(); });
  controls.addEventListener('start', () => { controls.autoRotate = false; spinBtn.classList.remove('is-active'); });
  controls.addEventListener('change', draw);
  window.addEventListener('rc:scene', (e) => show(e.detail));

  // 2D slice: scan / ground truth / ours / compare slider
  document.querySelectorAll('#v3d-view2d button').forEach((b) => b.addEventListener('click', () => {
    ui.view2d = b.dataset.view;
    document.querySelectorAll('#v3d-view2d button').forEach((x) => x.classList.toggle('is-active', x === b));
    $('v3d-cmp').hidden = ui.view2d !== 'compare';
    $('v3d-img-single').hidden = ui.view2d === 'compare';
    applySlice();
  }));

  // scroll on the 2D slice steps through the volume
  const cmp = $('v3d-cmp');
  $('v3d-slicebox').addEventListener('wheel', (e) => {
    if (!S || !S.plane) return;
    e.preventDefault();
    ui.slice = Math.max(0, Math.min(S.data.plane.n - 1, ui.slice + (e.deltaY > 0 ? 1 : -1)));
    $('v3d-slice').value = ui.slice;
    applySlice(); draw();
  }, { passive: false });
  if (window.RC_initCompare) window.RC_initCompare(cmp, 50);
  else document.addEventListener('DOMContentLoaded', () => window.RC_initCompare && window.RC_initCompare(cmp, 50));

  // split divider in the 3D stage
  const splitEl = $('v3d-split');
  const knob = splitEl.querySelector('.v3d-split-knob');
  let dragging = false;
  const setSplit = (x) => { ui.split = Math.max(0.02, Math.min(0.98, x)); splitEl.style.setProperty('--x', `${ui.split * 100}%`); draw(); };
  knob.addEventListener('pointerdown', (e) => { dragging = true; knob.setPointerCapture(e.pointerId); e.stopPropagation(); });
  knob.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const r = stage.getBoundingClientRect();
    setSplit((e.clientX - r.left) / r.width);
  });
  knob.addEventListener('pointerup', () => { dragging = false; });
  setSplit(0.5);

  // --------------------------------------------------------------- render --
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    draw();
  }
  new ResizeObserver(resize).observe(stage);

  function draw() { pending = true; }
  function frame() {
    requestAnimationFrame(frame);
    if (!visible || !S) return;
    const moved = controls.update();
    if (!moved && !pending && !controls.autoRotate) return;
    pending = false;
    const w = stage.clientWidth, h = stage.clientHeight;
    if (ui.mode === 'split') {
      renderer.setScissorTest(true);
      const sx = Math.round(ui.split * w);
      applyVisibility('gt');
      renderer.setViewport(0, 0, w, h);
      renderer.setScissor(0, 0, sx, h);
      renderer.render(scene, camera);
      applyVisibility('ours');
      renderer.setScissor(sx, 0, w - sx, h);
      renderer.render(scene, camera);
      renderer.setScissorTest(false);
      applyVisibility();
    } else {
      renderer.setViewport(0, 0, w, h);
      renderer.render(scene, camera);
    }
  }
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) draw(); }).observe(stage);

  // load the first scene when the section comes near
  const io = new IntersectionObserver((es) => {
    if (es[0].isIntersecting) { io.disconnect(); resize(); show('btcv'); requestAnimationFrame(frame); }
  }, { rootMargin: '400px' });
  io.observe(stage);
}
