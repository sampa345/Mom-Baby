import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import type { Blog } from '../../types/database';

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      if (!slug) return;
      setLoading(true);
      const { data } = await supabase.from('blogs').select('*').eq('slug', slug).single();
      if (data) setBlog(data);
      setLoading(false);
    }
    fetchBlog();
  }, [slug]);

  if (loading) return <div className="text-center py-20">Loading article...</div>;
  if (!blog) return <div className="text-center py-20 text-gray-500">Article not found.</div>;

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blogs" className="inline-flex items-center text-sm text-gray-500 hover:text-rose-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Blog
        </Link>
        
        <article>
          <header className="mb-10">
            <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
              <span className="text-rose-600 font-semibold uppercase tracking-wider">{blog.category || 'Guides'}</span>
              <span>{format(new Date(blog.created_at), 'MMMM d, yyyy')}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
              {blog.title}
            </h1>
            {blog.featured_image && (
              <img src={blog.featured_image} alt={blog.title} className="w-full h-auto rounded-2xl shadow-sm object-cover max-h-[500px]" />
            )}
          </header>

          <div className="prose prose-rose prose-lg max-w-none text-gray-700">
            {/* Very basic Markdown parser matching standard requirements. Use react-markdown if deeper support needed. */}
            {blog.content.split('\n').map((paragraph, index) => {
              if (!paragraph.trim()) return <br key={index} />;
              if (paragraph.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900">{paragraph.replace('## ', '')}</h2>;
              if (paragraph.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold mt-10 mb-6 text-gray-900">{paragraph.replace('# ', '')}</h1>;
              if (paragraph.startsWith('- ')) return <li key={index} className="ml-4 list-disc">{paragraph.replace('- ', '')}</li>;
              return <p key={index} className="mb-6 leading-relaxed">{paragraph}</p>;
            })}
          </div>
        </article>
      </div>
    </div>
  );
}
