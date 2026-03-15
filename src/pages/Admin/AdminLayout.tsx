import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Bell, ListOrdered, LogOut, QrCode, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

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
    { path: '/admin/calls', icon: <Bell size={20} />, label: 'Çağrılar', roles: ['supervisor', 'kitchen'] },
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
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col z-10"
      >
        <div className="p-6 border-b border-zinc-800 relative">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Ana Sayfaya Dön"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <h1 className="text-xl font-bold text-yellow-500 tracking-tight pr-8">Ciğerci Apo</h1>
          <p className="text-xs text-zinc-400 mt-1">Yönetim Paneli - {user.role === 'supervisor' ? 'Süpervizör' : 'Mutfak'}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {activeNavItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
            >
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-red-700 text-white font-medium shadow-md' 
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                {item.icon}
                {item.label}
                
                {/* Calls Badge */}
                <AnimatePresence>
                  {item.path === '/admin/calls' && activeCallsCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="ml-auto bg-yellow-500 text-zinc-950 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse"
                    >
                      {activeCallsCount}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Orders Badge */}
                <AnimatePresence>
                  {item.path === '/admin/orders' && pendingOrdersCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    >
                      {pendingOrdersCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <motion.button 
            whileHover={{ x: 4, color: '#ef4444' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            Çıkış Yap
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
