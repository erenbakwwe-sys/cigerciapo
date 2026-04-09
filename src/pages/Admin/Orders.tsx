import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, ChefHat, PackageCheck } from 'lucide-react';
import { useAppContext, Order } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { toast } from 'sonner';

export const Orders = () => {
  const { orders, updateOrderStatus, user } = useAppContext();

  // Play sound on new order
  useEffect(() => {
    const pendingOrders = orders.filter(o => o.status === 'pending');
    if (pendingOrders.length > 0) {
      const newestOrder = pendingOrders.reduce((prev, current) => (prev.createdAt > current.createdAt) ? prev : current);
      if (Date.now() - newestOrder.createdAt < 5000) {
        toast.info(`Masa ${newestOrder.table} yeni sipariş verdi!`, {
          icon: '🛎️',
          duration: 5000,
        });
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2866/2866-preview.mp3'); // Beep sound
          audio.play().catch(e => console.log('Audio play prevented', e));
        } catch (e) {}
      }
    }
  }, [orders]);

  const handleStatusChange = (id: string, currentStatus: Order['status']) => {
    let nextStatus: Order['status'] = 'pending';
    if (currentStatus === 'pending') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'ready';
    else if (currentStatus === 'ready') nextStatus = 'delivered';
    else return;

    updateOrderStatus(id, nextStatus);
    toast.success(`Sipariş durumu güncellendi: ${nextStatus.toUpperCase()}`);
  };

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'awaiting_payment');
  const pastOrders = orders.filter(o => o.status === 'delivered').slice(0, 10);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
      case 'preparing': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'ready': return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'delivered': return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock size={18} />;
      case 'preparing': return <ChefHat size={18} />;
      case 'ready': return <PackageCheck size={18} />;
      case 'delivered': return <CheckCircle2 size={18} />;
    }
  };

  const getNextActionLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Hazırlanıyor İşaretle';
      case 'preparing': return 'Hazır İşaretle';
      case 'ready': return 'Teslim Edildi İşaretle';
      default: return '';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold text-zinc-100">Siparişler</h1>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          Aktif Siparişler ({activeOrders.length})
        </h2>
        
        {activeOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500"
          >
            Şu an aktif sipariş bulunmuyor.
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {activeOrders.map(order => {
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                const elapsedMinutes = Math.floor((Date.now() - order.createdAt) / 60000);

                return (
                  <motion.div 
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    key={order.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-700 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-[0_0_10px_rgba(185,28,28,0.3)]">
                          {order.table}
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400">Masa</p>
                          <p className="font-bold text-zinc-100">{elapsedMinutes} dk önce</p>
                        </div>
                      </div>
                      <motion.div 
                        key={order.status}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 text-sm font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.toUpperCase()}
                      </motion.div>
                    </div>
                    
                    <div className="p-4 flex-1 overflow-y-auto max-h-60 space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <span className="font-bold text-yellow-500">{item.quantity}x</span>
                            <div>
                              <p className="font-medium text-zinc-200">{item.name}</p>
                              {item.description && <p className="text-xs text-zinc-500 line-clamp-1">{item.description}</p>}
                            </div>
                          </div>
                          <span className="text-zinc-400 text-sm">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t border-zinc-800 bg-zinc-950/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-zinc-400">Toplam ({totalItems} ürün)</span>
                        <span className="text-xl font-bold text-yellow-500">{formatCurrency(order.total)}</span>
                      </div>
                      
                      {order.paymentMethod && (
                        <div className="flex justify-between items-center mb-4 text-sm">
                          <span className="text-zinc-500">Ödeme Yöntemi:</span>
                          <span className="text-zinc-300 font-medium bg-zinc-800 px-2 py-1 rounded">
                            {order.paymentMethod === 'card' ? 'Kredi Kartı' : order.paymentMethod === 'pos' ? 'Fiziksel POS' : 'Nakit'}
                          </span>
                        </div>
                      )}
                      
                      {order.status !== 'delivered' && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleStatusChange(order.id, order.status)}
                          className={`w-full py-3 rounded-xl font-bold transition-colors ${
                            order.status === 'pending' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' :
                            order.status === 'preparing' ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.3)]' :
                            'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
                          }`}
                        >
                          {getNextActionLabel(order.status)}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {user?.role === 'supervisor' && pastOrders.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6 pt-8 border-t border-zinc-800"
        >
          <h2 className="text-xl font-bold text-zinc-400">Geçmiş Siparişler</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-sm bg-zinc-950/50">
                  <th className="p-4 font-medium">Masa</th>
                  <th className="p-4 font-medium">İçerik</th>
                  <th className="p-4 font-medium">Ödeme</th>
                  <th className="p-4 font-medium">Tutar</th>
                  <th className="p-4 font-medium">Zaman</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {pastOrders.map(order => (
                  <motion.tr 
                    variants={itemVariants}
                    key={order.id} 
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors"
                  >
                    <td className="p-4 font-medium text-zinc-300">Masa {order.table}</td>
                    <td className="p-4 text-zinc-400 text-sm">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="p-4 text-zinc-400 text-sm">
                      {order.paymentMethod === 'card' ? 'Kredi Kartı' : order.paymentMethod === 'pos' ? 'Fiziksel POS' : order.paymentMethod === 'cash' ? 'Nakit' : '-'}
                    </td>
                    <td className="p-4 text-zinc-300 font-medium">{formatCurrency(order.total)}</td>
                    <td className="p-4 text-zinc-500 text-sm">
                      {new Date(order.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
