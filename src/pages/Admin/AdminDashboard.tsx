import React from 'react';
import { motion } from 'motion/react';
import { Users, DollarSign, ShoppingBag, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';

export const AdminDashboard = () => {
  const { orders, calls } = useAppContext();

  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const totalRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const activeCalls = calls.filter(c => c.status === 'active').length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;

  const stats = [
    { label: 'Bugünkü Ciro', value: formatCurrency(totalRevenue), icon: <DollarSign size={24} className="text-yellow-500" /> },
    { label: 'Bugünkü Sipariş', value: todayOrders.length, icon: <ShoppingBag size={24} className="text-blue-500" /> },
    { label: 'Bekleyen Sipariş', value: pendingOrders, icon: <Clock size={24} className="text-orange-500" /> },
    { label: 'Aktif Çağrı', value: activeCalls, icon: <Users size={24} className="text-red-500" /> },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4"
          >
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-zinc-400">{stat.label}</p>
              <p className="text-2xl font-bold text-zinc-100">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-zinc-100 mb-4">Son Siparişler</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
                <th className="pb-3 font-medium">Masa</th>
                <th className="pb-3 font-medium">Tutar</th>
                <th className="pb-3 font-medium">Ödeme</th>
                <th className="pb-3 font-medium">Durum</th>
                <th className="pb-3 font-medium">Zaman</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                  <td className="py-4 font-medium text-zinc-200">Masa {order.table}</td>
                  <td className="py-4 text-yellow-500 font-medium">{formatCurrency(order.total)}</td>
                  <td className="py-4 text-zinc-400 text-sm">
                    {order.paymentMethod === 'card' ? 'Kredi Kartı' : order.paymentMethod === 'pos' ? 'Fiziksel POS' : order.paymentMethod === 'cash' ? 'Nakit' : '-'}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      order.status === 'pending' ? 'bg-orange-500/20 text-orange-500' :
                      order.status === 'preparing' ? 'bg-blue-500/20 text-blue-500' :
                      order.status === 'ready' ? 'bg-green-500/20 text-green-500' :
                      'bg-zinc-500/20 text-zinc-400'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 text-zinc-400 text-sm">
                    {new Date(order.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">Henüz sipariş yok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
