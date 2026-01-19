const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('receipt'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const imagePath = req.file.path;
    const pythonScriptPath = path.join(__dirname, '../python_services/ocr_engine.py');

    const pythonProcess = spawn('python', [pythonScriptPath, imagePath]);

    pythonProcess.stdout.on('data', (data) => {
        try {
            const result = JSON.parse(data.toString());
            res.json(result);
        } catch (e) {
            console.error("Parsing Error:", e);
            res.status(500).json({ error: 'Failed to process receipt data' });
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Logic Error: ${data}`);
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Bridge running on http://localhost:${PORT}`));
