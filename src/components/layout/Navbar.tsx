import { Link } from 'react-router-dom';
import { Baby } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-rose-100/50 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Baby className="h-8 w-8 text-rose-500" />
            <span className="text-xl font-bold text-gray-900 font-sans tracking-tight">Mom & Baby</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-rose-500 font-medium transition-colors">Products</Link>
            <Link to="/blogs" className="text-gray-600 hover:text-rose-500 font-medium transition-colors">Blog</Link>
          </div>
          
          <div className="md:hidden">
            {/* Mobile menu could go here */}
          </div>
        </div>
      </div>
    </nav>
  );
}
