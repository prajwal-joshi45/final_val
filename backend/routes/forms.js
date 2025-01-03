const express = require('express');
const router = express.Router();
const Form = require('../schema/form')
const Folder = require('../schema/folder');
const authMiddleware = require('../middleware/auth');
const { formAuthMiddleware } = require('../middleware/auth1');

// Get all forms in a folder
router.get('/folder/:folderId', authMiddleware, async (req, res) => {
  try {
    const forms = await Form.find({ folder: req.params.folderId });
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching forms' });
  }
});

router.post('/', formAuthMiddleware, async (req, res) => {
  const { name, folder, elements } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Form name is required' });
  }

  try {
    console.log('User from auth middleware:', req.user);
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User ID not found' });
    }

    if (folder) {
      const folderExists = await Folder.findById(folder);
      if (!folderExists) {
        return res.status(404).json({ message: 'Specified folder not found' });
      }
    }

    const validElements = elements.map(elem => ({
      type: elem.type,
      value: elem.value || '',
      required: elem.required || false
    }));

    const formData = {
      name,
      createdBy: req.user._id,
      elements: validElements
    };

    if (folder) {
      formData.folder = folder;
    }

    const form = new Form(formData);

    console.log('Form before save:', form);
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    console.error('Error creating form:', err);
    res.status(500).json({ 
      message: 'Error creating form', 
      error: err.message 
    });
  }
});
// Get a single form by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.status(200).json(form);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching form' });
  }
});

// Update a form
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, elements } = req.body;
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    if (form.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'You are not authorized to update this form' });
    }
    form.name = name || form.name;
    form.elements = elements || form.elements;
    await form.save();
    res.status(200).json(form);
  } catch (err) {
    res.status(500).json({ message: 'Error updating form' });
  }
});

// Delete a form
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    if (form.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'You are not authorized to delete this form' });
    }
    await form.remove();
    res.status(200).json({ message: 'Form deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting form' });
  }
});

module.exports = router;