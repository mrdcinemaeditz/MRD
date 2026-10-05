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
    budget_range: '$1,000 - $2,500',
    service_type: initialService,
    message: '',
    company_website: '' // honeypot field
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error } = useToast();

  const whatsappNumber = settings?.whatsapp_number || '+919876543210';
  const contactEmail = settings?.contact_email || 'contact@mrdcinemaeditz.com';

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
        <title>Hire Me & Request a Quote | MRD CINEMA EDITZ</title>
        <meta name="description" content="Book a video editing project or commercial campaign with MRD CINEMA EDITZ. Fast turnaround, high conversion vertical reels, and master color grading." />
      </Helmet>

      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121216] border border-[#D4A346]/40 text-[#F5C869] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Project Inquiries</span>
          </div>
          <h1 className="font-cinematic font-black text-3xl sm:text-5xl text-white tracking-tight mb-4">
            LET’S BUILD SOMETHING CINEMATIC
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Fill out the project details below or connect directly via WhatsApp for urgent deadlines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Quick Connect Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#121216] border border-[#24221C] space-y-6">
              <h3 className="font-cinematic font-bold text-xl text-white">DIRECT CHANNELS</h3>

              <div className="space-y-4">
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20MRD!%20I'd%20like%20to%20discuss%20a%20project`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 hover:border-emerald-500 flex items-center gap-4 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-white">WhatsApp Business</h4>
                    <p className="text-xs text-zinc-400">{whatsappNumber}</p>
                    <span className="text-[10px] text-emerald-400 font-medium mt-0.5 block">Typical reply: &lt; 30 mins</span>
                  </div>
                </a>

                <a
                  href={`mailto:${contactEmail}`}
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-[#D4A346]/40 flex items-center gap-4 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#D4A346]/10 text-[#F5C869] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-white">Email Inbox</h4>
                    <p className="text-xs text-zinc-400 truncate">{contactEmail}</p>
                    <span className="text-[10px] text-zinc-400 font-medium mt-0.5 block">Within 24 hours</span>
                  </div>
                </a>
              </div>

              {/* Guarantees */}
              <div className="pt-6 border-t border-zinc-800 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A346] shrink-0" />
                  <span>Strict NDA & confidentiality guaranteed</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <Clock className="w-4 h-4 text-[#D4A346] shrink-0" />
                  <span>Fast 48-hour initial cut delivery</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-[#D4A346] shrink-0" />
                  <span>Licensed master audio tracks included</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#121216] border border-[#24221C] shadow-2xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gold-gradient/20 border border-[#D4A346] text-[#F5C869] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-cinematic font-bold text-2xl text-white">ENQUIRY RECEIVED!</h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    Thank you for reaching out. I have received your project details and will follow up with a proposal within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', brand_name: '', email: '', phone: '', budget_range: '$1,000 - $2,500', service_type: 'Cinematic Reels & Shorts', message: '' }); }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-white hover:bg-zinc-700"
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
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-2">Brand / Channel Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Media or @handle"
                        value={formData.brand_name}
                        onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-2">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-2">Project Type</label>
                      <select
                        value={formData.service_type}
                        onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                      >
                        <option value="Cinematic Reels & Shorts">Viral Reels & Shorts</option>
                        <option value="Commercial Ads & Product Films">Commercial Ads & Brand Film</option>
                        <option value="Color Grading & Film Emulation">Color Grading & Film Science</option>
                        <option value="Music Video Post-Production">Music Video Post-Production</option>
                        <option value="Monthly Retainer Editing">Monthly Retainer Editing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-2">Estimated Budget Range</label>
                      <select
                        value={formData.budget_range}
                        onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                      >
                        <option value="Under $1,000">Under $1,000</option>
                        <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                        <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                        <option value="$5,000+">$5,000+ (Commercial Master)</option>
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
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-gold-gradient bg-gold-gradient-hover text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#D4A346]/25 transition-all disabled:opacity-50"
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
