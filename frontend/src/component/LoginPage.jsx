import React, { useState } from 'react';
import styles from '../template/LoginPage.module.css';
import image from '../assets/google.png';
import { useNavigate } from 'react-router-dom';
import { login } from '../authService';


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      // The login function already parses the response and sets localStorage
      const data = await login({
        email: formData.email,
        password: formData.password
      });
      
      // No need to parse response or set localStorage again since login() does that
      console.log('Login successful, navigating to dashboard');
      navigate('/dashboard');
    
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await googleAuth();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      window.location.href = data.authUrl;

    } catch (error) {
      console.error('Google sign-in failed:', error);
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
       
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            placeholder="**************"
            required
          />
        </div>

        <button
          type="submit"
          className={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <img
            src={image}
            alt="Google logo"
            className={styles.googleIcon}
          />
          <span>Sign in with Google</span>
        </button>

        <div className={styles.footer}>
          <span>Don't have an account? </span>
          <a href="/register" className={styles.registerLink}>
            Register now
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;