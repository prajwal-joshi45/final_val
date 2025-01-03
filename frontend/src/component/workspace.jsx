import React, { useState, useEffect } from 'react';
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
  X,
  PieChart, Users, ArrowUpRight,
} from 'lucide-react';
import styles from '../template/workspace.module.css';
 import { createForm, getFormById, updateForm} from '../authService';
 import {useParams, useLocation, useNavigate } from 'react-router-dom';
 
const Workspace = () => {
  const[isFlow, setIsFlow] = useState(true);
  const [formElements, setFormElements] = useState([]);
  const [formName, setFormName] = useState('');
  const [folder, setFolder] = useState('');
  const [error, setError] = useState(null); 
  const[isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { formId } = useParams();
  const folderId = location.state?.folderId;
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

  useEffect(() => {
    const fetchFormData = async () => {
      if (formId) {
        try {
          setIsLoading(true);
          setError(null);
          
          console.log('Fetching form with ID:', formId);
          const response = await getFormById(formId);
          console.log('API Response:', response);

          if (!response) {
            throw new Error('No form data received');
          }

          // Transform the elements data to match your state structure
          const transformedElements = response.elements.map(elem => ({
            id: Date.now() + Math.random(), // Generate unique ID for each element
            type: elem.type,
            value: elem.value || '',
            required: elem.required || false
          }));

          setFormName(response.name);
          setFormElements(transformedElements);
          console.log('Form data loaded:', { name: response.name, elements: transformedElements });
        } catch (err) {
          console.error('Error loading form:', err);
          setError(err.message || 'Failed to load form data');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchFormData();
  }, [formId]);

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
      if (!formName) {
        throw new Error('Form name is required');
      }

      // Map form elements to valid format
      const validElements = formElements.map(elem => ({
        type: elem.type,
        value: elem.value || '',
        required: false
      }));

      const formData = {
        name: formName,
        createdBy: user._id,
        elements: validElements,
        createdAt: new Date().toISOString()
      };

    
      if (folderId) {
        formData.folder = folderId;
      }

      let response;
      if (formId) {
        console.log('Updating form:', formId);
        response = await updateForm(formId, formData);
      } else {
        
        console.log('Creating new form');
        response = await createForm(formData);
      }

      console.log('Form saved successfully:', response);

      // Navigate back to dashboard
      navigate('/dashboard', {
        state: {
          form: response,
          folderId: folderId,
          success: true,
          message: `Form ${formId ? 'updated' : 'created'} successfully`
        }
      });

    } catch (error) {
      console.error('Error saving form:', error);
      setError(error.message || 'Failed to save form');
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };
  return (
    <div className={styles.formBuilder}>
      {isFlow ? (
        <>
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
              
              <div className={styles.buttonGroup}>
                <button className={styles.flowButton} onClick={() => setIsFlow(true)}>Flow</button>
                <button className={styles.responseButton} onClick={() => { setIsFlow(false); handleFetchResponses(); }}>Response</button>
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
                    value={element.value || ''} 
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
        </>
      ) : (
        <h1>Response</h1>

      )}
    </div>
  );
};

export default Workspace;