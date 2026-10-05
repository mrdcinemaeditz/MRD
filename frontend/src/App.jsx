import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { metadataService } from './services/metadataService';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { AuthModal } from './components/common/AuthModal';

// Public Pages
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { VideoDetail } from './pages/VideoDetail';
import { Services } from './pages/Services';
import { About } from './pages/About';
import { MediaKit } from './pages/MediaKit';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { VideosManager } from './pages/admin/VideosManager';
import { CategoriesManager } from './pages/admin/CategoriesManager';
import { CommentsModeration } from './pages/admin/CommentsModeration';
import { EnquiriesManager } from './pages/admin/EnquiriesManager';
import { BrandsTestimonials } from './pages/admin/BrandsTestimonials';
import { SiteSettings } from './pages/admin/SiteSettings';

// Public Layout Wrapper
const PublicLayout = ({ settings, onOpenAuth }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0C] text-[#F7F7F8] selection:bg-[#D4A346] selection:text-black">
      <Navbar onOpenAuth={onOpenAuth} />
      <main className="flex-1">
        <Outlet />
      </main>
      <FloatingWhatsApp settings={settings} />
      <Footer settings={settings} />
    </div>
  );
};

export default function App() {
  const [settings, setSettings] = useState({});
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const loadGlobalSettings = async () => {
      try {
        const res = await metadataService.getSiteSettings();
        setSettings(res.settings || {});
      } catch (err) {
        console.error('Failed to load global settings', err);
      }
    };
    loadGlobalSettings();
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Website Routes */}
                <Route element={<PublicLayout settings={settings} onOpenAuth={() => setAuthModalOpen(true)} />}>
                  <Route path="/" element={<Home onOpenAuth={() => setAuthModalOpen(true)} />} />
                  <Route path="/portfolio" element={<Portfolio onOpenAuth={() => setAuthModalOpen(true)} />} />
                  <Route path="/portfolio/:id" element={<VideoDetail onOpenAuth={() => setAuthModalOpen(true)} />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/media-kit" element={<MediaKit />} />
                  <Route path="/contact" element={<Contact settings={settings} />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                </Route>

                {/* Admin Management Console */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="videos" element={<VideosManager />} />
                  <Route path="categories" element={<CategoriesManager />} />
                  <Route path="comments" element={<CommentsModeration />} />
                  <Route path="enquiries" element={<EnquiriesManager />} />
                  <Route path="brands-testimonials" element={<BrandsTestimonials />} />
                  <Route path="settings" element={<SiteSettings />} />
                </Route>
              </Routes>

              {/* Global Auth Modal */}
              <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
              />
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
