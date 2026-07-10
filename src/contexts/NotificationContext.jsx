import React, { createContext, useContext, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../services/apiConfig.js';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [deviceToken, setDeviceToken] = useState(null);

  // Initialize push notifications on app start
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    initializePushNotifications();
  }, []);

  const initializePushNotifications = async () => {
    try {
      // Request notification permissions
      await PushNotifications.requestPermissions();
      
      // Register for push notifications
      await PushNotifications.register();

      // Get device token
      const { value } = await PushNotifications.getDeliveredNotifications();

      // Listen for push notification events
      setupNotificationListeners();
      
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ Failed to initialize push notifications:', error);
    }
  };

  const setupNotificationListeners = () => {
    // Listen for token refresh
    PushNotifications.addListener('registration', (token) => {
      setDeviceToken(token.value);
      
      // Save token to localStorage for logout
      localStorage.setItem('deviceToken', token.value);
      
      // Register token with backend
      registerTokenWithBackend(token.value);
    });

    // Listen for incoming notifications
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      const data = notification.data || {};
      const title = notification.title || 'New Notification';
      const body = notification.body || '';

      // Handle different notification types
      handleNotification(data, title, body);
      
      // Show toast notification
      toast.success(`${title}: ${body}`);
    });

    // Listen for notification action (tap)
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      const notification = action.notification;
      const data = notification.data || {};
      
      handleNotificationAction(data);
    });

    // Listen for registration errors
    PushNotifications.addListener('registrationError', (error) => {
      console.error('❌ Notification registration error:', error);
    });
  };

  const registerTokenWithBackend = async (token) => {
    try {
      const platform = Capacitor.getPlatform();
      const authToken = localStorage.getItem('token');

      if (!authToken) {
        return;
      }

      await apiClient.post(
        '/notifications/register-token',
        {
          deviceToken: token,
          platform: platform === 'ios' ? 'ios' : 'android',
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

    } catch (error) {
      console.error('❌ Failed to register token with backend:', error);
    }
  };

  const handleNotification = (data, title, body) => {
    const type = data.type || 'general';

    switch (type) {
      case 'enquiry':
        // Navigate to enquiries list for admin
        window.location.hash = '#enquiries';
        break;

      case 'registration':
        // Navigate to registrations for admin
        window.location.hash = '#registrations';
        break;

      default:
        break;
    }
  };

  const handleNotificationAction = (data) => {
    const action = data.action || 'open_app';

    switch (action) {
      case 'open_enquiries':
        window.location.hash = '#enquiries';
        break;

      case 'open_registrations':
        window.location.hash = '#registrations';
        break;

      default:
        // Open app normally
        break;
    }
  };

  const unregisterNotifications = async () => {
    try {
      if (deviceToken) {
        const authToken = localStorage.getItem('token');
        if (authToken) {
          await apiClient.post(
            '/notifications/unregister-token',
            { deviceToken },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
        }
      }
    } catch (error) {
      console.error('❌ Failed to unregister notifications:', error);
    }
  };

  const value = {
    isInitialized,
    deviceToken,
    unregisterNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
