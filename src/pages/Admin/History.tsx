import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { Clock, CheckCircle2, ListOrdered, Bell } from 'lucide-react';

export const History = () => {
  const { orders, calls } = useAppContext();
  const [activeTab, setActiveTab] = useState<'orders' | 'calls'>('orders');

  const deliveredOrders = orders.filter(o => o.status === 'delivered').sort((a, b) => b.createdAt - a.createdAt);
  const resolvedCalls = calls.filter(c => c.status === 'resolved').sort((a, b) => b.createdAt - a.createdAt);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-100">Geçmiş Kayıtlar</h1>
      </div>

      <div className="flex gap-4 border-b border-zinc-800 pb-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'orders' 
              ? 'bg-yellow-500 text-zinc-950' 
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
          }`}
        >
          <ListOrdered size={20} />
          Tamamlanan Siparişler ({deliveredOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('calls')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'calls' 
              ? 'bg-yellow-500 text-zinc-950' 
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
          }`}
        >
          <Bell size={20} />
          Çözülen Çağrılar ({resolvedCalls.length})
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {deliveredOrders.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Clock size={48} className="mx-auto mb-4 opacity-20" />
              <p>Henüz tamamlanmış sipariş bulunmuyor.</p>
            </div>
          ) : (
            deliveredOrders.map(order => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={order.id} 
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-yellow-500">Masa {order.table}</h3>
                    <p className="text-sm text-zinc-400 flex items-center gap-2 mt-1">
                      <Clock size={14} />
                      {new Date(order.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-zinc-100">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-zinc-400">
                      Ödeme: {order.paymentMethod === 'cash' ? 'Nakit' : order.paymentMethod === 'card' ? 'Kredi Kartı' : 'POS'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm border-t border-zinc-800/50 pt-2">
                      <span className="text-zinc-300">{item.quantity}x {item.name}</span>
                      <span className="text-zinc-400">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {activeTab === 'calls' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resolvedCalls.length === 0 ? (
            <div className="col-span-full text-center py-12 text-zinc-500">
              <CheckCircle2 size={48} className="mx-auto mb-4 opacity-20" />
              <p>Henüz çözülmüş çağrı bulunmuyor.</p>
            </div>
          ) : (
            resolvedCalls.map(call => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={call.id} 
                className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-zinc-100">Masa {call.table}</h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    {new Date(call.createdAt).toLocaleString('tr-TR')}
                  </p>
                </div>
                <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Çözüldü
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};
