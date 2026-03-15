import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { useAppContext, MenuItem } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { toast } from 'sonner';

export const CustomerMenu = () => {
  const { menu, addToCart } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<string>('Tümü');

  const categories = ['Tümü', ...Array.from(new Set(menu.map(item => item.category)))];

  const filteredMenu = activeCategory === 'Tümü' 
    ? menu 
    : menu.filter(item => item.category === activeCategory);

  const handleAddToCart = (item: MenuItem, e: React.MouseEvent) => {
    addToCart(item);
    
    // Simple bounce effect feedback
    const btn = e.currentTarget as HTMLButtonElement;
    btn.classList.add('scale-90');
    setTimeout(() => btn.classList.remove('scale-90'), 150);
    
    toast.success(`${item.name} sepete eklendi`);
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {categories.map(cat => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat 
                ? 'bg-yellow-500 text-zinc-950 shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Menu Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        key={activeCategory} // Re-trigger animation on category change
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredMenu.map((item) => (
            <motion.div 
              layout
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-lg group hover:border-zinc-700 transition-colors"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-yellow-500 border border-zinc-800">
                  {item.category}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xl text-zinc-100 group-hover:text-yellow-500 transition-colors">{item.name}</h3>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{item.description}</p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800/50">
                  <span className="font-bold text-yellow-500 text-2xl tracking-tight">
                    {formatCurrency(item.price)}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleAddToCart(item, e)}
                    className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-medium shadow-[0_0_15px_rgba(185,28,28,0.3)]"
                  >
                    <Plus size={20} />
                    Ekle
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
