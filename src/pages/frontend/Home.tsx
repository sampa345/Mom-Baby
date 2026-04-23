import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
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
        const [productsData, categoriesData] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('name')
        ]);
        
        if (productsData.error) {
          console.error("Products error:", productsData.error);
          setErrorText("Failed to load products. Check your Supabase configuration.");
        } else if (productsData.data) {
          setProducts(productsData.data);
        }

        if (categoriesData.error) {
          console.error("Categories error:", categoriesData.error);
        } else if (categoriesData.data) {
          setCategories(categoriesData.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setErrorText("Network error connecting to database.");
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
      <div className="bg-rose-50 border-b border-rose-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Curated <span className="text-rose-600">Mom & Baby</span> Essentials
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the best reviewed, highest quality products for you and your little one.
          </p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            <h3 className="font-bold text-lg mb-2">Supabase Connection Error</h3>
            <p className="mb-4">{errorText}</p>
            <p className="text-sm opacity-80">Make sure you have added VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Netlify Environment Variables!</p>
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
              {filteredProducts.map((product) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  layout
                  key={product.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  <div className="aspect-w-1 aspect-h-1 w-full bg-gray-50/50 flex items-center justify-center p-6 h-64 overflow-hidden relative group/img">
                    {product.image_url ? (
                      <>
                        <img 
                          src={product.image_url} 
                          alt={product.title} 
                          loading="lazy"
                          decoding="async"
                          className={`absolute p-6 object-contain h-full w-full inset-0 transition-opacity duration-500 group-hover/img:scale-105 ${product.image_url_2 ? 'group-hover/img:opacity-0' : ''}`} 
                        />
                        {product.image_url_2 && (
                          <img 
                            src={product.image_url_2} 
                            alt={`${product.title} alternate`} 
                            loading="lazy"
                            decoding="async"
                            className="absolute p-6 object-contain h-full w-full inset-0 opacity-0 group-hover/img:opacity-100 group-hover/img:scale-105 transition-opacity duration-500" 
                          />
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-transparent to-white border-t border-gray-50/50">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-md">{product.category}</span>
                      <div className="flex items-center text-yellow-400 bg-yellow-50 px-2 py-1 rounded-md">
                        <Star size={12} className="fill-current" />
                        <span className="ml-1 text-xs font-bold text-yellow-700">{product.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                      <Link to={`/product/${product.id}/${generateSlug(product.title)}`} className="hover:text-rose-600 transition-colors">
                        {product.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1 leading-relaxed">{product.description}</p>
                    
                    <div className="space-y-2 mt-auto">
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
                          className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-all transform hover:shadow-md"
                        >
                          Buy on Amazon
                          <ExternalLink size={16} className="ml-2 opacity-80" />
                        </a>
                      )}
                      {product.direct_link && (
                        <a
                          href={product.direct_link}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
                        >
                          🎁 Reveal Today's Secret Deal
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
