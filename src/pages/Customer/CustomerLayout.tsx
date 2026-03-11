import React from 'react';
import { Outlet, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { ShoppingCart, Bell, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'sonner';

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
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {isCheckout && (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-400 hover:text-white">
              <ArrowLeft size={24} />
            </button>
          )}
          <Link to="/" className="text-xl font-bold text-yellow-500 tracking-tight">
            Ciğerci Apo <span className="text-red-600">Samsun</span>
          </Link>
        </div>
        <div className="flex gap-3 items-center">
          <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
            Masa: <span className="text-zinc-100 font-bold">{tableNumber}</span>
          </div>
          <button 
            onClick={handleCallWaiter}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-yellow-500 px-3 py-2 rounded-xl transition-colors text-sm font-medium border border-zinc-800"
          >
            <Bell size={18} />
            <span>Garson Çağır</span>
          </button>
        </div>
      </header>
      <main className="p-4 max-w-4xl mx-auto">
        <Outlet />
      </main>

      {/* Sticky Bottom Bar for Mobile-first feel */}
      {!isCheckout && cartItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent z-50">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate(tableId ? `/menu/${tableId}/checkout` : '/menu/checkout')}
              className="w-full bg-red-700 hover:bg-red-600 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-between px-6 shadow-[0_0_30px_rgba(185,28,28,0.3)] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-zinc-950 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                </div>
                <span>Sepeti Görüntüle</span>
              </div>
              <span>
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(
                  cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                )}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
