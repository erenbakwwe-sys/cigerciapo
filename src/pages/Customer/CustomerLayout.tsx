import React from 'react';
import { Outlet, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { ShoppingCart, Bell, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerLayout = () => {
  const { cart, callWaiter } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { tableId } = useParams();
  const tableNumber = tableId || 'Misafir';

  const handleCallWaiter = () => {
    if (tableNumber === 'Misafir') {
      toast.error('Masada değilsiniz. Lütfen QR kodu okutun.');
      return;
    }
    callWaiter(tableNumber);
    toast.success('Garson yolda!', { icon: '🔔' });
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isCheckout = location.pathname.includes('checkout');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-24">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 p-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => isCheckout ? navigate(-1) : navigate('/')} 
            className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <Link to="/" className="text-xl font-bold text-yellow-500 tracking-tight">
            Ciğerci Apo <span className="text-red-600">Samsun</span>
          </Link>
        </div>
        <div className="flex gap-3 items-center">
          <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
            Masa: <span className="text-zinc-100 font-bold">{tableNumber}</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCallWaiter}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-yellow-500 px-3 py-2 rounded-xl transition-colors text-sm font-medium border border-zinc-800"
          >
            <Bell size={18} />
            <span>Garson Çağır</span>
          </motion.button>
        </div>
      </motion.header>
      <main className="p-4 max-w-4xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sticky Bottom Bar for Mobile-first feel */}
      <AnimatePresence>
        {!isCheckout && cartItemCount > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent z-50"
          >
            <div className="max-w-4xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(tableId ? `/menu/${tableId}/checkout` : '/menu/checkout')}
                className="w-full bg-red-700 hover:bg-red-600 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-between px-6 shadow-[0_0_30px_rgba(185,28,28,0.3)] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ShoppingCart size={24} />
                    <motion.span 
                      key={cartItemCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="absolute -top-2 -right-2 bg-yellow-500 text-zinc-950 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                    >
                      {cartItemCount}
                    </motion.span>
                  </div>
                  <span>Sepeti Görüntüle</span>
                </div>
                <span>
                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(
                    cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                  )}
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
