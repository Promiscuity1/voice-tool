document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('recordBtn');
    const stopBtn = document.getElementById('stopBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const audioUpload = document.getElementById('audioUpload');
    const statusText = document.getElementById('statusText');
    const statusIndicator = document.getElementById('statusIndicator');
    const resultText = document.getElementById('resultText');
    const copyBtn = document.getElementById('copyBtn');
    const visualizer = document.getElementById('visualizer');
    const recordBtnText = document.getElementById('recordBtnText');
    const changeBgBtn = document.getElementById('changeBgBtn');
    const bgLayer = document.getElementById('bg-layer');

    // Background Switching Logic
    function updateBackground() {
        // Using a random seed to bypass cache and get a new image every time
        // API: dmoe.cc
        const randomSeed = new Date().getTime();
        const imageUrl = `https://www.dmoe.cc/random.php?${randomSeed}`;

        // Preload image to avoid white flash
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            bgLayer.style.backgroundImage = `url('${imageUrl}')`;
        };
    }

    // Initial load
    updateBackground();

    // Button click
    changeBgBtn.addEventListener('click', () => {
        // Add rotation animation class briefly
        changeBgBtn.style.transform = "rotate(360deg)";
        setTimeout(() => changeBgBtn.style.transform = "", 500);
        updateBackground();
    });

    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;

    // Visualizer Setup
    const numberOfBars = 50;
    for (let i = 0; i < numberOfBars; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        visualizer.appendChild(bar);
    }
    const bars = document.querySelectorAll('.bar');

    // Random Visualizer Animation Function
    let animationId;
    function animateVisualizer() {
        if (!isRecording) return;

        bars.forEach(bar => {
            const height = Math.random() * 40 + 5; // Random height between 5 and 45
            bar.style.height = `${height}px`;
        });

        // Slower animation update for aesthetics
        setTimeout(() => {
            animationId = requestAnimationFrame(animateVisualizer);
        }, 50);
    }

    function resetVisualizer() {
        bars.forEach(bar => {
            bar.style.height = '4px';
        });
        cancelAnimationFrame(animationId);
    }

    // Audio Recording Logic
    recordBtn.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                await sendToBackend(audioBlob, 'recording.webm');
            };

            mediaRecorder.start();
            isRecording = true;
            updateUIState(true);
            animateVisualizer();

        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('无法访问麦克风，请检查权限设置。');
        }
    });

    stopBtn.addEventListener('click', () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            // Stop all tracks to release microphone
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            isRecording = false;
            updateUIState(false);
            resetVisualizer();
        }
    });

    // File Upload Logic
    uploadBtn.addEventListener('click', () => {
        audioUpload.click();
    });

    audioUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            await sendToBackend(file, file.name);
            // Reset input so same file can be selected again if needed
            audioUpload.value = '';
        }
    });

    // Send to Backend
    async function sendToBackend(blobOrFile, filename) {
        statusText.textContent = "正在处理...";
        resultText.value = "正在连接最强大脑进行分析...";
        recordBtn.disabled = true;
        uploadBtn.disabled = true;

        const formData = new FormData();
        formData.append('file', blobOrFile, filename);

        try {
            const response = await fetch('/transcribe', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Transcribe failed');
            }

            const data = await response.json();
            resultText.value = data.text;
            statusText.textContent = "完成";

        } catch (error) {
            console.error('Error:', error);
            resultText.value = `Error: ${error.message}`;
            statusText.textContent = "出错";
        } finally {
            recordBtn.disabled = false;
            uploadBtn.disabled = false;
        }
    }

    // UI Helper
    function updateUIState(recording) {
        if (recording) {
            recordBtn.style.display = 'none';
            stopBtn.style.display = 'flex';
            stopBtn.disabled = false;
            statusIndicator.classList.add('recording');
            statusText.textContent = "正在录音...";
            resultText.value = "";
        } else {
            recordBtn.style.display = 'flex';
            stopBtn.style.display = 'none';
            statusIndicator.classList.remove('recording');
        }
    }

    // Copy to Clipboard
    copyBtn.addEventListener('click', () => {
        if (resultText.value) {
            navigator.clipboard.writeText(resultText.value);
            // Visual feedback could be added here
            const originalTitle = copyBtn.getAttribute('title');
            copyBtn.setAttribute('title', '已复制!');
            setTimeout(() => copyBtn.setAttribute('title', originalTitle), 2000);
        }
    });
});
