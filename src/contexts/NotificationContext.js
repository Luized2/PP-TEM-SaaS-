// src/contexts/NotificationContext.js
import React, { createContext, useContext, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import NotificationContainer from "../components/common/NotificationContainer";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((currentNotifications) =>
      currentNotifications.filter((n) => n.id !== id)
    );
  }, []);

  const addNotification = useCallback(
    (message, type = "info", duration = 5000) => {
      const id = uuidv4();
      const newNotification = { id, message, type, duration };
      setNotifications((currentNotifications) => [
        ...currentNotifications,
        newNotification,
      ]);
    },
    []
  );

  const value = { addNotification, removeNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} />
    </NotificationContext.Provider>
  );
}
