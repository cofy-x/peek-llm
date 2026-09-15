# Peek LLM

**看见语言模型如何工作：打开一个展品，探索其中的机制。**

Peek LLM 是开源的语言模型交互知识网站。每个案例围绕一个具体问题，让学习者通过操作、观察变化和检查结果，理解模型中的机制。

[访问网站](https://cofy-x.github.io/peek-llm/) · [English](README.md) · [贡献指南](CONTRIBUTING.md)

每个案例都能独立理解。UI、数据与技术围绕学习目标选择，按需使用文字、图表、空间交互或可回放动画帮助理解。

## 本地开发

使用 Node.js 22+、pnpm 11.5.1、uv 0.11.25+ 和 Make。uv 管理 Python 3.12 与本地 `.venv`：

```sh
make install
make dev
make check
make preview
```

`make help` 查看命令，`make test-python` 运行 Python 测试。`make check`（也可用 `pnpm check`）包含 HTML 校验、Python 与 Node 测试、lint、类型检查和生产构建。`make build` 单独构建，`make preview` 预览 `dist/`。这些命令不会发布网站。

## 项目分工

| 位置 | 职责 |
| --- | --- |
| `apps/portal/` | React 首页、导航、客户端路由和 `src/experiences.mjs` 案例登记 |
| `packages/<topic>/<id>/` | 案例实现、预览、数据、测试和研究资料 |
| `scripts/` | 校验、构建辅助、许可证收集和部署检查 |

只有完成并登记的案例进入首页与构建。公开地址与源码路径分离；根目录统一管理工具链和锁文件，构建产物、依赖目录和研究缓存不进入 Git。

案例采用模块化源码，依赖与静态资源随站点构建并从同源加载，统一遵循[质量要求](CONTRIBUTING.md)。核心功能不依赖后端、运行时 CDN、远程字体或 analytics；可选联网功能必须明确说明并由用户触发。

开发与登记遵循[贡献指南](CONTRIBUTING.md)。GitHub Pages 使用 GitHub Actions，仅发布 `dist/`；获得授权后推送 `main` 会触发[部署流程](CONTRIBUTING.md#deployment)。

## 案例

在[网站案例目录](https://cofy-x.github.io/peek-llm/)浏览可用案例。每个案例的操作说明、数据来源和研究资料由其自身文档维护。

| 案例 | 探索内容 | 文档 |
| --- | --- | --- |
| [Attention Atlas](https://cofy-x.github.io/peek-llm/model-architectures/attention-atlas) | 通过模块选择、机制动画和导览，理解原始 Transformer 与 DeepSeek V4.1 Flash | [案例指南](packages/model-architectures/attention-atlas/README.md) |
| [Token Workshop](https://cofy-x.github.io/peek-llm/tokenization/token-workshop) | 输入文字、检查 UTF-8 字节、回放 BPE 合并并比较 token ID | [案例说明](packages/tokenization/token-workshop/README.md) |

## 许可证

源码使用 [MIT](LICENSE)，原创文字与视觉内容使用 [CC BY 4.0](LICENSE-CONTENT)。第三方代码与数据保留原许可证，Atlas 导入内容保留[原始 MIT 许可证](packages/model-architectures/attention-atlas/LICENSE-ORIGIN)。
