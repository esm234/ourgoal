import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initCacheManagement, registerServiceWorker } from './utils/cacheUtils'
import { autoRestoreOnLoad } from './utils/dataBackup'
import MockExamExam from './pages/MockExamExam'

// Handle Chrome extension errors
if (typeof chrome !== 'undefined' && chrome.runtime) {
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

// Auto-restore data if needed
autoRestoreOnLoad();

// Initialize cache management
initCacheManagement();
// Initialize console protection
initConsoleProtection();
// Register service worker
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
