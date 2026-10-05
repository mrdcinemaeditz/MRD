import { Settings, Save, Sparkles, MessageCircle, Share2, FileText, Globe, BellRing } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { PushNotificationManager } from '../../components/admin/PushNotificationManager';

export const SiteSettings = () => {
  const [settings, setSettings] = useState({
    site_title: '',
    hero_tagline: '',
    hero_subheadline: '',
    whatsapp_number: '',
    whatsapp_default_message: '',
    contact_email: '',
    instagram_url: '',
    youtube_url: '',
    twitter_url: '',
    about_story: '',
    whatsapp_alert_enabled: 'false',
    push_notifications_enabled: 'true',
    media_kit_stats: {
      total_followers: '350K+',
      monthly_views: '18.5M+',
      engagement_rate: '9.2%',
      completed_projects: '420+',
      top_demographics: '18-34 Yrs (78% US, UK, IN)'
    }
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
            media_kit_stats: res.settings.media_kit_stats || prev.media_kit_stats
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateSiteSettings(settings);
      success('Site settings saved successfully');
    } catch (err) {
      error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-zinc-500 text-xs">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cinematic font-bold text-2xl sm:text-3xl text-white">SITE SETTINGS & CONTACT</h1>
          <p className="text-xs text-zinc-400 mt-1">Configure global WhatsApp numbers, social handles, hero banners, and media kit stats.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact & WhatsApp */}
        <div className="p-6 rounded-3xl bg-[#121216] border border-[#24221C] space-y-4">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#D4A346]" />
            <span>Direct WhatsApp & Inquiries</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Floating WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                placeholder="+919876543210"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Contact Inbox Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                placeholder="contact@mrdcinemaeditz.com"
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

        {/* Inbound Notifications & Alert Integrations */}
        <div className="p-6 rounded-3xl bg-[#121216] border border-[#24221C] space-y-5">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4A346]" />
            <span>Enquiry Notification Alerts</span>
          </h3>

          {/* Push Notification Global Setting Toggle */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-white block">Send push notification on new enquiry</span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Automatically dispatch real-time Firebase Web Push alerts to all registered admin devices when a visitor submits the contact form.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.push_notifications_enabled === 'true' || settings.push_notifications_enabled === true}
                onChange={(e) => setSettings({ ...settings, push_notifications_enabled: e.target.checked ? 'true' : 'false' })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4A346]" />
            </label>
          </div>

          {/* WhatsApp Notification Toggle */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-white block">Send WhatsApp alert on new enquiry</span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Automatically dispatch instant WhatsApp notification to your phone using Twilio when a visitor submits the contact form.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.whatsapp_alert_enabled === 'true' || settings.whatsapp_alert_enabled === true}
                onChange={(e) => setSettings({ ...settings, whatsapp_alert_enabled: e.target.checked ? 'true' : 'false' })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4A346]" />
            </label>
          </div>

          {/* Push Notification Device Manager Card */}
          <div className="pt-2">
            <PushNotificationManager />
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-3xl bg-[#121216] border border-[#24221C] space-y-4">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#D4A346]" />
            <span>Social Handles & Profiles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram_url}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">YouTube URL</label>
              <input
                type="url"
                value={settings.youtube_url}
                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                placeholder="https://youtube.com/@..."
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Twitter / X URL</label>
              <input
                type="url"
                value={settings.twitter_url}
                onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                placeholder="https://twitter.com/..."
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

        {/* Media Kit Stats */}
        <div className="p-6 rounded-3xl bg-[#121216] border border-[#24221C] space-y-4">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D4A346]" />
            <span>Media Kit Metrics</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Total Followers</label>
              <input
                type="text"
                value={settings.media_kit_stats?.total_followers || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  media_kit_stats: { ...settings.media_kit_stats, total_followers: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Monthly Views</label>
              <input
                type="text"
                value={settings.media_kit_stats?.monthly_views || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  media_kit_stats: { ...settings.media_kit_stats, monthly_views: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Engagement Rate</label>
              <input
                type="text"
                value={settings.media_kit_stats?.engagement_rate || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  media_kit_stats: { ...settings.media_kit_stats, engagement_rate: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Completed Deals</label>
              <input
                type="text"
                value={settings.media_kit_stats?.completed_projects || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  media_kit_stats: { ...settings.media_kit_stats, completed_projects: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#D4A346]/20 hover:scale-[1.01] transition-transform disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save All Settings'}</span>
        </button>
      </form>
    </div>
  );
};
