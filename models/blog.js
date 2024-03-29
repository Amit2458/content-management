// models/blog.js

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String } // Assuming you'll store image URLs
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
