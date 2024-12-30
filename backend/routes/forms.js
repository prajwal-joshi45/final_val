const express = require('express');
const router = express.Router();
const Form = require('../schema/form');
const authMiddleware = require('../middleware/auth');

// Get all forms in a folder
router.get('/folder/:folderId', authMiddleware, async (req, res) => {
  try {
    const forms = await Form.find({ folder: req.params.folderId });
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching forms' });
  }
});

// Create a new form
router.post('/', authMiddleware, async (req, res) => {
  const { name, folder, elements } = req.body;
  if (!name || !folder) {
    return res.status(400).json({ message: 'Form name and folder are required' });
  }
  try {
    const form = new Form({
      name,
      folder,
      createdBy: req.user.id,
      elements,
    });
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    res.status(500).json({ message: 'Error creating form' });
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