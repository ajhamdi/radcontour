/* RadContour project page: everything except the three.js viewer (viewer3d.js).
 * Numbers are the paper's (main tables, analysis); data files in static/data/ are written by
 * website/scripts/build_assets.py. */

/* ------------------------------------------------------------------ data -- */

// Table 1 (tumors and lesions). Dice x100, identical cases. VoxTell = our run of the released checkpoint.
var LESION_COLS = [
  { k: 'bladder', name: 'Bladder cancer', mod: 'MRI', grp: 'Unknown concept' },
  { k: 'esoph', name: 'Esoph. tumor', mod: 'CT', grp: 'Unknown concept' },
  { k: 'breast', name: 'Breast cancer', mod: 'PET', grp: 'Cross-modality' },
  { k: 'sarcoma', name: 'Sarcoma', mod: 'MRI', grp: 'Cross-modality' },
  { k: 'lung', name: 'Lung tumor', mod: 'PET', grp: 'Unseen dataset' },
  { k: 'ms', name: 'Multiple sclerosis', mod: 'MRI', grp: 'Unseen dataset' },
  { k: 'adrenal', name: 'Adrenal tumor', mod: 'CT', grp: 'Unseen dataset' },
  { k: 'liver', name: 'Liver lesions', mod: 'CT', grp: 'Unseen dataset' },
  { k: 'brain', name: 'Brain mets', mod: 'MRI', grp: 'Unseen dataset' }
];
var LESION_ROWS = [
  { name: 'BiomedParse', net: false, v: [10.4, 17.9, 0.8, 36.2, 2.7, 9.6, 52.9, 41.3, 9.6, 20.2] },
  { name: 'Text3DSAM', net: true, v: [2.0, 7.3, 0.0, 12.8, 12.2, 0.2, 0.0, 0.5, 0.1, 3.9] },
  { name: 'SegVol', net: true, v: [0.1, 32.2, 0.1, 0.8, 0.0, 0.0, 51.1, 58.4, 0.0, 15.9] },
  { name: 'BiomedParse-V2', net: false, v: [2.7, 16.6, 0.0, 7.7, 0.5, 2.0, 55.9, 70.4, 18.7, 19.4] },
  { name: 'SAT', net: true, v: [9.6, 0.0, 58.3, 10.6, 77.1, 13.7, 0.1, 62.3, 22.2, 28.2] },
  { name: 'VoxTell', net: true, best: true, v: [23.3, 69.1, 69.7, 39.3, 62.3, 72.4, 76.7, 66.3, 46.7, 58.4] },
  { name: 'RadContour', model: 'Haiku 5.5', ours: 'weak', v: [30.8, 0.0, 42.1, 65.9, 24.2, 50.8, 58.0, 38.2, 23.5, 37.1] },
  { name: 'RadContour', model: 'Sonnet 5.5', ours: 'weak', v: [41.8, 0.0, 54.2, 74.4, 34.7, 54.7, 65.9, 51.7, 23.5, 44.5] },
  { name: 'RadContour', model: 'Fable 5.2', ours: 'main', v: [43.0, 82.2, 60.9, 76.5, 56.0, 60.8, 58.3, 59.3, 31.6, 58.7] }
];

// Table 2 (anatomy).
var ANAT_COLS = [
  { k: 'ped', name: 'Organs (pediatric)', mod: 'CT' },
  { k: 'lung', name: 'Lung & airway', mod: 'CT' },
  { k: 'liver', name: 'Liver & vessels', mod: 'CT' },
  { k: 'heart', name: 'Heart', mod: 'MRI' },
  { k: 'pelvis', name: 'Pelvic bones', mod: 'CT' }
];
var ANAT_ROWS = [
  { name: 'TotalSegmentator', net: true, v: [67.6, 85.2, 49.5, null, null, null] },
  { name: 'BiomedParse', net: false, v: [9.1, 0.0, 6.5, 8.1, 0.5, 4.8] },
  { name: 'Text3DSAM', net: true, v: [26.6, 65.4, 28.9, 15.7, 24.8, 32.3] },
  { name: 'SegVol', net: true, v: [52.5, 88.7, 41.3, 1.9, 22.1, 41.3] },
  { name: 'BiomedParse-V2', net: false, v: [51.8, 62.6, 35.1, 18.1, 1.4, 33.8] },
  { name: 'SAT', net: true, v: [68.8, 88.0, 37.7, 43.4, 96.1, 66.8] },
  { name: 'VoxTell', net: true, best: true, v: [72.8, 89.7, 57.2, 52.7, 97.6, 74.0] },
  { name: 'RadContour', model: 'Haiku 5.5', ours: 'weak', v: [56.2, 84.6, 44.7, 40.4, 87.0, 62.6] },
  { name: 'RadContour', model: 'Sonnet 5.5', ours: 'main', v: [62.3, 84.1, 47.5, 49.0, 89.8, 66.5] }
];

// Table 3 (3D semantic segmentation): BTCV, AMOS, BraTS means. Every baseline has seen voxel labels of these structures.
var STD = {
  cols: [
    { name: 'BTCV', what: 'abdominal organs, CT' },
    { name: 'AMOS', what: 'abdominal organs, MRI' },
    { name: 'BraTS', what: 'brain tumor regions, MRI' }
  ],
  rows: [
    ['UNet', [null, null, 54.4]], ['V-Net', [null, null, 84.2]], ['ResUNet++', [null, null, 78.4]],
    ['Attention U-Net', [null, null, 79.8]], ['nnFormer', [null, null, 81.2]], ['UNETR', [null, null, 87.1]],
    ['SegResNet', [null, null, 89.0]], ['Swin-UNETR', [null, null, 88.6]], ['TotalVibeSeg.', [79.2, 79.6, 83.0]],
    ['Swin-BOB', [88.2, 84.0, 89.4]], ['VoxTell', [88.2, 86.4, 88.4]],
    ['RadContour (Haiku 5.5)', [71.8, 62.7, 62.2], true], ['RadContour (Sonnet 5.5)', [76.7, 69.9, 73.9], true]
  ]
};

// Table 5 (wording): anatomy (10 prompts) and tumors (2 prompts), label / synonym / description.
var WORDING = {
  groups: ['Anatomy', 'Tumors'],
  kinds: ['label', 'synonym', 'description'],
  vox: [[91.6, 91.3, 65.9], [29.7, 28.0, 20.6]],
  ours: [[78.3, 78.0, 78.2], [48.0, 72.8, 68.3]]
};

// Figure 6: 25 backbones on the same ten pelvic CT volumes (PENGWIN), unchanged pipeline.
var BACKBONES = [
  ['Fable 5.2', 'anthropic', 89.4], ['GPT-6.1 Terra', 'openai', 88.7], ['Opus 5.5', 'anthropic', 88.5],
  ['Gemini 4 Carbon', 'google', 88.3], ['Gemini 4 Argon', 'google', 88.1], ['Sonnet 5.5', 'anthropic', 86.9],
  ['Gemini 4 Hydrogen', 'google', 85.1], ['Haiku 5.5', 'anthropic', 82.5], ['Gemini 3.8 Flash', 'google', 81.2],
  ['Opus 5', 'anthropic', 80.9], ['GPT-6 Luna', 'openai', 73.8], ['GPT-5.6 Luna', 'openai', 69.7],
  ['Gemini 3.5 Flash', 'google', 67.0], ['Gemini 3.1 Pro', 'google', 61.4], ['GLM 5.3 Flash', 'zai', 51.7, true],
  ['Qwen3.8 27B', 'alibaba', 41.9, true], ['Qwen3.5 397B', 'alibaba', 41.0, true], ['Sonnet 5', 'anthropic', 39.5],
  ['Gemini 3.5 Flash-Lite', 'google', 34.7], ['Muse Glimmer 30B', 'meta', 33.0, true], ['Gemma 4 26B', 'google', 23.9, true],
  ['Gemini 3.1 Flash-Lite', 'google', 11.6], ['Qwen3.5 9B', 'alibaba', 11.0, true], ['GLM 4.6V', 'zai', 8.0, true],
  ['Haiku 4.5', 'anthropic', 5.2]
];
var FAMILIES = [['anthropic', 'Anthropic'], ['openai', 'OpenAI'], ['google', 'Google'], ['alibaba', 'Alibaba'],
  ['zai', 'Z.ai'], ['meta', 'Meta']];
var GENERATIONS = [['Haiku 4.5', 'Haiku 5.5'], ['Sonnet 5', 'Sonnet 5.5'], ['Gemini 3.1 Flash-Lite', 'Gemini 3.5 Flash-Lite']];
var BK_REF = { label: 'VoxTell', v: 96.7 };

/* --------------------------------------------------------------- helpers -- */

function el(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined && text !== null) e.textContent = text;
  return e;
}
function fmt(v) { return v === null || v === undefined ? '\u2013' : v.toFixed(1); }
function pad3(i) { return ('00' + i).slice(-3); }
function onVisible(node, fn, threshold) {
  if (!node) return;
  if (!('IntersectionObserver' in window)) { fn(); return; }
  var io = new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) { io.disconnect(); fn(); }
  }, { threshold: threshold || 0.15 });
  io.observe(node);
}
function getJSON(url) {
  return fetch(url).then(function (r) { if (!r.ok) throw new Error(url); return r.json(); });
}
var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------- counters -- */

function animateCount(node) {
  var target = parseFloat(node.getAttribute('data-count'));
  var dec = parseInt(node.getAttribute('data-dec') || '0', 10);
  var fmtN = function (v) {
    return dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
  };
  if (REDUCED || target === 0) { node.textContent = fmtN(target); return; }
  var t0 = null, dur = 1200;
  function step(t) {
    if (!t0) t0 = t;
    var p = Math.min(1, (t - t0) / dur);
    var e = 1 - Math.pow(1 - p, 3);
    node.textContent = fmtN(target * e);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ------------------------------------------------- hero background canvas -- */

// A slowly turning stack of closed contours, the visual idea of the method (outlines on slices -> a volume).
function heroCanvas() {
  var cv = document.getElementById('hero-canvas');
  if (!cv || REDUCED) return;
  var ctx = cv.getContext('2d');
  var W, H, dpr = Math.min(2, window.devicePixelRatio || 1);
  function size() {
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  window.addEventListener('resize', size);
  var N = 30, P = 64, running = true;
  var io = new IntersectionObserver(function (es) { running = es[0].isIntersecting; if (running) requestAnimationFrame(draw); });
  io.observe(cv);
  function radius(z, a, t) {
    var base = Math.sin(Math.PI * (z + 0.03)) * 0.95;
    return base * (1 + 0.18 * Math.sin(3 * a + z * 4 + t * 0.4) + 0.08 * Math.cos(5 * a - z * 6));
  }
  function draw(ts) {
    if (!running) return;
    var t = ts / 1000;
    ctx.clearRect(0, 0, W, H);
    var cx = W * 0.06, cy = H * 0.55, R = Math.min(W, H) * 0.3;
    var rot = t * 0.25, tilt = 0.42;
    for (var i = 0; i < N; i++) {
      var z = i / (N - 1);
      ctx.beginPath();
      for (var j = 0; j <= P; j++) {
        var a = (j / P) * Math.PI * 2;
        var r = radius(z, a, t) * R;
        var x = Math.cos(a + rot) * r, y = Math.sin(a + rot) * r;
        var sx = cx + x, sy = cy + (0.5 - z) * R * 2.2 + y * tilt;
        if (j === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      var glow = 0.5 + 0.5 * Math.sin(t * 1.2 - z * 7);
      ctx.strokeStyle = 'rgba(13,148,136,' + (0.04 + 0.12 * glow).toFixed(3) + ')';
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

/* ---------------------------------------------------------- quick nav -- */

function quickNav() {
  var nav = document.getElementById('quicknav');
  var hero = document.getElementById('top');
  if (!nav || !hero) return;
  window.addEventListener('scroll', function () {
    nav.classList.toggle('is-shown', window.scrollY > hero.offsetHeight - 60);
  }, { passive: true });
  var links = nav.querySelectorAll('.qn-links a');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting && map[e.target.id]) {
        links.forEach(function (a) { a.classList.remove('is-current'); });
        map[e.target.id].classList.add('is-current');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
}

/* ---------------------------------------------------- image compare -- */

function initCompare(box, start) {
  var over = box.querySelector('.ic-over');
  var handle = box.querySelector('.ic-handle');
  function setPct(pct) {
    pct = Math.max(1, Math.min(99, pct));
    over.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    handle.style.left = pct + '%';
  }
  function fromEvent(e) {
    var r = box.getBoundingClientRect();
    setPct(((e.clientX - r.left) / r.width) * 100);
  }
  setPct(start || 50);
  var dragging = false;
  box.addEventListener('pointerdown', function (e) { dragging = true; box.setPointerCapture(e.pointerId); fromEvent(e); });
  box.addEventListener('pointermove', function (e) { if (dragging || e.pointerType === 'mouse') fromEvent(e); });
  box.addEventListener('pointerup', function () { dragging = false; });
  box.addEventListener('pointercancel', function () { dragging = false; });
  return setPct;
}
window.RC_initCompare = initCompare;

/* --------------------------------------------------------- slice rolls -- */

function initRoll(host, meta) {
  var order = (host.getAttribute('data-order') || meta.panels.join(',')).split(',');
  var labels = (host.getAttribute('data-labels') || order.join('|')).split('|');
  var fps = parseFloat(host.getAttribute('data-fps') || '10');
  var n = meta.n, idx = Math.floor(n * 0.45), playing = !REDUCED, timer = null;

  if (host.getAttribute('data-title')) {
    var tt = el('div', 'roll-title'); tt.innerHTML = host.getAttribute('data-title'); host.appendChild(tt);
  }
  var body = el('div', 'roll-body');
  var scout = null, sline = null;
  if (meta.scout) {
    scout = el('div', 'roll-scout');
    var si = document.createElement('img'); si.src = meta.dir + 'scout.jpg'; si.alt = 'Coronal scout'; scout.appendChild(si);
    sline = el('div', 'scout-line');
    sline.style.left = (meta.scout.x0 * 100) + '%';
    sline.style.right = ((1 - meta.scout.x1) * 100) + '%';
    scout.appendChild(sline);
    body.appendChild(scout);
  } else {
    body.style.gridTemplateColumns = '1fr';
  }
  var panels = el('div', 'roll-panels');
  panels.style.gridTemplateColumns = 'repeat(' + order.length + ', 1fr)';
  var imgs = [];
  order.forEach(function (p, i) {
    var fig = el('figure', 'roll-panel' + (p === 'ours' ? ' is-ours' : ''));
    var im = document.createElement('img');
    im.alt = labels[i];
    im.width = meta.w; im.height = meta.h;
    fig.appendChild(im);
    if (meta.dice && meta.dice[p] !== undefined) fig.appendChild(el('span', 'dice-chip', 'Dice ' + fmt(meta.dice[p])));
    fig.appendChild(el('figcaption', null, labels[i]));
    panels.appendChild(fig);
    imgs.push([p, im]);
  });
  body.appendChild(panels);
  host.appendChild(body);

  var ctrl = el('div', 'roll-ctrl');
  var btn = el('button'); btn.type = 'button'; btn.setAttribute('aria-label', 'Play or pause');
  var range = el('input', 'range'); range.type = 'range'; range.min = 0; range.max = n - 1; range.value = idx;
  var pos = el('span', 'roll-pos');
  ctrl.appendChild(btn); ctrl.appendChild(range); ctrl.appendChild(pos);
  host.appendChild(ctrl);
  if (meta.legend && meta.legend.length > 1) {
    var lg = el('div', 'roll-legend');
    meta.legend.forEach(function (l) {
      var s = el('span'); var i = el('i'); i.style.background = 'rgb(' + l.rgb.join(',') + ')';
      s.appendChild(i); s.appendChild(document.createTextNode(l.label)); lg.appendChild(s);
    });
    host.appendChild(lg);
  }

  // preload every frame so scrubbing is instant
  var cache = [];
  function preload() {
    for (var i = 0; i < n; i++) order.forEach(function (p) { var im = new Image(); im.src = meta.dir + p + '_' + pad3(i) + '.jpg'; cache.push(im); });
  }
  function show(i) {
    idx = (i + n) % n;
    imgs.forEach(function (pi) { pi[1].src = meta.dir + pi[0] + '_' + pad3(idx) + '.jpg'; });
    range.value = idx;
    if (sline && meta.scout.y) sline.style.top = (meta.scout.y[idx] * 100) + '%';
    pos.textContent = (idx + 1) + ' / ' + n;
  }
  function setPlay(p) {
    playing = p;
    btn.innerHTML = p ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    clearInterval(timer);
    if (p) timer = setInterval(function () { show(idx + 1); }, 1000 / fps);
  }
  btn.addEventListener('click', function () { setPlay(!playing); });
  range.addEventListener('input', function () { setPlay(false); show(parseInt(range.value, 10)); });
  panels.addEventListener('wheel', function (e) {
    e.preventDefault(); setPlay(false); show(idx + (e.deltaY > 0 ? 1 : -1));
  }, { passive: false });
  show(idx);
  setPlay(false);
  onVisible(host, function () { preload(); if (!REDUCED) setPlay(true); }, 0.2);
  // pause when scrolled away
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting && playing) { setPlay(false); host._autoPaused = true; }
      else if (es[0].isIntersecting && host._autoPaused) { host._autoPaused = false; setPlay(true); }
    }).observe(host);
  }
}

function initRolls() {
  var hosts = document.querySelectorAll('.roll[data-roll]');
  if (!hosts.length) return;
  getJSON('static/data/rolls.json').then(function (all) {
    hosts.forEach(function (h) { var m = all[h.getAttribute('data-roll')]; if (m) initRoll(h, m); });
  }).catch(function () {
    hosts.forEach(function (h) { h.textContent = 'Slice rolls need a local web server (python -m http.server).'; });
  });
}

/* ---------------------------------------------- turntables (video + canvas) -- */

// One video holds GT | ours side by side; the canvas shows GT left of the divider and ours right of it.
function initTurntable(host) {
  var video = document.createElement('video');
  video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'auto';
  video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
  var cv = document.createElement('canvas');
  var ctx = cv.getContext('2d');
  var handle = el('div', 'ic-handle');
  var knob = el('div', 'tt-knob'); knob.innerHTML = '<i class="fas fa-arrows-alt-h"></i>';
  var lab1 = el('span', 'tt-lab l', 'Ground truth');
  var lab2 = el('span', 'tt-lab r', 'RadContour');
  var play = el('button', 'tt-play'); play.type = 'button'; play.setAttribute('aria-label', 'Play or pause');
  play.innerHTML = '<i class="fas fa-pause"></i>';
  [video, cv, handle, knob, lab1, lab2, play].forEach(function (n) { host.appendChild(n); });

  var split = parseFloat(host.getAttribute('data-split') || '0.5');
  var visible = false, userPaused = false;
  function place() { handle.style.left = (split * 100) + '%'; knob.style.left = (split * 100) + '%'; }
  place();
  function draw() {
    if (video.readyState >= 2) {
      var w = video.videoWidth / 2, h = video.videoHeight;
      if (cv.width !== w) { cv.width = w; cv.height = h; }
      var sx = Math.round(split * w);
      if (sx > 0) ctx.drawImage(video, 0, 0, sx, h, 0, 0, sx, h);
      if (sx < w) ctx.drawImage(video, w + sx, 0, w - sx, h, sx, 0, w - sx, h);
    }
    if (visible) requestAnimationFrame(draw);
  }
  // the video downloads only when the turntable comes near the viewport
  var loaded = false;
  new IntersectionObserver(function (es) {
    visible = es[0].isIntersecting;
    if (visible && !loaded) { loaded = true; video.src = host.getAttribute('data-src'); }
    if (visible) { if (!userPaused && !REDUCED) video.play().catch(function () {}); requestAnimationFrame(draw); }
    else video.pause();
  }, { rootMargin: '300px 0px' }).observe(host);
  // draw directly on video events too, so the first frame shows even when animation frames are throttled
  function drawOnce() { var v = visible; visible = false; draw(); visible = v; }
  video.addEventListener('loadeddata', drawOnce);
  video.addEventListener('timeupdate', drawOnce);

  function setPlayIcon() { play.innerHTML = video.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>'; }
  video.addEventListener('play', setPlayIcon); video.addEventListener('pause', setPlayIcon);
  play.addEventListener('click', function (e) {
    e.stopPropagation();
    if (video.paused) { userPaused = false; video.play(); } else { userPaused = true; video.pause(); }
  });
  play.addEventListener('pointerdown', function (e) { e.stopPropagation(); });

  var mode = null, x0 = 0, t0 = 0, wasPlaying = false;
  host.addEventListener('pointerdown', function (e) {
    var r = host.getBoundingClientRect();
    var fx = (e.clientX - r.left) / r.width;
    host.setPointerCapture(e.pointerId);
    if (Math.abs(fx - split) < 0.06 || e.target === knob || knob.contains(e.target)) {
      mode = 'split';
    } else {
      mode = 'spin'; x0 = e.clientX; t0 = video.currentTime; wasPlaying = !video.paused; video.pause();
    }
  });
  host.addEventListener('pointermove', function (e) {
    var r = host.getBoundingClientRect();
    if (mode === 'split') {
      split = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); place();
      if (video.paused) requestAnimationFrame(draw);
    } else if (mode === 'spin' && video.duration) {
      var d = video.duration;
      var t = t0 - ((e.clientX - x0) / r.width) * d * 0.9;
      video.currentTime = ((t % d) + d) % d;
    }
  });
  function end() {
    if (mode === 'spin' && wasPlaying && !userPaused) video.play().catch(function () {});
    mode = null;
  }
  host.addEventListener('pointerup', end);
  host.addEventListener('pointercancel', end);
  video.addEventListener('seeked', function () { if (video.paused) requestAnimationFrame(draw); });
}

/* ------------------------------------------------------ method stepper -- */

function jsonTokens(obj) {
  // Pretty JSON split into [text, class] tokens for syntax colouring.
  var src = JSON.stringify(obj, null, 2);
  var toks = [], re = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?)|([^"\d-]+|-)/g, m;
  while ((m = re.exec(src))) {
    if (m[1] && m[2]) { toks.push([m[1], 'k']); toks.push([m[2], '']); }
    else if (m[1]) toks.push([m[1], 's']);
    else if (m[3]) toks.push([m[3], 'n']);
    else toks.push([m[4], '']);
  }
  return toks;
}
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function typeTokens(node, toks, cps) {
  var total = toks.reduce(function (a, t) { return a + t[0].length; }, 0);
  var shown = 0;
  if (node._typer) clearInterval(node._typer);
  function render(nc) {
    var out = '', left = nc;
    for (var i = 0; i < toks.length && left > 0; i++) {
      var s = toks[i][0].slice(0, left); left -= s.length;
      out += toks[i][1] ? '<span class="' + toks[i][1] + '">' + esc(s) + '</span>' : esc(s);
    }
    node.innerHTML = out + (nc < total ? '<span class="caret">&nbsp;</span>' : '');
  }
  if (REDUCED) { render(total); return; }
  node._typer = setInterval(function () {
    shown = Math.min(total, shown + (cps || 4));
    render(shown);
    if (shown >= total) clearInterval(node._typer);
  }, 16);
}

// Closed Catmull-Rom through the points, as cubic Bezier segments (close to the paper's interpolating spline).
function closedSplinePath(pts) {
  var n = pts.length, d = '';
  for (var i = 0; i < n; i++) {
    var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    if (i === 0) d += 'M' + p1[0].toFixed(1) + ',' + p1[1].toFixed(1);
    var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    var c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += 'C' + c1[0].toFixed(1) + ',' + c1[1].toFixed(1) + ' ' + c2[0].toFixed(1) + ',' + c2[1].toFixed(1) + ' ' +
      p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
  }
  return d + 'Z';
}

function initStepper() {
  var root = document.getElementById('stepper');
  if (!root) return;
  var tabs = root.querySelectorAll('.st-tab'), panes = root.querySelectorAll('.st-pane');
  var bar = document.getElementById('st-bar');
  var M = null, cur = -1, autoTimer = null, built = {}, locTimers = [];
  var asmVideo = document.getElementById('asm-video'), asmRange = document.getElementById('asm-range');
  var asmVal = document.getElementById('asm-val');

  function go(i, user) {
    if (user) clearTimeout(autoTimer);
    cur = i;
    tabs.forEach(function (t, k) { t.classList.toggle('is-active', k === i); });
    panes.forEach(function (p, k) { p.classList.toggle('is-active', k === i); });
    bar.style.width = ((i + 1) * 25) + '%';
    if (M) enter(i);
    if (i !== 3 && asmVideo) asmVideo.pause();
  }
  tabs.forEach(function (t, k) { t.addEventListener('click', function () { go(k, true); }); });

  function enter(i) {
    if (i === 0) {
      if (!built[0]) {
        var ov = document.getElementById('st-ov');
        ['axial', 'coronal', 'sagittal'].forEach(function (k) {
          var f = el('figure'); var im = document.createElement('img'); im.src = M.overview[k].src; im.alt = k + ' overview';
          f.appendChild(im); f.appendChild(el('figcaption', null, k)); ov.appendChild(f);
        });
        built[0] = true;
      }
      typeTokens(document.getElementById('st-plan'), jsonTokens(M.plan), 2);
    } else if (i === 1) {
      if (!built[1]) {
        var sc = document.getElementById('st-scout');
        var si = document.createElement('img'); si.src = M.scout.src; si.alt = 'coronal context'; sc.appendChild(si);
        M.scout.fine.forEach(function (y) { var l = el('div', 'sline'); l.style.top = (y * 100) + '%'; sc.appendChild(l); });
        var strip = function (host, items, getBoxes) {
          items.forEach(function (c) {
            var v = el('div', 'loc-view');
            var im = document.createElement('img'); im.src = c.src; im.alt = 'slice ' + c.z; v.appendChild(im);
            var bxs = getBoxes(c);
            if (!bxs.length) v.classList.add('none');
            bxs.forEach(function (b) {
              var bx = el('div', 'bx');
              bx.style.left = (b[0] * 100) + '%'; bx.style.top = (b[1] * 100) + '%';
              bx.style.width = ((b[2] - b[0]) * 100) + '%'; bx.style.height = ((b[3] - b[1]) * 100) + '%';
              v.appendChild(bx);
            });
            v.appendChild(el('span', 'zlab', 'z ' + c.z));
            host.appendChild(v);
          });
        };
        strip(document.getElementById('st-coarse'), M.coarse, function (c) { return c.boxes; });
        strip(document.getElementById('st-fine'), M.fine.slice(0, 8), function (c) { return [c.box]; });
        built[1] = true;
      }
      // coarse boxes one by one, then the fine search range on the scout, then the fine boxes
      var cbx = root.querySelectorAll('#st-coarse .bx'), fbx = root.querySelectorAll('#st-fine .bx');
      var lines = root.querySelectorAll('.sline');
      [cbx, fbx, lines].forEach(function (g) { g.forEach(function (b) { b.classList.remove('on'); }); });
      locTimers.forEach(clearTimeout); locTimers = [];
      var later = function (node, t) { locTimers.push(setTimeout(function () { node.classList.add('on'); }, t)); };
      cbx.forEach(function (b, k) { later(b, 500 + k * 450); });
      var t1 = 500 + cbx.length * 450 + 400;
      lines.forEach(function (l, k) { later(l, t1 + k * 90); });
      var t2 = t1 + lines.length * 90 + 300;
      fbx.forEach(function (b, k) { later(b, t2 + k * 380); });
    } else if (i === 2) {
      var K = M.keyframe;
      if (!built[2]) {
        var full = document.getElementById('st-kffull');
        var fi = document.createElement('img'); fi.src = K.full; fi.alt = 'FULL keyframe'; full.appendChild(fi);
        var r = K.crop_rect;
        full.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 1 1" preserveAspectRatio="none"><rect x="' + r[0] +
          '" y="' + r[1] + '" width="' + (r[2] - r[0]) + '" height="' + (r[3] - r[1]) +
          '" fill="none" stroke="#facc15" stroke-width="0.006"/></svg>');
        var crop = document.getElementById('st-kfcrop');
        var ci = document.createElement('img'); ci.src = K.crop; ci.alt = 'zoomed CROP'; crop.appendChild(ci);
        var w = K.crop_w, h = K.crop_h, svg = '<svg viewBox="0 0 ' + w + ' ' + h + '">';
        K.loops.forEach(function (lp, li) {
          var pts = lp.points.map(function (p) { return [p[0] * w, p[1] * h]; });
          svg += '<path class="trace" d="' + closedSplinePath(pts) + '" fill="rgba(46,229,157,0.18)" stroke="#2ee59d" stroke-width="4"/>';
          pts.forEach(function (p, k) {
            svg += '<circle class="tp" data-k="' + k + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="7" fill="#22d3ee" stroke="#0b1220" stroke-width="2" opacity="0"/>';
          });
        });
        crop.insertAdjacentHTML('beforeend', svg + '</svg>');
        built[2] = true;
      }
      retrace();
    } else if (i === 3) {
      if (asmVideo && !REDUCED) { asmVideo.currentTime = 0; asmVideo.play().catch(function () {}); }
    }
  }

  function retrace() {
    var K = M.keyframe, crop = document.getElementById('st-kfcrop');
    var path = crop.querySelector('.trace'), dots = crop.querySelectorAll('.tp');
    dots.forEach(function (d) { d.setAttribute('opacity', '0'); });
    dots.forEach(function (d, k) { setTimeout(function () { d.setAttribute('opacity', '1'); }, 120 + k * 70); });
    if (path) {
      var L = path.getTotalLength();
      path.style.transition = 'none';
      path.style.strokeDasharray = L; path.style.strokeDashoffset = L; path.style.fillOpacity = 0;
      path.getBoundingClientRect();
      path.style.transition = 'stroke-dashoffset 1.6s ease ' + (0.3 + dots.length * 0.07) + 's, fill-opacity 0.6s ease ' + (1.9 + dots.length * 0.07) + 's';
      path.style.strokeDashoffset = 0; path.style.fillOpacity = 1;
    }
  }
  document.getElementById('st-retrace').addEventListener('click', retrace);

  if (asmVideo) {
    asmVideo.addEventListener('timeupdate', function () {
      var f = Math.round(asmVideo.currentTime * 30);
      asmRange.value = f;
    });
    asmVideo.addEventListener('ended', function () { asmVideo.pause(); });
    asmRange.addEventListener('input', function () {
      asmVideo.pause(); asmVideo.currentTime = parseInt(asmRange.value, 10) / 30;
    });
  }

  getJSON('static/data/method.json').then(function (m) {
    M = m;
    onVisible(root, function () { go(0); scheduleAuto(); }, 0.3);
  }).catch(function () {});

  // Advance automatically until the visitor takes over.
  var userTook = false;
  root.addEventListener('pointerdown', function () { userTook = true; clearTimeout(autoTimer); });
  function scheduleAuto() {
    if (REDUCED) return;
    var wait = [14000, 13000, 9000][cur];
    if (cur >= 3 || userTook) return;
    autoTimer = setTimeout(function () { if (!userTook) { go(cur + 1); scheduleAuto(); } }, wait);
  }
}

/* -------------------------------------------------------- results charts -- */


function renderHChart(prefix, cols, rows) {
  var chips = document.getElementById('chips-' + prefix), chart = document.getElementById('chart-' + prefix);
  if (!chart) return;
  var nCol = cols.length;            // index nCol = Mean
  var rowH = 32, rowEls = [];

  // chips, grouped where the columns have groups
  var lastGrp = null;
  var mk = function (j, label, mod) {
    var b = el('button', 'bchip' + (j === nCol ? ' is-mean is-active' : ''));
    b.type = 'button';
    if (mod) { var m = el('span', 'mod mod-' + mod, mod); b.appendChild(m); }
    b.appendChild(document.createTextNode(label));
    b.addEventListener('click', function () {
      chips.querySelectorAll('.bchip').forEach(function (c) { c.classList.remove('is-active'); });
      b.classList.add('is-active'); update(j);
    });
    chips.appendChild(b);
  };
  mk(nCol, 'Mean', null);
  cols.forEach(function (c, j) {
    if (c.grp && c.grp !== lastGrp) { lastGrp = c.grp; }
    mk(j, c.name, c.mod);
  });

  var wrap = el('div'); wrap.style.position = 'relative'; wrap.style.height = (rows.length * rowH) + 'px';
  rows.forEach(function (r, i) {
    var row = el('div', 'hb-row' + (r.ours ? ' is-ours' + (r.ours === 'weak' ? ' is-weak' : '') : '') + (r.best ? ' is-best-trained' : ''));
    row.style.position = 'absolute'; row.style.left = 0; row.style.right = 0; row.style.top = (i * rowH) + 'px';
    var nm = el('div', 'hb-name');
    if (r.ours) { nm.appendChild(document.createTextNode(r.name + ' ')); nm.appendChild(el('small', null, '(' + r.model + ')')); }
    else {
      nm.appendChild(document.createTextNode(r.name));
    }
    var tr = el('div', 'hb-track');
    var bar = el('div', 'hb-bar');
    var val = el('span', 'hb-val');
    tr.appendChild(bar); tr.appendChild(val);
    row.appendChild(nm); row.appendChild(tr);
    wrap.appendChild(row);
    rowEls.push({ row: row, bar: bar, val: val, r: r });
  });
  chart.appendChild(wrap);
  var axis = el('div', 'hb-axis'); axis.appendChild(el('div'));
  var ticks = el('div', 'hb-ticks');
  for (var a = 0; a <= 100; a += 20) { var s = el('span', null, String(a)); s.style.left = a + '%'; ticks.appendChild(s); }
  axis.appendChild(ticks); chart.appendChild(axis);

  var started = false;
  function update(j) {
    var vals = rows.map(function (r) { return r.v[j]; });
    var top = Math.max.apply(null, vals.filter(function (v) { return v !== null; }));
    var order = rows.map(function (_, i) { return i; }).sort(function (a, b) {
      var va = vals[a] === null ? -1 : vals[a], vb = vals[b] === null ? -1 : vals[b];
      return vb - va;
    });
    order.forEach(function (ri, rank) {
      var e = rowEls[ri], v = vals[ri];
      e.row.style.transform = 'translateY(' + ((rank - ri) * rowH) + 'px)';
      e.row.style.opacity = v === null ? 0 : 1;
      var w = started && v !== null ? v : 0;
      e.bar.style.width = w + '%';
      e.val.style.left = w + '%';
      e.val.textContent = v === null ? 'not reported' : fmt(v);
      e.val.classList.toggle('is-top', v === top);
    });
  }
  onVisible(chart, function () { started = true; update(nCol); }, 0.2);
  update(nCol);

}

function renderStd() {
  var host = document.getElementById('std-grid');
  if (!host) return;
  STD.cols.forEach(function (c, j) {
    var card = el('div', 'std-card');
    card.appendChild(el('h4', null, c.name));
    card.appendChild(el('div', 'std-what', c.what));
    var rows = STD.rows.filter(function (r) { return r[1][j] !== null; }).sort(function (a, b) { return b[1][j] - a[1][j]; });
    rows.forEach(function (r) {
      var row = el('div', 'std-row' + (r[2] ? ' ours' : ''));
      row.appendChild(el('span', null, r[0]));
      var t = el('div', 't'), i = el('i'); i.setAttribute('data-w', r[1][j]); t.appendChild(i);
      row.appendChild(t); row.appendChild(el('b', null, fmt(r[1][j])));
      card.appendChild(row);
    });
    host.appendChild(card);
  });
  onVisible(host, function () { host.querySelectorAll('i[data-w]').forEach(function (i) { i.style.width = i.getAttribute('data-w') + '%'; }); });
}

function conceptBars() {
  document.querySelectorAll('.concept-cards').forEach(function (h) {
    onVisible(h, function () { h.querySelectorAll('.cc-bar').forEach(function (b) { b.style.width = b.getAttribute('data-w') + '%'; }); });
  });
}

/* ------------------------------------------------------------- wording -- */

function renderWording() {
  var host = document.getElementById('word-chart');
  if (!host) return;
  var lg = el('div', 'chart-legend');
  lg.innerHTML = '<span><i class="swatch" style="background:#6b7280"></i>VoxTell (trained)</span>' +
    '<span><i class="swatch" style="background:#14b8a6"></i>RadContour</span>';
  host.appendChild(lg);
  var groups = el('div', 'wc-groups');
  WORDING.groups.forEach(function (g, gi) {
    var box = el('div');
    box.appendChild(el('div', 'wc-title', g));
    var plot = el('div', 'wc-plot'), xl = el('div', 'wc-xl');
    WORDING.kinds.forEach(function (k, ki) {
      var cl = el('div', 'wc-cluster');
      [['vox', ''], ['ours', ' ours']].forEach(function (m) {
        var v = WORDING[m[0]][gi][ki];
        var b = el('div', 'wc-bar' + m[1]); b.setAttribute('data-h', v);
        b.appendChild(el('span', null, fmt(v)));
        b.title = (m[0] === 'vox' ? 'VoxTell' : 'RadContour') + ', ' + k + ': ' + fmt(v);
        cl.appendChild(b);
      });
      plot.appendChild(cl);
      xl.appendChild(el('span', null, k));
    });
    box.appendChild(plot); box.appendChild(xl);
    groups.appendChild(box);
  });
  host.appendChild(groups);
  onVisible(host, function () { host.querySelectorAll('.wc-bar').forEach(function (b) { b.style.height = b.getAttribute('data-h') + '%'; }); });
}

/* ------------------------------------------------------------ backbones -- */

function renderBackbones() {
  var host = document.getElementById('backend-chart'), legend = document.getElementById('backend-legend');
  if (!host) return;
  var MAX = 100, pct = function (v) { return (v / MAX * 100) + '%'; };
  var off = {};
  FAMILIES.forEach(function (f) {
    var b = el('span', 'lg-btn');
    var im = document.createElement('img'); im.src = 'static/assets/logos/' + f[0] + '.png'; im.alt = '';
    b.appendChild(el('i', 'swatch bk-fam-' + f[0])); b.appendChild(im); b.appendChild(document.createTextNode(f[1]));
    b.title = 'Show or hide ' + f[1];
    b.addEventListener('click', function () { off[f[0]] = !off[f[0]]; b.classList.toggle('is-off', !!off[f[0]]); refresh(); });
    legend.appendChild(b);
  });

  var overlay = el('div', 'bk-overlay');
  for (var t = 0; t <= MAX; t += 10) { var g = el('div', 'bk-grid'); g.style.left = pct(t); overlay.appendChild(g); }
  var ref = el('div', 'bk-ref'); ref.style.left = pct(BK_REF.v);
  ref.appendChild(el('span', 'bk-ref-tag', BK_REF.label + ' ' + fmt(BK_REF.v)));
  overlay.appendChild(ref);
  host.appendChild(overlay);
  var rows = [], hl = null;
  BACKBONES.forEach(function (b) {
    var row = el('div', 'bk-row');
    row.title = b[0] + ': Dice ' + fmt(b[2]);
    var logo = el('div', 'bk-logo'), li = document.createElement('img');
    li.src = 'static/assets/logos/' + b[1] + '.png'; li.alt = ''; logo.appendChild(li);
    var lab = el('div', 'bk-label', b[0]);
    var track = el('div', 'bk-track'), bar = el('div', 'bk-bar bk-fam-' + b[1]), val = el('span', 'bk-val', fmt(b[2]));
    bar.setAttribute('data-w', b[2] / MAX * 100); val.style.left = '0%';
    track.appendChild(bar); track.appendChild(val);
    row.appendChild(logo); row.appendChild(lab); row.appendChild(track);
    host.appendChild(row);
    rows.push({ row: row, b: b });
  });
  var axis = el('div', 'bk-axis'), ticks = el('div', 'bk-axis-ticks');
  for (var a = 0; a <= MAX; a += 10) { var tk = el('span', null, String(a)); tk.style.left = pct(a); ticks.appendChild(tk); }
  axis.appendChild(el('div', 'bk-logo')); axis.appendChild(el('div', 'bk-label')); axis.appendChild(ticks);
  host.appendChild(axis);
  host.appendChild(el('div', 'bk-axis-title', 'Dice'));
  function refresh() {
    rows.forEach(function (r) {
      var dim = !!off[r.b[1]] || (hl && hl.indexOf(r.b[0]) < 0);
      r.row.classList.toggle('is-dim', !!dim);
      r.row.classList.toggle('is-hl', !!(hl && hl.indexOf(r.b[0]) >= 0));
    });
  }
  onVisible(host, function () {
    rows.forEach(function (r, i) {
      setTimeout(function () {
        var bar = r.row.querySelector('.bk-bar'), val = r.row.querySelector('.bk-val');
        bar.style.width = bar.getAttribute('data-w') + '%'; val.style.left = bar.getAttribute('data-w') + '%';
      }, i * 35);
    });
  }, 0.1);
}

/* -------------------------------------------------------------- gallery -- */

function initGallery() {
  var casesHost = document.getElementById('gal-cases'), view = document.getElementById('gal-view');
  if (!casesHost) return;
  var groupTabs = document.querySelectorAll('.gal-group li');
  var items = [], group = 'lesion';
  function chips() {
    casesHost.innerHTML = '';
    var list = items.filter(function (it) { return it.group === group; });
    list.forEach(function (it, i) {
      var b = el('button', 'bchip' + (i === 0 ? ' is-active' : ''));
      b.type = 'button';
      b.appendChild(el('span', 'mod mod-' + it.mod, it.mod));
      b.appendChild(document.createTextNode(it.title));
      b.addEventListener('click', function () {
        casesHost.querySelectorAll('.bchip').forEach(function (c) { c.classList.remove('is-active'); });
        b.classList.add('is-active'); show(it);
      });
      casesHost.appendChild(b);
    });
    if (list.length) show(list[0]);
  }
  function show(it) {
    view.innerHTML = '';
    var head = el('div', 'gal-head');
    head.appendChild(el('h4', null, it.title));
        head.appendChild(el('span', 'q', '\u201c' + it.prompt + '\u201d'));
    head.appendChild(el('span', 'chip', 'Dice ' + fmt(it.dice.ours)));
    view.appendChild(head);
    var grid = el('div', 'gal-grid');

    // 2D: compare slider; the left side can show the image, the ground truth or the baseline
    var left = el('div');
    var sub = el('div', 'gal-sub');
    var opts = [['gt', 'Ground truth'], ['img', 'Image']];
    if (it.files.voxtell) opts.push(['voxtell', 'VoxTell']);
    var seg = el('div', 'seg seg-light gal-toggle');
    seg.style.gridTemplateColumns = 'repeat(' + opts.length + ', auto)';
    sub.appendChild(seg); left.appendChild(sub);
    var box = el('div', 'img-compare');
    var under = document.createElement('img'); under.className = 'ic-under'; under.src = it.files.ours; under.alt = 'RadContour';
    var overD = el('div', 'ic-over'), overI = document.createElement('img'); overI.src = it.files.gt; overI.alt = '';
    overD.appendChild(overI);
    var hd = el('div', 'ic-handle'); hd.innerHTML = '<span class="ic-arrow-l"></span><span class="ic-arrow-r"></span>';
    var labL = el('span', 'ic-label ic-label-left', 'Ground truth'), labR = el('span', 'ic-label ic-label-right', 'RadContour');
    [under, overD, hd, labL, labR].forEach(function (n) { box.appendChild(n); });
    left.appendChild(box);
    var slice = '';
    opts.forEach(function (o, k) {
      var b = el('button', k === 0 ? 'is-active' : '', o[1]); b.type = 'button';
      b.addEventListener('click', function () {
        seg.querySelectorAll('button').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active'); overI.src = it.files[o[0] + slice] || it.files[o[0]];
        overI.setAttribute('data-k', o[0]);
        labL.textContent = o[1] + (o[0] === 'voxtell' ? ' ' + fmt(it.dice.voxtell) : '');
      });
      seg.appendChild(b);
    });
    overI.setAttribute('data-k', 'gt');
    if (it.files.img1) {
      var s2 = el('div', 'seg seg-light gal-toggle'); s2.style.gridTemplateColumns = 'auto auto'; s2.style.marginTop = '0.5rem';
      ['Level 1', 'Level 2'].forEach(function (t, k) {
        var b = el('button', k === 0 ? 'is-active' : '', t); b.type = 'button';
        b.addEventListener('click', function () {
          s2.querySelectorAll('button').forEach(function (x) { x.classList.remove('is-active'); });
          b.classList.add('is-active'); slice = k ? '1' : '';
          under.src = it.files['ours' + slice];
          var key = overI.getAttribute('data-k');
          overI.src = it.files[key + slice] || it.files[key];
        });
        s2.appendChild(b);
      });
      left.appendChild(s2);
    }
    grid.appendChild(left);
    initCompare(box, 50);

    // 3D
    var right = el('div');
        var g3 = el('div', 'gal-3d ' + (it.files.voxtell3d ? 'c3' : 'c2'));
    var f3 = [['gt3d', 'Ground truth', null], ['ours3d', 'RadContour', it.dice.ours]];
    if (it.files.voxtell3d) f3.push(['voxtell3d', 'VoxTell', it.dice.voxtell]);
    f3.forEach(function (f) {
      if (!it.files[f[0]]) return;
      var fig = el('figure', f[0] === 'ours3d' ? 'is-ours' : '');
      var im = document.createElement('img'); im.src = it.files[f[0]]; im.alt = f[1] + ' 3D'; im.loading = 'lazy';
      fig.appendChild(im);
      if (f[2] !== null && f[2] !== undefined) fig.appendChild(el('span', 'dice-chip', fmt(f[2])));
      fig.appendChild(el('figcaption', null, f[1]));
      g3.appendChild(fig);
    });
    right.appendChild(g3);
    if (it.group === 'lesion') {
      var eb = document.createElement('img'); eb.src = 'static/assets/figs/errbar.png'; eb.className = 'gal-errbar'; eb.alt = 'surface distance color bar, 0 to 10 mm';
      right.appendChild(eb);
    }
    grid.appendChild(right);
    view.appendChild(grid);
  }
  groupTabs.forEach(function (li) {
    li.addEventListener('click', function () {
      groupTabs.forEach(function (x) { x.classList.remove('is-active'); });
      li.classList.add('is-active'); group = li.getAttribute('data-group'); chips();
    });
  });
  getJSON('static/data/qual.json').then(function (d) { items = d; chips(); }).catch(function () {});
}

/* ------------------------------------------------------------------ init -- */

document.addEventListener('DOMContentLoaded', function () {
  heroCanvas();
  quickNav();
  document.querySelectorAll('[data-count]').forEach(function (n) { onVisible(n, function () { animateCount(n); }, 0.5); });
  document.querySelectorAll('.img-compare:not(#v3d-cmp)').forEach(function (b) { initCompare(b, 50); });
  initRolls();
  document.querySelectorAll('.turntable').forEach(initTurntable);
  initStepper();
  renderHChart('lesions', LESION_COLS, LESION_ROWS);
  renderHChart('anatomy', ANAT_COLS, ANAT_ROWS);
  conceptBars();
  renderStd();
  renderWording();
  renderBackbones();
  initGallery();

  document.querySelectorAll('[data-goto-scene]').forEach(function (a) {
    a.addEventListener('click', function () {
      window.dispatchEvent(new CustomEvent('rc:scene', { detail: a.getAttribute('data-goto-scene') }));
    });
  });

  var lb = document.getElementById('lightbox');
  document.querySelectorAll('.zoomable').forEach(function (im) {
    im.addEventListener('click', function () { lb.querySelector('img').src = im.src; lb.hidden = false; });
  });
  lb.addEventListener('click', function () { lb.hidden = true; });

  var copyBtn = document.getElementById('copy-bibtex');
  if (copyBtn) copyBtn.addEventListener('click', function () {
    var text = document.getElementById('bibtex-text').textContent;
    var label = copyBtn.querySelector('span:last-child');
    function done(msg) { label.textContent = msg; setTimeout(function () { label.textContent = 'Copy'; }, 1500); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done('Copied'); }, function () { done('Press Ctrl+C'); });
    } else done('Press Ctrl+C');
  });
});
