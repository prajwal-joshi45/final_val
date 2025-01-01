const express = require('express');
const router = express.Router();
const Workspace = require('../schema/workspace');
const authMiddleware = require('../middleware/auth');

// Get all workspaces
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const workspaces = await Workspace.find({ createdBy: req.params.userId });
    if (!workspaces) {
      return res.status(404).json({ message: 'Workspaces not found' });
    }
    res.status(200).json(workspaces);
  } catch (err) {
    console.error('Error fetching workspaces:', err);
    res.status(500).json({ message: 'Error fetching workspaces', error: err.message });
  }
});

// Create a new workspace
router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Workspace name is required' });
  }
  try {
    const workspace = new Workspace({
      name,
      owner: req.user.id,
      members: [{ user: req.user.id, role: 'owner' }],
    });
    await workspace.save();
    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ message: 'Error creating workspace' });
  }
});

// Get a single workspace by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate('members.user', 'username email');
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    res.status(200).json(workspace);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching workspace' });
  }
});

// Update a workspace
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, darkMode } = req.body;
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'You are not authorized to update this workspace' });
    }
    workspace.name = name || workspace.name;
    workspace.darkMode = darkMode !== undefined ? darkMode : workspace.darkMode;
    await workspace.save();
    res.status(200).json(workspace);
  } catch (err) {
    res.status(500).json({ message: 'Error updating workspace' });
  }
});

// Delete a workspace
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'You are not authorized to delete this workspace' });
    }
    await workspace.remove();
    res.status(200).json({ message: 'Workspace deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting workspace' });
  }
});

module.exports = router;