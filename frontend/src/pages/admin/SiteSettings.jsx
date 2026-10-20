import React, { useState, useEffect } from 'react';
import { Settings, Save, Sparkles, MessageCircle, Share2, FileText, Globe, BellRing, MapPin, Tag, Plus, Trash2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { PushNotificationManager } from '../../components/admin/PushNotificationManager';

const defaultReelPackages = [
  { id: 1, reels_count: 1, price: 1499, title: "Professional Reel", features: ["1 Professional Reel", "On-Spot Shoot & Coverage", "Shoot on Gimbal for Smooth Videos", "Reels Delivered in Few Hours"] },
  { id: 2, reels_count: 2, price: 2999, title: "Advanced Edit", features: ["2 Advanced Cinematic Reels", "On-Spot Shoot & Creative Angles", "Shoot on Gimbal for Smooth Videos", "Reels Delivered in Few Hours", "Complimentary High-Quality Photos"] },
  { id: 3, reels_count: 3, price: 4299, title: "Cinematic Edit", features: ["3 Cinematic Master Reels", "Dedicated On-Spot Creative Shoot", "Cinematic Color & Beat Sync FX", "Reels Delivered in Few Hours", "Complimentary High-Quality Photos"], highlight: true },
  { id: 4, reels_count: 4, price: 5499, title: "Premium Edit", features: ["4 Premium Multi-Angle Reels", "Extended Shoot & Angle Coverage", "Smooth Gimbal Cinematic Flow", "Fast Delivery in Few Hours", "Complimentary High-Quality Photos"] },
  { id: 5, reels_count: 5, price: 6999, title: "Pro Cinematic Edit", features: ["5 Pro Cinematic Reels", "Full Shoot & Directorial Coverage", "Gimbal Ultra-Smooth Videos", "Fast Delivery in Few Hours", "Complimentary High-Quality Photos", "100% Quality Guarantee"] }
];

export const SiteSettings = () => {
  const [settings, setSettings] = useState({
    site_title: 'MRD CINEMA EDITZ | Cinematic Videos & Viral Reels',
    hero_tagline: 'CINEMATIC VIDEOS THAT TELL YOUR STORY',
    hero_subheadline: "We Don't Just Shoot — We Create Memories. Starting from ₹1499. Reels delivered in few hours with ultra-smooth gimbal quality.",
    whatsapp_number: '7470678511',
    whatsapp_default_message: 'Hi MRD Cinema Editz! I want to book a video shoot / reel package.',
    contact_email: 'mrdcinemaeditz@gmail.com',
    location: 'Rewa, Madhya Pradesh',
    availability: 'Available All Over India',
    starting_price: '1499',
    instagram_url: 'https://instagram.com/mrd_cinemaeditz',
    youtube_url: 'https://youtube.com/@mrdcinemaeditz',
    twitter_url: 'https://twitter.com/mrdcinemaeditz',
    whatsapp_alert_enabled: 'false',
    push_notifications_enabled: 'true',
    reel_packages: defaultReelPackages
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await adminService.getSiteSettings();
        if (res.settings) {
          setSettings((prev) => ({
            ...prev,
            ...res.settings,
            reel_packages: (res.settings.reel_packages && Array.isArray(res.settings.reel_packages))
              ? res.settings.reel_packages
              : prev.reel_packages
          }));
        }
      } catch (err) {
        error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handlePackageChange = (index, field, value) => {
    const updated = [...(settings.reel_packages || defaultReelPackages)];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, reel_packages: updated });
  };

  const handlePackageFeaturesChange = (index, text) => {
    const updated = [...(settings.reel_packages || defaultReelPackages)];
    updated[index] = {
      ...updated[index],
      features: text.split('\n').filter((line) => line.trim().length > 0)
    };
    setSettings({ ...settings, reel_packages: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateSiteSettings(settings);
      success('Site settings and packages saved successfully');
    } catch (err) {
      error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-zinc-500 text-xs">Loading settings...</div>;
  }

  const packagesList = settings.reel_packages || defaultReelPackages;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cinematic font-bold text-2xl sm:text-3xl text-white">SITE SETTINGS & REELS PACKAGES</h1>
          <p className="text-xs text-zinc-400 mt-1">Manage official contact information, Rewa studio details, and pricing for the 5 Reels packages.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact & Location */}
        <div className="p-6 rounded-3xl bg-[#121216] border border-[#24221C] space-y-4">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#D4A346]" />
            <span>Direct WhatsApp, Call & Location</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">WhatsApp / Call Number *</label>
              <input
                type="text"
                required
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                placeholder="7470678511"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Contact Email Address</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                placeholder="mrdcinemaeditz@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Studio Location</label>
              <input
                type="text"
                value={settings.location || 'Rewa, Madhya Pradesh'}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                placeholder="Rewa, Madhya Pradesh"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Availability Scope</label>
              <input
                type="text"
                value={settings.availability || 'Available All Over India'}
                onChange={(e) => setSettings({ ...settings, availability: e.target.value })}
                placeholder="Available All Over India"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Default WhatsApp Prefilled Message</label>
            <input
              type="text"
              value={settings.whatsapp_default_message}
              onChange={(e) => setSettings({ ...settings, whatsapp_default_message: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
            />
          </div>
        </div>

        {/* REELS PRICING PACKAGES MANAGER (Flyer Image 2) */}
        <div className="p-6 rounded-3xl bg-[#121216] border border-[#24221C] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#D4A346]" />
              <span>Manage Reels Packages & Pricing</span>
            </h3>
            <span className="text-xs font-mono-code text-[#F5C869]">
              {packagesList.length} Active Packages
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Edit the prices, titles, and deliverables displayed on the homepage and services page.
          </p>

          <div className="space-y-4 pt-2">
            {packagesList.map((pkg, idx) => (
              <div key={pkg.id || idx} className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="font-cinematic font-bold text-sm text-white">
                    PACKAGE {pkg.reels_count} — {pkg.reels_count} {pkg.reels_count === 1 ? 'REEL' : 'REELS'}
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-zinc-400 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!pkg.highlight}
                        onChange={(e) => handlePackageChange(idx, 'highlight', e.target.checked)}
                        className="rounded accent-[#D4A346]"
                      />
                      <span>Highlight as Most Popular</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1">Package Title</label>
                    <input
                      type="text"
                      value={pkg.title}
                      onChange={(e) => handlePackageChange(idx, 'title', e.target.value)}
                      placeholder="e.g. Professional Reel"
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1">Price in INR (₹)</label>
                    <input
                      type="number"
                      value={pkg.price}
                      onChange={(e) => handlePackageChange(idx, 'price', Number(e.target.value))}
                      placeholder="1499"
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono-code font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Deliverables / Features (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={(pkg.features || []).join('\n')}
                    onChange={(e) => handlePackageFeaturesChange(idx, e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono-code"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Handles */}
        <div className="p-6 rounded-3xl bg-[#121216] border border-[#24221C] space-y-4">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#D4A346]" />
            <span>Social Handles & Profiles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram_url}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                placeholder="https://instagram.com/mrd_cinemaeditz"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">YouTube Channel URL</label>
              <input
                type="url"
                value={settings.youtube_url}
                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                placeholder="https://youtube.com/@mrdcinemaeditz"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="p-6 rounded-3xl bg-[#121216] border border-[#24221C] space-y-4">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#D4A346]" />
            <span>Homepage Hero Banner</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Hero Headline Tagline</label>
            <input
              type="text"
              value={settings.hero_tagline}
              onChange={(e) => setSettings({ ...settings, hero_tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white font-heading font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Hero Subtitle</label>
            <textarea
              rows={2}
              value={settings.hero_subheadline}
              onChange={(e) => setSettings({ ...settings, hero_subheadline: e.target.value })}
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200"
            />
          </div>
        </div>

        {/* Push Notifications Settings */}
        <div className="p-6 rounded-3xl bg-[#121216] border border-[#24221C] space-y-4">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <BellRing className="w-4 h-4 text-[#D4A346]" />
            <span>Push Notifications</span>
          </h3>
          <PushNotificationManager />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#D4A346]/20 hover:scale-[1.01] transition-transform disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save All Settings & Packages'}</span>
        </button>
      </form>
    </div>
  );
};
