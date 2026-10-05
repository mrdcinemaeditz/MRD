import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Play, Sparkles, Film, ArrowRight, Eye, Heart, Star, 
  Award, Zap, CheckCircle2, ChevronRight, Video as VideoIcon, 
  Layers, Clapperboard, Send
} from 'lucide-react';
import { videoService } from '../services/videoService';
import { metadataService } from '../services/metadataService';
import { ReelCard } from '../components/common/ReelCard';

export const Home = ({ onOpenAuth }) => {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [brands, setBrands] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [videosRes, brandsRes, testimonialsRes, settingsRes] = await Promise.all([
          videoService.getFeaturedVideos(6),
          metadataService.getBrands(),
          metadataService.getTestimonials(),
          metadataService.getSiteSettings()
        ]);

        setFeaturedVideos(videosRes.videos || []);
        setBrands(brandsRes.brands || []);
        setTestimonials(testimonialsRes.testimonials || []);
        setSettings(settingsRes.settings || {});
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const heroTagline = settings?.hero_tagline || "CRAFTING HIGH-IMPACT CINEMATIC VISUALS & VIRAL REELS";
  const heroSubheadline = settings?.hero_subheadline || "Elevating brands, artists, and creators through master-class video editing, Hollywood color science, and dynamic sound design.";

  return (
    <>
      <Helmet>
        <title>MRD CINEMA EDITZ | Filmmaker & Video Editor Portfolio</title>
        <meta name="description" content="Official portfolio of MRD CINEMA EDITZ. High-impact commercial reels, YouTube video editing, cinematic color grading, and creator storytelling." />
        <meta property="og:title" content="MRD CINEMA EDITZ | Reels & Video Creator" />
        <meta property="og:description" content="Discover premium cinematic video edits, viral vertical reels, and commercial campaigns." />
        <meta property="og:image" content="/logo.png" />
      </Helmet>

      <div className="relative min-h-screen pt-20 overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
          {/* Ambient Glow Orbits */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#D4A346]/15 via-[#FF9E2C]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Creator Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121216]/90 border border-[#D4A346]/40 text-[#F5C869] text-xs font-semibold uppercase tracking-widest mb-6 shadow-xl animate-fade-in backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#F5C869]" />
            <span>Master Video Editor & Colorist</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="max-w-4xl font-cinematic font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] mb-6">
            <span className="block">{heroTagline.split('&')[0]}</span>
            <span className="text-gold-gradient text-gold-glow block mt-1">
              {heroTagline.includes('&') ? `& ${heroTagline.split('&')[1]}` : 'CINEMA EDITZ'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-zinc-300 text-sm sm:text-base lg:text-lg font-light leading-relaxed mb-10 text-balance">
            {heroSubheadline}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/portfolio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gold-gradient bg-gold-gradient-hover text-black font-heading font-bold text-sm uppercase tracking-wider shadow-xl shadow-[#D4A346]/25 transition-all transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch My Work</span>
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#121216] hover:bg-[#1A1A22] text-white border border-[#D4A346]/40 hover:border-[#F5C869] text-sm font-semibold uppercase tracking-wider transition-all"
            >
              <span>Work With Me</span>
              <ArrowRight className="w-4 h-4 text-[#D4A346]" />
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl w-full">
            <div className="p-5 rounded-2xl bg-[#121216]/80 border border-[#24221C] backdrop-blur-md">
              <span className="font-mono-code font-bold text-2xl sm:text-3xl text-gold-gradient block">50M+</span>
              <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-1 block">Total Reel Views</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#121216]/80 border border-[#24221C] backdrop-blur-md">
              <span className="font-mono-code font-bold text-2xl sm:text-3xl text-white block">350K+</span>
              <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-1 block">Audience Reach</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#121216]/80 border border-[#24221C] backdrop-blur-md">
              <span className="font-mono-code font-bold text-2xl sm:text-3xl text-gold-gradient block">120+</span>
              <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-1 block">Brand Campaigns</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#121216]/80 border border-[#24221C] backdrop-blur-md">
              <span className="font-mono-code font-bold text-2xl sm:text-3xl text-white block">9.2%</span>
              <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-1 block">Avg Engagement</span>
            </div>
          </div>
        </section>

        {/* FEATURED REELS GRID SECTION */}
        <section className="py-16 bg-[#08080A] border-t border-b border-[#24221C] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#D4A346] block mb-2 font-heading">
                  Selected Works
                </span>
                <h2 className="font-cinematic font-bold text-2xl sm:text-4xl text-white">
                  FEATURED REELS & EDITS
                </h2>
              </div>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#F5C869] hover:text-white transition-colors mt-4 md:mt-0"
              >
                <span>View Full Portfolio</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[9/16] rounded-2xl bg-zinc-900 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredVideos.map((video) => (
                  <Link key={video.id} to={`/portfolio/${video.slug || video.id}`}>
                    <ReelCard video={video} onOpenAuth={onOpenAuth} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* BRANDS WORKED WITH */}
        {brands.length > 0 && (
          <section className="py-16 bg-[#0A0A0C]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 block mb-8 font-heading">
                Trusted By Global Brands & Creators
              </span>
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center gap-2 group">
                    {brand.logo_url ? (
                      <img src={brand.logo_url} alt={brand.name} className="h-9 w-auto object-contain rounded-lg" />
                    ) : (
                      <span className="font-heading font-bold text-lg text-zinc-400 group-hover:text-[#F5C869] transition-colors">
                        {brand.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SERVICES TEASER SECTION */}
        <section className="py-20 bg-[#070709] border-t border-[#24221C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#D4A346] block mb-2 font-heading">
                What I Deliver
              </span>
              <h2 className="font-cinematic font-bold text-2xl sm:text-4xl text-white">
                SPECIALIZED CREATIVE SERVICES
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-[#121216] border border-[#24221C] hover:border-[#D4A346]/50 transition-all hover:-translate-y-1 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-gold-gradient/10 border border-[#D4A346]/40 flex items-center justify-center text-[#F5C869] mb-6">
                  <Film className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-3">Cinematic Reels & Shorts</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  High-converting vertical video edits specifically engineered for Instagram, TikTok, and YouTube Shorts algorithmic reach.
                </p>
                <Link to="/services" className="text-xs font-semibold text-[#F5C869] flex items-center gap-1.5 hover:text-white">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-8 rounded-2xl bg-[#121216] border border-[#24221C] hover:border-[#D4A346]/50 transition-all hover:-translate-y-1 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-gold-gradient/10 border border-[#D4A346]/40 flex items-center justify-center text-[#F5C869] mb-6">
                  <Clapperboard className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-3">Commercials & Brand Ads</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  High-stakes product launch commercials, automotive showcases, and luxury lifestyle campaigns with master sound design.
                </p>
                <Link to="/services" className="text-xs font-semibold text-[#F5C869] flex items-center gap-1.5 hover:text-white">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-8 rounded-2xl bg-[#121216] border border-[#24221C] hover:border-[#D4A346]/50 transition-all hover:-translate-y-1 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-gold-gradient/10 border border-[#D4A346]/40 flex items-center justify-center text-[#F5C869] mb-6">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-3">Color Science & 3D VFX</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Advanced DaVinci Resolve color grading, custom 35mm film grain emulations, skin retouching, and kinetic visual effects.
                </p>
                <Link to="/services" className="text-xs font-semibold text-[#F5C869] flex items-center gap-1.5 hover:text-white">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        {testimonials.length > 0 && (
          <section className="py-20 bg-[#0A0A0C]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#D4A346] block mb-2 font-heading">
                  Client Endorsements
                </span>
                <h2 className="font-cinematic font-bold text-2xl sm:text-4xl text-white">
                  WHAT DIRECTORS & BRANDS SAY
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t) => (
                  <div key={t.id} className="p-6 sm:p-8 rounded-2xl bg-[#121216] border border-[#24221C] flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-1 text-[#F5C869]">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed italic">
                        "{t.content}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-6 mt-6 border-t border-zinc-800/80">
                      {t.client_avatar_url && (
                        <img src={t.client_avatar_url} alt={t.client_name} className="w-10 h-10 rounded-full object-cover border border-[#D4A346]/40" />
                      )}
                      <div>
                        <h4 className="text-sm font-semibold text-white">{t.client_name}</h4>
                        <p className="text-xs text-zinc-400">{t.client_title} • {t.brand_name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CALL TO ACTION BANNER */}
        <section className="py-20 bg-gradient-to-b from-[#0A0A0C] via-[#121216] to-[#0A0A0C] border-t border-[#24221C] text-center px-4">
          <div className="max-w-4xl mx-auto p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-[#1A1A22] via-[#121216] to-[#1A1A22] border border-[#D4A346]/40 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#D4A346]/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="font-cinematic font-black text-2xl sm:text-4xl text-white mb-4">
              READY TO ELEVATE YOUR VISUAL STORYTELLING?
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Book a custom reel package or commercial campaign shoot today. Fast turnaround and guaranteed viral pacing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-gradient text-black font-heading font-bold text-sm uppercase tracking-wider shadow-xl shadow-[#D4A346]/30 hover:scale-105 transition-transform"
              >
                Get a Quote Now
              </Link>
              <Link
                to="/portfolio"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-sm hover:border-[#D4A346] transition-colors"
              >
                Explore Reels Archive
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
