import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Film, Award, Camera, Monitor, 
  Cpu, CheckCircle2, ArrowRight, Heart 
} from 'lucide-react';

export const About = () => {
  return (
    <>
      <Helmet>
        <title>About MRD | Filmmaker & Master Colorist Story</title>
        <meta name="description" content="Discover the story behind MRD CINEMA EDITZ. 7+ years of cinematic editing, high-profile commercial campaigns, and viral social media storytelling." />
      </Helmet>

      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Creator Profile Image / Logo Art: Slides from LEFT */}
          <div 
            className="lg:col-span-5 flex justify-center"
            data-aos="fade-right"
            data-aos-duration="850"
            data-aos-once="true"
          >
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden p-1.5 bg-gradient-to-tr from-[#FF1E27] via-[#E50914] to-[#800000] shadow-2xl shadow-red-600/30 neon-red-halo">
              <img
                src="/logo.png"
                alt="MRD CINEMA EDITZ"
                className="w-full h-full object-cover rounded-[20px] bg-black"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#09090D]/95 backdrop-blur-md border border-red-500/40 text-center shadow-2xl">
                <span className="brand-mrd-text text-xl leading-none block">MRD</span>
                <div className="flex items-center justify-center gap-1 brand-editz-sub text-[9.5px] uppercase mt-1">
                  <span className="text-white font-extrabold">CINEMA</span>
                  <span className="text-[#FF1E27] text-red-glow font-black">EDITZ</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase block mt-1.5 pt-1.5 border-t border-zinc-800">Director & Lead Editor • Rewa, MP</span>
              </div>
            </div>
          </div>

          {/* Story & Philosophy: Slides from RIGHT */}
          <div 
            className="lg:col-span-7 space-y-6"
            data-aos="fade-left"
            data-aos-duration="850"
            data-aos-once="true"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121216] border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Behind The Lens</span>
            </div>

            <h1 className="font-cinematic font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              TURNING RAW FOOTAGE INTO <span className="text-red-gradient">CINEMATIC REALITY</span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              We Don't Just Shoot — We Create Memories. Based in Rewa, Madhya Pradesh, MRD Cinema Editz is dedicated to cinematic video production, viral vertical reels, royal wedding films, and high-impact commercial showcases.
            </p>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Using professional gimbal stabilization for buttery smooth movements, master color science, and dynamic audio rhythm synchronization, we turn your precious life moments and brand stories into unforgettable visual experiences.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
              <div>
                <span className="font-mono-code font-bold text-2xl text-red-400 block">₹1,499</span>
                <span className="text-xs text-zinc-400 font-medium">Starting Package</span>
              </div>
              <div>
                <span className="font-mono-code font-bold text-2xl text-white block">Rewa, MP</span>
                <span className="text-xs text-zinc-400 font-medium">Available All India</span>
              </div>
              <div>
                <span className="font-mono-code font-bold text-2xl text-red-400 block">100%</span>
                <span className="text-xs text-zinc-400 font-medium">Quality Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gear & Software Stack */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#121216] border border-[#24221C] mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-red-500 block mb-2 font-heading">
              Hardware & Software
            </span>
            <h2 className="font-cinematic font-bold text-2xl sm:text-3xl text-white">
              MY PRODUCTION TOOLKIT
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <Monitor className="w-8 h-8 text-[#FF1E27]" />
              <h3 className="font-heading font-bold text-white text-base">Editing & VFX Suites</h3>
              <ul className="text-xs text-zinc-400 space-y-1.5">
                <li>• DaVinci Resolve Studio (Master Color Grading)</li>
                <li>• Adobe Premiere Pro CC (Assembly & Pacing)</li>
                <li>• Adobe After Effects (3D Tracking & Motion VFX)</li>
                <li>• Blender (3D Product Renderings)</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <Camera className="w-8 h-8 text-[#FF1E27]" />
              <h3 className="font-heading font-bold text-white text-base">Camera & Optics</h3>
              <ul className="text-xs text-zinc-400 space-y-1.5">
                <li>• Sony FX3 Full-Frame Cinema Line (4K 120p)</li>
                <li>• Sony G-Master Primes (24mm, 50mm, 85mm f/1.4)</li>
                <li>• DJI Ronin RS3 Pro Gimbal Stabilizer</li>
                <li>• PolarPro QuartzLine VND Filters</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <Cpu className="w-8 h-8 text-[#FF1E27]" />
              <h3 className="font-heading font-bold text-white text-base">Audio & Monitoring</h3>
              <ul className="text-xs text-zinc-400 space-y-1.5">
                <li>• Sennheiser MKH 416 Shotgun Microphone</li>
                <li>• Genelec 8030C Studio Reference Monitors</li>
                <li>• Pro Tools & iZotope RX Audio Restoration</li>
                <li>• Calibrated 10-bit HDR Eizo Grading Display</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-red-gradient bg-red-gradient-hover text-white font-heading font-bold text-xs uppercase tracking-wider shadow-xl shadow-red-600/30 hover:scale-105 transition-all"
          >
            <span>Let's Create Together</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
};
