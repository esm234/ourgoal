// Google Analytics 4 utilities for tracking user interactions
// Replace GA_MEASUREMENT_ID with your actual Google Analytics 4 measurement ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Your Google Analytics 4 Measurement ID
// Replace this with your actual GA4 measurement ID (starts with G-)
export const GA_MEASUREMENT_ID = 'G-G1154GYH5M';

// Initialize Google Analytics
export const initGA = () => {
  // Create script tag for gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  // Configure GA4
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views (for SPA navigation)
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('📊 Tracking page view:', path, title); // Debug log

    // Send page_view event
    window.gtag('event', 'page_view', {
      page_title: title || document.title,
      page_location: window.location.href,
      page_path: path,
    });

    // Also update config for proper tracking
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    });

    // Send custom event for better tracking
    window.gtag('event', 'custom_page_view', {
      event_category: 'navigation',
      event_label: path,
      page_title: title || document.title,
    });
  }
};

// Generic event tracking function
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track file downloads
export const trackFileDownload = (
  fileId: string,
  fileName: string,
  fileCategory: string
) => {
  trackEvent('file_download', 'engagement', `${fileCategory}_${fileName}`, 1);

  // Also track as a conversion event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'file_download_conversion', {
      file_id: fileId,
      file_name: fileName,
      file_category: fileCategory,
    });
  }
};

// Track equivalency calculator usage
export const trackCalculatorUsage = (
  calculationType: string,
  inputValues?: Record<string, any>
) => {
  trackEvent('calculator_usage', 'engagement', calculationType, 1);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'calculator_conversion', {
      calculator_type: calculationType,
      input_data: inputValues ? JSON.stringify(inputValues) : undefined,
    });
  }
};

// Track study plan generation
export const trackStudyPlanGeneration = (
  planType: string,
  planDetails?: Record<string, any>
) => {
  trackEvent('study_plan_generated', 'engagement', planType, 1);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'study_plan_conversion', {
      plan_type: planType,
      plan_details: planDetails ? JSON.stringify(planDetails) : undefined,
    });
  }
};

// Track user registration
export const trackUserRegistration = (method: string = 'email') => {
  trackEvent('sign_up', 'user_engagement', method, 1);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: method,
    });
  }
};

// Track user login
export const trackUserLogin = (method: string = 'email') => {
  trackEvent('login', 'user_engagement', method, 1);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'login', {
      method: method,
    });
  }
};

// Track search queries
export const trackSearch = (searchTerm: string, category?: string) => {
  trackEvent('search', 'engagement', searchTerm, 1);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
      search_category: category,
    });
  }
};

// Track weekly event participation
export const trackEventParticipation = (
  eventId: string,
  eventName: string,
  action: 'start' | 'complete' | 'abandon'
) => {
  trackEvent(`event_${action}`, 'weekly_events', eventName, 1);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', `weekly_event_${action}`, {
      event_id: eventId,
      event_name: eventName,
    });
  }
};

// Track Pomodoro timer usage
export const trackPomodoroUsage = (
  action: 'start' | 'complete' | 'pause' | 'reset',
  duration?: number
) => {
  trackEvent(`pomodoro_${action}`, 'productivity', action, duration);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', `pomodoro_${action}`, {
      timer_duration: duration,
    });
  }
};

// Track form submissions
export const trackFormSubmission = (
  formName: string,
  success: boolean = true
) => {
  trackEvent('form_submit', 'engagement', formName, success ? 1 : 0);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_submit', {
      form_name: formName,
      success: success,
    });
  }
};

// Track button clicks
export const trackButtonClick = (
  buttonName: string,
  location: string
) => {
  trackEvent('button_click', 'engagement', `${location}_${buttonName}`, 1);
};

// Track time spent on page
export const trackTimeOnPage = (pageName: string, timeSpent: number) => {
  if (timeSpent > 10) { // Only track if user spent more than 10 seconds
    trackEvent('time_on_page', 'engagement', pageName, Math.round(timeSpent));
  }
};

// Track errors
export const trackError = (errorType: string, errorMessage: string) => {
  trackEvent('error', 'technical', errorType, 1);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: errorMessage,
      fatal: false,
    });
  }
};

// Track video play events
export const trackVideoPlay = (
  videoId: string,
  videoTitle?: string,
  courseId?: string
) => {
  trackEvent('video_play', 'engagement', `${courseId || 'unknown'}_${videoId}`, 1);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'video_play', {
      video_id: videoId,
      video_title: videoTitle,
      course_id: courseId,
    });
  }
};

// Track video completion events
export const trackVideoComplete = (
  videoId: string,
  courseId?: string,
  videoTitle?: string
) => {
  trackEvent('video_complete', 'engagement', `${courseId || 'unknown'}_${videoId}`, 1);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'video_complete', {
      video_id: videoId,
      course_id: courseId,
      video_title: videoTitle,
    });
  }
};

// Track video progress events
export const trackVideoProgress = (
  videoId: string,
  currentTime: number,
  courseId?: string,
  totalDuration?: number
) => {
  const progressPercent = totalDuration ? Math.round((currentTime / totalDuration) * 100) : 0;

  // Only track at certain milestones (25%, 50%, 75%)
  if (progressPercent === 25 || progressPercent === 50 || progressPercent === 75) {
    trackEvent('video_progress', 'engagement', `${courseId || 'unknown'}_${videoId}_${progressPercent}%`, progressPercent);

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'video_progress', {
        video_id: videoId,
        course_id: courseId,
        progress_percent: progressPercent,
        current_time: currentTime,
      });
    }
  }
};

// Track custom conversions
export const trackConversion = (
  conversionName: string,
  value?: number,
  currency: string = 'SAR'
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: GA_MEASUREMENT_ID,
      value: value,
      currency: currency,
      transaction_id: `${conversionName}_${Date.now()}`,
    });
  }
};

// Get enrollment statistics (mock implementation)
export const getEnrollmentStats = async () => {
  // This is a mock implementation - in a real app, you would fetch this from your analytics API
  return {
    totalEnrollments: 1250,
    monthlyEnrollments: 180,
    weeklyEnrollments: 45,
    dailyEnrollments: 8,
    topCourses: [
      { courseId: 'the-last-dance', name: 'The Last Dance', enrollments: 450 },
      { courseId: 'math-basics', name: 'أساسيات الرياضيات', enrollments: 320 },
      { courseId: 'arabic-grammar', name: 'قواعد اللغة العربية', enrollments: 280 },
    ],
    enrollmentTrend: [
      { date: '2024-01-01', enrollments: 25 },
      { date: '2024-01-02', enrollments: 30 },
      { date: '2024-01-03', enrollments: 28 },
      { date: '2024-01-04', enrollments: 35 },
      { date: '2024-01-05', enrollments: 40 },
    ]
  };
};
