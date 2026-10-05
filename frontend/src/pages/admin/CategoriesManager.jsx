import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderTree, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', position: 0 });
  const [saving, setSaving] = useState(false);

  const { success, error } = useToast();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCategories();
      setCategories(res.categories || []);
    } catch (err) {
      error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCat(null);
    setFormData({ name: '', slug: '', description: '', position: categories.length + 1 });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      position: cat.position || 0
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCat) {
        await adminService.updateCategory(editingCat.id, formData);
        success('Category updated');
      } else {
        await adminService.createCategory(formData);
        success('Category created');
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      error(err.response?.data?.error || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await adminService.deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      success('Category deleted');
    } catch (err) {
      error('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinematic font-bold text-2xl sm:text-3xl text-white">PORTFOLIO CATEGORIES</h1>
          <p className="text-xs text-zinc-400 mt-1">Organize your reels, advertisements, and filmmaking genres.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4A346]/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      <div className="rounded-2xl bg-[#121216] border border-[#24221C] overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0A0A0C] border-b border-zinc-800 text-zinc-400 uppercase font-heading tracking-wider">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4">Reels Count</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-zinc-900/40 transition-colors">
                <td className="p-4 font-semibold text-white">{cat.name}</td>
                <td className="p-4 font-mono-code text-zinc-400">{cat.slug}</td>
                <td className="p-4 text-zinc-400 max-w-xs truncate">{cat.description}</td>
                <td className="p-4 font-mono-code text-[#F5C869] font-bold">{cat.videos_count || 0}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#121216] border border-[#D4A346]/40 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="font-cinematic font-bold text-white">
                {editingCat ? 'EDIT CATEGORY' : 'NEW CATEGORY'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commercials & Ads"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#D4A346]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-xs text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
