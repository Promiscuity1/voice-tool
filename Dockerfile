# Use official Python runtime
FROM python:3.10-slim

# Install system dependencies (ffmpeg is required for Whisper/Audio)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create a cache directory for HuggingFace models to ensure they persist or download correctly
# (Optional optimization: You can pre-download models here if needed, but runtime download is fine for medium)
RUN mkdir -p /root/.cache/huggingface

# Expose port 7860 (HuggingFace default)
EXPOSE 7860

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
