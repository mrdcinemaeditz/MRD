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
    { name: 'Services & Packages', path: '/services' },
    { name: 'About', path: '/about' },
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
          ? 'bg-[#030305]/95 backdrop-blur-xl border-b border-red-900/30 py-3 shadow-2xl shadow-black/80'
          : 'bg-gradient-to-b from-[#030305]/95 via-[#030305]/80 to-transparent py-3 sm:py-4'
      }`}
    >
      {/* Top Quick Contact & Availability Ticker (User-Friendly Desktop Bar) */}
      {!isScrolled && (
        <div className="hidden sm:block border-b border-red-950/40 pb-2.5 mb-3 text-[11px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-red-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Rewa, MP & Available All India
              </span>
              <span className="text-zinc-700">•</span>
              <span className="text-zinc-300 font-medium">Shoot on Gimbal • Fast Delivery in Few Hours</span>
            </div>
            <div className="flex items-center gap-4 font-medium">
              <span className="text-zinc-300">Packages from <strong className="text-red-400 font-mono-code font-bold">₹1,499</strong></span>
              <span className="text-zinc-700">•</span>
              <a href="tel:7470678511" className="text-white hover:text-red-400 font-bold tracking-wide transition-colors">
                📞 7470678511
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Title with Red Halo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#FF1E27] via-[#E50914] to-[#800000] shadow-lg shadow-red-600/30 group-hover:scale-105 transition-all duration-300 neon-red-halo shrink-0">
            <img
              src="/logo.png"
              alt="MRD CINEMA EDITZ"
              className="w-full h-full object-cover rounded-full bg-black"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="brand-mrd-text text-xl sm:text-2xl leading-none">
              MRD
            </span>
            <div className="flex items-center gap-1 brand-editz-sub text-[9.5px] uppercase mt-1 leading-none">
              <span className="text-white drop-shadow-sm font-extrabold">CINEMA</span>
              <span className="text-[#FF1E27] text-red-glow font-black">EDITZ</span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                isActive(link.path)
                  ? 'text-white bg-gradient-to-r from-red-950/60 via-red-900/30 to-red-950/60 border border-red-500/50 shadow-sm shadow-red-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
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
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex items-center justify-center p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-red-400 hover:border-red-500/40 transition-all shadow-sm active:scale-95"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Hire Me CTA (Desktop) - Neon Crimson Red Gradient */}
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white rounded-lg bg-red-gradient bg-red-gradient-hover transition-all duration-300 transform active:scale-95 shadow-lg shadow-red-600/30 font-heading border border-red-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Book Shoot</span>
          </Link>

          {/* User Profile / Login */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-red-500/40 bg-zinc-900/80 hover:border-red-400 transition-all"
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0B0B0E] border border-red-900/40 shadow-2xl py-2 z-50 animate-fade-in backdrop-blur-xl">
                  <div className="px-4 py-2 border-b border-zinc-800">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-zinc-900/80 font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-red-400" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-900/80 transition-colors text-left"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-300 border border-zinc-800 bg-zinc-900/80 hover:text-white hover:border-red-500/40 transition-all"
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
        <div className="md:hidden bg-[#050507]/98 border-b border-red-900/40 px-6 pt-4 pb-6 backdrop-blur-2xl animate-slide-down">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2.5 text-base font-medium rounded-xl transition-all ${
                  isActive(link.path)
                    ? 'text-white bg-red-950/50 border border-red-500/40 font-semibold shadow-sm shadow-red-500/20'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Theme Toggle Row */}
            <div className="flex items-center justify-between px-4 py-3 mt-1 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Appearance
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-semibold uppercase tracking-wider text-zinc-200 hover:text-white transition-all shadow-sm active:scale-95"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            <Link
              to="/contact"
              className="mt-3 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider text-white rounded-xl bg-red-gradient font-heading shadow-lg shadow-red-600/30 border border-red-400/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book Shoot / Get a Quote</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
