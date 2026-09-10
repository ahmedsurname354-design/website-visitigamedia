import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Outlet, Routes, Route, useLocation } from 'react-router-dom';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppErrorBoundary from '@/components/AppErrorBoundary';
import PageMeta from '@/components/PageMeta';
import HomePage from '@/pages/HomePage';
import { publicPageLoaders } from '@/lib/publicRoutes';
const AboutPage = lazy(publicPageLoaders.about);
const ServicesPage = lazy(publicPageLoaders.services);
const PortfolioPage = lazy(publicPageLoaders.portfolio);
const VideoPage = lazy(publicPageLoaders.video);
const ContactPage = lazy(publicPageLoaders.contact);
const FAQPage = lazy(publicPageLoaders.faq);
const PrivacyPage = lazy(publicPageLoaders.privacy);
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
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
  const location = useLocation();
  return <div className="public-site">
    <a href="#main-content" className="sr-only z-50 rounded-lg bg-white px-4 py-3 font-semibold text-[#211c18] shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Lewati ke konten utama</a>
    <PageMeta />
    <Navbar />
    <main id="main-content">
      <Suspense key={location.pathname} fallback={<RouteLoadingFallback />}>
        <PageTransition animate={location.pathname !== '/'}><Outlet /></PageTransition>
      </Suspense>
    </main>
    <Footer />
  </div>;
}

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    // A route already fades in; instant scroll positioning prevents two
    // competing animations and keeps the new page stable.
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    // Analytics must not pull the Supabase SDK into the critical render path.
    void import('@/lib/analytics').then(({ recordPageView }) => recordPageView(location.pathname));
  }, [location.pathname]);

  return (
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
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
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
            <Route element={<PublicLayout />}>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
    </Suspense>
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

function PageTransition({ children, animate }: { children: ReactNode; animate: boolean }) {
  return <div className={`min-h-[calc(100vh-5rem)]${animate ? ' page-content-enter' : ''}`}>{children}</div>;
}

function App() {
  const theme: 'light' | 'dark' = 'light';

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.style.colorScheme = theme;
  }, []);


  return (
    <LazyMotion features={domAnimation}>
    <MotionConfig reducedMotion="user" transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
      <div className={`app-shell theme-${theme} overflow-x-clip`}>
        <Router>
          <AppErrorBoundary><AnimatedRoutes /></AppErrorBoundary>
        </Router>
      </div>
    </MotionConfig>
    </LazyMotion>
  );
}

export default App;
