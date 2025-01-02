// schema/form.js
const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  folder: {
    type: String,  // Changed from ObjectId to String
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  elements: [{
    type: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: ''  // Provide default empty string
    },
    required: {
      type: Boolean,
      default: false
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);