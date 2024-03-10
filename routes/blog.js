const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import Multer for handling file uploads
const path = require('path');
const fs = require('fs'); // Import fs module for file operations
const Blog = require('../models/blog');
const { createReadStream, createWriteStream } = require('fs');

// Set up Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Specify the destination directory for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Set the filename to be unique by appending timestamp
    }
});


// Set up Multer upload configuration
const upload = multer({ storage: storage });


// Modify your serverless function to handle file uploads
module.exports = upload.single('image'), async (req, res) => {
    // Access the uploaded file from the /tmp directory
    const uploadedFile = req.file;

    // Perform any necessary processing or validation on the file data
    if (!uploadedFile) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Example: Copy the uploaded file to a more permanent storage location
    const permanentStoragePath = '/path/to/permanent/storage/' + uploadedFile.filename;
    const readStream = createReadStream(uploadedFile.path);
    const writeStream = createWriteStream(permanentStoragePath);
    readStream.pipe(writeStream);

    // Send a response back to the client indicating the status of the file upload
    res.status(200).json({ message: 'File uploaded successfully', imageUrl: permanentStoragePath });
};

// Get all blogs
router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Create a new blog with image upload
router.post('/blogs', upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    let imageUrl = null;

    if (req.file) {
        // Remove the '/public' prefix from the file path using the replace method
        imageUrl = req.file.path.replace(/^\/?public[\\/]/, '');
        console.log(imageUrl);
    }

    try {
        const blog = new Blog({
            title,
            content,
            imageUrl
        });

        const newBlog = await blog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});




router.put('/blogs/:id', upload.single('image'), async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Update blog title and content
        blog.title = req.body.title || blog.title;
        blog.content = req.body.content || blog.content;

        // Update imageUrl if a new image is uploaded
        if (req.file) {
            blog.imageUrl = req.file.path.replace(/^\/?public[\\/]/, '');
        }

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



//delete a blog
router.delete('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        await Blog.deleteOne({ _id: req.params.id }); // Use deleteOne to delete the blog
        res.json({ message: 'Blog deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

