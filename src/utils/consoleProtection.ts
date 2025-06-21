/**
 * Advanced Console Protection Utility
 * 
 * This utility provides multiple layers of protection against browser developer tools:
 * 1. Disables right-click context menu
 * 2. Blocks keyboard shortcuts for developer tools
 * 3. Disables console logging methods
 * 4. Detects when DevTools is open
 * 5. Uses debugger detection
 * 6. Self-healing protection against tampering
 * 7. CSS-based protection
 */

import './devtools-detector.css';

/**
 * Initialize console protection
 * Only applies in production environment
 */
export const initConsoleProtection = (): void => {
  // Only apply in production
  if (import.meta.env.PROD) {
    try {
      // Disable right-click
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });

      // Disable keyboard shortcuts for developer tools
      document.addEventListener('keydown', (e) => {
        // F12, Ctrl+Shift+I, Cmd+Option+I, Ctrl+Shift+J, Cmd+Option+J, Ctrl+Shift+C, Cmd+Option+C, F11
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            e.key === 'F11') {
          e.preventDefault();
          return false;
        }
      });

      // Apply console protection methods
      applyConsoleProtection();
      
      // Setup self-healing protection
      setupSelfHealing();
      
      // Setup debugger detection
      setupDebuggerDetection();
      
      // Setup CSS-based detection
      setupCssDetection();
    } catch (e) {
      // Silent fail
    }
  }
};

/**
 * Disable console functionality
 */
const applyConsoleProtection = (): void => {
  const noOp = () => undefined;
  const methods = ['log', 'debug', 'info', 'warn', 'error', 'dir', 'trace'];
  
  // Store original methods
  const originalMethods: Record<string, any> = {};
  methods.forEach(method => {
    originalMethods[method] = console[method];
    console[method] = noOp;
  });
  
  // Detect DevTools opening
  const checkDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    if (widthThreshold || heightThreshold) {
      // DevTools might be open, re-disable methods
      methods.forEach(method => {
        console[method] = noOp;
      });
      
      // Clear console
      console.clear();
      
      // Add class to body for CSS protection
      document.body.classList.add('devtools-open');
    } else {
      // Remove class when DevTools is closed
      document.body.classList.remove('devtools-open');
    }
  };
  
  // Periodically check and clear
  setInterval(checkDevTools, 1000);
  setInterval(console.clear, 3000);
};

/**
 * Setup self-healing protection against tampering
 */
const setupSelfHealing = (): void => {
  const protectionCode = applyConsoleProtection.toString();
  setInterval(() => {
    if (applyConsoleProtection.toString() !== protectionCode) {
      // Protection was modified, reapply
      applyConsoleProtection();
    }
  }, 2000);
};

/**
 * Setup debugger detection
 */
const setupDebuggerDetection = (): void => {
  setInterval(() => {
    const startTime = new Date().getTime();
    debugger; // This will pause execution if dev tools are open
    const endTime = new Date().getTime();
    if (endTime - startTime > 100) {
      // Debugger was detected, take action
      console.clear();
      document.body.classList.add('devtools-open');
    }
  }, 1000);
};

/**
 * Setup CSS-based detection for DevTools
 */
const setupCssDetection = (): void => {
  // Monitor animation state to detect DevTools
  const animationTest = document.createElement('div');
  animationTest.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    animation: devtools-detect 1s infinite;
  `;
  document.body.appendChild(animationTest);
  
  // Check if animation is running
  setInterval(() => {
    const computedStyle = window.getComputedStyle(animationTest);
    const isAnimationRunning = computedStyle.animationPlayState === 'running';
    
    if (!isAnimationRunning) {
      // Animation stopped, DevTools might be open
      document.body.classList.add('devtools-open');
    } else {
      document.body.classList.remove('devtools-open');
    }
  }, 1000);
}; 