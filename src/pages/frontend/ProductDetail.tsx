import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Star, ArrowLeft } from 'lucide-react';
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

  if (loading) return <div className="text-center py-20">Loading product...</div>;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-rose-600 mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        Back to Products
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-8">
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} className="max-w-full h-auto object-contain max-h-[500px]" />
            ) : (
              <span className="text-gray-400">No image available</span>
            )}
          </div>
          
          <div className="flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 text-sm font-semibold rounded-full w-max mb-4">
              {product.category || 'Uncategorized'}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              {product.title}
            </h1>
            
            <div className="flex items-center text-yellow-400 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className={i < (product.rating || 0) ? "fill-current" : "text-gray-300"} />
              ))}
              <span className="ml-2 text-sm font-medium text-gray-600">{product.rating} / 5.0</span>
            </div>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4">
              {product.affiliate_link && (
                <a
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center py-4 px-8 border border-transparent rounded-lg shadow text-base font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                >
                  Buy on Amazon
                  <ExternalLink size={20} className="ml-2" />
                </a>
              )}
              {product.direct_link && (
                <a
                  href={product.direct_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center py-4 px-8 border-2 border-rose-200 rounded-lg shadow-sm text-base font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  Claim Exclusive Offer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
