import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, initGA } from '@/utils/analytics';

// Hook to track page views automatically
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize GA on first load
    if (typeof window !== 'undefined' && !window.gtag) {
      initGA();
    }
  }, []);

  useEffect(() => {
    // Track page view on route change
    const path = location.pathname + location.search;
    trackPageView(path);
  }, [location]);
};

// Hook to track time spent on page
export const useTimeTracking = (pageName: string) => {
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const timeSpent = (Date.now() - startTime) / 1000; // Convert to seconds
      if (timeSpent > 5) { // Only track if user spent more than 5 seconds
        import('@/utils/analytics').then(({ trackTimeOnPage }) => {
          trackTimeOnPage(pageName, timeSpent);
        });
      }
    };
  }, [pageName]);
};
