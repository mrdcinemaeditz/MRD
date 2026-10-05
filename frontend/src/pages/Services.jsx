import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Film, Clapperboard, Layers, Zap, Video, Sparkles, 
  CheckCircle2, ArrowRight, DollarSign, Clock, MessageSquare 
} from 'lucide-react';

export const Services = () => {
  const servicesList = [
    {
      id: 'viral-reels',
      title: 'High-Converting Viral Reels & Shorts',
      tagline: 'Engineered for Instagram, TikTok & YouTube Shorts algorithm growth',
      icon: Film,
      description: 'Dynamic pacing, custom sound design, sound effects synchronization, kinetic motion titles, and retention-maximizing visual hooks.',
      deliverables: [
        '9:16 Vertical UHD Master (4K 60FPS)',
        'Sound design & bespoke SFX scoring',
        'Dynamic animated captions & typography',
        '3 Revisions with 24-48h turnaround'
      ],
      idealFor: 'Content Creators, Influencers & Consumer Brands'
    },
    {
      id: 'commercial-ads',
      title: 'Commercial Ads & Product Films',
      tagline: 'High-stakes advertising designed to drive conversions and prestige',
      icon: Clapperboard,
      description: 'Full post-production pipeline including storyboard pacing, luxury speed ramps, sound design, commercial color grading, and broadcast deliverables.',
      deliverables: [
        'Multi-aspect delivery (16:9, 9:16, 1:1, 4:5)',
        'Broadcast-safe master audio leveling',
        'Product skin retouching & cleanup',
        'Licensing-cleared commercial score'
      ],
      idealFor: 'E-commerce Brands, Luxury Apparel & Automotive'
    },
    {
      id: 'color-grading',
      title: 'Hollywood Color Science & Film Emulation',
      tagline: 'DaVinci Resolve color grading for cinematic tonal mastery',
      icon: Layers,
      description: 'Transform flat LOG and RAW footage into rich, filmic Kodachrome / Vision3 warmth with custom highlight roll-off and balanced skin tones.',
      deliverables: [
        'Shot-to-shot color balance matching',
        'Custom 35mm / 16mm film grain emulation',
        'High Dynamic Range (HDR / SDR) deliverables',
        'Exported custom LUTs for future shoots'
      ],
      idealFor: 'Directors, Indie Filmmakers & Music Producers'
    },
    {
      id: 'music-videos',
      title: 'Music Video Post-Production & Teasers',
      tagline: 'Electrifying rhythm edits with 3D VFX and strobe transitions',
      icon: Zap,
      description: 'Fast-paced rhythmic video editing, seamless glitch transitions, 3D element integration, and promotional social media teaser cutdowns.',
      deliverables: [
        'Full length music video master',
        '3x High-impact promotional reels for release week',
        'Custom title sequence & visual effects',
        'Lyric visualizer variations'
      ],
      idealFor: 'Recording Artists, Record Labels & DJs'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Services & Video Editing Packages | MRD CINEMA EDITZ</title>
        <meta name="description" content="Explore professional video editing services: viral vertical reels, commercial ads, Hollywood color grading, and UGC packages by MRD." />
      </Helmet>

      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121216] border border-[#D4A346]/40 text-[#F5C869] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Premium Video Production</span>
          </div>
          <h1 className="font-cinematic font-black text-3xl sm:text-5xl text-white tracking-tight mb-4">
            CREATIVE SERVICES & PACKAGES
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Every project is tailored with master-grade precision, fast delivery timelines, and dedicated communication.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {servicesList.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="p-8 rounded-3xl bg-[#121216] border border-[#24221C] hover:border-[#D4A346]/50 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gold-gradient/10 border border-[#D4A346]/30 flex items-center justify-center text-[#F5C869]">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-mono-code text-zinc-400 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                      {service.idealFor}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-white mb-1">{service.title}</h3>
                  <p className="text-xs text-[#D4A346] font-medium uppercase tracking-wider mb-4">{service.tagline}</p>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">{service.description}</p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-zinc-800/80 mb-6">
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-[#D4A346] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="w-full py-3.5 rounded-xl bg-[#1A1A22] hover:bg-gold-gradient hover:text-black border border-[#D4A346]/40 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <span>Request a Custom Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Workflow Steps */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#121216] via-[#1A1A22] to-[#121216] border border-[#24221C] mb-16 text-center">
          <h2 className="font-cinematic font-bold text-2xl text-white mb-10">THE 4-STEP PRODUCTION PIPELINE</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left">
              <span className="font-mono-code font-bold text-[#D4A346] text-xl block mb-2">01. Briefing</span>
              <p className="text-xs text-zinc-400 leading-relaxed">We discuss your vision, visual references, timeline, and campaign objectives.</p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left">
              <span className="font-mono-code font-bold text-[#D4A346] text-xl block mb-2">02. Rough Cut</span>
              <p className="text-xs text-zinc-400 leading-relaxed">Story assembly, music pacing, and structural flow review within 48 hours.</p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left">
              <span className="font-mono-code font-bold text-[#D4A346] text-xl block mb-2">03. Master Polish</span>
              <p className="text-xs text-zinc-400 leading-relaxed">DaVinci color grading, immersive sound design, SFX layering, and VFX.</p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left">
              <span className="font-mono-code font-bold text-[#D4A346] text-xl block mb-2">04. Delivery</span>
              <p className="text-xs text-zinc-400 leading-relaxed">High bitrate 4K deliverables formatted for broadcast, web, and social.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
