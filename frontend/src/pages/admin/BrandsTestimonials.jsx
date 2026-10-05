import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, Award, MessageSquare, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const BrandsTestimonials = () => {
  const [brands, setBrands] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandForm, setBrandForm] = useState({ name: '', logo_url: '', website_url: '', position: 0 });

  const [testModalOpen, setTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [testForm, setTestForm] = useState({
    client_name: '', client_title: '', brand_name: '', client_avatar_url: '', content: '', rating: 5, is_featured: true
  });

  const { success, error } = useToast();

  const loadAll = async () => {
    setLoading(true);
    try {
      const [bRes, tRes] = await Promise.all([
        adminService.getBrands(),
        adminService.getTestimonials()
      ]);
      setBrands(bRes.brands || []);
      setTestimonials(tRes.testimonials || []);
    } catch (err) {
      error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Brand actions
  const handleSaveBrand = async (e) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await adminService.updateBrand(editingBrand.id, brandForm);
        success('Brand updated');
      } else {
        await adminService.createBrand(brandForm);
        success('Brand added');
      }
      setBrandModalOpen(false);
      loadAll();
    } catch (err) {
      error('Failed to save brand');
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm('Delete brand logo?')) return;
    try {
      await adminService.deleteBrand(id);
      setBrands(brands.filter((b) => b.id !== id));
      success('Brand deleted');
    } catch (err) {
      error('Failed to delete brand');
    }
  };

  // Testimonial actions
  const handleSaveTest = async (e) => {
    e.preventDefault();
    try {
      if (editingTest) {
        await adminService.updateTestimonial(editingTest.id, testForm);
        success('Testimonial updated');
      } else {
        await adminService.createTestimonial(testForm);
        success('Testimonial added');
      }
      setTestModalOpen(false);
      loadAll();
    } catch (err) {
      error('Failed to save testimonial');
    }
  };

  const handleDeleteTest = async (id) => {
    if (!window.confirm('Delete testimonial?')) return;
    try {
      await adminService.deleteTestimonial(id);
      setTestimonials(testimonials.filter((t) => t.id !== id));
      success('Testimonial deleted');
    } catch (err) {
      error('Failed to delete testimonial');
    }
  };

  return (
    <div className="space-y-12 max-w-6xl">
      {/* Brands Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-cinematic font-bold text-xl sm:text-2xl text-white">PARTNER BRANDS</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Showcase client logos on homepage.</p>
          </div>
          <button
            onClick={() => { setEditingBrand(null); setBrandForm({ name: '', logo_url: '', website_url: '', position: brands.length + 1 }); setBrandModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-gradient text-black font-semibold text-xs uppercase"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Brand</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {brands.map((b) => (
            <div key={b.id} className="p-4 rounded-2xl bg-[#121216] border border-[#24221C] flex flex-col items-center text-center justify-between gap-3">
              {b.logo_url ? (
                <img src={b.logo_url} alt="" className="h-10 w-auto object-contain rounded-md" />
              ) : (
                <span className="font-heading font-bold text-white text-sm">{b.name}</span>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingBrand(b); setBrandForm({ name: b.name, logo_url: b.logo_url, website_url: b.website_url, position: b.position }); setBrandModalOpen(true); }}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteBrand(b.id)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="space-y-6 pt-6 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-cinematic font-bold text-xl sm:text-2xl text-white">CLIENT TESTIMONIALS</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Manage reviews from directors and brands.</p>
          </div>
          <button
            onClick={() => { setEditingTest(null); setTestForm({ client_name: '', client_title: '', brand_name: '', client_avatar_url: '', content: '', rating: 5, is_featured: true }); setTestModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-gradient text-black font-semibold text-xs uppercase"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Testimonial</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="p-5 rounded-2xl bg-[#121216] border border-[#24221C] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-[#F5C869]">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 italic line-clamp-3">"{t.content}"</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                <div>
                  <h4 className="text-xs font-bold text-white">{t.client_name}</h4>
                  <span className="text-[10px] text-zinc-500">{t.client_title} • {t.brand_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setEditingTest(t); setTestForm(t); setTestModalOpen(true); }}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTest(t.id)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Modal */}
      {brandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#121216] border border-[#D4A346]/40 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="font-cinematic font-bold text-white">{editingBrand ? 'EDIT BRAND' : 'ADD BRAND'}</h3>
              <button onClick={() => setBrandModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveBrand} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony Music"
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Logo URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={brandForm.logo_url}
                  onChange={(e) => setBrandForm({ ...brandForm, logo_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setBrandModalOpen(false)} className="px-4 py-2 rounded-xl bg-zinc-800 text-xs text-zinc-300">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase">Save Brand</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#121216] border border-[#D4A346]/40 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="font-cinematic font-bold text-white">{editingTest ? 'EDIT TESTIMONIAL' : 'ADD TESTIMONIAL'}</h3>
              <button onClick={() => setTestModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveTest} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={testForm.client_name}
                    onChange={(e) => setTestForm({ ...testForm, client_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Brand / Company</label>
                  <input
                    type="text"
                    value={testForm.brand_name}
                    onChange={(e) => setTestForm({ ...testForm, brand_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Review Content *</label>
                <textarea
                  required
                  rows={3}
                  value={testForm.content}
                  onChange={(e) => setTestForm({ ...testForm, content: e.target.value })}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setTestModalOpen(false)} className="px-4 py-2 rounded-xl bg-zinc-800 text-xs text-zinc-300">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
