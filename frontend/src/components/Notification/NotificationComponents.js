import React, { useState, useEffect } from "react";
import styles from "./Notification.module.css";

const Notification = ({ message, type = "info", duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <p className={styles.message}>{message}</p>
      <button
        className={styles.closeButton}
        onClick={() => setIsVisible(false)}
      >
        &times;
      </button>
    </div>
  );
};

export default Notification;
