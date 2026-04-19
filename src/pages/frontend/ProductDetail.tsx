import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Star, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import type { Product } from '../../types/database';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
            <div className="bg-gray-200 rounded-xl h-96"></div>
            <div className="flex flex-col justify-center">
              <div className="h-6 bg-gray-200 rounded-full w-24 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-2/3 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
              <div className="space-y-4 mb-8">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
              <div className="h-14 bg-gray-200 rounded-lg w-48"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!product) return <div className="text-center py-20 text-gray-500 font-medium text-lg">Product not found. <br/><Link to="/" className="text-rose-600 underline mt-4 inline-block">Return home</Link></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-rose-600 mb-8 transition-colors group">
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center bg-gray-50/50 rounded-2xl p-8 lg:p-12 relative overflow-hidden"
          >
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.title} 
                loading="eager"
                decoding="async"
                className="max-w-full h-auto object-contain max-h-[500px]" 
              />
            ) : (
              <span className="text-gray-400">No image available</span>
            )}
          </motion.div>
          
          <div className="flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest rounded-md w-max mb-6">
              {product.category || 'Uncategorized'}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center mb-8 bg-yellow-50 w-max px-3 py-1.5 rounded-lg">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < (product.rating || 0) ? "fill-current" : "text-gray-300"} />
                ))}
              </div>
              <span className="ml-3 text-sm font-bold text-yellow-700">{product.rating} / 5.0</span>
            </div>

            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {product.affiliate_link && (
                <a
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center py-4 px-8 rounded-xl shadow-sm text-base font-semibold text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-all transform hover:-translate-y-0.5 hover:shadow-md"
                >
                  Buy on Amazon
                  <ExternalLink size={20} className="ml-2 opacity-80" />
                </a>
              )}
              {product.direct_link && (
                <a
                  href={product.direct_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center py-4 px-8 rounded-xl text-base font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  Claim Exclusive Offer
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
