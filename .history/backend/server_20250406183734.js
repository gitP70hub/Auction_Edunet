const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for the frontend application
app.use(cors({
  origin: 'http://localhost:5174' // Allow requests from frontend
}));

// Test route
app.get('/sayhello', (req, res) => {
  res.json('Hello from the backend!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});