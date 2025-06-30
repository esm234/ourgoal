import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initCacheManagement, registerServiceWorker } from './utils/cacheUtils'
import { autoRestoreOnLoad } from './utils/dataBackup'


// Handle Chrome extension errors
if (typeof window !== 'undefined' && 'chrome' in window) {
  const chromeObj = window['chrome'] as any;
  if (chromeObj && chromeObj.runtime) {
    // Suppress Chrome extension errors
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('message port closed') ||
          message.includes('runtime.lastError') ||
          message.includes('Extension context invalidated')) {
        return; // Suppress these specific errors
      }
      originalError.apply(console, args);
    };
  }
}

// Auto-restore data if needed
autoRestoreOnLoad();

// Initialize cache management
initCacheManagement();

// Register service worker
registerServiceWorker();

// Initialize console protection
initConsoleProtection();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
