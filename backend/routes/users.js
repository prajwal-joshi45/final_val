const express = require('express');
const router = express.Router();
const User = require('../schema/user');
const authMiddleware = require('../middleware/auth');

// Get user details by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('workspaces', 'name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Add a workspace to a user
router.post('/:userId/workspaces', authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { workspaceId } = req.body;

  try {
    const user = await User.findById(userId);
    const workspace = await Workspace.findById(workspaceId);

    if (!user || !workspace) {
      return res.status(404).json({ message: 'User or Workspace not found' });
    }

    if (!user.workspaces.includes(workspaceId)) {
      user.workspaces.push(workspaceId);
      await user.save();
    }

    res.status(200).json({ message: 'Workspace added to user successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding workspace to user' });
  }
});

// Get all users
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().populate('workspaces', 'name');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;