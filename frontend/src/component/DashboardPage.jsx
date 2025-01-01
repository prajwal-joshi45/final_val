import React, { useState, useEffect } from "react";
import styles from "../template/Dashboard.module.css"; // Import the modular CSS
import { useNavigate } from "react-router-dom";

import { getWorkspaces, getFolders, deleteFolder, createFolder } from "../authService";


const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '' });
  const [workspaces, setWorkspaces] = useState([]);
  const [error, setError] = useState(null);  // Add this line
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState({ token: null, userId: null });
  const [newFolderName, setNewFolderName] = useState(''); // Add state for new folder name
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) {
          throw new Error('User ID not found');
        }
        const data = await getWorkspaces(user._id);
        setWorkspaces(data);
      } catch (err) {
        setError(`Error fetching workspaces: ${err.message}`);
      }
    };

    const fetchFolders = async () => {
      try {
        const data = await getFolders();
        setFolders(data);
      } catch (err) {
        setError(`Error fetching folders: ${err.message}`);
      }
    };

    const fetchUserData = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setFormData({ username: user.username });
      }
    };

    fetchWorkspaces();
    fetchFolders();
    fetchUserData();
  }, []);
 // Empty dependency array since we only want this to run once on mount

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNewform = () => {
    navigate('/workspace');
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };
  
  const handleCreateFolder = async () => {
    try {
      if (!newFolderName.trim()) {
        setError('Folder name cannot be empty');
        return;
      }
  
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('Current user data:', user);
      
      if (!user || !user._id) {
        setError('User session not found. Please login again.');
        return;
      }
  
      console.log('Creating folder with name:', newFolderName);
  
      const newFolder = await createFolder({ 
        name: newFolderName.trim(),
        workspace: user._id,
        createdBy: user._id
      });
  
      console.log('Successfully created folder:', newFolder);
      
      // Update the folders state with the new folder
      setFolders(prevFolders => [...prevFolders, newFolder]);
      setNewFolderName('');
      closeModal();
      
    } catch (err) {
      console.error('Folder creation failed:', err);
      setError(err.message || 'Failed to create folder');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await deleteFolder(folderId);
      setFolders(folders.filter(folder => folder._id !== folderId));
    } catch (err) {
      setError('Failed to delete folder');
    }
  };

  return (
    <div className={`${styles.dashboard} ${isDarkMode ? styles.dark : styles.light}`}>
       {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}
      <header className={styles.navcontainer}>
        <div className={styles.workspace}>{formData.username}'s workspace</div>
        <div className={styles.toggleWrapper}>
          <label className={styles.toggleLabel}>
            {isDarkMode ? "Dark" : "Light"}
          </label>
          <button onClick={toggleTheme} className={styles.toggleButton}>
            <span className={styles.toggleIndicator}></span>
          </button>
        </div>
        <button className={styles.shareButton} onClick={openShareModal}>Share</button>
      </header>

      <main className={styles.mainContent}>
      
        <div className={styles.container}>
          <div className={styles.buttonGroup}>
            <div className={styles.createFolderButton}>
              <button onClick={openModal} className={styles.createFolder}>📂 Create a folder</button>
              {folders.map((folder) => (
          <div key={folder._id} className={styles.folderItem}>
            <span>{folder.name}</span>
            <button onClick={() => handleDeleteFolder(folder._id)} className={styles.deleteButton}>Delete</button>
            </div>
        ))}
            </div>

            <div className={styles.Typebotbutton}>
              <button className={styles.createTypebot} onClick={handleNewform}>
                <div className={styles.createTypebotInner}>
                  <span>+</span>
                </div>
                Create a typebot
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Component */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h3>Create New Folder</h3>
            <input
              type="text"
              className={styles.modalInput}
              placeholder="Enter folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button className={styles.doneBtn} onClick={handleCreateFolder}>
                Done
              </button>
              <button className={styles.cancelBtn} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className={styles.modalOverlay} onClick={closeShareModal}>
          <div
            className={styles.shareModalContent}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button className={styles.closeButton} onClick={closeShareModal}>
              ✖
            </button>
            <h3>Invite by Email</h3>
            <input
              type="text"
              className={styles.modalInput}
              placeholder="Enter email id"
            />
            <button className={styles.modalActionButton}>Send Invite</button>
            <h3>Invite by Link</h3>
            <button className={styles.modalActionButton}>Copy link</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;