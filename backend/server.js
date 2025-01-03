const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); 

dotenv.config();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL , credentials: true }));
app.use(express.json());

//  routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const workspaceRoute = require('./routes/workspaces');
const folderRoute = require('./routes/folders');
const formRoute = require('./routes/forms');
const inviteRouter = require('./routes/invitecontroller');

// Use routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/workspace', workspaceRoute);
app.use('/api/folder', folderRoute);
app.use('/api/form', formRoute);
app.use('/api', inviteRouter)

const PORT = process.env.PORT || 5000;

connectDB(); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});