import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Film, Clapperboard, Layers, Zap, Video as VideoIcon, Sparkles, 
  CheckCircle2, ArrowRight, Clock, MessageSquare, Phone, Check, MessageCircle
} from 'lucide-react';
import { metadataService } from '../services/metadataService';

export const Services = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await metadataService.getSiteSettings();
        setSettings(res.settings || {});
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const whatsappNumber = (settings?.whatsapp_number || '7470678511').replace(/[^0-9]/g, '');
  const cleanPhone = whatsappNumber.length === 10 ? `91${whatsappNumber}` : whatsappNumber;

  const servicesList = [
    {
      id: 'wedding-films',
      title: 'Wedding Films & Teasers',
      tagline: 'Timeless, emotional storytelling for your once-in-a-lifetime moments',
      icon: Film,
      description: 'Grand royal wedding entries, varmala cinematic highlights, emotional family moments, and cinematic teaser edits formatted for Instagram and 4K TV.',
      deliverables: [
        'Cinematic wedding teaser (9:16 & 16:9)',
        'Full ceremony highlights with custom soundtrack',
        'Gimbal-stabilized smooth footage',
        'High resolution stills included'
      ],
      idealFor: 'Weddings & Royal Celebrations'
    },
    {
      id: 'pre-wedding',
      title: 'Pre Wedding Shoots',
      tagline: 'Artistic love stories set in breathtaking locations',
      icon: Clapperboard,
      description: 'Creative couple directing, picturesque outdoor locations, golden hour pacing, and cinematic romantic storytelling.',
      deliverables: [
        'Romantic cinematic teaser reel',
        'Multi-location shoot direction',
        'Hollywood color science & grading',
        'Complimentary high-res couple photos'
      ],
      idealFor: 'Couples & Destination Shoots'
    },
    {
      id: 'reels-videos',
      title: 'Cinematic Reels & Shorts',
      tagline: 'High-converting vertical video edits starting from ₹1499',
      icon: Zap,
      description: 'Dynamic pacing, custom sound design, sound effects synchronization, kinetic titles, and retention-maximizing visual hooks delivered in few hours.',
      deliverables: [
        '9:16 Vertical UHD Master (4K 60FPS)',
        'Smooth gimbal tracking shots',
        'Beat-synced audio & sound effects',
        'Reels delivered in few hours'
      ],
      idealFor: 'Cars, Bikes, Cafes, Events & Creators'
    },
    {
      id: 'commercial-ads',
      title: 'Commercial Ads & Brand Shoots',
      tagline: 'High-stakes advertising designed to drive customers and prestige',
      icon: Layers,
      description: 'Full production pipeline for showrooms, fashion boutiques, cafes, saloons, and product launches with master sound design.',
      deliverables: [
        'Multi-aspect delivery (9:16 & 16:9)',
        'Product & interior showcase lighting',
        'Brand color palette matching',
        'Fast commercial turnaround'
      ],
      idealFor: 'Restaurants, Saloons, Clothing & Boutiques'
    },
    {
      id: 'youtube-videos',
      title: 'YouTube Videos & Documentaries',
      tagline: 'Widescreen 4K storytelling and long-form narrative pacing',
      icon: VideoIcon,
      description: 'Extended storytelling, multi-camera assembly, audio leveling, custom motion graphics, and engaging viewer pacing.',
      deliverables: [
        '16:9 Widescreen Master in 4K',
        'Clean dialog leveling & background score',
        'Custom thumbnails & teaser cutdowns',
        'Color grading & visual restoration'
      ],
      idealFor: 'YouTubers, Artists & Documentaries'
    }
  ];

  const packages = settings?.reel_packages && Array.isArray(settings.reel_packages) && settings.reel_packages.length > 0
    ? settings.reel_packages
    : [
        { id: 1, reels_count: 1, price: 1499, title: 'Professional Reel', features: ['1 Professional Reel', 'On-Spot Shoot', 'Gimbal Smooth Videos', 'Delivered in Few Hours'] },
        { id: 2, reels_count: 2, price: 2999, title: 'Advanced Edit', features: ['2 Advanced Reels', 'On-Spot Shoot', 'Gimbal Smooth Videos', 'Delivered in Few Hours', 'Free High-Quality Photos'] },
        { id: 3, reels_count: 3, price: 4299, title: 'Cinematic Edit', features: ['3 Cinematic Reels', 'Cinematic Color Grading', 'Gimbal Smooth Videos', 'Delivered in Few Hours', 'Free High-Quality Photos'], highlight: true },
        { id: 4, reels_count: 4, price: 5499, title: 'Premium Edit', features: ['4 Premium Reels', 'Extended Shoot Coverage', 'Gimbal Smooth Flow', 'Fast Delivery', 'Free High-Quality Photos'] },
        { id: 5, reels_count: 5, price: 6999, title: 'Pro Cinematic Edit', features: ['5 Pro Cinematic Reels', 'Full Shoot & Directorial Coverage', 'Gimbal Ultra-Smooth Videos', 'Fast Priority Delivery', 'Free High-Quality Photos', '100% Quality Guarantee'] }
      ];

  const topicsList = [
    'Weddings', 'Car & Bike Delivery', 'Brand Shoots',
    'Events', 'Birthdays', 'Interior Shoots',
    'Restaurants', 'Saloons', 'Clothing'
  ];

  return (
    <>
      <Helmet>
        <title>Services & Reels Packages | MRD CINEMA EDITZ</title>
        <meta name="description" content="Explore cinematic video services: Weddings, Pre-Weddings, Reels starting at ₹1499, Commercial Ads, and YouTube video editing by MRD Cinema Editz." />
      </Helmet>

      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div 
          className="text-center max-w-3xl mx-auto mb-16"
          data-aos="fade-down"
          data-aos-duration="850"
          data-aos-once="true"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/30 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MRD Cinema Editz • Rewa, MP</span>
          </div>
          <h1 className="font-cinematic font-black text-3xl sm:text-5xl text-white tracking-tight mb-4">
            OUR SERVICES & PACKAGES
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Starting from ₹1499. High quality cinematic video production, gimbal stabilization, and fast delivery in few hours.
          </p>
        </div>

        {/* 5 Core Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {servicesList.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                data-aos={idx % 2 === 0 ? "fade-right" : "fade-left"}
                data-aos-duration="850"
                data-aos-once="true"
                className="p-8 rounded-3xl bg-[#0B0B0F] border border-zinc-800 hover:border-red-500/50 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-red-950/30 border border-red-500/40 flex items-center justify-center text-red-400">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-mono-code text-zinc-400 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                      {service.idealFor}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-white mb-1">{service.title}</h3>
                  <p className="text-xs text-red-400 font-medium uppercase tracking-wider mb-4">{service.tagline}</p>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">{service.description}</p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-zinc-800 mb-6">
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={`https://wa.me/${cleanPhone}?text=Hi%20MRD%20Cinema%20Editz!%20I'm%20interested%20in%20${encodeURIComponent(service.title)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-xl bg-zinc-900 hover:bg-red-gradient hover:text-white border border-red-500/30 text-zinc-200 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>

        {/* REELS PRICING TABLE */}
        <div 
          className="mb-20"
          data-aos="fade-up"
          data-aos-duration="850"
          data-aos-once="true"
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-red-500 block mb-2 font-heading">
              Shoot • Edit • Deliver
            </span>
            <h2 className="font-cinematic font-bold text-2xl sm:text-3xl text-white">
              REELS PACKAGES (₹1,499 - ₹6,999)
            </h2>
            <p className="text-zinc-400 text-xs mt-1">
              Reels delivered in few hours with complimentary high-quality still photos.
            </p>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
            data-aos="fade-right"
            data-aos-duration="850"
            data-aos-once="true"
          >
            {packages.map((pkg) => {
              const isHighlight = pkg.highlight || pkg.reels_count === 3;
              return (
                <div
                  key={pkg.id}
                  className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                    isHighlight
                      ? 'bg-gradient-to-b from-red-950/40 via-[#0B0B0E] to-[#0B0B0E] border-2 border-red-500 shadow-xl shadow-red-600/25'
                      : 'bg-[#0B0B0F] border border-zinc-800 hover:border-red-500/40'
                  }`}
                >
                  {isHighlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-red-gradient text-white font-heading font-bold text-[10px] uppercase tracking-wider shadow-md border border-red-400/30">
                      Best Value
                    </div>
                  )}

                  <div>
                    <div className="text-center pb-4 border-b border-zinc-800">
                      <span className="font-cinematic font-black text-3xl text-white block">
                        {pkg.reels_count}
                      </span>
                      <span className="font-heading text-xs uppercase tracking-widest text-red-500 font-semibold">
                        {pkg.reels_count === 1 ? 'REEL' : 'REELS'}
                      </span>
                      <p className="text-[11px] text-zinc-400 mt-1">{pkg.title}</p>
                    </div>

                    <div className="text-center py-4">
                      <span className="font-mono-code font-bold text-2xl text-white block">
                        ₹{Number(pkg.price).toLocaleString('en-IN')}/-
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                      {(pkg.features || []).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                    <a
                      href={`https://wa.me/${cleanPhone}?text=Hi%20MRD%20Cinema%20Editz!%20I%20want%20to%20book%20the%20${encodeURIComponent(pkg.reels_count)}%20Reel%20Package%20(₹${pkg.price}).`}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-full py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        isHighlight
                          ? 'bg-red-gradient text-white shadow-lg shadow-red-600/35 border border-red-400/30'
                          : 'bg-zinc-800 hover:bg-red-gradient hover:text-white text-zinc-200'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>Book on WhatsApp</span>
                    </a>
                    <Link
                      to={`/contact?service=${encodeURIComponent(pkg.title + ' (' + pkg.reels_count + ' Reel - ₹' + pkg.price + ')')}`}
                      className="w-full py-1.5 text-center text-[11px] font-medium text-zinc-400 hover:text-red-400 block transition-colors"
                    >
                      Or Book via Website &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 9 Perfect For Categories Grid */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0B0B0F] border border-zinc-800 mb-16 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-red-500 block mb-2 font-heading">
            Specialized Shoots
          </span>
          <h2 className="font-cinematic font-bold text-2xl text-white mb-6">PERFECT FOR EVERY OCCASION</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {topicsList.map((topic) => (
              <Link
                key={topic}
                to={`/portfolio`}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500 text-xs font-medium text-zinc-300 hover:text-red-400 transition-all"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>

        {/* Production Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#0B0B0F] border border-zinc-800 text-left">
            <span className="font-mono-code font-bold text-red-400 text-lg block mb-1">On-Spot Shoot</span>
            <p className="text-xs text-zinc-400">Professional gimbal coverage, dynamic motion, and framing on site.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0B0B0F] border border-zinc-800 text-left">
            <span className="font-mono-code font-bold text-red-400 text-lg block mb-1">Expert Editing</span>
            <p className="text-xs text-zinc-400">Cinematic color grading, beat synchronization, and audio design.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0B0B0F] border border-zinc-800 text-left">
            <span className="font-mono-code font-bold text-red-400 text-lg block mb-1">Fast Delivery</span>
            <p className="text-xs text-zinc-400">Reels delivered in few hours right to your mobile phone.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0B0B0F] border border-zinc-800 text-left">
            <span className="font-mono-code font-bold text-red-400 text-lg block mb-1">Free Photos</span>
            <p className="text-xs text-zinc-400">Complimentary high-quality portrait stills included with every shoot.</p>
          </div>
        </div>
      </div>
    </>
  );
};
