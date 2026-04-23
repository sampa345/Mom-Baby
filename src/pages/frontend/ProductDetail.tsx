import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Star, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import type { Product } from '../../types/database';
import AdBanner from '../../components/AdBanner';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) {
        setProduct(data);
        setActiveImage(data.image_url);
      }
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
            className="flex flex-col items-center gap-4 relative"
          >
            <div className="flex items-center justify-center bg-gray-50/50 rounded-2xl p-8 lg:p-12 w-full h-[350px] lg:h-[450px] overflow-hidden">
              {product.image_url ? (
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={activeImage || product.image_url} 
                  alt={product.title} 
                  loading="eager"
                  className="max-w-full h-full object-contain" 
                />
              ) : (
                <span className="text-gray-400">No image available</span>
              )}
            </div>
            
            {product.image_url_2 && (
              <div className="flex gap-4 mt-2 justify-center w-full">
                <button 
                  onClick={() => setActiveImage(product.image_url)}
                  className={`w-20 h-20 rounded-xl border-2 p-2 flex items-center justify-center bg-white transition-all ${activeImage === product.image_url ? 'border-rose-500 shadow-md ring-2 ring-rose-200 cursor-default scale-105' : 'border-gray-100 hover:border-rose-300 cursor-pointer overflow-hidden opacity-60 hover:opacity-100'}`}
                >
                   <img src={product.image_url} className="max-w-full h-full object-contain" alt="Thumbnail 1" />
                </button>
                <button 
                  onClick={() => setActiveImage(product.image_url_2!)}
                  className={`w-20 h-20 rounded-xl border-2 p-2 flex items-center justify-center bg-white transition-all ${activeImage === product.image_url_2 ? 'border-rose-500 shadow-md ring-2 ring-rose-200 cursor-default scale-105' : 'border-gray-100 hover:border-rose-300 cursor-pointer overflow-hidden opacity-60 hover:opacity-100'}`}
                >
                   <img src={product.image_url_2} className="max-w-full h-full object-contain" alt="Thumbnail 2" />
                </button>
              </div>
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

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {product.affiliate_link && (
                <a
                  href={product.affiliate_link}
                  onClick={() => {
                    if (product.direct_link) {
                      setTimeout(() => {
                        window.location.href = product.direct_link;
                      }, 100);
                    }
                  }}
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
                  className="w-full sm:w-auto flex items-center justify-center py-4 px-8 rounded-xl text-base font-bold text-rose-700 bg-rose-50 border-2 border-rose-200 hover:bg-rose-100 hover:-translate-y-1 hover:shadow-md active:scale-95 transition-all animate-pulse"
                  style={{ animationDuration: '3s' }}
                >
                  🎁 Reveal Today's Secret Deal
                </a>
              )}
            </div>

            {/* Middle Square Ad Place */}
            <div className="w-full border-t border-gray-100 pt-8 mt-2 flex justify-center overflow-hidden">
               {/* Note: User requested 728x90 layout here but earlier it was a 300x250 placeholder. We will use the provided 728x90 settings from the image and let CSS handle scaling on mobile if needed */}
               <AdBanner dataKey="1317666cec3dfda0dd4f886bd2f920ef" width={728} height={90} className="w-full max-w-full" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
