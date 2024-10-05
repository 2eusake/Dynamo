import React, { useState, useEffect } from "react";
import Notification from "./Notification";
import styles from "./NotificationSystem.module.css";
import apiClient from "../../utils/apiClient";

const NotificationSystem = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 300000); // Check every 5 minutes
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser || !currentUser.id) {
      setError("User not authenticated");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = apiClient.get(`/notification/${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.map((notif, index) => ({ ...notif, id: index })));
      } else {
        throw new Error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setError("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  if (!currentUser || !currentUser.id) {
    return null; // Or return a message asking the user to log in
  }

  return (
    <div className={styles.notificationSystem}>
      <button
        className={styles.notificationButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        Notifications{" "}
        {notifications.length > 0 && (
          <span className={styles.badge}>{notifications.length}</span>
        )}
      </button>
      {isOpen && (
        <div className={styles.notificationContainer}>
          {isLoading ? (
            <p className={styles.loadingMessage}>Loading notifications...</p>
          ) : error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <Notification
                key={notif.id}
                message={notif.message}
                type={notif.type}
                onClose={() => removeNotification(notif.id)}
              />
            ))
          ) : (
            <p className={styles.noNotifications}>No notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
