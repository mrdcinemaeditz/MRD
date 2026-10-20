import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Play, Sparkles, Film, ArrowRight, CheckCircle2, ChevronRight, 
  Video as VideoIcon, Layers, Clapperboard, Phone, MessageCircle, 
  Clock, Camera, Check, ShieldCheck, MapPin, Award
} from 'lucide-react';
import { videoService } from '../services/videoService';
import { metadataService } from '../services/metadataService';
import { ReelCard } from '../components/common/ReelCard';
import { AutoplayVideoPlayer } from '../components/common/AutoplayVideoPlayer';
import AOS from 'aos';

const topicImages = {
  'Weddings': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
  'Car & Bike Delivery': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
  'Brand Shoots': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
  'Events': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
  'Birthdays': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80',
  'Interior Shoots': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
  'Restaurants': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
  'Saloons': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
  'Clothing': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
};

const defaultPackages = [
  {
    id: 1,
    reels_count: 1,
    price: 1499,
    title: 'Professional Reel',
    features: [
      '1 Professional Reel',
      'On-Spot Shoot & Coverage',
      'Shoot on Gimbal for Smooth Videos',
      'Reels Delivered in Few Hours'
    ],
    highlight: false
  },
  {
    id: 2,
    reels_count: 2,
    price: 2999,
    title: 'Advanced Edit',
    features: [
      '2 Advanced Cinematic Reels',
      'On-Spot Shoot & Creative Angles',
      'Shoot on Gimbal for Smooth Videos',
      'Reels Delivered in Few Hours',
      'Complimentary High-Quality Photos'
    ],
    highlight: false
  },
  {
    id: 3,
    reels_count: 3,
    price: 4299,
    title: 'Cinematic Edit',
    features: [
      '3 Cinematic Master Reels',
      'Dedicated On-Spot Creative Shoot',
      'Cinematic Color & Beat Sync FX',
      'Reels Delivered in Few Hours',
      'Complimentary High-Quality Photos'
    ],
    highlight: true // Most Popular
  },
  {
    id: 4,
    reels_count: 4,
    price: 5499,
    title: 'Premium Edit',
    features: [
      '4 Premium Multi-Angle Reels',
      'Extended Shoot & Angle Coverage',
      'Smooth Gimbal Cinematic Flow',
      'Fast Delivery in Few Hours',
      'Complimentary High-Quality Photos'
    ],
    highlight: false
  },
  {
    id: 5,
    reels_count: 5,
    price: 6999,
    title: 'Pro Cinematic Edit',
    features: [
      '5 Pro Cinematic Reels',
      'Full Shoot & Directorial Coverage',
      'Gimbal Ultra-Smooth Videos',
      'Fast Delivery in Few Hours',
      'Complimentary High-Quality Photos',
      '100% Quality Guarantee'
    ],
    highlight: false
  }
];

export const Home = ({ onOpenAuth }) => {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [videosRes, categoriesRes, settingsRes] = await Promise.all([
          videoService.getFeaturedVideos(6),
          metadataService.getCategories(),
          metadataService.getSiteSettings()
        ]);

        setFeaturedVideos(videosRes.videos || []);
        setCategories(categoriesRes.categories || []);
        setSettings(settingsRes.settings || {});
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
        setTimeout(() => {
          AOS.refresh();
        }, 150);
      }
    };

    loadHomeData();
  }, []);

  const spotlightVideo = featuredVideos.length > 0 ? featuredVideos[0] : null;

  const whatsappNumber = (settings?.whatsapp_number || '7470678511').replace(/[^0-9]/g, '');
  const cleanPhone = whatsappNumber.length === 10 ? `91${whatsappNumber}` : whatsappNumber;
  const packages = (settings?.reel_packages && Array.isArray(settings.reel_packages) && settings.reel_packages.length > 0)
    ? settings.reel_packages
    : defaultPackages;

  const servicesList = [
    { title: 'Wedding Films', desc: 'Emotional, royal, and timeless cinematic coverage of your big day.' },
    { title: 'Pre Wedding Shoots', desc: 'Breathtaking locations, intimate moments, and artistic couple reels.' },
    { title: 'Reels Videos', desc: 'High-energy vertical videos engineered for viral Instagram reach.' },
    { title: 'Commercial Ads', desc: 'Showcase your brand, showroom, cafe, or product with luxury visuals.' },
    { title: 'YouTube Videos', desc: '4K widescreen documentary storytelling, pacing, and color grading.' },
  ];

  return (
    <>
      <Helmet>
        <title>MRD CINEMA EDITZ | Cinematic Videos That Tell Your Story</title>
        <meta name="description" content="MRD CINEMA EDITZ - We Don't Just Shoot, We Create Memories. Wedding Films, Pre-Wedding, Reels, Commercial Ads, YouTube Videos. Starting from ₹1499. Based in Rewa, MP." />
        <meta property="og:title" content="MRD CINEMA EDITZ | Cinematic Video Creator" />
        <meta property="og:description" content="Starting from ₹1499. Shoot on Gimbal, Delivered in Few Hours, Complimentary High-Quality Photos." />
      </Helmet>

      <div className="relative min-h-screen pt-20 overflow-hidden bg-[#030305]">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
          {/* Ambient Crimson Red Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#FF1E27]/20 via-[#B91C1C]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Slogan Pill with Brand Typography */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#0E0E14]/90 border border-red-500/40 text-xs font-semibold uppercase tracking-widest mb-6 shadow-xl shadow-red-950/40 animate-fade-in backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
            <span className="brand-editz-sub text-[11px] tracking-[0.25em] text-white">MRD <span className="text-[#FF1E27]">CINEMA EDITZ</span></span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300 font-medium">REWA, MP</span>
          </div>

          {/* Main Hero Headline (Metallic Chrome & Crimson Glow) */}
          <h1 className="max-w-4xl font-cinematic font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] mb-4">
            <span className="block text-chrome-gradient drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)]">
              CINEMATIC VIDEOS
            </span>
            <span className="text-red-gradient text-red-glow block mt-1">
              THAT TELL YOUR STORY
            </span>
          </h1>

          {/* Category Top Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-4 max-w-2xl">
            {['WEDDING', 'PRE WEDDING', 'REELS', 'COMMERCIAL', 'YOUTUBE'].map((item) => (
              <span key={item} className="px-3.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] sm:text-xs font-heading font-semibold text-zinc-300 tracking-wider hover:border-red-500/50 hover:text-red-300 transition-colors">
                {item}
              </span>
            ))}
          </div>

          {/* Subtitle / Philosophy */}
          <p className="max-w-2xl text-zinc-300 text-sm sm:text-base lg:text-lg font-light leading-relaxed mb-6 text-balance">
            <span className="font-heading font-bold text-white italic">"We Don't Just Shoot — WE CREATE MEMORIES"</span>
            <br />
            Ultra-smooth gimbal camera work, master color grading, and fast delivery right to your phone.
          </p>

          {/* Price Badge with Neon Red Border */}
          <div className="mb-8 inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-red-950/80 via-black to-red-950/80 border border-red-500/60 text-white shadow-xl shadow-red-900/30">
            <span className="text-xs uppercase font-heading tracking-widest text-zinc-300 font-semibold">Starting From</span>
            <span className="font-mono-code font-black text-2xl text-red-400 text-red-glow">₹1499/-</span>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href={`https://wa.me/${cleanPhone}?text=Hi%20MRD%20Cinema%20Editz!%20I%20would%20like%20to%20book%20a%20shoot.`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-red-gradient bg-red-gradient-hover text-white font-heading font-bold text-sm uppercase tracking-wider shadow-xl shadow-red-600/35 transition-all transform active:scale-95 border border-red-400/40"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Book Shoot On WhatsApp</span>
            </a>

            <a
              href="#packages"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700 hover:border-red-500 text-sm font-semibold uppercase tracking-wider transition-all"
            >
              <span>View Packages</span>
              <ArrowRight className="w-4 h-4 text-red-400" />
            </a>
          </div>

          {/* Highlights Bar (From Flyers) */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl w-full">
            <div className="p-5 rounded-2xl bg-[#0B0B0F] border border-zinc-800 hover:border-red-500/40 text-center transition-all hover:-translate-y-0.5 shadow-lg">
              <span className="font-cinematic font-bold text-lg sm:text-xl text-red-400 text-red-glow block">STARTING ₹1499</span>
              <span className="text-xs text-zinc-400 mt-1 block">Best Price Packages</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#0B0B0F] border border-zinc-800 hover:border-red-500/40 text-center transition-all hover:-translate-y-0.5 shadow-lg">
              <span className="font-cinematic font-bold text-lg sm:text-xl text-white block">SMOOTH GIMBAL</span>
              <span className="text-xs text-zinc-400 mt-1 block">Cinematic Steady Motion</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#0B0B0F] border border-zinc-800 hover:border-red-500/40 text-center transition-all hover:-translate-y-0.5 shadow-lg">
              <span className="font-cinematic font-bold text-lg sm:text-xl text-red-400 text-red-glow block">FEW HOURS</span>
              <span className="text-xs text-zinc-400 mt-1 block">Fast Reel Delivery</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#0B0B0F] border border-zinc-800 hover:border-red-500/40 text-center transition-all hover:-translate-y-0.5 shadow-lg">
              <span className="font-cinematic font-bold text-lg sm:text-xl text-white block">FREE PHOTOS</span>
              <span className="text-xs text-zinc-400 mt-1 block">Complimentary Stills</span>
            </div>
          </div>
        </section>

        {/* "PERFECT FOR" 9 TOPICS SHOWCASE (Circled in green on Flyer) */}
        <section className="py-20 bg-[#060608] border-t border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/30 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tailored Shoot Categories</span>
              </div>
              <h2 className="font-cinematic font-black text-2xl sm:text-4xl text-white tracking-tight">
                PERFECT FOR EVERY OCCASION
              </h2>
              <p className="text-zinc-400 text-sm mt-2">
                Click any topic to explore our reels and dedicated visual storytelling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const imgUrl = topicImages[cat.name] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80';
                return (
                  <Link
                    key={cat.id}
                    to={`/portfolio?category=${cat.slug || cat.id}`}
                    className="group relative h-64 rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-500/80 transition-all duration-300 shadow-xl flex flex-col justify-end p-6 hover:-translate-y-1 hover:shadow-red-900/20"
                  >
                    {/* Background Image */}
                    <img
                      src={imgUrl}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Dark Gradients with subtle red tint on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 group-hover:from-black/95 group-hover:via-black/50 transition-colors" />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-mono-code tracking-widest px-2.5 py-0.5 rounded-full bg-black/80 border border-red-500/40 text-red-400">
                          {cat.videos_count ? `${cat.videos_count} Video${cat.videos_count > 1 ? 's' : ''}` : 'Shoot Available'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <h3 className="font-cinematic font-bold text-xl sm:text-2xl text-white group-hover:text-red-400 transition-colors leading-tight">
                        {cat.name}
                      </h3>
                      <p className="text-zinc-300 text-xs mt-1.5 line-clamp-2 leading-relaxed opacity-90">
                        {cat.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CINEMATIC SPOTLIGHT: VIDEO SLIDES FROM LEFT, TEXT FROM RIGHT */}
        <section className="py-20 lg:py-28 bg-[#040406] border-t border-zinc-900 relative overflow-hidden">
          {/* Subtle Ambient Red Glow */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* VIDEO CONTAINER: Slides in from the LEFT */}
              <div 
                className="lg:col-span-7"
                data-aos="fade-right"
                data-aos-duration="850"
                data-aos-once="true"
              >
                <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-red-500/40 shadow-2xl shadow-red-950/60 p-2 group hover:border-red-500 transition-all">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-950 flex items-center justify-center">
                    {spotlightVideo ? (
                      <AutoplayVideoPlayer
                        url={spotlightVideo.video_url}
                        thumbnailUrl={spotlightVideo.thumbnail_url}
                        title={spotlightVideo.title}
                        categorySlug={spotlightVideo.category?.slug}
                        aspectRatio="16:9"
                        playerId={`spotlight-${spotlightVideo.id}`}
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80"
                          alt="Cinematic Shoot"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Floating Video Badges */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
                      <span className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-red-500/50 text-[10px] font-mono-code font-bold uppercase tracking-wider text-red-400">
                        4K 60FPS • SMOOTH GIMBAL
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TEXT CONTENT: Slides in from the RIGHT */}
              <div 
                className="lg:col-span-5 space-y-6"
                data-aos="fade-left"
                data-aos-duration="850"
                data-aos-once="true"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/40 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The MRD Experience</span>
                </div>

                <h2 className="font-cinematic font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
                  WE DON’T JUST SHOOT, <span className="text-red-gradient">WE CREATE MEMORIES</span>
                </h2>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  From high-energy car and bike delivery sequences to royal weddings and viral Instagram reels, every frame is captured on 3-axis precision gimbals and graded with cinematic Hollywood color science.
                </p>

                {/* Checklist of Client Benefits */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Shoot on Gimbal:</strong> Ultra-steady cinematic motion and creative tracking angles.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Fast Delivery:</strong> Master reels delivered within a few hours to your phone.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Free Photos:</strong> Complimentary high-resolution portrait stills included with every package.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Best Pricing:</strong> Starting at just ₹1,499 with complete quality guarantee.</span>
                  </div>
                </div>

                {/* Call to Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href={`https://wa.me/${cleanPhone}?text=Hi%20MRD%20Cinema%20Editz!%20I'd%20like%20to%20book%20a%20cinematic%20shoot.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-red-gradient bg-red-gradient-hover text-white font-heading font-bold text-xs uppercase tracking-wider shadow-xl shadow-red-600/35 transition-all flex items-center justify-center gap-2 border border-red-400/30"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Book Shoot on WhatsApp</span>
                  </a>

                  <Link
                    to="/portfolio"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-red-500 text-white font-semibold text-xs uppercase tracking-wider text-center transition-colors"
                  >
                    Explore Portfolio &rarr;
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* REELS PACKAGES (PRICING TABLE FROM FLYER IMAGE 2) */}
        <section id="packages" className="py-20 bg-[#030305] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-red-400 block mb-2 font-heading">
                Transparent Pricing
              </span>
              <h2 className="font-cinematic font-black text-2xl sm:text-4xl text-white">
                REELS PACKAGES
              </h2>
              <p className="text-zinc-400 text-sm mt-2">
                Shoot • Edit • Deliver — High quality reels delivered in few hours with complimentary photos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {packages.map((pkg) => {
                const isHighlight = pkg.highlight || pkg.reels_count === 3;
                return (
                  <div
                    key={pkg.id}
                    className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-2xl ${
                      isHighlight
                        ? 'bg-gradient-to-b from-red-950/40 via-[#0B0B0E] to-[#0B0B0E] border-2 border-red-500 shadow-red-600/25'
                        : 'bg-[#0B0B0F] border border-zinc-800 hover:border-red-500/50'
                    }`}
                  >
                    {isHighlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-red-gradient text-white font-heading font-bold text-[10px] uppercase tracking-wider shadow-md shadow-red-600/40 border border-red-400/30">
                        Most Popular
                      </div>
                    )}

                    <div>
                      {/* Reels Count & Badge */}
                      <div className="text-center pb-4 border-b border-zinc-800">
                        <span className="font-cinematic font-black text-3xl text-white block">
                          {pkg.reels_count}
                        </span>
                        <span className="font-heading text-xs uppercase tracking-widest text-red-500 font-bold">
                          {pkg.reels_count === 1 ? 'REEL' : 'REELS'}
                        </span>
                        <p className="text-[11px] text-zinc-400 mt-1 font-medium">{pkg.title}</p>
                      </div>

                      {/* Price */}
                      <div className="text-center py-5">
                        <span className="font-mono-code font-bold text-2xl sm:text-3xl text-white block">
                          ₹{Number(pkg.price).toLocaleString('en-IN')}/-
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mt-0.5">
                          Complete Package
                        </span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2.5 text-xs text-zinc-300 pt-2 mb-6">
                        {(pkg.features || []).map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-left">
                            <Check className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                      <a
                        href={`https://wa.me/${cleanPhone}?text=Hi%20MRD%20Cinema%20Editz!%20I%20want%20to%20book%20the%20${encodeURIComponent(pkg.reels_count)}%20Reel(s)%20Package%20for%20₹${pkg.price}.`}
                        target="_blank"
                        rel="noreferrer"
                        className={`w-full py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                          isHighlight
                            ? 'bg-red-gradient text-white shadow-lg shadow-red-600/40 hover:scale-105 border border-red-400/30'
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
        </section>

        {/* FEATURED PORTFOLIO REELS */}
        <section className="py-20 bg-[#060608] border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className="flex flex-col md:flex-row md:items-end justify-between mb-12"
              data-aos="fade-left"
              data-aos-duration="850"
              data-aos-once="true"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500 block mb-2 font-heading">
                  Real Creations
                </span>
                <h2 className="font-cinematic font-bold text-2xl sm:text-4xl text-white">
                  FEATURED REELS & SHOOTS
                </h2>
              </div>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-white transition-colors mt-4 md:mt-0"
              >
                <span>View Full Portfolio ({categories.length} Topics)</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-w-0">
                {featuredVideos.map((video) => (
                  <Link key={video.id} to={`/portfolio/${video.slug || video.id}`} className="block w-full min-w-0">
                    <ReelCard video={video} onOpenAuth={onOpenAuth} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* OUR 5 SERVICES (IMAGE 1) */}
        <section className="py-20 bg-[#030305] border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-red-500 block mb-2 font-heading">
                Comprehensive Filmmaking
              </span>
              <h2 className="font-cinematic font-bold text-2xl sm:text-4xl text-white">
                OUR CORE SERVICES
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {servicesList.map((svc, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#0B0B0F] border border-zinc-800 text-center hover:border-red-500/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-red-950/30 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto mb-4">
                      <Film className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-white mb-2">{svc.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">{svc.desc}</p>
                  </div>
                  <Link to={`/contact?service=${encodeURIComponent(svc.title)}`} className="text-xs font-semibold text-red-400 flex items-center justify-center gap-1 hover:text-white">
                    <span>Inquire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SHOOT • EDIT • DELIVER PROCESS */}
        <section className="py-16 bg-[#060608] border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-cinematic font-bold text-2xl sm:text-3xl text-white mb-10">
              SHOOT • EDIT • DELIVER
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-[#0B0B0F] border border-zinc-800 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-gradient text-white flex items-center justify-center font-bold font-mono-code shadow-md shadow-red-600/30">
                    01
                  </div>
                  <h3 className="font-heading font-bold text-white text-base">On-Spot Shoot</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Professional gimbal stabilizer for buttery smooth footage, creative angles, and cinematic lighting on-site.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B0B0F] border border-zinc-800 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-gradient text-white flex items-center justify-center font-bold font-mono-code shadow-md shadow-red-600/30">
                    02
                  </div>
                  <h3 className="font-heading font-bold text-white text-base">Expert Editing</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Dynamic rhythm pacing, beat-synced cuts, master color science, and cinematic sound design that grips viewers.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B0B0F] border border-zinc-800 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-gradient text-white flex items-center justify-center font-bold font-mono-code shadow-md shadow-red-600/30">
                    03
                  </div>
                  <h3 className="font-heading font-bold text-white text-base">Fast Delivery</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Delivered in few hours right to your phone, with complimentary high-quality still photos ready to post.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION BANNER */}
        <section className="py-20 bg-gradient-to-b from-[#030305] via-[#09090D] to-[#030305] border-t border-zinc-900 text-center px-4">
          <div className="max-w-4xl mx-auto p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-[#120507] via-[#09090D] to-[#120507] border border-red-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <span className="text-xs font-semibold uppercase tracking-widest text-red-400 block mb-2 font-heading">
              Professional Shoot Today!
            </span>
            <h2 className="font-cinematic font-black text-2xl sm:text-4xl text-white mb-4">
              LET'S CREATE SOMETHING EPIC!
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Call or WhatsApp directly on <span className="text-red-400 font-bold">7470678511</span> or DM on Instagram <span className="text-red-400 font-bold">@mrd_cinemaeditz</span>. Based in Rewa, MP — Available all over India.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${cleanPhone}?text=Hi%20MRD%20Cinema%20Editz!%20I%20want%20to%20book%20a%20shoot.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-red-gradient bg-red-gradient-hover text-white font-heading font-bold text-sm uppercase tracking-wider shadow-xl shadow-red-600/40 hover:scale-105 transition-transform flex items-center justify-center gap-2 border border-red-400/30"
              >
                <Phone className="w-4 h-4" />
                <span>Call / WhatsApp 7470678511</span>
              </a>
              <Link
                to="/portfolio"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-sm hover:border-red-500 transition-colors"
              >
                Explore All 9 Topics
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
