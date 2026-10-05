import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Download, Sparkles, Users, TrendingUp, Eye, Globe, 
  BarChart3, CheckCircle2, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { metadataService } from '../services/metadataService';
import { useToast } from '../context/ToastContext';

export const MediaKit = () => {
  const [settings, setSettings] = useState({});
  const [brands, setBrands] = useState([]);
  const { success } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settingsRes, brandsRes] = await Promise.all([
          metadataService.getSiteSettings(),
          metadataService.getBrands()
        ]);
        setSettings(settingsRes.settings || {});
        setBrands(brandsRes.brands || []);
      } catch (err) {
        console.error('Failed to load media kit data', err);
      }
    };
    loadData();
  }, []);

  const stats = settings?.media_kit_stats || {
    total_followers: '350K+',
    monthly_views: '18.5M+',
    engagement_rate: '9.2%',
    completed_projects: '420+',
    top_demographics: '18-34 Yrs (78% US, UK, IN)'
  };

  const handleDownloadPDF = () => {
    // Triggers download of generated media kit
    success('Downloading MRD CINEMA EDITZ Media Kit (PDF)...');
    const element = document.createElement('a');
    const file = new Blob([
      `MRD CINEMA EDITZ - Official Media Kit & Rate Card\n\nTotal Followers: ${stats.total_followers}\nMonthly Views: ${stats.monthly_views}\nEngagement Rate: ${stats.engagement_rate}\nContact: contact@mrdcinemaeditz.com\nWebsite: https://mrdcinemaeditz.com`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'MRD_Cinema_Editz_Media_Kit.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <Helmet>
        <title>Media Kit & Creator Analytics | MRD CINEMA EDITZ</title>
        <meta name="description" content="View verified creator audience statistics, demographics, engagement rates, and download the official media kit for MRD CINEMA EDITZ." />
      </Helmet>

      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121216] border border-[#D4A346]/40 text-[#F5C869] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audience & Sponsorships</span>
          </div>
          <h1 className="font-cinematic font-black text-3xl sm:text-5xl text-white tracking-tight mb-4">
            CREATOR MEDIA KIT & STATS
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
            Detailed performance metrics, audience demographics, and commercial sponsorship rate benchmarks.
          </p>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#D4A346]/20 hover:scale-105 transition-transform"
          >
            <Download className="w-4 h-4" />
            <span>Download Official Media Kit (PDF)</span>
          </button>
        </div>

        {/* Analytics Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-8 rounded-2xl bg-[#121216] border border-[#24221C] space-y-2">
            <div className="flex items-center justify-between text-[#F5C869]">
              <Users className="w-6 h-6" />
              <span className="text-[10px] font-mono-code uppercase bg-zinc-900 px-2 py-0.5 rounded">Instagram / TikTok</span>
            </div>
            <span className="font-mono-code font-bold text-3xl text-white block">{stats.total_followers}</span>
            <span className="text-xs text-zinc-400 block">Total Combined Audience</span>
          </div>

          <div className="p-8 rounded-2xl bg-[#121216] border border-[#24221C] space-y-2">
            <div className="flex items-center justify-between text-[#F5C869]">
              <Eye className="w-6 h-6" />
              <span className="text-[10px] font-mono-code uppercase bg-zinc-900 px-2 py-0.5 rounded">Monthly</span>
            </div>
            <span className="font-mono-code font-bold text-3xl text-gold-gradient block">{stats.monthly_views}</span>
            <span className="text-xs text-zinc-400 block">Average Monthly Views</span>
          </div>

          <div className="p-8 rounded-2xl bg-[#121216] border border-[#24221C] space-y-2">
            <div className="flex items-center justify-between text-[#F5C869]">
              <TrendingUp className="w-6 h-6" />
              <span className="text-[10px] font-mono-code uppercase bg-zinc-900 px-2 py-0.5 rounded">Industry Avg 2.1%</span>
            </div>
            <span className="font-mono-code font-bold text-3xl text-white block">{stats.engagement_rate}</span>
            <span className="text-xs text-zinc-400 block">Active Engagement Rate</span>
          </div>

          <div className="p-8 rounded-2xl bg-[#121216] border border-[#24221C] space-y-2">
            <div className="flex items-center justify-between text-[#F5C869]">
              <Globe className="w-6 h-6" />
              <span className="text-[10px] font-mono-code uppercase bg-zinc-900 px-2 py-0.5 rounded">Core Tier 1</span>
            </div>
            <span className="font-mono-code font-bold text-3xl text-white block">78%</span>
            <span className="text-xs text-zinc-400 block">18-34 Age Demographics</span>
          </div>
        </div>

        {/* Detailed Demographics Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#121216] border border-[#24221C] mb-16">
          <h3 className="font-cinematic font-bold text-xl text-white mb-8">AUDIENCE INSIGHTS & GEOGRAPHY</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-heading font-semibold text-sm text-zinc-300">Top Geographic Locations</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>United States & Canada</span>
                    <span className="font-mono-code text-white">42%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-gold-gradient rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>United Kingdom & Europe</span>
                    <span className="font-mono-code text-white">28%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-gold-gradient rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>India & Asia Pacific</span>
                    <span className="font-mono-code text-white">22%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-gold-gradient rounded-full" style={{ width: '22%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-heading font-semibold text-sm text-zinc-300">Audience Interests</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A346]" />
                  <span>Cinematography & Gear</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A346]" />
                  <span>Luxury Fashion & Style</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A346]" />
                  <span>Automotive & Supercars</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A346]" />
                  <span>Music & Festival Lifestyle</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sponsor CTA */}
        <div className="text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#D4A346]/20 hover:scale-105 transition-transform"
          >
            <span>Inquire About Brand Sponsorship</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
};
