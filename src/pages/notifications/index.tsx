import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import NotificationsPage from '../../components/notifications/NotificationsPage';
import { motion } from 'framer-motion';

/**
 * صفحة الإشعارات الرئيسية
 */
export default function NotificationsIndex() {
  useEffect(() => {
    // تمرير إلى الأعلى عند تحميل الصفحة
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>الإشعارات | هدفنا</title>
        <meta name="description" content="إدارة وعرض جميع الإشعارات الخاصة بك" />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-b from-gray-950 to-black"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,150,50,0.05),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(200,150,50,0.05),transparent_40%)] pointer-events-none"></div>
        <NotificationsPage />
      </motion.div>
    </>
  );
} 