require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const userRoutes = require('./userRoutes');  // Import the userRoutes

const app = express();
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

connectDB();

// Use the user routes
app.use('/api', userRoutes);  // Attach the routes under '/api'

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});