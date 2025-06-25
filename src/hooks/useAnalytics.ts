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

    // Get page title based on path
    const getPageTitle = (pathname: string) => {
      const titles: Record<string, string> = {
        '/': 'الصفحة الرئيسية - اور جول',
        '/equivalency-calculator': 'حاسبة المعادلة - اور جول',
        '/files': 'الملفات التعليمية - اور جول',
        '/study-plan': 'مولد خطة الدراسة - اور جول',
        '/profile': 'الملف الشخصي - اور جول',
        '/pomodoro-timer': 'مؤقت البومودورو - اور جول',
        '/weekly-events': 'الاختبارات الأسبوعية - اور جول',
        '/login': 'تسجيل الدخول - اور جول',
        '/privacy': 'سياسة الخصوصية - اور جول',
        '/terms': 'شروط الاستخدام - اور جول',
        '/faq': 'الأسئلة الشائعة - اور جول',
      };

      // Check for dynamic routes
      if (pathname.startsWith('/files/')) return 'تفاصيل الملف - اور جول';
      if (pathname.startsWith('/local-file-details/')) return 'اختبارات الملف - اور جول';
      if (pathname.startsWith('/plan-details/')) return 'تفاصيل الخطة - اور جول';
      if (pathname.startsWith('/weekly-events/')) return 'تفاصيل الاختبار - اور جول';

      return titles[pathname] || document.title;
    };

    const pageTitle = getPageTitle(location.pathname);
    trackPageView(path, pageTitle);

    // Also track as a custom event for better visibility
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_navigation', {
        page_path: path,
        page_title: pageTitle,
      });
    }
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
