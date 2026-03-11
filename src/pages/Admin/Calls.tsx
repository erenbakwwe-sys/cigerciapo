import React from 'react';
import { motion } from 'motion/react';
import { Bell, CheckCircle2, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'sonner';

export const Calls = () => {
  const { calls, resolveCall } = useAppContext();

  const activeCalls = calls.filter(c => c.status === 'active').sort((a, b) => b.createdAt - a.createdAt);
  const resolvedCalls = calls.filter(c => c.status === 'resolved').sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);

  const handleResolve = (id: string, table: string) => {
    resolveCall(id);
    toast.success(`Masa ${table} çağrısı yanıtlandı.`);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-zinc-100">Garson Çağrıları</h1>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-red-500 flex items-center gap-2">
          <Bell size={24} className={activeCalls.length > 0 ? "animate-bounce" : ""} />
          Bekleyen Çağrılar ({activeCalls.length})
        </h2>

        {activeCalls.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500">
            Şu an bekleyen çağrı bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCalls.map(call => {
              const elapsedMinutes = Math.floor((Date.now() - call.createdAt) / 60000);

              return (
                <motion.div
                  layout
                  key={call.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border-2 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-colors bg-red-950/30 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)] animate-pulse"
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold bg-red-600 text-white">
                    {call.table}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-zinc-100">Masa {call.table}</h3>
                    <p className="flex items-center justify-center gap-1 text-sm mt-1 text-red-400 font-bold">
                      <Clock size={14} />
                      {elapsedMinutes} dk önce
                    </p>
                  </div>
                  <button
                    onClick={() => handleResolve(call.id, call.table)}
                    className="mt-2 w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border border-zinc-700 hover:border-zinc-600"
                  >
                    <CheckCircle2 size={20} className="text-green-500" />
                    Hizmet Verildi
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {resolvedCalls.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-400">Son Yanıtlananlar</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-sm bg-zinc-950/50">
                  <th className="p-4 font-medium">Masa</th>
                  <th className="p-4 font-medium">Çağrı Zamanı</th>
                  <th className="p-4 font-medium">Durum</th>
                </tr>
              </thead>
              <tbody>
                {resolvedCalls.map(call => (
                  <tr key={call.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 font-medium text-zinc-300">Masa {call.table}</td>
                    <td className="p-4 text-zinc-500 text-sm">
                      {new Date(call.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-500 flex items-center gap-1 w-max">
                        <CheckCircle2 size={12} /> Yanıtlandı
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
