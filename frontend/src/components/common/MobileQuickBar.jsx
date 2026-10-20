import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Film, Sparkles } from 'lucide-react';

export const MobileQuickBar = ({ settings }) => {
  const location = useLocation();
  const whatsappNumber = (settings?.whatsapp_number || '7470678511').replace(/[^0-9]/g, '');
  const cleanPhone = whatsappNumber.length === 10 ? `91${whatsappNumber}` : whatsappNumber;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi%20MRD%20Cinema%20Editz!%20I%20would%20like%20to%20book%20a%20video%20shoot%20or%20reels%20package.`;

  return (
    <aside
      aria-label="Mobile quick actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#06060A]/95 backdrop-blur-2xl border-t border-red-900/40 shadow-[0_-10px_35px_rgba(0,0,0,0.9)] px-3 py-2 flex items-center justify-between gap-2 safe-bottom"
    >
      {/* 1. Quick Call Button */}
      <a
        href={`tel:${settings?.whatsapp_number || '7470678511'}`}
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-red-500/40 active:scale-95 transition-all text-center"
      >
        <Phone className="w-4 h-4 text-red-500 mb-0.5" />
        <span className="text-[10px] font-heading font-bold uppercase tracking-wider">Call</span>
      </a>

      {/* 2. Direct WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 active:scale-95 transition-all text-center"
      >
        <div className="relative">
          <MessageCircle className="w-4 h-4 fill-current mb-0.5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <span className="text-[10px] font-heading font-bold uppercase tracking-wider">WhatsApp</span>
      </a>

      {/* 3. Reels Portfolio Link */}
      <Link
        to="/portfolio"
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl border active:scale-95 transition-all text-center ${
          location.pathname.startsWith('/portfolio')
            ? 'bg-zinc-800 border-red-500/50 text-white'
            : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:text-white'
        }`}
      >
        <Film className="w-4 h-4 text-red-400 mb-0.5" />
        <span className="text-[10px] font-heading font-bold uppercase tracking-wider">Reels</span>
      </Link>

      {/* 4. Instant Shoot Booking CTA */}
      <Link
        to="/contact"
        className="flex-[1.4] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-gradient text-white font-heading font-extrabold text-[11px] uppercase tracking-wider shadow-lg shadow-red-600/40 border border-red-400/40 active:scale-95 transition-all"
      >
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">Book Shoot</span>
      </Link>
    </aside>
  );
};
