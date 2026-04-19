import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, Search } from 'lucide-react';
import type { Product, Category } from '../../types/database';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const [productsData, categoriesData] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('name')
        ]);
        
        if (productsData.error) {
          console.error("Products error:", productsData.error);
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">Loading amazing products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="aspect-w-1 aspect-h-1 w-full bg-gray-50 flex items-center justify-center p-4 h-64">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.title} className="object-contain h-full w-full" />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider">{product.category}</span>
                    <div className="flex items-center text-yellow-400">
                      <Star size={14} className="fill-current" />
                      <span className="ml-1 text-xs font-medium text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    <Link to={`/product/${product.id}`} className="hover:text-rose-600 transition-colors">
                      {product.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{product.description}</p>
                  
                  <div className="space-y-2 mt-auto">
                    {product.affiliate_link && (
                      <a
                        href={product.affiliate_link}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                      >
                        Buy on Amazon
                        <ExternalLink size={16} className="ml-2" />
                      </a>
                    )}
                    {product.direct_link && (
                      <a
                        href={product.direct_link}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center py-2 px-4 border border-rose-200 rounded-md shadow-sm text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                      >
                        Exclusive Offer
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
