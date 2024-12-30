const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the connectDB function

// Load environment variables from .env file
dotenv.config();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Import routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const workspaceRoute = require('./routes/workspaces');
const folderRoute = require('./routes/folders');
const formRoute = require('./routes/forms');

// Use routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/workspace', workspaceRoute);
app.use('/api/folder', folderRoute);
app.use('/api/form', formRoute);

// Database and Server
const PORT = process.env.PORT || 5000;

connectDB(); // Connect to the database

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});