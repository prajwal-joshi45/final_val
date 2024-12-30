import React, { useState, useEffect } from "react";
import styles from "../template/Dashboard.module.css"; // Import the modular CSS
import { useNavigate } from "react-router-dom";

import { getWorkspaces } from "../authService";

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '' });
  const [workspaces, setWorkspaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await getWorkspaces();
        const data = await response.json();
        setWorkspaces(data);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

 
  const fetchUserData = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData({ username: user.username });
    }
  };

  fetchWorkspaces();

  fetchUserData();
}, []);
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

  return (
    <div className={`${styles.dashboard} ${isDarkMode ? styles.dark : styles.light}`}>
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
            />
            <div className={styles.modalActions}>
              <button className={styles.doneBtn} onClick={closeModal}>
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