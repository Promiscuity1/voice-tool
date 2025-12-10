import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel

app = FastAPI()

# Mount static files
base_dir = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(base_dir, "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set Proxy for Downloading Model from HuggingFace (Clash Verge)
os.environ["HTTP_PROXY"] = "http://127.0.0.1:7897"
os.environ["HTTPS_PROXY"] = "http://127.0.0.1:7897"

# Initialize Local Model
# Using 'medium' for a balance of speed and accuracy. 
# 'large-v3' is the "strongest" but is 3GB+ and very slow on CPU.
# We will try 'medium' first. If you want 'large-v3', just change this string.
print("--- Loading Local Model (This may take a while to download on first run)... ---")
model_size = "medium" 
# Run on GPU with FP16 if available, else CPU with INT8
# device="auto" (or "cuda"/"cpu"), compute_type="int8"
model = WhisperModel(model_size, device="cpu", compute_type="int8")
print("--- Local Model Loaded Successfully ---")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    index_path = os.path.join(static_dir, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        return f.read()

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Receives an audio file and uses Local Whisper to transcribe it.
    """
    temp_filename = f"temp_{file.filename}"
    
    try:
        print(f"--- Processing file: {temp_filename} ---")
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        print("--- Running Local Inference... ---")
        # beam_size=5 is standard for accuracy
        segments, info = model.transcribe(temp_filename, beam_size=5, language="zh")
        
        # Combine all segments into one string
        full_text = " ".join([segment.text for segment in segments])
        
        print(f"--- Transcription Complete: {len(full_text)} chars ---")
        return {"text": full_text}

    except Exception as e:
        print(f"!!! Error occurred: {e} !!!")
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        if os.path.exists(temp_filename):
            try:
                os.remove(temp_filename)
            except Exception as cleanup_err:
                print(f"Warning: Failed to delete temp file {temp_filename}: {cleanup_err}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
