import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Heart, ArrowUp } from 'lucide-react';

// Custom Crisp Brand SVGs
const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
  </svg>
);

const TwitterIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
  </svg>
);

export const Footer = ({ settings }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const instagramUrl = settings?.instagram_url || 'https://instagram.com/mrdcinemaeditz';
  const youtubeUrl = settings?.youtube_url || 'https://youtube.com/@mrdcinemaeditz';
  const twitterUrl = settings?.twitter_url || 'https://twitter.com/mrdcinemaeditz';
  const contactEmail = settings?.contact_email || 'contact@mrdcinemaeditz.com';
  const whatsappNumber = settings?.whatsapp_number || '+919876543210';

  return (
    <footer className="relative bg-[#060608] border-t border-[#D4A346]/20 pt-16 pb-12 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#D4A346]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-800/80">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-block">
              <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#D4A346] to-[#996F28]">
                <img src="/logo.png" alt="MRD CINEMA EDITZ" className="w-full h-full object-cover rounded-full bg-black" />
              </div>
              <div>
                <span className="font-cinematic font-bold tracking-[0.2em] text-xl text-white">MRD</span>
                <span className="block font-heading tracking-[0.3em] text-[10px] uppercase text-[#D4A346]">CINEMA EDITZ</span>
              </div>
            </Link>

            <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
              Crafting master-class visual narratives, viral vertical reels, and high-stakes commercial ads for world-class brands, directors, and artists worldwide.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#121216] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#F5C869] hover:border-[#D4A346]/50 transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#121216] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#F5C869] hover:border-[#D4A346]/50 transition-all hover:scale-110"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#121216] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#F5C869] hover:border-[#D4A346]/50 transition-all hover:scale-110"
                aria-label="Twitter / X"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#121216] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all hover:scale-110"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading uppercase tracking-wider text-xs font-bold text-zinc-200">Navigation</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link to="/portfolio" className="hover:text-[#F5C869] transition-colors">Portfolio Reels</Link></li>
              <li><Link to="/services" className="hover:text-[#F5C869] transition-colors">Services & Pricing</Link></li>
              <li><Link to="/media-kit" className="hover:text-[#F5C869] transition-colors">Media Kit & Stats</Link></li>
              <li><Link to="/about" className="hover:text-[#F5C869] transition-colors">About My Journey</Link></li>
              <li><Link to="/contact" className="hover:text-[#F5C869] transition-colors">Hire Me / Quote</Link></li>
            </ul>
          </div>

          {/* Legal & Contacts */}
          <div className="space-y-3">
            <h4 className="font-heading uppercase tracking-wider text-xs font-bold text-zinc-200">Connect & Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4A346]" />
                <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors truncate">{contactEmail}</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4A346]" />
                <a href={`tel:${whatsappNumber}`} className="hover:text-white transition-colors">{whatsappNumber}</a>
              </li>
              <li className="pt-2"><Link to="/privacy-policy" className="hover:text-zinc-200 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-zinc-200 transition-colors">Terms of Service</Link></li>
              <li className="pt-1"><Link to="/admin" className="text-zinc-500 hover:text-[#F5C869] text-xs font-mono-code transition-colors inline-flex items-center gap-1"><span>Admin Portal</span> &rarr;</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} MRD CINEMA EDITZ. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-[#F5C869] transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
