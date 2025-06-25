import { usePageTracking } from '@/hooks/useAnalytics';

// Component to handle analytics tracking
const AnalyticsTracker = () => {
  usePageTracking();
  return null; // This component doesn't render anything
};

export default AnalyticsTracker;
