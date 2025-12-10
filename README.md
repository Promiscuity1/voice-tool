---
title: Voice Tool
emoji: 🎙️
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---

# AI 语音转文字工具 (Voice Tool)

这是一个基于 **Python FastAPI** 和 **Faster-Whisper** 的本地语音转文字工具。
它拥有极具现代感的**深色玻璃拟态 (Glassmorphism)** 前端界面，支持麦克风录音和音频文件上传。

## ✨ 功能特点

- **完全本地运行**: 使用 `faster-whisper` 模型，无需 OpenAI API Key，免费且隐私安全。
- **现代化 UI**: 精美的深色模式界面，带有动态音频可视化效果。
- **高精度识别**: 默认使用 `medium` 模型，支持中文及多种语言的高精度转录。
- **多种输入**: 支持网页直接录音，或上传 `.mp3`, `.wav`, `.m4a` 等音频文件。
- **云端部署**: 支持部署到 HuggingFace Spaces，实现云端运行。

## 🛠️ 安装与运行

### 本地运行 (Windows)

1.  **安装依赖**: `pip install -r requirements.txt`
2.  **启动**: `uvicorn main:app --reload` (首次运行会自动下载模型)
3.  **访问**: [http://127.0.0.1:7860](http://127.0.0.1:7860)

> **代理说明**: `main.py` 会自动检测 Windows 系统并使用本地代理 (127.0.0.1:7897) 辅助下载模型。

### 🚀 云端部署 (HuggingFace Spaces)

本项目已配置 Dockerfile，可一键部署：

1.  **注册**: [HuggingFace](https://huggingface.co/join)
2.  **新建 Space**:
    - Space Name: `voice-tool` (自定义)
    - SDK: **Docker** (必选)
3.  **上传代码**:
    - 方式一: 使用 Git 将本仓库推送到 HuggingFace Space。
    - 方式二: 在 Space 设置里连接您的 GitHub 仓库 `Promiscuity1/voice-tool`。

## 📁 项目结构

```
voice_tool/
├── Dockerfile           # 云端部署配置
├── main.py              # 后端核心逻辑
├── requirements.txt     # Python 依赖项
└── static/              # 前端资源
```

## 📝 License
MIT License
