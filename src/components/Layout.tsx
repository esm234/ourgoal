
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WeeklyEventNotificationBanner from "./WeeklyEventNotificationBanner";
import { clearAllCaches, forceReload } from "@/utils/cacheUtils";
import { Button } from "./ui/button";
import { useWeeklyEvents } from "@/hooks/useWeeklyEvents";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showCacheButton, setShowCacheButton] = useState(false);
  const { events } = useWeeklyEvents();

  useEffect(() => {
    // Show cache button in development or when pressing Ctrl+Shift+C
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        setShowCacheButton(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleClearCache = async () => {
    const success = await clearAllCaches();
    if (success) {
      alert('تم مسح الذاكرة المؤقتة بنجاح! سيتم إعادة تحميل الصفحة.');
      forceReload();
    } else {
      alert('حدث خطأ في مسح الذاكرة المؤقتة.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <WeeklyEventNotificationBanner events={events} />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />

      {/* Hidden cache management button - Press Ctrl+Shift+C to show */}
      {showCacheButton && (
        <div className="fixed bottom-4 left-4 z-50">
          <Button
            onClick={handleClearCache}
            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1"
            size="sm"
          >
            مسح Cache
          </Button>
        </div>
      )}
    </div>
  );
};

export default Layout;
