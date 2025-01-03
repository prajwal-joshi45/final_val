const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formElementSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['text', 'image', 'video', 'gif', 'email', 'number', 'phone', 'date', 'rating']
  },
  value: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
});

const formSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  folder: {
    type: Schema.Types.ObjectId,
    ref: 'Folder',
    required: true
  },
  elements: [formElementSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Form', formSchema);