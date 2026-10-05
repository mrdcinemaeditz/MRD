import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp = ({ settings }) => {
  const number = (settings?.whatsapp_number || '+919876543210').replace(/[^0-9]/g, '');
  const message = encodeURIComponent(
    settings?.whatsapp_default_message || 'Hi MRD! I would like to discuss a video project.'
  );

  const whatsappUrl = `https://wa.me/${number}?text=${message}`;

  return (
    <aside
      aria-label="Contact options"
      className="fixed bottom-6 left-6 z-40 group flex items-center gap-3"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {/* Pulsing Aura */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
        <MessageCircle className="w-7 h-7 fill-current relative z-10" />
      </a>

      {/* Hover Tooltip */}
      <span className="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-[#121216]/95 border border-[#D4A346]/40 text-xs font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-md">
        Chat with MRD on WhatsApp
      </span>
    </aside>
  );
};
