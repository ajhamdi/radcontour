# radcontour

Project page of **RadContour: Can Frozen Multimodal LLMs Segment 3D Medical Images?**
Abdullah Hamdi and Carlos Hinojosa, KAUST.

RadContour turns a frozen, general-purpose multimodal LLM into a text-prompted 3D segmenter of CT, MRI and PET
volumes. The MLLM plans the target from free text, localizes it in 3D from coarse to fine, and traces closed outlines
on a few keyframes; deterministic geometry assembles the outlines into a 3D mask.

The page is static (Bulma, three.js from jsDelivr, no build step). Preview locally with

```bash
python -m http.server 8000   # then open http://localhost:8000
```

Opening `index.html` directly from disk does not work, because the page fetches its JSON and mesh files.
