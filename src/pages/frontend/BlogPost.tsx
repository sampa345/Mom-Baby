import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import { motion } from 'motion/react';
import type { Blog } from '../../types/database';

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      if (!slug) return;
      setLoading(true);
      const snapshot = await getDocs(query(collection(db, 'blogs'), where('slug', '==', slug), limit(1)));
      if (!snapshot.empty) setBlog({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Blog);
      setLoading(false);
    }
    fetchBlog();
  }, [slug]);

  if (loading) return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-8"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-2xl w-full mb-10"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!blog) return <div className="text-center py-20 text-gray-500 flex flex-col items-center"><div className="text-4xl mb-4">😿</div><p>Article not found.</p><Link to="/blogs" className="text-rose-600 mt-4 underline">Return to blog</Link></div>;

  const createMarkup = (htmlContent: string) => {
    return {
      __html: DOMPurify.sanitize(htmlContent)
    };
  };

  // Helper check if the content looks like HTML (Quill) or raw Markdown (dummy script)
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(blog.content);

  return (
    <div className="bg-white min-h-screen py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <Link to="/blogs" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-rose-600 mb-8 transition-colors group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>
        
        <article>
          <header className="mb-10">
            <div className="flex items-center text-xs font-bold text-gray-400 mb-4 space-x-4">
              <span className="text-rose-500 px-2 py-1 bg-rose-50 rounded-md uppercase tracking-widest">{blog.category || 'Guides'}</span>
              <span>{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
              {blog.title}
            </h1>
            {blog.featured_image && (
              <motion.img 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                src={blog.featured_image} 
                alt={blog.title} 
                className="w-full h-auto rounded-3xl shadow-sm object-cover max-h-[500px]" 
              />
            )}
          </header>

          <div className="prose prose-rose prose-lg max-w-none text-gray-700 
            prose-headings:font-bold prose-headings:text-gray-900
            prose-a:text-rose-600 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl">
            {isHtml ? (
               <div dangerouslySetInnerHTML={createMarkup(blog.content)} />
            ) : (
               blog.content.split('\n').map((paragraph, index) => {
                if (!paragraph.trim()) return <br key={index} />;
                if (paragraph.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900">{paragraph.replace('## ', '')}</h2>;
                if (paragraph.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold mt-10 mb-6 text-gray-900">{paragraph.replace('# ', '')}</h1>;
                if (paragraph.startsWith('- ')) return <li key={index} className="ml-4 list-disc">{paragraph.replace('- ', '')}</li>;
                return <p key={index} className="mb-6 leading-relaxed">{paragraph}</p>;
              })
            )}
          </div>
        </article>
      </motion.div>
    </div>
  );
}
