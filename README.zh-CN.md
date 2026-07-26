# Peek LLM

**每个概念，一个 HTML；打开页面，看见原理如何运行。**

Peek LLM 是一个开源的大模型交互知识可视化项目。它不要求用户阅读长篇文章或观看完整视频，而是把一个知识点制作成可以观察、操作和回放的独立网页。

[English](README.md) · [在线站点](https://cofy-x.github.io/peek-llm/) · [贡献指南](CONTRIBUTING.md)

## 一个概念，一个文件

每个展品都是一个自包含 HTML 文件：

- 手工维护的文件同时是源文件和发布产物，不存在另一份源码或分发副本；
- CSS 和 JavaScript 全部内联；
- 图片、字体、数据和运行依赖全部嵌入；
- 核心体验不依赖 CDN 或后端；
- 展品创作不使用 package manager、build tool、bundler、前端框架或生成步骤；
- 下载后可以通过 `file://` 离线打开；
- 可选的联网增强能力必须明确标识，并保留完整的离线核心体验；
- 可以保留指向论文和官方文档的普通引用链接。

仓库可以包含贡献者使用的检查脚本和文档，但这些工具不得生成或改写展品。每个展品始终是可读、可直接编辑、可独立移植的单文件。

## 初始知识路径

第一组页面沿五个概念铺出一条直觉路径：Tokenization、Embeddings、Attention、Logits & Sampling、KV Cache。每个概念有独立目录，内含 `index.html` 入口和按展品划分的 HTML 文件。

- [Tokenization](tokenization/index.html) — 已上线三个展品：guided slides、studio 与 free-scroll playground，全部由真实 GPT-2 merge 表驱动。
- [Embeddings](embeddings/index.html) — 由 [Embedding Studio](embeddings/embedding-studio.html) 开启：基于 4,000 个真实 GPT-2 词向量的 3D 工作台。
- [Attention](attention/index.html) — 由 [Attention Studio](attention/attention-studio.html) 开启：覆盖全部 12 层 × 12 头的真实 GPT-2 注意力图工作台。
- [Logits &amp; Sampling](logits-and-sampling/index.html) — 由 [Sampling Studio](logits-and-sampling/sampling-studio.html) 开启：基于真实 GPT-2 下一 token logits 的概率轮盘工作台，支持 temperature、top-k 与 top-p 调节。
- KV Cache — 开发中。

训练系列从让模型能够学习的参数更新规则开始：

- [Gradient Descent](gradient-descent/index.html) — 由 [Gradient Descent Studio](gradient-descent/gradient-descent-studio.html) 开启：使用原生 Canvas 呈现计算生成的 3D 损失曲面、俯视等高线视图，以及从收敛到发散的学习率实验。

## 本地检查

```bash
python3 scripts/check.py
python3 -m unittest discover -s tests
```

不需要安装任何第三方 Python 包。

## 许可证

源代码使用 [MIT License](LICENSE)。原创讲解文字和视觉内容使用 [CC BY 4.0](LICENSE-CONTENT)。内联第三方代码继续遵循其原始许可证。
