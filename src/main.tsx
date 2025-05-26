import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initCacheManagement, registerServiceWorker } from './utils/cacheUtils'

// Initialize cache management
initCacheManagement();

// Register service worker
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
