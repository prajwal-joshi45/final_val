const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'viewer' },
  }],
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }],
  darkMode: { type: Boolean, default: true },
});

module.exports = mongoose.model('Workspace', workspaceSchema);