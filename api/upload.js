const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Ensure you have an 'uploads' folder
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname).toLowerCase();
        const filename = Date.now() + extname; // To avoid filename collisions
        cb(null, filename);  // Save with the timestamped filename
    }
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// API endpoint to handle file upload
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        const fileUrl = `/uploads/${req.file.filename}`;  // Create the file URL
        res.json({ url: fileUrl });  // Respond with the file URL
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
