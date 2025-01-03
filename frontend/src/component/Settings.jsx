import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../authService';
import styles from '../template/settings.module.css';

const Settings = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await changePassword(passwords.currentPassword, passwords.newPassword);
      setSuccess('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Failed to update password');
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <h2>Settings</h2>
      
      <form onSubmit={handleSubmit} className={styles.passwordForm}>
        <h3>Change Password</h3>
        
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        
        <div className={styles.inputGroup}>
          <label>Current Password</label>
          <input
            type="password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>New Password</label>
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Update Password
        </button>
      </form>
    </div>
  );
};

export default Settings;