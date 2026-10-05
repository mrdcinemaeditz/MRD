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
          {/* Creator Profile Image / Logo Art */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden p-1 bg-gradient-to-tr from-[#D4A346] via-[#F5C869] to-[#996F28] shadow-2xl shadow-[#D4A346]/20">
              <img
                src="/logo.png"
                alt="MRD CINEMA EDITZ"
                className="w-full h-full object-cover rounded-[22px] bg-[#0A0A0C]"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#121216]/90 backdrop-blur-md border border-[#D4A346]/40 text-center">
                <span className="font-cinematic font-bold text-lg text-white block">MRD CINEMA EDITZ</span>
                <span className="text-xs text-[#F5C869] font-medium tracking-widest uppercase">Director & Lead Editor</span>
              </div>
            </div>
          </div>

          {/* Story & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121216] border border-[#D4A346]/40 text-[#F5C869] text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Behind The Lens</span>
            </div>

            <h1 className="font-cinematic font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              TURNING RAW FOOTAGE INTO CINEMATIC GOLD
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              With over 7 years of dedicated craftsmanship in high-end video post-production, I treat every video as a high-stakes cinematic experience. What separates a standard edit from a viral, high-converting masterpiece is an obsession over rhythm, emotional pacing, color science, and tactile audio design.
            </p>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              I have collaborated with international fashion labels, music artists, automotive brands, and leading lifestyle creators, accumulating over 50 million views across Instagram, TikTok, and YouTube.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
              <div>
                <span className="font-mono-code font-bold text-2xl text-[#F5C869] block">7+</span>
                <span className="text-xs text-zinc-400 font-medium">Years Experience</span>
              </div>
              <div>
                <span className="font-mono-code font-bold text-2xl text-white block">420+</span>
                <span className="text-xs text-zinc-400 font-medium">Completed Projects</span>
              </div>
              <div>
                <span className="font-mono-code font-bold text-2xl text-[#F5C869] block">99.8%</span>
                <span className="text-xs text-zinc-400 font-medium">Client Satisfaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gear & Software Stack */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#121216] border border-[#24221C] mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D4A346] block mb-2 font-heading">
              Hardware & Software
            </span>
            <h2 className="font-cinematic font-bold text-2xl sm:text-3xl text-white">
              MY PRODUCTION TOOLKIT
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <Monitor className="w-8 h-8 text-[#D4A346]" />
              <h3 className="font-heading font-bold text-white text-base">Editing & VFX Suites</h3>
              <ul className="text-xs text-zinc-400 space-y-1.5">
                <li>• DaVinci Resolve Studio (Master Color Grading)</li>
                <li>• Adobe Premiere Pro CC (Assembly & Pacing)</li>
                <li>• Adobe After Effects (3D Tracking & Motion VFX)</li>
                <li>• Blender (3D Product Renderings)</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <Camera className="w-8 h-8 text-[#D4A346]" />
              <h3 className="font-heading font-bold text-white text-base">Camera & Optics</h3>
              <ul className="text-xs text-zinc-400 space-y-1.5">
                <li>• Sony FX3 Full-Frame Cinema Line (4K 120p)</li>
                <li>• Sony G-Master Primes (24mm, 50mm, 85mm f/1.4)</li>
                <li>• DJI Ronin RS3 Pro Gimbal Stabilizer</li>
                <li>• PolarPro QuartzLine VND Filters</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <Cpu className="w-8 h-8 text-[#D4A346]" />
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
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#D4A346]/20 hover:scale-105 transition-transform"
          >
            <span>Let's Create Together</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
};
