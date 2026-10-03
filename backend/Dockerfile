FROM python:3.12-slim

# Install system deps — ffmpeg is CRITICAL for yt-dlp merging
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Set up user with UID 1000 for Hugging Face Spaces compatibility
RUN useradd -m -u 1000 user && chown -R user:user /app || true
USER user

# HF Spaces requires port 7860
EXPOSE 7860

# Replace "main:app" with your actual FastAPI entry point
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "1"]
