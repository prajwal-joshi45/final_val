import React, { useState, useEffect } from "react";
import styles from "../template/Dashboard.module.css"; 
import { useNavigate, useLocation } from "react-router-dom";
import {
  getWorkspaces,
  getFolders,
  deleteFolder,
  createFolder,
  fetchFormsForFolder,
  getFormById,
  sendInviteEmail,
  deleteForm,
} from "../authService";
import { FaTrash } from 'react-icons/fa'; // Import the FaTrash icon


const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: "" });
  const [workspaces, setWorkspaces] = useState([]);
  const [error, setError] = useState(null); 
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();
  const [newFolderName, setNewFolderName] = useState(""); 
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderForms, setFolderForms] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePermission, setInvitePermission] = useState("view");
  const [inviteLink, setInviteLink] = useState("");
  const [inviteLinkPermission, setInviteLinkPermission] = useState("view");

  const folderId = location.state?.folderId;

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) {
          throw new Error("User ID not found");
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
    const fetchFolderData = async () => {
      try {
        const data = await getFolders();
        setFolders(data);

       
        await Promise.all(
          data.map(async (folder) => {
            const forms = await fetchFormsForFolder(folder._id);
            setFolderForms((prev) => ({
              ...prev,
              [folder._id]: forms,
            }));
          })
        );
      } catch (err) {
        setError(`Error fetching data: ${err.message}`);
      }
     
      console.log("FolderForms state:", folderForms);
    };
    fetchFolderData();
    if (location.state?.newForm && location.state?.folderId) {
      const { newForm, folderId } = location.state;
      setFolderForms((prev) => ({
        ...prev,
        [folderId]: [...(prev[folderId] || []), newForm],
      }));
      window.history.replaceState({}, document.title);
    }
    const fetchUserData = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setFormData({ username: user.username });
      }
    };
    fetchWorkspaces();
    fetchFolders();
    fetchUserData();
  }, [location]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNewform = () => {
    navigate("/workspace", { state: { folderId: selectedFolder } }); // Pass folderId to Workspace
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
        setError("Folder name cannot be empty");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      console.log("Current user data:", user);

      if (!user || !user._id) {
        setError("User session not found. Please login again.");
        return;
      }

      console.log("Creating folder with name:", newFolderName);

      const newFolder = await createFolder({
        name: newFolderName.trim(),
        workspace: user._id,
        createdBy: user._id,
      });

      console.log("Successfully created folder:", newFolder);

      setFolders((prevFolders) => [...prevFolders, newFolder]);
      setNewFolderName("");
      closeModal();
    } catch (err) {
      console.error("Folder creation failed:", err);
      setError(err.message || "Failed to create folder");
    }
  };
  const handleNavigateToForm = async (formId) => {
    try {
      
      if (formId === undefined || formId === null) {
        throw new Error('Form ID is undefined or null');
      }
      
      if (typeof formId === 'object') {
        throw new Error(`Invalid form ID: received object instead of string/number. Value: ${JSON.stringify(formId)}`);
      }
      
      if (!formId.toString().trim()) {
        throw new Error('Form ID is empty');
      }

      const form = await getFormById(formId);
      navigate(`/workspace/${formId}`, { state: { form } });
    } catch (err) {
      console.error('Navigation error details:', {
        formId,
        errorMessage: err.message,
        errorStack: err.stack
      });
      setError(err.message || 'Failed to fetch form');
    }
};

  const handleDeleteFolder = async (folderId) => {
    try {
      await deleteFolder(folderId);
      setFolders(folders.filter((folder) => folder._id !== folderId));
    } catch (err) {
      setError("Failed to delete folder");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFolderClick = async (folderId) => {
    try {
      setSelectedFolder((prevSelected) =>
        prevSelected === folderId ? null : folderId
      );

      const forms = await fetchFormsForFolder(folderId);
      setFolderForms((prev) => ({
        ...prev,
        [folderId]: forms || [], 
      }));
    } catch (err) {
      setError(err.message);
    }
  };
  const handleDeleteForm = async (formId, folderId) => {
    try {
      await deleteForm(formId);
      
      setFolderForms(prev => ({
        ...prev,
        [folderId]: prev[folderId].filter(form => form._id !== formId)
      }));
    } catch (err) {
      setError('Failed to delete form');
      console.error('Error deleting form:', err);
    }
  };

  const handleEmailInvite = async () => {
    try {
      if (!inviteEmail) {
        setError("Please enter an email address");
        return;
      }

      await sendInviteEmail({
        email: inviteEmail,
        permission: invitePermission,
        workspace: selectedFolder || workspaces[0]?._id
      });

      setInviteEmail("");
      setError("Invite sent successfully!");
    } catch (err) {
      setError("Failed to send invite: " + err.message);
    }
  };

  const generateInviteLink = () => {
    const baseUrl = window.location.origin;
    const linkToken = btoa(`workspace=${selectedFolder}&permission=${inviteLinkPermission}`);
    const generatedLink = `${baseUrl}/invite/${linkToken}`;
    setInviteLink(generatedLink);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setError("Link copied to clipboard!");
  };

  return (
    <div
      className={`${styles.dashboard} ${
        isDarkMode ? styles.dark : styles.light
      }`}
    >
      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}
      <header className={styles.navcontainer}>
       
        <button className={styles.workspace} onClick={() => setIsDropdownOpen(!isDropdownOpen)}> {formData.username}'s workspace 
 
        {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button className={styles.dropdownItem} onClick={() => navigate('/settings')}>Settings</button>
              <button className={styles.dropdownItem} onClick={handleLogout}>Logout</button>
              </div> 
          )}
        
        </button>
        <div className={styles.toggleWrapper}>
          <label className={styles.toggleLabel}>
            {isDarkMode ? "Dark" : "Light"}
          </label>
          <button onClick={toggleTheme} className={styles.toggleButton}>
            <span className={styles.toggleIndicator}></span>
          </button>
        </div>
        <button className={styles.shareButton} onClick={openShareModal}>
          Share
        </button>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.buttonGroup}>
            <div className={styles.createFolderButton}>
              <button onClick={openModal} className={styles.createFolder}>
                📂 Create a folder
              </button>
              {folders.map((folder) => (
                <div key={folder._id} className={styles.folderssection}>
                  
                    <button
                      className={`${styles.folderItem} ${
                        selectedFolder === folder._id ? styles.selected : ""
                      }`}
                      onClick={() => handleFolderClick(folder._id)}
                    >
                      {folder.name}
                      <button
                      onClick={() => handleDeleteFolder(folder._id)}
                      className={styles.deleteButton}
                    >
                      <FaTrash/>
                    </button>
                    </button>
                    
                  </div>
                
              ))}
            </div>

            <div className={styles.Typebotbutton}>
  <button
    className={`${styles.createTypebot} ${
      !selectedFolder ? styles.disabled : ""
    }`}
    onClick={handleNewform}
  >
    <div className={styles.createTypebotInner}>
      <span>+</span>
    </div>
    Create a typebot
  </button>

  {selectedFolder && folderForms[selectedFolder] && (
    <div className={`${styles.formsContainer} ${styles.flexContainer}`}>
      {folderForms[selectedFolder]?.map((form) => (
        <button
          className={styles.formItem}
          onClick={() => handleNavigateToForm(form._id)}
          key={form._id}
        >
           <button
                      onClick={() => handleDeleteForm(form._id)}
                      className={styles.deleteButtonform}
                    >
                      <FaTrash/>
                    </button>
          {form.name}
        </button>
      ))}
      {(!folderForms[selectedFolder] ||
        folderForms[selectedFolder]?.length === 0) && (
        <div className={styles.noForms}>No forms in this folder</div>
      )}
    </div>
  )}
</div>

          </div>
        </div>
      </main>

      {/* Modal Component */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}>
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
      {isShareModalOpen &&  <div className={styles.modalOverlay} onClick={closeShareModal}>
      <div className={styles.shareModalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={closeShareModal}>✖</button>
        
        <div className={styles.inviteSection}>
          <h3>Invite by Email</h3>
          <div className={styles.inviteInputGroup}>
            <input
              type="email"
              className={styles.modalInput}
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <select
              className={styles.permissionSelect}
              value={invitePermission}
              onChange={(e) => setInvitePermission(e.target.value)}
            >
              <option value="view">View</option>
              <option value="edit">Edit</option>
            </select>
          </div>
          <button 
            className={styles.modalActionButton}
            onClick={handleEmailInvite}
          >
            Send Invite
          </button>
        </div>

        <div className={styles.inviteSection}>
          <h3>Invite by Link</h3>
          <div className={styles.inviteInputGroup}>
            <select
              className={styles.permissionSelect}
              value={inviteLinkPermission}
              onChange={(e) => setInviteLinkPermission(e.target.value)}
            >
              <option value="view">View</option>
              <option value="edit">Edit</option>
            </select>
            <button 
              className={styles.modalActionButton}
              onClick={generateInviteLink}
            >
              Generate Link
            </button>
          </div>
          {inviteLink && (
            <div className={styles.linkContainer}>
              <input
                type="text"
                className={styles.linkInput}
                value={inviteLink}
                readOnly
              />
              <button 
                className={styles.copyButton}
                onClick={copyInviteLink}
              >
                Copy Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
}
</div>
  )};


export default Dashboard;
