import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ShoppingBag, FileText, Tags, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, blogs: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [
          { count: productsCount },
          { count: blogsCount },
          { count: categoriesCount }
        ] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('blogs').select('*', { count: 'exact', head: true }),
          supabase.from('categories').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          products: productsCount || 0,
          blogs: blogsCount || 0,
          categories: categoriesCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Products', value: stats.products, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { name: 'Total Blogs', value: stats.blogs, icon: FileText, color: 'bg-green-50 text-green-600' },
    { name: 'Categories', value: stats.categories, icon: Tags, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div>
      {/* Removed local h1 since AdminLayout handles it */}
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[24px] mb-[32px]">
            {statCards.map((stat) => {
              return (
                <div key={stat.name} className="bg-white p-[20px] rounded-[12px] border border-gray-200 shadow-sm">
                  <div className="text-[0.75rem] uppercase tracking-[0.05em] text-gray-500 mb-2 font-medium">{stat.name}</div>
                  <div className="text-[1.75rem] font-bold text-gray-800">{stat.value}</div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-[12px] border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/admin/products"
                className="flex items-center justify-center gap-2 p-4 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-medium transition-colors"
                state={{ openModal: true }}
              >
                <PlusCircle size={20} />
                <span>Add New Product</span>
              </Link>
              
              <Link 
                to="/admin/blogs"
                className="flex items-center justify-center gap-2 p-4 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors"
                state={{ openModal: true }}
              >
                <PlusCircle size={20} />
                <span>Create Blog Post</span>
              </Link>
              
              <Link 
                to="/admin/categories"
                className="flex items-center justify-center gap-2 p-4 border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-medium transition-colors"
                state={{ openModal: true }}
              >
                <PlusCircle size={20} />
                <span>Add Category</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
