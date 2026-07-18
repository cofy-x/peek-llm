# Peek LLM

**每个概念，一个 HTML；打开页面，看见原理如何运行。**

Peek LLM 是一个开源的大模型交互知识可视化项目。它不要求用户阅读长篇文章或观看完整视频，而是把一个知识点制作成可以观察、操作和回放的独立网页。

[English](README.md) · [在线站点](https://cofy-x.github.io/peek-llm/) · [贡献指南](CONTRIBUTING.md)

## 一个概念，一个文件

每个展品都是一个自包含 HTML 文件：

- CSS 和 JavaScript 全部内联；
- 图片、字体、数据和运行依赖全部嵌入；
- 不依赖 CDN、后端、包安装或构建步骤；
- 下载后可以通过 `file://` 离线打开；
- 可以保留指向论文和官方文档的普通引用链接。

仓库可以包含贡献者使用的检查脚本和文档，但每个展品本身必须保持单文件可移植。

## 初始知识路径

第一组页面将从 Tokenization、Embedding、Attention、Autoregressive Decoding 延伸到 KV Cache。当前初始版本只建立项目契约、首页和展品模板；第一个真实知识展品会单独设计和实现。

## 本地检查

```bash
python3 scripts/check.py
python3 -m unittest discover -s tests
```

不需要安装任何第三方 Python 包。

## 许可证

源代码使用 [MIT License](LICENSE)。原创讲解文字和视觉内容使用 [CC BY 4.0](LICENSE-CONTENT)。内联第三方代码继续遵循其原始许可证。
