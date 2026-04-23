import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import type { Blog, Category } from '../../types/database';

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const location = useLocation();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featured_image: '',
    category: '',
    slug: '',
  });

  useEffect(() => {
    fetchData();
    if (location.state?.openModal) {
      openModal();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  async function fetchData() {
    setLoading(true);
    try {
      const [blogsSnapshot, categoriesSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'blogs'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'categories'), orderBy('name', 'asc')))
      ]);
      
      setBlogs(blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Blog[]);
      setCategories(categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[]);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.content || formData.content === '<p><br></p>') {
      alert("Please enter blog content.");
      return;
    }
    
    try {
      if (editingId) {
        await updateDoc(doc(db, 'blogs', editingId), formData);
      } else {
        await addDoc(collection(db, 'blogs'), { ...formData, createdAt: serverTimestamp() });
      }
      closeModal();
      fetchData();
    } catch (err: any) {
      alert("Error saving: " + err.message);
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      await deleteDoc(doc(db, 'blogs', id));
      fetchData();
    }
  }

  function generateSlug(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: editingId ? formData.slug : generateSlug(title)
    });
  }

  function openModal(blog?: Blog) {
    setIsHtmlMode(false);
    if (blog) {
      setEditingId(blog.id);
      setFormData({
        title: blog.title,
        content: blog.content,
        featured_image: blog.featured_image || '',
        category: blog.category || '',
        slug: blog.slug,
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', content: '', featured_image: '', category: '', slug: '' });
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
            <h3 className="text-[1.1rem] font-semibold text-gray-800 m-0">Blog Posts</h3>
            <button
              onClick={() => openModal()}
              className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-lg font-semibold text-[0.9rem] transition-colors"
            >
              + Add Post
            </button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left bg-gray-50 px-6 py-4 text-[0.75rem] uppercase tracking-[0.05em] text-gray-500 border-b border-gray-200">Title & Slug</th>
                <th className="text-left bg-gray-50 px-6 py-4 text-[0.75rem] uppercase tracking-[0.05em] text-gray-500 border-b border-gray-200">Category</th>
                <th className="text-right bg-gray-50 px-6 py-4 text-[0.75rem] uppercase tracking-[0.05em] text-gray-500 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <div className="text-[0.9rem] font-medium text-gray-800">{blog.title}</div>
                    <div className="text-[0.75rem] text-gray-400">/{blog.slug}</div>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-[0.9rem]">
                    <span className="px-2 py-1 rounded bg-[#E1EFFE] text-[#1E429F] text-[0.75rem] font-semibold">
                      {blog.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-right text-[0.85rem] font-semibold text-brand-500 cursor-pointer">
                    <button onClick={() => openModal(blog)} className="hover:text-brand-600 mr-2">Edit</button>
                    <span className="text-gray-300">·</span>
                    <button onClick={() => handleDelete(blog.id)} className="hover:text-red-600 ml-2">Delete</button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500 text-[0.9rem]">
                    No blog posts found.
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-bold">{editingId ? 'Edit Post' : 'Add Post'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text" required value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text" required value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
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
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                  <input
                    type="url" value={formData.featured_image}
                    onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <button 
                      type="button" 
                      onClick={() => setIsHtmlMode(!isHtmlMode)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-1 rounded"
                    >
                      {isHtmlMode ? 'Use Visual Editor' : 'Edit as HTML'}
                    </button>
                  </div>
                  
                  {isHtmlMode ? (
                    <div className="bg-[#1e1e1e] rounded-md border border-gray-700 overflow-hidden mt-2 p-1">
                      <div className="flex bg-[#2d2d2d] text-gray-400 text-xs px-4 py-2 border-b border-gray-700 font-mono items-center space-x-2">
                         <span className="w-3 h-3 rounded-full bg-red-500"></span>
                         <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                         <span className="w-3 h-3 rounded-full bg-green-500"></span>
                         <span className="ml-4 pl-2 tracking-wider">index.html</span>
                      </div>
                      <textarea
                        required
                        rows={20}
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        className="w-full px-4 py-4 bg-[#1e1e1e] text-green-400 font-mono text-sm leading-relaxed focus:outline-none focus:ring-0 border-none resize-y"
                        placeholder="<!-- Write your raw HTML code here... -->"
                        spellCheck="false"
                      />
                    </div>
                  ) : (
                    <div className="bg-white border rounded-md overflow-hidden">
                      <ReactQuill 
                        theme="snow"
                        value={formData.content}
                        onChange={(val) => setFormData({...formData, content: val})}
                        className="h-[500px] mb-12"
                        modules={{
                          toolbar: [
                            [{ 'font': [] }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'script': 'sub'}, { 'script': 'super' }],
                            [{ 'blockquote': true }, 'code-block'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'indent': '-1'}, { 'indent': '+1' }],
                            [{ 'align': [] }],
                            ['link', 'image', 'video'],
                            ['clean']
                          ],
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700">Save Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
