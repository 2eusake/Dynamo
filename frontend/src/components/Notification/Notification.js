import React, { useState, useEffect } from "react";
import apiClient from "../../utils/apiClient";
import "./Notification.css";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId"); // Ensure you have userId stored
        const response = await apiClient.get(`/notifications/${userId}/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = response.data; // Assuming apiClient handles JSON parsing
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications(
        notifications.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications(notifications.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "error":
        return "🔴";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📫";
    }
  };

  if (loading) {
    return <div className="loading">Loading notifications...</div>;
  }

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications</p>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${
                notification.isRead ? "read" : ""
              }`}
            >
              <span className="notification-icon">
                {getIconForType(notification.type)}
              </span>
              <div className="notification-content">
                <h3>{getIconForType(notification.type)}</h3>
                <p>{notification.message}</p>
              </div>
              <div className="notification-actions">
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="mark-read-btn"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
