import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ShoppingBag, FileText, Tags } from 'lucide-react';

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[24px] mb-[32px]">
          {statCards.map((stat) => {
            return (
              <div key={stat.name} className="bg-white p-[20px] rounded-[12px] border border-gray-200">
                <div className="text-[0.75rem] uppercase tracking-[0.05em] text-gray-500 mb-2">{stat.name}</div>
                <div className="text-[1.75rem] font-bold text-gray-800">{stat.value}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
