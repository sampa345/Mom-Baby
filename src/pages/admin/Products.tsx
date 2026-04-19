import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, X, ExternalLink } from 'lucide-react';
import type { Product, Category } from '../../types/database';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    affiliate_link: '',
    direct_link: '',
    category: '',
    rating: 5,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);

    try {
      const [productsData, categoriesData] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name')
      ]);
      
      if (productsData.data) setProducts(productsData.data);
      if (categoriesData.data) setCategories(categoriesData.data);
    } catch (error) {
      console.error("Error fetching admin products", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      await supabase.from('products').update(formData).eq('id', editingId);
    } else {
      await supabase.from('products').insert([formData]);
    }
    closeModal();
    fetchData();
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchData();
    }
  }

  function openModal(product?: Product) {
    if (product) {
      setEditingId(product.id);
      setFormData({
        title: product.title,
        description: product.description || '',
        image_url: product.image_url || '',
        affiliate_link: product.affiliate_link || '',
        direct_link: product.direct_link || '',
        category: product.category || '',
        rating: product.rating || 5,
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', image_url: '', affiliate_link: '', direct_link: '', category: '', rating: 5 });
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-[12px] border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between border-b border-gray-200">
            <h3 className="text-[1.1rem] font-semibold text-gray-800 m-0">Inventory List</h3>
            <button
              onClick={() => openModal()}
              className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-lg font-semibold text-[0.9rem] transition-colors"
            >
              + Add Product
            </button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left bg-gray-50 px-6 py-4 text-[0.75rem] uppercase tracking-[0.05em] text-gray-500 border-b border-gray-200">Image</th>
                <th className="text-left bg-gray-50 px-6 py-4 text-[0.75rem] uppercase tracking-[0.05em] text-gray-500 border-b border-gray-200">Product Title</th>
                <th className="text-left bg-gray-50 px-6 py-4 text-[0.75rem] uppercase tracking-[0.05em] text-gray-500 border-b border-gray-200">Category</th>
                <th className="text-left bg-gray-50 px-6 py-4 text-[0.75rem] uppercase tracking-[0.05em] text-gray-500 border-b border-gray-200">Rating</th>
                <th className="text-left bg-gray-50 px-6 py-4 text-[0.75rem] uppercase tracking-[0.05em] text-gray-500 border-b border-gray-200">Links</th>
                <th className="text-right bg-gray-50 px-6 py-4 text-[0.75rem] uppercase tracking-[0.05em] text-gray-500 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <div className="w-10 h-10 rounded bg-gray-50 overflow-hidden flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt="" className="w-10 h-10 object-cover" />
                      ) : (
                        <div className="text-[0.6rem] text-gray-400">None</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-[0.9rem]">
                    <strong>{product.title}</strong>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <span className="px-2 py-1 rounded bg-[#DEF7EC] text-[#03543F] text-[0.75rem] font-semibold">
                      {product.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-[0.9rem] text-gray-600">
                    {product.rating} ★
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm flex gap-2">
                    {product.affiliate_link && (
                      <span className="px-2 py-1 rounded bg-[#E1EFFE] text-[#1E429F] text-[0.75rem] font-semibold">Amazon</span>
                    )}
                    {product.direct_link && (
                      <span className="px-2 py-1 rounded bg-[#F3E8FF] text-[#6B21A8] text-[0.75rem] font-semibold">Direct</span>
                    )}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-right text-[0.85rem] font-semibold text-brand-500 cursor-pointer">
                    <button onClick={() => openModal(product)} className="hover:text-brand-600 mr-2">Edit</button>
                    <span className="text-gray-300">·</span>
                    <button onClick={() => handleDelete(product.id)} className="hover:text-red-600 ml-2">Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-[0.9rem]">
                    No products found.
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-bold">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text" required value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3} value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url" value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-2 h-20 object-contain rounded border" />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                  <input
                    type="number" min="1" max="5" step="0.1" value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amazon Affiliate Link</label>
                  <input
                    type="url" value={formData.affiliate_link}
                    onChange={(e) => setFormData({...formData, affiliate_link: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Direct Monetag Link</label>
                  <input
                    type="url" value={formData.direct_link}
                    onChange={(e) => setFormData({...formData, direct_link: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
