import React, { useState } from 'react';
import { 
  FileText,
  Calendar,
  Image,
  Mail,
  Phone,
  Star,
  Video,
  PlaySquare,
  Hash,
  X
} from 'lucide-react';
import styles from '../template/workspace.module.css';
 import { createForm } from '../authService';
   

const Workspace = () => {
  const [formElements, setFormElements] = useState([]);
  const [formName, setFormName] = useState('');
  const [folder, setFolder] = useState('');
  

  const formControls = [
    { type: 'text', icon: <FileText size={20} />, label: 'Text' },
    { type: 'image', icon: <Image size={20} />, label: 'Image' },
    { type: 'video', icon: <Video size={20} />, label: 'Video' },
    { type: 'gif', icon: <PlaySquare size={20} />, label: 'GIF' },
    { type: 'email', icon: <Mail size={20} />, label: 'Email' },
    { type: 'number', icon: <Hash size={20} />, label: 'Number' },
    { type: 'phone', icon: <Phone size={20} />, label: 'Phone' },
    { type: 'date', icon: <Calendar size={20} />, label: 'Date' },
    { type: 'rating', icon: <Star size={20} />, label: 'Rating' }
  ];

  const handleDragStart = (type) => (event) => {
    event.dataTransfer.setData('formElementType', type);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('formElementType');
    setFormElements([...formElements, { 
      type, 
      id: Date.now(),
      value: ''
    }]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDelete = (id) => {
    setFormElements(formElements.filter(element => element.id !== id));
  };

  const handleInputChange = (id, value) => {
    setFormElements(formElements.map(element => 
      element.id === id ? { ...element, value } : element
    ));
  };

  const handleSaveForm = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        throw new Error('User ID not found');
      }
      if (!formName || !folder) {
        throw new Error('Form name and folder are required');
      }

      // Ensure all elements have a value
      const validElements = formElements.map(elem => ({
        type: elem.type,
        value: elem.value || '',  // Ensure value is never undefined
        required: false
      }));

      const formData = {
        name: formName,
        folder: folder,
        elements: validElements
      };

      console.log('Sending form data:', formData);
      const response = await createForm(formData);
      console.log('Form saved successfully:', response);
      
      // Clear form after successful save
      setFormElements([]);
      setFormName('');
      setFolder('');
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };
  return (
    <div className={styles.formBuilder}>
      {/* Left Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <h2 className={styles.sidebarTitle}>Bubbles</h2>
          <div className={styles.controlsGrid}>
            {formControls.map((control) => (
              <div
                key={control.type}
                draggable
                onDragStart={handleDragStart(control.type)}
                className={styles.controlItem}
              >
                {control.icon}
                <span className={styles.controlLabel}>{control.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <input
            type="text"
            placeholder="Enter form name"
            className={styles.formNameInput}
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
           <input
        type="text"
        placeholder="Enter folder"
        className={styles.folderInput}
        value={folder}
        onChange={(e) => setFolder(e.target.value)}
      />
          <div className={styles.buttonGroup}>
            <button className={styles.flowButton}>Flow</button>
            <button className={styles.responseButton}>Response</button>
            <button className={styles.saveButton} onClick={handleSaveForm}>Save</button>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={styles.dropZone}
        >
          {formElements.length === 0 && (
            <div className={styles.placeholder}>
              Drag and drop form elements here
            </div>
          )}
          {formElements.map((element) => (
            <div key={element.id} className={styles.formElement}>
              <input
                type={element.type}
                value={element.value}
                onChange={(e) => handleInputChange(element.id, e.target.value)}
                placeholder={`Enter ${element.type}`}
              />
              <button onClick={() => handleDelete(element.id)} className={styles.deleteButton}>
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workspace;