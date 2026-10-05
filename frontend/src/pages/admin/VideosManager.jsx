import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, Search, Edit2, Trash2, Sparkles, Star, 
  Check, X, Eye, Heart, Clock, Video as VideoIcon, 
  ExternalLink, UploadCloud, Link as LinkIcon, Film, AlertCircle 
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { FileUploader } from '../../components/common/FileUploader';

export const VideosManager = () => {
  const [searchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(searchParams.get('action') === 'new');
  const [editingVideo, setEditingVideo] = useState(null);
  const [saving, setSaving] = useState(false);

  // Active Tab for Video Source Mode: 'upload' | 'external'
  const [sourceMode, setSourceMode] = useState('upload');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category_id: '',
    video_url: '',
    video_type: 'upload',
    source_type: 'file',
    thumbnail_url: '',
    aspect_ratio: '9:16',
    duration: '00:30',
    is_featured: false,
    status: 'published',
    published_at: '',
    tag_names: '',
    seo_title: '',
    seo_description: '',
    video_file_signed_id: null,
    thumbnail_signed_id: null,
    video_preview_url: null,
    thumbnail_preview_url: null
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
    setSourceMode('upload');
    setFormData({
      title: '',
      slug: '',
      description: '',
      category_id: categories[0]?.id || '',
      video_url: '',
      video_type: 'upload',
      source_type: 'file',
      thumbnail_url: '',
      aspect_ratio: '9:16',
      duration: '00:30',
      is_featured: false,
      status: 'published',
      published_at: new Date().toISOString().slice(0, 16),
      tag_names: '',
      seo_title: '',
      seo_description: '',
      video_file_signed_id: null,
      thumbnail_signed_id: null,
      video_preview_url: null,
      thumbnail_preview_url: null
    });
    setModalOpen(true);
  };

  const openEditModal = (video) => {
    setEditingVideo(video);
    const isFileUpload = video.source_type === 'file' || video.has_custom_video || (video.video_url && video.video_url.includes('/rails/active_storage/'));
    setSourceMode(isFileUpload ? 'upload' : 'external');

    setFormData({
      title: video.title || '',
      slug: video.slug || '',
      description: video.description || '',
      category_id: video.category?.id || '',
      video_url: video.video_url || '',
      video_type: video.video_type || (isFileUpload ? 'upload' : 'youtube'),
      source_type: video.source_type || (isFileUpload ? 'file' : 'external'),
      thumbnail_url: video.thumbnail_url || '',
      aspect_ratio: video.aspect_ratio || '9:16',
      duration: video.duration || '',
      is_featured: video.is_featured || false,
      status: video.status || 'published',
      published_at: video.published_at ? new Date(video.published_at).toISOString().slice(0, 16) : '',
      tag_names: video.tags ? video.tags.map((t) => t.name).join(', ') : '',
      seo_title: video.seo_title || '',
      seo_description: video.seo_description || '',
      video_file_signed_id: null,
      thumbnail_signed_id: null,
      video_preview_url: video.video_url || null,
      thumbnail_preview_url: video.thumbnail_url || null
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Source validation check
    if (sourceMode === 'upload' && !formData.video_file_signed_id && !editingVideo?.video_url) {
      error('Please select and upload a video file from your device');
      return;
    }

    if (sourceMode === 'external' && !formData.video_url.trim()) {
      error('Please provide an external video link (e.g. YouTube or Instagram)');
      return;
    }

    setSaving(true);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      category_id: formData.category_id,
      video_url: sourceMode === 'external' ? formData.video_url : (formData.video_file_signed_id ? '' : formData.video_url),
      video_type: sourceMode === 'external' ? (formData.video_url.includes('instagram.com') ? 'instagram' : 'youtube') : 'upload',
      source_type: sourceMode === 'upload' ? 'file' : 'external',
      thumbnail_url: formData.thumbnail_signed_id ? '' : formData.thumbnail_url,
      aspect_ratio: formData.aspect_ratio,
      duration: formData.duration,
      is_featured: formData.is_featured,
      status: formData.status,
      published_at: formData.published_at,
      seo_title: formData.seo_title,
      seo_description: formData.seo_description
    };

    const submitData = {
      video: payload,
      tag_names: formData.tag_names.split(',').map((t) => t.trim()).filter(Boolean),
      video_file_signed_id: formData.video_file_signed_id,
      thumbnail_signed_id: formData.thumbnail_signed_id
    };

    try {
      if (editingVideo) {
        await adminService.updateVideo(editingVideo.id, submitData);
        success('Video updated successfully');
      } else {
        await adminService.createVideo(submitData);
        success('Video published successfully! Background processing active.');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      error(err.response?.data?.error || err.response?.data?.message || 'Failed to save video');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video? Attached video and thumbnail files will also be purged.')) return;

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
          <p className="text-xs text-zinc-400 mt-1">
            Upload videos directly from your system or link external YouTube / Instagram reels.
          </p>
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
                <th className="p-4">Source & Format</th>
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
                          loading="lazy"
                          className="w-12 h-16 rounded-lg object-cover bg-black border border-zinc-800 shrink-0"
                        />
                        <div className="max-w-xs">
                          <h4 className="font-semibold text-white truncate">{video.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-zinc-500 font-mono-code truncate">{video.slug}</span>
                            {video.duration && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-[#F5C869] font-mono-code">
                                {video.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {video.category?.name || 'Uncategorized'}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono-code text-zinc-300 uppercase font-semibold">
                          {video.aspect_ratio || '9:16'}
                        </span>
                        <span className={`text-[10px] uppercase font-mono-code px-1.5 py-0.5 rounded inline-block w-fit ${
                          video.source_type === 'file'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {video.source_type === 'file' ? 'Direct Upload' : `Link (${video.video_type})`}
                        </span>
                      </div>
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
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#121216] border border-[#D4A346]/40 p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <div>
                <h3 className="font-cinematic font-bold text-lg text-white">
                  {editingVideo ? 'EDIT VIDEO / REEL' : 'CREATE NEW VIDEO ENTRY'}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select video source method and upload media directly.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* VIDEO SOURCE MODE TOGGLE / TABS */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Video Source Mode
                </label>
                <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-[#0A0A0C] border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      setSourceMode('upload');
                      setFormData({ ...formData, source_type: 'file', video_type: 'upload' });
                    }}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                      sourceMode === 'upload'
                        ? 'bg-gold-gradient text-black shadow-lg shadow-[#D4A346]/20'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload from Device (New)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSourceMode('external');
                      setFormData({ ...formData, source_type: 'external', video_type: 'youtube' });
                    }}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                      sourceMode === 'external'
                        ? 'bg-gold-gradient text-black shadow-lg shadow-[#D4A346]/20'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>External Link (YouTube/Instagram)</span>
                  </button>
                </div>
              </div>

              {/* MEDIA UPLOAD AREA */}
              {sourceMode === 'upload' ? (
                <div className="space-y-4 p-5 rounded-2xl bg-[#0A0A0C]/80 border border-zinc-800/80">
                  {/* Video Direct File Uploader */}
                  <FileUploader
                    type="video"
                    label="Upload Video File"
                    helperText="MP4, MOV, WEBM • Max 500 MB (Direct Storage Upload)"
                    currentUrl={formData.video_preview_url}
                    onUploadSuccess={(signedId, blob, previewUrl) => {
                      setFormData((prev) => ({
                        ...prev,
                        video_file_signed_id: signedId,
                        video_preview_url: previewUrl
                      }));
                    }}
                    onRemove={() => {
                      setFormData((prev) => ({
                        ...prev,
                        video_file_signed_id: null,
                        video_preview_url: null
                      }));
                    }}
                  />

                  {/* Thumbnail File Uploader */}
                  <FileUploader
                    type="image"
                    label="Custom Thumbnail Image (Optional)"
                    helperText="JPG, PNG, WEBP • Max 5 MB • Leave empty to auto-extract frame at 1s"
                    currentUrl={formData.thumbnail_preview_url}
                    onUploadSuccess={(signedId, blob, previewUrl) => {
                      setFormData((prev) => ({
                        ...prev,
                        thumbnail_signed_id: signedId,
                        thumbnail_preview_url: previewUrl
                      }));
                    }}
                    onRemove={() => {
                      setFormData((prev) => ({
                        ...prev,
                        thumbnail_signed_id: null,
                        thumbnail_preview_url: null
                      }));
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-4 p-5 rounded-2xl bg-[#0A0A0C]/80 border border-zinc-800/80">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      External Video Link (YouTube, Vimeo, Instagram) *
                    </label>
                    <input
                      type="url"
                      required={sourceMode === 'external'}
                      placeholder="https://www.youtube.com/watch?v=... or https://instagram.com/reel/..."
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Thumbnail Image URL (or upload custom thumbnail below)
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                    />
                  </div>

                  {/* Optional Custom Thumbnail Upload for External Link */}
                  <FileUploader
                    type="image"
                    label="Or Upload Custom Thumbnail From Device"
                    helperText="JPG, PNG, WEBP • Max 5 MB"
                    currentUrl={formData.thumbnail_preview_url}
                    onUploadSuccess={(signedId, blob, previewUrl) => {
                      setFormData((prev) => ({
                        ...prev,
                        thumbnail_signed_id: signedId,
                        thumbnail_preview_url: previewUrl
                      }));
                    }}
                    onRemove={() => {
                      setFormData((prev) => ({
                        ...prev,
                        thumbnail_signed_id: null,
                        thumbnail_preview_url: null
                      }));
                    }}
                  />
                </div>
              )}

              {/* GENERAL VIDEO DETAILS */}
              <div className="space-y-4 pt-2 border-t border-zinc-800">
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
                      <option value="9:16">9:16 (Vertical Reel / Short / TikTok)</option>
                      <option value="16:9">16:9 (Cinematic Widescreen / 4K)</option>
                      <option value="1:1">1:1 (Square)</option>
                      <option value="4:5">4:5 (Portrait Feed)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">Duration</label>
                    <input
                      type="text"
                      placeholder="00:30 (Auto-extracted for uploads)"
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

                <div className="flex items-center gap-3 pt-1">
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
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Saving Video...</span>
                    </>
                  ) : editingVideo ? (
                    'Update Video'
                  ) : (
                    'Publish Video'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
