const express = require('express');
const path = require('path');
const port = 8000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const blogsRouter = require('./routes/blog.js');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_URI )
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));



// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));




// Route for the admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
});

app.get('/add-blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dist', 'add-blog.html'));
});


app.get('/all-blogs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dist', 'all-blogs.html'));
});


// Use blogs routes
app.use('/api', blogsRouter);


// Start the server
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
