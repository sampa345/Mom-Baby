import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, ShoppingBag, FileText, Tags, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center font-sans">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Blogs', path: '/admin/blogs', icon: FileText },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-[260px] bg-white border-r border-gray-200 flex flex-col pt-6 pb-6 px-6">
        <div className="flex items-center gap-3 mb-[40px]">
          <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold leading-none">M</div>
          <span className="text-[1.25rem] font-bold text-rose-500 tracking-[-0.02em]">Mom & Baby</span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg text-[0.95rem] font-medium transition-colors ${
                  isActive 
                    ? 'bg-rose-50 text-rose-500' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button
            onClick={signOut}
            className="flex items-center w-full px-4 py-3 rounded-lg text-[0.95rem] font-medium text-gray-500 hover:text-red-700 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen">
        <header className="h-[72px] px-10 flex items-center justify-between border-b border-gray-200 bg-white shadow-sm shrink-0">
          <h1 className="text-[1.5rem] font-semibold text-gray-800 m-0">Admin Console</h1>
          <div className="flex items-center gap-[10px] py-[6px] px-[12px] border border-gray-200 rounded-full text-[0.85rem] font-medium text-gray-800">
            <div className="w-6 h-6 rounded-full bg-rose-200"></div>
            <span>Admin User</span>
          </div>
        </header>
        <div className="p-10 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
