// src/components/common/NotificationContainer.js
import React from "react";
import Alert from "./Alert"; // Reutilizamos nosso componente Alert
import { useNotification } from "../../contexts/NotificationContext";
import "./Notification.css";

function NotificationContainer({ notifications }) {
  const { removeNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map(({ id, message, type, duration }) => (
        <Notification
          key={id}
          id={id}
          message={message}
          type={type}
          duration={duration}
          onClose={() => removeNotification(id)}
        />
      ))}
    </div>
  );
}

function Notification({ id, message, type, duration, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return <Alert message={message} type={type} onClose={onClose} />;
}

export default NotificationContainer;
