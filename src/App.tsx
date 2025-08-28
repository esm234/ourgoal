import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import EquivalencyCalculator from "@/pages/EquivalencyCalculator";
import Files from "@/pages/Files";
import FileDetails from "@/pages/FileDetails";
import LocalFileDetails from "@/pages/LocalFileDetails";
import CollectionDetails from "@/pages/CollectionDetails";
import StudyPlan from "@/pages/StudyPlan";
import Profile from "@/pages/Profile";
import Welcome from "@/pages/Welcome";
import PlanDetails from "@/pages/PlanDetails";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import AdminDashboard from "@/pages/AdminDashboard";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import FAQ from "@/pages/FAQ";
import WeeklyEvents from "@/pages/WeeklyEvents";
import AdminWeeklyEvents from "@/pages/AdminWeeklyEvents";
import AdminCreateEvent from "@/pages/AdminCreateEvent";
import AdminEditEvent from "@/pages/AdminEditEvent";
import AdminEventQuestions from "@/pages/AdminEventQuestions";
import EventTest from "@/pages/EventTest";
import EventResults from "@/pages/EventResults";
import EventPreview from "@/pages/EventPreview";
import AdminCreateQuestion from "@/pages/AdminCreateQuestion";
import AdminEditQuestion from "@/pages/AdminEditQuestion";
import PomodoroTimer from "@/pages/PomodoroTimer";
import Event from "@/pages/Event";
import MaintenancePage from "@/components/MaintenancePage";
import ScrollToTop from "@/components/ScrollToTop";
import SEOPerformance from "@/components/SEOPerformance";
import RedirectHandler from "@/components/RedirectHandler";
import Courses from "@/pages/Courses";
import CourseDetails from "@/pages/CourseDetails";
import CourseLesson from "@/pages/CourseLesson";
import PDFViewer from "@/pages/PDFViewer";
import NotificationsPage from "@/pages/notifications";
import MockExam from "@/pages/MockExam";
import MockExamExam from './pages/MockExamExam';
import MockExamResult from './pages/MockExamResult';
<<<<<<< HEAD

=======
>>>>>>> 9b70aa3465933cbdecb33f35ce1e6e8876807455
import { SHOW_COURSES_PAGE, SHOW_NOTIFICATIONS_PAGE } from './config/environment';


// Set this to true to enable maintenance mode
const MAINTENANCE_MODE =  false;

const queryClient = new QueryClient();

const App = () => {
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <SEOPerformance
              preloadImages={['/new-favicon.jpg', '/photo_2025-05-24_16-53-22.jpg']}
              preloadFonts={['https://fonts.gstatic.com/s/tajawal/v9/Iura6YBj_oCad4k1l_6gLg.woff2']}
            />
            <BrowserRouter>
              <ScrollToTop />
              <RedirectHandler />
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/equivalency-calculator" element={<EquivalencyCalculator />} />
              <Route path="/files" element={<Files />} />
              <Route path="/files/:id" element={<FileDetails />} />
              <Route path="/local-file-details/:id" element={<LocalFileDetails />} />
              <Route path="/collections/:id" element={<CollectionDetails />} />
              <Route path="/courses" element={SHOW_COURSES_PAGE ? <Courses /> : null} />
              <Route path="/courses/:courseId" element={<CourseDetails />} />
              <Route path="/courses/:courseId/lesson/:lessonId" element={<CourseLesson />} />
              <Route path="/pdf/:fileId" element={<PDFViewer />} />
              <Route path="/study-plan" element={
                <ProtectedRoute>
                  <StudyPlan />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/welcome" element={
                <ProtectedRoute>
                  <Welcome />
                </ProtectedRoute>
              } />
              <Route path="/plan-details/:planId" element={
                <ProtectedRoute>
                  <PlanDetails />
                </ProtectedRoute>
              } />
              <Route path="/pomodoro" element={
                <ProtectedRoute>
                  <PomodoroTimer />
                </ProtectedRoute>
              } />
              {SHOW_NOTIFICATIONS_PAGE && (
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                } />
              )}

              <Route path="/faq" element={<FAQ />} />
              <Route path="/weekly-events" element={
                <ProtectedRoute>
                  <WeeklyEvents />
                </ProtectedRoute>
              } />
              <Route path="/weekly-events/:eventId/test" element={
                <ProtectedRoute>
                  <EventTest />
                </ProtectedRoute>
              } />
              <Route path="/weekly-events/:eventId/results" element={
                <ProtectedRoute>
                  <EventResults />
                </ProtectedRoute>
              } />
              <Route path="/weekly-events/:eventId/preview" element={
                <ProtectedRoute adminOnly={true}>
                  <EventPreview />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

        

              <Route path="/admin/weekly-events" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminWeeklyEvents />
                </ProtectedRoute>
              } />
              <Route path="/admin/weekly-events/create" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminCreateEvent />
                </ProtectedRoute>
              } />
              <Route path="/admin/weekly-events/:eventId/edit" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminEditEvent />
                </ProtectedRoute>
              } />
              <Route path="/admin/weekly-events/:eventId/questions" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminEventQuestions />
                </ProtectedRoute>
              } />
              <Route path="/admin/weekly-events/:eventId/questions/create" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminCreateQuestion />
                </ProtectedRoute>
              } />
              <Route path="/admin/weekly-events/:eventId/questions/:questionId/edit" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminEditQuestion />
                </ProtectedRoute>
              } />

              <Route path="/mock-exam" element={<MockExam />} />
              <Route path="/mock-exam/exam" element={<MockExamExam />} />
              <Route path="/mock-exam/result" element={<MockExamResult />} />

              <Route path="*" element={<NotFound />} />
                <Route path="/Ourgoalevent" element={<Event />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
