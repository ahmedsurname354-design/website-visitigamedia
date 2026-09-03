import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Navigate, Outlet, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import { preloadPublicRoutesWhenIdle, publicPageLoaders } from '@/lib/publicRoutes';
const AboutPage = lazy(publicPageLoaders.about);
const ServicesPage = lazy(publicPageLoaders.services);
const PortfolioPage = lazy(publicPageLoaders.portfolio);
const VideoPage = lazy(publicPageLoaders.video);
const ContactPage = lazy(publicPageLoaders.contact);
const ProductPage = lazy(publicPageLoaders.product);
const NewsPage = lazy(publicPageLoaders.news);
const NewsDetailPage = lazy(publicPageLoaders.newsDetail);
const LoginPage = lazy(() => import('@/pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const PortfoliosPage = lazy(() => import('@/pages/admin/PortfoliosPage'));
const NewsManagerPage = lazy(() => import('@/pages/admin/NewsManagerPage'));
const ProductsManagerPage = lazy(() => import('@/pages/admin/ProductsManagerPage'));
const ServicesManagerPage = lazy(() => import('@/pages/admin/ServicesManagerPage'));
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
    <AnimatePresence mode="sync" initial={false}>
      <PageTransition key={location.pathname}>
        <Suspense fallback={<RouteLoadingFallback />}>
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
                  <Route path="services" element={<ServicesManagerPage />} />
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

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6" role="status" aria-live="polite">
      <div className="flex items-center gap-3 rounded-full border border-current/10 px-5 py-3 text-sm opacity-70 shadow-sm">
        <span className="size-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" aria-hidden="true" />
        <span>Memuat halaman…</span>
      </div>
    </div>
  );
}

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
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

  useEffect(() => preloadPublicRoutesWhenIdle(), []);

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
