import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { Blog } from '../../types/database';

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);

      if (import.meta.env.VITE_SUPABASE_URL === 'your-supabase-project-url' || !import.meta.env.VITE_SUPABASE_URL) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
        if (error) {
          console.error("Blogs error:", error);
        } else if (data) {
          setBlogs(data);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Parenting Insights & Guides</h1>
          <p className="mt-4 text-xl text-gray-600">Expert tips, reviews, and stories for modern parents.</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading articles...</div>
        ) : (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'your-supabase-project-url') ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-800">
            <h3 className="text-lg font-bold mb-2">Supabase Connection Required</h3>
            <p>Your blog posts will appear here once you follow the instructions in the <strong>Setup Guide</strong> to link your Supabase database in Settings &gt; Secrets.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article key={blog.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                {blog.featured_image ? (
                  <img src={blog.featured_image} alt={blog.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-rose-50 flex items-center justify-center text-rose-300">
                    No image
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                    <span className="text-rose-600 font-semibold uppercase tracking-wider">{blog.category || 'Guides'}</span>
                    <span>{format(new Date(blog.created_at), 'MMM d, yyyy')}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link to={`/blog/${blog.slug}`} className="hover:text-rose-600 transition-colors">
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 line-clamp-3 mb-4 flex-1">
                    {blog.content.substring(0, 150)}...
                  </p>
                  <Link to={`/blog/${blog.slug}`} className="text-rose-600 font-medium hover:text-rose-700 transition-colors mt-auto">
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
