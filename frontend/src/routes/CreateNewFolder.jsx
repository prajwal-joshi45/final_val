import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../template/cnf.module.css";

const CreateNewFolder = () => {
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
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
  );
};

export default CreateNewFolder;
