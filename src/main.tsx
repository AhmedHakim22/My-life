import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for offline PWA and Web Push Notifications
registerSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    if (r) {
      console.log('MASAAR Service Worker registered:', swUrl);
    }
  },
  onRegisterError(error) {
    console.warn('MASAAR Service Worker registration failed:', error);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
