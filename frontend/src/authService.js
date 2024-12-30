const API_URL = 'http://localhost:5000/api';

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  return response;
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  return response;
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
  const response = await fetch(`${API_URL}/workspace/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};