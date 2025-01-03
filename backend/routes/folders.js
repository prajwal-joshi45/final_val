const express = require('express');
const router = express.Router();
const Folder = require('../schema/folder');
const authMiddleware = require('../middleware/auth');
const {folderAuthMiddleware} = require('../middleware/auth1');
const Form = require('../schema/form'); 


router.get('/:folderId/form', authMiddleware, async (req, res) => {
  try {
    const { folderId } = req.params;
    
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    const forms = await Form.find({ folder: folderId });
    
    res.status(200).json(forms);
  } catch (err) {
    console.error('Error fetching forms:', err);
    res.status(500).json({ message: 'Error fetching forms', error: err.message });
  }
});
router.post('/', folderAuthMiddleware , async (req, res) => {
  try {
   
    const { name, workspace } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Folder name is required' });
    }
    if (!workspace) {
      return res.status(400).json({ message: 'Workspace ID is required' });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }
    const folder = new Folder({
      name: name.trim(),
      workspace,
      createdBy: req.user.id  
    });
    const savedFolder = await folder.save();
    res.status(201).json(savedFolder);
  } catch (err) {
    console.error('Error creating folder:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', error: err.message });
    }
    res.status(500).json({ message: 'Error creating folder', error: err.message });
  }
});


// Get a single folder by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.status(200).json(folder);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching folder' });
  }
});
// Update a folder
router.put('/:id', authMiddleware, async (req, res) => {
  const { name } = req.body;
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    if (folder.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'You are not authorized to update this folder' });
    }
    folder.name = name || folder.name;
    await folder.save();
    res.status(200).json(folder);
  } catch (err) {
    res.status(500).json({ message: 'Error updating folder' });
  }
});

// Delete a folder
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    if (folder.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this folder' });
    }

    await Folder.deleteOne({ _id: req.params.id }); 
    res.status(200).json({ message: 'Folder deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting folder' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const folders = await Folder.find({ createdBy: req.user.id });
    res.status(200).json(folders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching folders' });
  }
});
module.exports = router;