import { lazy, Suspense, useState, useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Navigate, Outlet, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
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
const ProductsPage = lazy(() => import('@/pages/admin/ProductsPage'));

function PublicLayout() {
  return <><Navbar /><main><Outlet /></main><Footer /></>;
}

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    // A route already fades in; instant scroll positioning prevents two
    // competing animations and keeps the new page stable.
    window.scrollTo({ top: 0, behavior: 'auto' });
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
            <Route path="/admin/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="portfolios" element={<AdminPlaceholder title="Portofolio" />} />
                <Route path="news" element={<AdminPlaceholder title="Berita" />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
}

function AdminPlaceholder({ title }: { title: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><h2 className="text-2xl font-black">{title}</h2><p className="mt-2 text-sm text-slate-500">Struktur database dan navigasi sudah siap. Gunakan halaman Produk sebagai template CRUD untuk modul ini.</p></div>;
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
  const [isLoading, setIsLoading] = useState(true);
  const theme: 'light' | 'dark' = 'light';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.style.colorScheme = theme;
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <LoadingScreen isLoading={isLoading} />
      <div className={`app-shell theme-${theme} overflow-x-hidden`}>
        <Router>
          <Navbar />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
        </Router>
      </div>
    </MotionConfig>
  );
}

export default App;
