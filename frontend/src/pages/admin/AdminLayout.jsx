import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Video, FolderTree, MessageSquare, 
  Mail, Award, Settings, ArrowLeft, ShieldCheck, LogOut 
} from 'lucide-react';
import { AdminLogin } from './AdminLogin';
import { NotificationBell } from '../../components/admin/NotificationBell';

export const AdminLayout = () => {
  const { user, isAdmin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#D4A346] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin />;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Videos & Reels', path: '/admin/videos', icon: Video },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Comments & Moderation', path: '/admin/comments', icon: MessageSquare },
    { name: 'Client Enquiries', path: '/admin/enquiries', icon: Mail },
    { name: 'Brands & Reviews', path: '/admin/brands-testimonials', icon: Award },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0D0D11] border-r border-[#24221C] flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-[#24221C] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#D4A346] to-[#996F28]">
              <img src="/logo.png" alt="MRD" className="w-full h-full object-cover rounded-full bg-black" />
            </div>
            <div>
              <span className="font-cinematic font-bold text-sm text-white block">MRD STUDIO</span>
              <span className="text-[9px] text-[#F5C869] font-mono-code uppercase">Admin Console</span>
            </div>
          </Link>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1.5 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-gold-gradient text-black font-bold shadow-lg shadow-[#D4A346]/10'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-black' : 'text-zinc-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#24221C] space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Public Website</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar with Notification Bell */}
        <header className="h-16 px-6 md:px-10 border-b border-[#24221C] bg-[#0D0D11]/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Welcome, <strong className="text-white">{user?.name || 'Director'}</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />

            <div className="w-8 h-8 rounded-full bg-gold-gradient p-[1px] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-[#F5C869]">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
