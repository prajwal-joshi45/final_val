const API_URL = 'http://localhost:5000/api';

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    } else {
      throw new Error('Registration failed');
    }
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    } else {
      throw new Error('Login failed');
    }
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const googleAuth = async () => {
  const response = await fetch(`${API_URL}/auth/google`, {
    method: 'GET',
    credentials: 'include'
  });
  return response;
};

export const getWorkspaces = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User is not authenticated');
  }
  const response = await fetch(`${API_URL}/workspace/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch workspaces');
  }
  return response.json();
};

export const getFolders = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User is not authenticated');
  }
  const response = await fetch(`${API_URL}/folder`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch folders');
  }
  return response.json();
};

export const createFolder = async (folderData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User is not authenticated');
  }
  const response = await fetch(`${API_URL}/folder`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(folderData)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create folder');
  }
  return response.json();
}

export const deleteFolder = async (folderId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User is not authenticated');
  }
  const response = await fetch(`${API_URL}/folder/${folderId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete folder');
  }
  return response.json();
};

export const validateFormData = (formData) => {
  const errors = {};
  
  // Validate form name
  if (!formData.name || formData.name.trim().length === 0) {
    errors.name = 'Form name is required';
  } else if (formData.name.length > 100) {
    errors.name = 'Form name must be less than 100 characters';
  }

  // Validate folder ID
  if (!formData.folder || formData.folder.trim().length === 0) {
    errors.folder = 'Folder ID is required';
  }

  // Validate creator ID
  if (!formData.createdBy) {
    errors.createdBy = 'Creator ID is required';
  }

  // Validate form elements
  if (!Array.isArray(formData.elements) || formData.elements.length === 0) {
    errors.elements = 'At least one form element is required';
  } else {
    const validTypes = ['text', 'image', 'video', 'gif', 'email', 'number', 'phone', 'date', 'rating'];
    const invalidElements = formData.elements.filter(elem => !validTypes.includes(elem.type));
    if (invalidElements.length > 0) {
      errors.elements = `Invalid element types found: ${invalidElements.map(e => e.type).join(', ')}`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const createForm = async (formData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User is not authenticated');
  }
  const response = await fetch(`${API_URL}/form`, { // Ensure this matches the server route
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Server error:', errorData); // Log server error

    throw new Error(errorData.message || 'Failed to create form');
  }
  return response.json();
};