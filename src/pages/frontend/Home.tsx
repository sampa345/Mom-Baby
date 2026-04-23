import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Product, Category } from '../../types/database';
import AdBanner from '../../components/AdBanner';

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setErrorText(null);

      try {
        const productsRef = collection(db, 'products');
        const categoriesRef = collection(db, 'categories');
        
        const [productsSnapshot, categoriesSnapshot] = await Promise.all([
          getDocs(query(productsRef, orderBy('createdAt', 'desc'))),
          getDocs(query(categoriesRef, orderBy('name', 'asc')))
        ]);
        
        const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
        
        setProducts(productsData);
        setCategories(categoriesData);

      } catch (err: any) {
        console.error("Error fetching data:", err);
        setErrorText(err.message || "Network error connecting to database.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = 
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-rose-100 flex items-center justify-center min-h-[60vh] sm:min-h-[50vh] xl:min-h-[70vh] py-20">
        {/* Background Image with optimized scale and gradient */}
        <div className="absolute inset-0 z-0 bg-rose-50">
          <motion.img
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full object-cover object-center blur-[2px]"
            src="https://i.ibb.co/jkKn4KKC/pexels-polina-tankilevitch-3875130.jpg"
            alt="Mother and baby background inline"
          />
          {/* Lighter overlay with a subtle gradient to make text pop while keeping image beauty */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-white/30 backdrop-blur-[1px] mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-white/40 sm:bg-white/30 pb-20"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-black text-gray-900 tracking-tight drop-shadow-sm leading-[1.1]"
          >
            Curated <span className="text-rose-600 block sm:inline">Mom & Baby</span> Essentials
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mt-6 text-lg sm:text-xl lg:text-2xl text-gray-800 max-w-2xl mx-auto font-medium drop-shadow-sm px-2"
          >
            Discover the best reviewed, highest quality products for you and your little one. Hand-picked selections to make parenting beautiful.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex justify-center"
          >
            <a
              href="#products-section"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-200 bg-rose-600 border border-transparent rounded-full sm:text-lg hover:bg-rose-700 hover:shadow-xl hover:shadow-rose-400/30 overflow-hidden"
            >
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
              <span className="relative">Shop Collection</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Top Banner Ads */}
      <div className="w-full">
        <div className="hidden md:block">
          {/* Desktop Leaderboard Ad */}
          <AdBanner dataKey="1317666cec3dfda0dd4f886bd2f920ef" width={728} height={90} className="my-6" />
        </div>
        <div className="block md:hidden">
          {/* Mobile Standard Ad */}
          <AdBanner dataKey="1317666cec3dfda0dd4f886bd2f920ef" width={300} height={250} className="my-6" />
        </div>
      </div>

      <div id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-8 relative w-full lg:max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl leading-5 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-all"
            placeholder="Search products by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto pb-4 mb-8 space-x-2 hide-scrollbar">
          <button
            onClick={() => setActiveCategory('All')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'All' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.name ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {errorText && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl mb-8 flex flex-col items-center text-center">
            <h3 className="font-bold text-lg mb-2">Database Connection Error</h3>
            <p className="mb-4">{errorText}</p>
            <p className="text-sm opacity-80">Make sure your Firebase Firestore has products and categories collections.</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-64 w-full"></div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="mt-4 h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.flatMap((product, index) => {
                const productElement = (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    layout
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-rose-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100/50 flex items-center justify-center p-6 sm:p-8 overflow-hidden group/img">
                      {product.image_url ? (
                        <>
                          <img 
                            src={product.image_url} 
                            alt={product.title} 
                            loading="lazy"
                            decoding="async"
                            className={`absolute inset-0 w-full h-full p-6 sm:p-8 object-contain drop-shadow-md transition-all duration-500 group-hover/img:scale-110 ${product.image_url_2 ? 'group-hover/img:opacity-0' : ''}`} 
                          />
                          {product.image_url_2 && (
                            <img 
                              src={product.image_url_2} 
                              alt={`${product.title} alternate`} 
                              loading="lazy"
                              decoding="async"
                              className="absolute inset-0 w-full h-full p-6 sm:p-8 object-contain drop-shadow-md opacity-0 group-hover/img:opacity-100 group-hover/img:scale-110 transition-all duration-500" 
                            />
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400 font-medium">No image</span>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col bg-white border-t border-gray-50/50">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">{product.category}</span>
                        <div className="flex items-center text-yellow-500 bg-yellow-50/50 px-2 py-1 rounded-md">
                          <Star size={12} className="fill-current" />
                          <span className="ml-1.5 text-xs font-bold text-yellow-700">{product.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-rose-600 transition-colors">
                        <Link to={`/product/${generateSlug(product.title)}`} className="focus:outline-none">
                          <span className="absolute inset-0" aria-hidden="true" />
                          {product.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1 leading-relaxed">{product.description}</p>
                      
                      <div className="space-y-3 mt-auto relative z-20">
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
                            className="relative w-full overflow-hidden flex items-center justify-center py-3 px-4 rounded-xl shadow-md shadow-orange-200/50 text-sm font-bold text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:scale-[1.02] active:scale-95 transition-all group/btn"
                          >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></span>
                            <span className="relative flex items-center justify-center">
                              Buy on Amazon
                              <ExternalLink size={16} className="ml-2 opacity-90" />
                            </span>
                          </a>
                        )}
                        {product.direct_link && (
                          <a
                            href={product.direct_link}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full relative group/deal flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-[13px] sm:text-sm font-extrabold text-rose-700 bg-rose-50 border-2 border-dashed border-rose-300 hover:bg-rose-100/80 hover:border-rose-400 hover:shadow-md hover:shadow-rose-100 hover:scale-[1.02] active:scale-95 transition-all text-center leading-tight overflow-hidden"
                          >
                            <span className="text-base sm:text-lg group-hover/deal:scale-110 group-hover/deal:-rotate-12 transition-transform duration-300 relative z-10">🎁</span>
                            <span className="relative z-10">Reveal Secret Deal</span>
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-rose-200/30 to-transparent -translate-x-full group-hover/deal:animate-[shimmer_2s_infinite]"></div>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );

                const isAdRow = (index + 1) % 4 === 0 && index !== filteredProducts.length - 1;
                
                if (isAdRow) {
                  const adElement = (
                    <motion.div key={`ad-${product.id}`} layout className="col-span-1 sm:col-span-2 lg:col-span-4 w-full my-4 flex justify-center">
                       <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col items-center justify-center py-4 min-h-[120px]">
                           <span className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Sponsored</span>
                           <div id="container-82b0285a006a590e6a15f0e5ca6b6235" className="w-full flex justify-center"></div>
                           <script async data-cfasync="false" src="https://pl29234075.profitablecpmratenetwork.com/82b0285a006a590e6a15f0e5ca6b6235/invoke.js"></script>
                       </div>
                    </motion.div>
                  );
                  return [productElement, adElement];
                }

                return [productElement];
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
