import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Bell, ListOrdered, LogOut, QrCode } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const AdminLayout = () => {
  const { user, logout, calls, orders } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', roles: ['supervisor'] },
    { path: '/admin/orders', icon: <ListOrdered size={20} />, label: 'Siparişler', roles: ['supervisor', 'kitchen'] },
    { path: '/admin/menu', icon: <UtensilsCrossed size={20} />, label: 'Menü Yönetimi', roles: ['supervisor'] },
    { path: '/admin/tables', icon: <QrCode size={20} />, label: 'Masa & QR', roles: ['supervisor'] },
    { path: '/admin/calls', icon: <Bell size={20} />, label: 'Çağrılar', roles: ['supervisor'] },
  ];

  const activeNavItems = navItems.filter(item => item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const activeCallsCount = calls.filter(c => c.status === 'active').length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-bold text-yellow-500 tracking-tight">Ciğerci Apo</h1>
          <p className="text-xs text-zinc-400 mt-1">Yönetim Paneli - {user.role === 'supervisor' ? 'Süpervizör' : 'Mutfak'}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {activeNavItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                location.pathname === item.path 
                  ? 'bg-red-700 text-white font-medium' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {item.icon}
              {item.label}
              
              {/* Calls Badge */}
              {item.path === '/admin/calls' && activeCallsCount > 0 && (
                <span className="ml-auto bg-yellow-500 text-zinc-950 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {activeCallsCount}
                </span>
              )}

              {/* Orders Badge */}
              {item.path === '/admin/orders' && pendingOrdersCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  {pendingOrdersCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:bg-zinc-800 hover:text-red-500 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
};
