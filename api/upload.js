const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir); // Ensure the uploads directory exists
        }
        cb(null, uploadDir); // Save in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);  // Keep the original file name
    }
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// API endpoint to handle file upload
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (req.file) {
            const fileUrl = `/uploads/${req.file.filename}`;
            res.json({ url: fileUrl });
        } else {
            res.status(400).json({ message: 'No file uploaded' });
        }
    } catch (err) {
        console.error('Error during file upload:', err); // Log errors to the console
        res.status(500).json({ message: 'Internal server error' }); // Respond with a generic error message
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
