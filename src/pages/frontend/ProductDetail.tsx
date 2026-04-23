import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Star, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import type { Product } from '../../types/database';
import AdBanner from '../../components/AdBanner';

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        const matchedProduct = productsData.find(p => generateSlug(p.title) === slug);
        
        if (matchedProduct) {
          setProduct(matchedProduct);
          setActiveImage(matchedProduct.image_url);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
            <div className="bg-gray-200 rounded-2xl h-96"></div>
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
              <div className="h-16 bg-gray-200 rounded-2xl w-full sm:w-64"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!product) return <div className="text-center py-20 text-gray-500 font-medium text-lg">Product not found. <br/><Link to="/" className="text-rose-600 underline mt-4 inline-block">Return home</Link></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12 relative">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-rose-600 mb-6 sm:mb-8 transition-colors group">
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-[2rem] shadow-xl shadow-rose-900/5 sm:border border-gray-100 overflow-hidden relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-6 relative lg:col-span-5"
          >
            <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-[2rem] p-8 lg:p-12 w-full aspect-square xl:aspect-auto xl:h-[500px] overflow-hidden group">
              {product.image_url ? (
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={activeImage || product.image_url} 
                  alt={product.title} 
                  loading="eager"
                  className="max-w-full h-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105" 
                />
              ) : (
                <span className="text-gray-400 font-medium">No image available</span>
              )}
            </div>
            
            {product.image_url_2 && (
              <div className="flex gap-4 mt-2 justify-center w-full px-4">
                <button 
                  onClick={() => setActiveImage(product.image_url)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 p-3 flex items-center justify-center bg-white transition-all duration-300 ${activeImage === product.image_url ? 'border-rose-500 shadow-lg ring-4 ring-rose-50 scale-105 cursor-default' : 'border-gray-100 hover:border-rose-300 hover:shadow-md cursor-pointer opacity-70 hover:opacity-100 hover:-translate-y-1'}`}
                >
                   <img src={product.image_url} className="max-w-full h-full object-contain drop-shadow-sm" alt="Main view Thumbnail" />
                </button>
                <button 
                  onClick={() => setActiveImage(product.image_url_2!)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 p-3 flex items-center justify-center bg-white transition-all duration-300 ${activeImage === product.image_url_2 ? 'border-rose-500 shadow-lg ring-4 ring-rose-50 scale-105 cursor-default' : 'border-gray-100 hover:border-rose-300 hover:shadow-md cursor-pointer opacity-70 hover:opacity-100 hover:-translate-y-1'}`}
                >
                   <img src={product.image_url_2} className="max-w-full h-full object-contain drop-shadow-sm" alt="Alternate view Thumbnail" />
                </button>
              </div>
            )}
          </motion.div>
          
          <div className="flex flex-col justify-center lg:col-span-7 pt-4 lg:pt-0">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center px-3.5 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-extrabold uppercase tracking-widest rounded-full">
                {product.category || 'Uncategorized'}
              </span>
              <div className="flex items-center bg-yellow-50/80 px-3 py-1.5 rounded-full border border-yellow-100/50">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < (product.rating || 0) ? "fill-current" : "text-gray-300"} />
                  ))}
                </div>
                <span className="ml-2 text-xs font-black text-yellow-700">{product.rating} / 5.0</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-[1.15]">
              {product.title}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed font-medium">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full">
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
                  className="relative w-full sm:w-auto overflow-hidden flex items-center justify-center py-4 px-10 rounded-2xl shadow-xl shadow-orange-200/60 text-[15px] sm:text-base font-extrabold text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:scale-105 active:scale-95 transition-all group/btn"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></span>
                  <span className="relative flex items-center justify-center tracking-wide">
                    Buy on Amazon
                    <ExternalLink size={20} className="ml-2.5 opacity-90" />
                  </span>
                </a>
              )}
              {product.direct_link && (
                <a
                  href={product.direct_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto relative group/deal flex flex-wrap items-center justify-center gap-3 py-4 px-8 rounded-2xl text-[15px] sm:text-[17px] font-black text-rose-700 bg-rose-50 border-2 border-dashed border-rose-300 hover:bg-rose-100/90 hover:border-rose-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/50 active:scale-95 transition-all overflow-hidden"
                >
                  <span className="text-2xl sm:text-3xl group-hover/deal:scale-110 group-hover/deal:-rotate-12 transition-transform duration-300 relative z-10 drop-shadow-sm">🎁</span>
                  <span className="tracking-wide relative z-10 pt-0.5">Reveal Today's Secret Deal</span>
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-rose-200/30 to-transparent -translate-x-full group-hover/deal:animate-[shimmer_2s_infinite]"></div>
                </a>
              )}
            </div>

            {/* Middle Square Ad Place */}
            <div className="w-full border-t border-gray-100 pt-8 mt-auto flex justify-center overflow-hidden">
               {/* Native/Banner ad spot */}
               <AdBanner dataKey="1317666cec3dfda0dd4f886bd2f920ef" width={728} height={90} className="w-full max-w-full rounded-xl overflow-hidden shadow-sm border border-gray-50" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

