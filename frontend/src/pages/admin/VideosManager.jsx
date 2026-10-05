import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, Search, Edit2, Trash2, Sparkles, Star, 
  Check, X, Eye, Heart, Clock, Video as VideoIcon, ExternalLink 
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const VideosManager = () => {
  const [searchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(searchParams.get('action') === 'new');
  const [editingVideo, setEditingVideo] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category_id: '',
    video_url: '',
    video_type: 'youtube',
    thumbnail_url: '',
    aspect_ratio: '9:16',
    duration: '00:30',
    is_featured: false,
    status: 'published',
    published_at: '',
    tag_names: '',
    seo_title: '',
    seo_description: ''
  });

  const { success, error } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [vidsRes, catsRes] = await Promise.all([
        adminService.getVideos({ per_page: 50 }),
        adminService.getCategories()
      ]);
      setVideos(vidsRes.videos || []);
      setCategories(catsRes.categories || []);
    } catch (err) {
      error('Failed to load videos data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      category_id: categories[0]?.id || '',
      video_url: '',
      video_type: 'youtube',
      thumbnail_url: '',
      aspect_ratio: '9:16',
      duration: '00:30',
      is_featured: false,
      status: 'published',
      published_at: new Date().toISOString().slice(0, 16),
      tag_names: '',
      seo_title: '',
      seo_description: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title || '',
      slug: video.slug || '',
      description: video.description || '',
      category_id: video.category?.id || '',
      video_url: video.video_url || '',
      video_type: video.video_type || 'youtube',
      thumbnail_url: video.thumbnail_url || '',
      aspect_ratio: video.aspect_ratio || '9:16',
      duration: video.duration || '',
      is_featured: video.is_featured || false,
      status: video.status || 'published',
      published_at: video.published_at ? new Date(video.published_at).toISOString().slice(0, 16) : '',
      tag_names: video.tags ? video.tags.map((t) => t.name).join(', ') : '',
      seo_title: video.seo_title || '',
      seo_description: video.seo_description || ''
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      tag_names: formData.tag_names.split(',').map((t) => t.trim()).filter(Boolean)
    };

    try {
      if (editingVideo) {
        await adminService.updateVideo(editingVideo.id, { video: payload, tag_names: payload.tag_names });
        success('Video updated successfully');
      } else {
        await adminService.createVideo({ video: payload, tag_names: payload.tag_names });
        success('Video created successfully');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      error(err.response?.data?.error || 'Failed to save video');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      await adminService.deleteVideo(id);
      setVideos(videos.filter((v) => v.id !== id));
      success('Video deleted');
    } catch (err) {
      error('Failed to delete video');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const res = await adminService.toggleFeatured(id);
      setVideos(videos.map((v) => (v.id === id ? { ...v, is_featured: res.is_featured } : v)));
      success(res.message);
    } catch (err) {
      error('Failed to toggle featured status');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinematic font-bold text-2xl sm:text-3xl text-white">VIDEOS & REELS MANAGER</h1>
          <p className="text-xs text-zinc-400 mt-1">Upload, edit, schedule, and reorder video portfolio entries.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4A346]/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Reel / Video</span>
        </button>
      </div>

      {/* Videos Table */}
      <div className="rounded-2xl bg-[#121216] border border-[#24221C] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A0A0C] border-b border-zinc-800 text-zinc-400 uppercase font-heading tracking-wider">
              <tr>
                <th className="p-4">Reel / Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Format</th>
                <th className="p-4">Metrics</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-zinc-500">Loading videos...</td>
                </tr>
              ) : videos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-zinc-500">No videos in archive yet. Click "Add New Reel" to start.</td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={video.thumbnail_url || '/logo.png'}
                          alt=""
                          className="w-12 h-16 rounded-lg object-cover bg-black border border-zinc-800 shrink-0"
                        />
                        <div className="max-w-xs">
                          <h4 className="font-semibold text-white truncate">{video.title}</h4>
                          <span className="text-[10px] text-zinc-500 font-mono-code truncate block">{video.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {video.category?.name || 'Uncategorized'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-mono-code text-zinc-400 uppercase">
                        {video.aspect_ratio} • {video.video_type}
                      </span>
                    </td>

                    <td className="p-4 font-mono-code text-[11px] text-zinc-400">
                      <div>{Number(video.views_count || 0).toLocaleString()} views</div>
                      <div className="text-zinc-500">{video.likes_count || 0} likes • {video.comments_count || 0} comments</div>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleFeatured(video.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          video.is_featured
                            ? 'bg-[#D4A346]/20 border-[#D4A346] text-[#F5C869]'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${video.is_featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        video.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : video.status === 'scheduled'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {video.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(video)}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#D4A346]/40"
                          title="Edit video"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/40"
                          title="Delete video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Video Modal (Create / Edit) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#121216] border border-[#D4A346]/40 p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <h3 className="font-cinematic font-bold text-lg text-white">
                {editingVideo ? 'EDIT VIDEO / REEL' : 'CREATE NEW VIDEO ENTRY'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyberpunk Supercar Commercial Reel"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Aspect Ratio</label>
                  <select
                    value={formData.aspect_ratio}
                    onChange={(e) => setFormData({ ...formData, aspect_ratio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                  >
                    <option value="9:16">9:16 (Vertical Reel / Short)</option>
                    <option value="16:9">16:9 (Cinematic Widescreen)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="4:5">4:5 (Portrait Feed)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Video Source URL (YouTube / Direct MP4)</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Thumbnail Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Duration</label>
                  <input
                    type="text"
                    placeholder="00:30"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="4K 60FPS, Color Graded, SFX"
                    value={formData.tag_names}
                    onChange={(e) => setFormData({ ...formData, tag_names: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Description & Story</label>
                <textarea
                  rows={3}
                  placeholder="Cinematic breakdown, gear used, and creative direction..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#D4A346] bg-zinc-900 border-zinc-800 focus:ring-0"
                />
                <label htmlFor="featured-check" className="text-xs font-medium text-zinc-300">
                  Feature this reel prominently on Homepage Hero
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingVideo ? 'Update Video' : 'Publish Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
