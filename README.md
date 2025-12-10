# AI 语音转文字工具 (Voice Tool)

这是一个基于 **Python FastAPI** 和 **Faster-Whisper** 的本地语音转文字工具。
它拥有极具现代感的**深色玻璃拟态 (Glassmorphism)** 前端界面，支持麦克风录音和音频文件上传。

## ✨ 功能特点

- **完全本地运行**: 使用 `faster-whisper` 模型，无需 OpenAI API Key，免费且隐私安全。
- **现代化 UI**: 精美的深色模式界面，带有动态音频可视化效果。
- **高精度识别**: 默认使用 `medium` 模型，支持中文及多种语言的高精度转录。
- **多种输入**: 支持网页直接录音，或上传 `.mp3`, `.wav`, `.m4a` 等音频文件。

## 🛠️ 安装与运行

### 1. 克隆或下载代码
```bash
git clone https://github.com/Promiscuity1/voice-tool.git
cd voice-tool
```

### 2. 安装依赖
确保您已安装 Python 3.8+。
```bash
pip install -r requirements.txt
```

### 3. 这里有一个关键配置 (Proxy)
> ⚠️ **注意**: 为了方便在中国大陆下载 HuggingFace 模型，代码 `main.py` 中硬编码了本地代理设置：
> ```python
> os.environ["HTTP_PROXY"] = "http://127.0.0.1:7897"
> os.environ["HTTPS_PROXY"] = "http://127.0.0.1:7897"
> ```
> 如果您的代理端口不是 `7897`，或者您不在中国大陆，**请务必修改或删除 `main.py` 中的这几行代码**，否则会导致无法联网。

### 4. 启动服务
```bash
uvicorn main:app --reload
```
首次运行时，程序会自动下载 Whisper 模型（约 1.5GB），请耐心等待控制台显示 `Application startup complete`。

### 5. 使用
打开浏览器访问: [http://127.0.0.1:8000](http://127.0.0.1:8000)

## 📁 项目结构

```
voice_tool/
├── main.py              # 后端核心逻辑 (FastAPI)
├── requirements.txt     # Python 依赖项
└── static/              # 前端资源
    ├── index.html       # 主页面
    ├── style.css        # 样式表
    └── app.js           # 前端逻辑
```

## 📝 License
MIT License
