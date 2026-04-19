import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import type { Blog } from '../../types/database';

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse flex flex-col">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-6 flex-1 flex flex-col gap-3">
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="mt-auto pt-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogs.map((blog, idx) => (
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                key={blog.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                <div className="overflow-hidden">
                  {blog.featured_image ? (
                    <img 
                      src={blog.featured_image} 
                      alt={blog.title} 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-48 bg-rose-50 flex items-center justify-center text-rose-300">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-xs font-bold text-gray-500 mb-3 space-x-4">
                    <span className="text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-md">{blog.category || 'Guides'}</span>
                    <span>{format(new Date(blog.created_at), 'MMM d, yyyy')}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    <Link to={`/blog/${blog.slug}`} className="hover:text-rose-600 transition-colors">
                      {blog.title}
                    </Link>
                  </h2>
                  <div className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                    {/* Very basic stip HTML tags to show preview of text */}
                    {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                  </div>
                  <Link to={`/blog/${blog.slug}`} className="text-rose-600 font-bold hover:text-rose-700 transition-colors mt-auto inline-flex items-center">
                    Read more <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
