import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Menu, X, Film, Play, User as UserIcon, LogOut, 
  ShieldCheck, Moon, Sun, Sparkles, MessageCircle 
} from 'lucide-react';

export const Navbar = ({ onOpenAuth }) => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Media Kit', path: '/media-kit' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0A0C]/90 backdrop-blur-xl border-b border-[#D4A346]/20 py-3 shadow-2xl shadow-black/60'
          : 'bg-gradient-to-b from-[#0A0A0C]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#D4A346] via-[#F5C869] to-[#996F28] shadow-lg shadow-[#D4A346]/20 group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="MRD CINEMA EDITZ"
              className="w-full h-full object-cover rounded-full bg-black"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-cinematic font-bold tracking-[0.2em] text-lg sm:text-xl text-white group-hover:text-[#F5C869] transition-colors leading-none">
              MRD
            </span>
            <span className="font-heading tracking-[0.3em] text-[9px] uppercase text-[#D4A346] font-medium mt-1">
              CINEMA EDITZ
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive(link.path)
                  ? 'text-[#F5C869] bg-[#1A1A22] border border-[#D4A346]/30 shadow-sm shadow-[#D4A346]/10'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/40'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Controls & User Auth */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-[#F5C869] hover:border-[#D4A346]/40 transition-all"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Hire Me CTA (Desktop) */}
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black rounded-lg bg-gold-gradient bg-gold-gradient-hover transition-all duration-300 transform active:scale-95 shadow-lg shadow-[#D4A346]/20 font-heading"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hire Me</span>
          </Link>

          {/* User Profile / Login */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full border border-[#D4A346]/40 bg-zinc-900/80 hover:border-[#F5C869] transition-all"
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#D4A346] text-black font-bold flex items-center justify-center text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#121216] border border-[#D4A346]/30 shadow-2xl py-2 z-50 animate-fade-in backdrop-blur-xl">
                  <div className="px-4 py-2 border-b border-zinc-800">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#F5C869] hover:bg-zinc-800/60 font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#F5C869]" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-zinc-800/60 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-300 border border-zinc-700/80 bg-zinc-900/80 hover:text-white hover:border-[#D4A346]/40 transition-all"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0C]/98 border-b border-[#D4A346]/30 px-6 pt-4 pb-6 backdrop-blur-2xl animate-slide-down">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2.5 text-base font-medium rounded-xl transition-all ${
                  isActive(link.path)
                    ? 'text-[#F5C869] bg-[#1A1A22] border border-[#D4A346]/30 font-semibold'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/40'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/contact"
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-black rounded-xl bg-gold-gradient font-heading shadow-lg shadow-[#D4A346]/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Hire Me / Get a Quote</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
