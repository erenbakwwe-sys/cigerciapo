import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Printer, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

export const Tables = () => {
  const [tableCount, setTableCount] = useState(10);
  const tables = Array.from({ length: tableCount }, (_, i) => i + 1);

  const appUrl = window.location.origin;

  const handlePrint = (tableNum: number) => {
    toast.success(`Masa ${tableNum} QR kodu yazdırılıyor...`);
  };

  const handleCopyLink = (tableNum: number) => {
    const url = `${appUrl}/menu/${tableNum}`;
    navigator.clipboard.writeText(url);
    toast.success(`Masa ${tableNum} linki kopyalandı!`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-zinc-100">Masa & QR Yönetimi</h1>
        <div className="flex items-center gap-3 bg-zinc-900 p-2 rounded-xl border border-zinc-800 shadow-sm">
          <span className="text-zinc-400 text-sm pl-2">Toplam Masa:</span>
          <input 
            type="number" 
            value={tableCount} 
            onChange={(e) => setTableCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-center text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors"
            min="1"
          />
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {tables.map((tableNum) => {
            const tableUrl = `${appUrl}/menu/${tableNum}`;
            // Simulated QR Code URL using an API
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(tableUrl)}&color=000000&bgcolor=ffffff`;

            return (
              <motion.div
                layout
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                key={tableNum}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center gap-4 group hover:border-zinc-700 transition-colors shadow-sm hover:shadow-md"
              >
                <div className="w-full flex justify-between items-center">
                  <span className="text-xl font-bold text-yellow-500">Masa {tableNum}</span>
                  <QrCode className="text-zinc-500" size={20} />
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-2 rounded-xl shadow-inner"
                >
                  <img src={qrUrl} alt={`Masa ${tableNum} QR`} className="w-32 h-32 object-contain" />
                </motion.div>

                <div className="w-full flex gap-2 mt-2">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopyLink(tableNum)}
                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded-xl transition-colors text-sm"
                    title="Linki Kopyala"
                  >
                    <LinkIcon size={16} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePrint(tableNum)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white py-2 rounded-xl transition-colors text-sm shadow-[0_0_10px_rgba(185,28,28,0.2)]"
                    title="Yazdır"
                  >
                    <Printer size={16} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
