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

The first collection builds an intuitive path through five concepts — tokenization, embeddings, attention, autoregressive decoding, and KV cache. Each concept lives in its own directory with an `index.html` entry and one HTML file per exhibit.

- [Tokenization](tokenization/index.html) — complete with three exhibits: guided slides, a studio, and a free-scroll playground, all driven by the real GPT-2 merge table.
- [Embeddings](embeddings/index.html) — opened by [Embedding Studio](embeddings/embedding-studio.html), a 3D workbench over 4,000 real GPT-2 word vectors.
- [Attention](attention/index.html) — opened by [Attention Studio](attention/attention-studio.html), a workbench over real GPT-2 attention maps from all 12 layers × 12 heads.
- Autoregressive decoding, KV cache — in development, in that order.

## Check locally

```bash
python3 scripts/check.py
python3 -m unittest discover -s tests
```

No third-party Python package is required.

## License

Source code is available under the [MIT License](LICENSE). Original explanatory text and visual content are available under [CC BY 4.0](LICENSE-CONTENT). Inlined third-party code remains under its original license.
