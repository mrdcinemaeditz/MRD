import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Heart, ArrowUp, MapPin } from 'lucide-react';

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

  const instagramUrl = settings?.instagram_url || 'https://instagram.com/mrd_cinemaeditz';
  const youtubeUrl = settings?.youtube_url || 'https://youtube.com/@mrdcinemaeditz';
  const twitterUrl = settings?.twitter_url || 'https://twitter.com/mrdcinemaeditz';
  const contactEmail = settings?.contact_email || 'mrdcinemaeditz@gmail.com';
  const whatsappNumber = settings?.whatsapp_number || '7470678511';
  const location = settings?.location || 'Rewa, Madhya Pradesh';

  return (
    <footer className="relative bg-[#040406] border-t border-red-950/40 pt-16 pb-12 overflow-hidden">
      {/* Ambient background glow in Crimson Red */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-red-600/15 via-red-950/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-900">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#FF1E27] via-[#E50914] to-[#800000] shadow-lg shadow-red-600/30 neon-red-halo shrink-0">
                <img src="/logo.png" alt="MRD CINEMA EDITZ" className="w-full h-full object-cover rounded-full bg-black" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="brand-mrd-text text-xl leading-none">MRD</span>
                <div className="flex items-center gap-1 brand-editz-sub text-[9.5px] uppercase mt-1 leading-none">
                  <span className="text-white font-extrabold">CINEMA</span>
                  <span className="text-[#FF1E27] text-red-glow font-black">EDITZ</span>
                </div>
              </div>
            </Link>

            <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
              We Don't Just Shoot — We Create Memories. Crafting cinematic vertical reels, royal weddings, car & bike delivery reveals, and commercial promotional shoots. Available all over India.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0D0D11] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:border-red-500/50 transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0D0D11] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:border-red-500/50 transition-all hover:scale-110"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0D0D11] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:border-red-500/50 transition-all hover:scale-110"
                aria-label="Twitter / X"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0D0D11] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all hover:scale-110"
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
              <li><Link to="/portfolio" className="hover:text-red-400 transition-colors">Portfolio Reels</Link></li>
              <li><Link to="/services" className="hover:text-red-400 transition-colors">Services & Pricing</Link></li>
              <li><Link to="/about" className="hover:text-red-400 transition-colors">About MRD</Link></li>
              <li><Link to="/contact" className="hover:text-red-400 transition-colors">Book Shoot / Quote</Link></li>
            </ul>
          </div>

          {/* Legal & Contacts */}
          <div className="space-y-3">
            <h4 className="font-heading uppercase tracking-wider text-xs font-bold text-zinc-200">Connect & Location</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" />
                <a href={`tel:${whatsappNumber}`} className="hover:text-white transition-colors">{whatsappNumber}</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <a href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">WhatsApp: {whatsappNumber}</a>
              </li>
              <li className="flex items-center gap-2 text-zinc-400 text-xs">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>{location}</span>
              </li>
              <li className="text-xs text-red-400 font-semibold flex items-center gap-1.5 pt-1">
                <span>🇮🇳</span>
                <span>Available All Over India</span>
              </li>
              <li className="pt-2"><Link to="/privacy-policy" className="hover:text-zinc-200 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-zinc-200 transition-colors">Terms of Service</Link></li>
              <li className="pt-1"><Link to="/admin" className="text-zinc-600 hover:text-red-400 text-xs font-mono-code transition-colors inline-flex items-center gap-1"><span>Admin Portal</span> &rarr;</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Neon Red soundwave line */}
        <div className="soundwave-line my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} MRD CINEMA EDITZ. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
