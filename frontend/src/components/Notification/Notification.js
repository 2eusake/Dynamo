import React, { useState, useEffect, useContext } from "react";
import apiClient from "../../utils/apiClient";
import { AuthContext } from "../../contexts/AuthContext"; // Assuming you have an AuthContext
import "./Notification.css";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext); // Get the authenticated user from context

  useEffect(() => {
    const fetchNotifications = async () => {
      // Check if user is authenticated
      if (!user || !user.id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get(`/notifications/${user.id}/all`);
        console.log("Response:", response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]); // Depend on user to refetch when user changes

  const handleMarkAsRead = async (id) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
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
      await apiClient.delete(`/notifications/${id}`);
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

  if (error) {
    return <div className="error">{error}</div>;
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
                <h3>{notification.title}</h3>
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
