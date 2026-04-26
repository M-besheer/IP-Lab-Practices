const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const courseRouter = require('./routes/courseRouter');

const app = express();
app.use(express.json()); // Built-in middleware to parse JSON bodies

// MongoDB connection
const uri = process.env.MONGODB_URI;

const databaseConnect = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Successful Connection to MongoDB ✅');
    } catch (error) {
        console.log(error);
    }
};

databaseConnect();

// Mount the router
app.use('/api/courses', courseRouter);

// 404 fallback middleware
app.use((req, res) => {
    res.status(404).send('Page not found');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} 🚀`);
});