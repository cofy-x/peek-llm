# Peek LLM

**See how language models work, one HTML at a time.**

Peek LLM is an open-source collection of interactive visual explanations for large language model concepts. Instead of asking readers to work through a long article or video, each exhibit turns one idea into something they can observe, manipulate, and replay.

[中文说明](README.zh-CN.md) · [Live site](https://cofy-x.github.io/peek-llm/) · [Contributing](CONTRIBUTING.md)

## One concept, one file

Every exhibit is a self-contained HTML document:

- the hand-maintained file is both the source and the published artifact, with no separate source or distribution copy;
- all CSS and JavaScript are inline;
- images, fonts, data, and runtime libraries are embedded;
- no CDN or backend is required by the core experience;
- no package manager, build tool, bundler, frontend framework, or generation step is used to author an exhibit;
- the downloaded file works offline through `file://`;
- optional network-enhanced features remain clearly identified and preserve the offline core experience;
- ordinary links to papers and documentation remain allowed.

The repository may contain contributor checks and documentation, but those tools do not generate or rewrite exhibits. Each exhibit remains readable, directly editable, and portable as one file.

## Collections

The first collection builds an intuitive path through six concepts — tokenization, embeddings, positional encoding, attention, logits and sampling, and KV cache. Each concept lives in its own directory with an `index.html` entry and one HTML file per exhibit.

- [Tokenization](tokenization/index.html) — complete with three exhibits: guided slides, a studio, and a free-scroll playground, all driven by the real GPT-2 merge table.
- [Embeddings](embeddings/index.html) — opened by [Embedding Studio](embeddings/embedding-studio.html), a 3D workbench over 4,000 real GPT-2 word vectors.
- [Positional Encoding](positional-encoding/index.html) — opened by [RoPE Studio](positional-encoding/rope-studio.html), a computed 2.5D workbench for rotating query and key dimension pairs and testing relative-position invariance.
- [Attention](attention/index.html) — opened by [Attention Studio](attention/attention-studio.html), a workbench over real GPT-2 attention maps from all 12 layers × 12 heads.
- [Logits &amp; Sampling](logits-and-sampling/index.html) — opened by [Sampling Studio](logits-and-sampling/sampling-studio.html), a probability-wheel workbench over real GPT-2 next-token logits with temperature, top-k, and top-p.
- [KV Cache](kv-cache/index.html) — opened by [KV Cache Studio](kv-cache/kv-cache-studio.html), a computed decoding workbench that compares full-history K/V recomputation with append-only reuse and measures MHA, GQA, and MQA cache memory.

The training collection starts from the update rule that lets a model learn:

- [Gradient Descent](gradient-descent/index.html) — opened by [Gradient Descent Studio](gradient-descent/gradient-descent-studio.html), a native Canvas workbench with a computed 3D loss surface, a top-down contour view, and learning-rate experiments from convergence to divergence.
- [Forward Pass](forward-pass/index.html) — opened by [Forward Pass Studio](forward-pass/forward-pass-studio.html), a native SVG workbench for stepping a computed tiny MLP through weighted sums, ReLU activations, token logits, and softmax probabilities.
- [Backpropagation](backpropagation/index.html) — opened by [Backprop Studio](backpropagation/backprop-studio.html), which sends cross-entropy error backward through the same tiny MLP: p − y at the logits, the ReLU gate, and a gradient for every weight.

## Check locally

```bash
python3 scripts/check.py
python3 -m unittest discover -s tests
```

No third-party Python package is required.

## License

Source code is available under the [MIT License](LICENSE). Original explanatory text and visual content are available under [CC BY 4.0](LICENSE-CONTENT). Inlined third-party code remains under its original license.
