import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Mail, Phone, MessageCircle, Send, Sparkles, 
  CheckCircle2, Clock, ShieldCheck, MapPin 
} from 'lucide-react';
import { enquiryService } from '../services/enquiryService';
import { useToast } from '../context/ToastContext';

export const Contact = ({ settings }) => {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || 'Cinematic Reels & Shorts';

  const [formData, setFormData] = useState({
    name: '',
    brand_name: '',
    email: '',
    phone: '',
    budget_range: '₹1,499 - ₹2,999 (Reels Package)',
    service_type: initialService || '1 Reel Package (₹1,499)',
    message: '',
    company_website: '' // honeypot field
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error } = useToast();

  const whatsappNumber = settings?.whatsapp_number || '7470678511';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const cleanPhoneFormatted = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const contactEmail = settings?.contact_email || 'mrdcinemaeditz@gmail.com';
  const location = settings?.location || 'Rewa, Madhya Pradesh';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await enquiryService.submitEnquiry(formData);
      success('Thanks! We will contact you soon.');
      setSubmitted(true);
    } catch (err) {
      error(err.response?.data?.error || 'Failed to submit enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Hire Me & Book Shoot | MRD CINEMA EDITZ</title>
        <meta name="description" content="Book a video shoot or reels package with MRD CINEMA EDITZ. Fast turnaround, gimbal smooth videos, starting from ₹1499. Rewa, MP." />
      </Helmet>

      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121216] border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shoot Booking & Quotes</span>
          </div>
          <h1 className="font-cinematic font-black text-3xl sm:text-5xl text-white tracking-tight mb-4">
            LET’S CREATE SOMETHING <span className="text-red-gradient">EPIC!</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Fill out the project details below or contact directly on Call / WhatsApp for instant booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Quick Connect Sidebar: Slides from LEFT */}
          <div 
            className="lg:col-span-5 space-y-6"
            data-aos="fade-right"
            data-aos-duration="850"
            data-aos-once="true"
          >
            <div className="p-8 rounded-3xl bg-[#121216] border border-[#24221C] space-y-6">
              <h3 className="font-cinematic font-bold text-xl text-white">DIRECT CHANNELS</h3>

              <div className="space-y-4">
                <a
                  href={`https://wa.me/${cleanPhoneFormatted}?text=Hi%20MRD%20Cinema%20Editz!%20I'd%20like%20to%20discuss%20a%20project`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 hover:border-emerald-500 flex items-center gap-4 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-white">Call / WhatsApp</h4>
                    <p className="text-xs text-zinc-400">{whatsappNumber}</p>
                    <span className="text-[10px] text-emerald-400 font-medium mt-0.5 block">Instant reply on WhatsApp</span>
                  </div>
                </a>

                <a
                  href={`mailto:${contactEmail}`}
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-red-500/40 flex items-center gap-4 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-white">Email Inbox</h4>
                    <p className="text-xs text-zinc-400 truncate">{contactEmail}</p>
                    <span className="text-[10px] text-zinc-400 font-medium mt-0.5 block">Within 24 hours</span>
                  </div>
                </a>

                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-white">Studio Location</h4>
                    <p className="text-xs text-zinc-400">{location}</p>
                    <span className="text-[10px] text-red-400 font-medium mt-0.5 block">Available All Over India</span>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="pt-6 border-t border-zinc-800 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-[#FF1E27] shrink-0" />
                  <span>Shoot on Gimbal for ultra-smooth video</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <Clock className="w-4 h-4 text-[#FF1E27] shrink-0" />
                  <span>Reels delivered in few hours</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-[#FF1E27] shrink-0" />
                  <span>Complimentary high-quality photos included</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form: Slides from RIGHT */}
          <div 
            className="lg:col-span-7"
            data-aos="fade-left"
            data-aos-duration="850"
            data-aos-once="true"
          >
            <div className="p-8 sm:p-10 rounded-3xl bg-[#121216] border border-[#24221C] shadow-2xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500 text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-600/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-cinematic font-bold text-2xl text-white">ENQUIRY RECEIVED!</h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    Thank you! We will connect with you via Call or WhatsApp on your provided phone number shortly.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', brand_name: '', email: '', phone: '', budget_range: '₹1,499 - ₹2,999 (Reels Package)', service_type: '1 Reel Package (₹1,499)', message: '' }); }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-white hover:bg-[#FF1E27] transition-all"
                  >
                    Submit Another Project
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field for bot spam prevention */}
                  <input
                    type="text"
                    name="company_website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.company_website}
                    onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-2">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-2">Business / Occasion</label>
                      <input
                        type="text"
                        placeholder="e.g. Wedding, Cafe, Bike Delivery, Salon"
                        value={formData.brand_name}
                        onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="you@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-2">Call / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 7470678511"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-2">Project / Reel Package</label>
                      <select
                        value={formData.service_type}
                        onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#FF1E27] transition-all"
                      >
                        <option value="1 Reel Package (₹1,499)">1 Reel Package (₹1,499)</option>
                        <option value="2 Reels Package (₹2,999)">2 Reels Package (₹2,999)</option>
                        <option value="3 Reels Package (₹4,299)">3 Reels Package (₹4,299) - Most Popular</option>
                        <option value="4 Reels Package (₹5,499)">4 Reels Package (₹5,499)</option>
                        <option value="5 Reels Package (₹6,999)">5 Reels Package (₹6,999)</option>
                        <option value="Wedding Film & Teaser">Wedding Film & Teaser</option>
                        <option value="Pre Wedding Shoot">Pre Wedding Shoot</option>
                        <option value="Car / Bike Delivery Shoot">Car / Bike Delivery Shoot</option>
                        <option value="Brand Shoot / Commercial Ad">Brand Shoot / Commercial Ad</option>
                        <option value="Birthday / Event Shoot">Birthday / Event Shoot</option>
                        <option value="Restaurant / Cafe / Saloon Shoot">Restaurant / Cafe / Saloon Shoot</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-2">Estimated Budget Range</label>
                      <select
                        value={formData.budget_range}
                        onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#FF1E27] transition-all"
                      >
                        <option value="₹1,499 - ₹2,999">₹1,499 - ₹2,999 (Starter Reels)</option>
                        <option value="₹3,000 - ₹5,500">₹3,000 - ₹5,500 (Multi-Reel Shoots)</option>
                        <option value="₹5,500 - ₹10,000">₹5,500 - ₹10,000 (Pro Packages)</option>
                        <option value="₹10,000+">₹10,000+ (Grand Wedding / Campaign)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">Project Scope & Vision *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell me about the goals, reference links, footage status, and expected delivery date..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-red-gradient bg-red-gradient-hover text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Submitting Enquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Project Proposal</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
