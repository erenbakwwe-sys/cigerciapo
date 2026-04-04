import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { Wallet, TrendingUp, CreditCard, Banknote, Receipt } from 'lucide-react';

export const Finance = () => {
  const { orders } = useAppContext();

  // Sadece teslim edilmiş siparişleri hesaba kat
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  const stats = useMemo(() => {
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
    const cashRevenue = deliveredOrders.filter(o => o.paymentMethod === 'cash').reduce((sum, order) => sum + order.total, 0);
    const cardRevenue = deliveredOrders.filter(o => o.paymentMethod === 'card' || o.paymentMethod === 'pos').reduce((sum, order) => sum + order.total, 0);
    
    return {
      totalRevenue,
      cashRevenue,
      cardRevenue,
      totalOrders: deliveredOrders.length
    };
  }, [deliveredOrders]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-100">Finansal Durum</h1>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <h3 className="text-zinc-400 font-medium">Toplam Ciro</h3>
          </div>
          <p className="text-3xl font-bold text-zinc-100">{formatCurrency(stats.totalRevenue)}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center">
              <Banknote className="text-yellow-500" size={24} />
            </div>
            <h3 className="text-zinc-400 font-medium">Nakit Gelir</h3>
          </div>
          <p className="text-3xl font-bold text-zinc-100">{formatCurrency(stats.cashRevenue)}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <CreditCard className="text-blue-500" size={24} />
            </div>
            <h3 className="text-zinc-400 font-medium">Kart/POS Geliri</h3>
          </div>
          <p className="text-3xl font-bold text-zinc-100">{formatCurrency(stats.cardRevenue)}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
              <Receipt className="text-purple-500" size={24} />
            </div>
            <h3 className="text-zinc-400 font-medium">Tamamlanan Sipariş</h3>
          </div>
          <p className="text-3xl font-bold text-zinc-100">{stats.totalOrders} <span className="text-sm text-zinc-500 font-normal">adet</span></p>
        </motion.div>
      </motion.div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <h2 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
          <Wallet className="text-yellow-500" />
          Son Finansal İşlemler
        </h2>
        
        <div className="space-y-4">
          {deliveredOrders.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">Henüz finansal işlem bulunmuyor.</p>
          ) : (
            deliveredOrders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10).map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    order.paymentMethod === 'cash' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {order.paymentMethod === 'cash' ? <Banknote size={20} /> : <CreditCard size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-200">Masa {order.table}</p>
                    <p className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleString('tr-TR')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-500">+{formatCurrency(order.total)}</p>
                  <p className="text-xs text-zinc-500">{order.paymentMethod === 'cash' ? 'Nakit' : 'Kredi Kartı'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};
