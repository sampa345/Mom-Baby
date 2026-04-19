import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import type { Category } from '../../types/database';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const location = useLocation();

  useEffect(() => {
    fetchCategories();
    if (location.state?.openModal) {
      openModal();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  async function fetchCategories() {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (!error && data) setCategories(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      await supabase.from('categories').update({ name }).eq('id', editingId);
    } else {
      await supabase.from('categories').insert([{ name }]);
    }
    closeModal();
    fetchCategories();
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    }
  }

  function openModal(category?: Category) {
    if (category) {
      setEditingId(category.id);
      setName(category.name);
    } else {
      setEditingId(null);
      setName('');
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setName('');
    setEditingId(null);
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-[12px] border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between border-b border-gray-200">
            <h3 className="text-[1.1rem] font-semibold text-gray-800 m-0">Categories</h3>
            <button
              onClick={() => openModal()}
              className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-lg font-semibold text-[0.9rem] transition-colors"
            >
              + Add Category
            </button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left bg-gray-50 px-6 py-4 text-[0.75rem] uppercase tracking-[0.05em] text-gray-500 border-b border-gray-200">Name</th>
                <th className="text-right bg-gray-50 px-6 py-4 text-[0.75rem] uppercase tracking-[0.05em] text-gray-500 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 border-b border-gray-200 text-[0.9rem] font-medium text-gray-800">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-right text-[0.85rem] font-semibold text-brand-500 cursor-pointer">
                    <button onClick={() => openModal(category)} className="hover:text-brand-600 mr-2">Edit</button>
                    <span className="text-gray-300">·</span>
                    <button onClick={() => handleDelete(category.id)} className="hover:text-red-600 ml-2">Delete</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-gray-500 text-[0.9rem]">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-bold">{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                  placeholder="e.g. Strollers"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
