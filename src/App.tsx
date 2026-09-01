import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Navigate, Outlet, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage'));
const VideoPage = lazy(() => import('@/pages/VideoPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const NewsPage = lazy(() => import('@/pages/NewsPage'));
const NewsDetailPage = lazy(() => import('@/pages/NewsDetailPage'));
const LoginPage = lazy(() => import('@/pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const PortfoliosPage = lazy(() => import('@/pages/admin/PortfoliosPage'));
const NewsManagerPage = lazy(() => import('@/pages/admin/NewsManagerPage'));
const ProductsManagerPage = lazy(() => import('@/pages/admin/ProductsManagerPage'));
const LeadsPage = lazy(() => import('@/pages/admin/LeadsPage'));
const AdminAuthBoundary = lazy(() => import('@/components/admin/AdminAuthBoundary'));
const ProtectedRoute = lazy(() => import('@/components/admin/ProtectedRoute'));
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'));

function PublicLayout() {
  return <div className="public-site"><Navbar /><main><Outlet /></main><Footer /></div>;
}

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    // A route already fades in; instant scroll positioning prevents two
    // competing animations and keeps the new page stable.
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    // Analytics must not pull the Supabase SDK into the critical render path.
    void import('@/lib/analytics').then(({ recordPageView }) => recordPageView(location.pathname));
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Suspense fallback={<div className="min-h-[calc(100vh-5rem)]" />}>
          <Routes location={location}>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/video" element={<VideoPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
            </Route>
            <Route path="/admin" element={<AdminAuthBoundary />}>
              <Route path="login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="products" element={<ProductsManagerPage />} />
                  <Route path="portfolios" element={<PortfoliosPage />} />
                  <Route path="news" element={<NewsManagerPage />} />
                  <Route path="leads" element={<LeadsPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
}

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[calc(100vh-5rem)]"
    >
      {children}
    </motion.div>
  );
}

function App() {
  const isMobile = window.matchMedia('(max-width: 640px)').matches;
  const theme: 'light' | 'dark' = 'light';

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.style.colorScheme = theme;
  }, []);

  return (
    <MotionConfig reducedMotion={isMobile ? 'always' : 'user'}>
      <div className={`app-shell theme-${theme} overflow-x-hidden`}>
        <Router>
          <AnimatedRoutes />
        </Router>
      </div>
    </MotionConfig>
  );
}

export default App;
