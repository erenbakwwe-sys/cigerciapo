import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Star, ChefHat, Flame, Utensils } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const Landing = () => {
  const navigate = useNavigate();
  const { menu } = useAppContext();

  // Menüden ilgili ürünleri bul, yoksa varsayılanları kullan
  const cigerSis = menu.find(m => m.name.toLowerCase().includes('ciğer şiş')) || { 
    name: 'Ciğer Şiş', 
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=400&h=300', 
    description: 'Kuyruk yağı ile harmanlanmış efsane lezzet' 
  };
  
  const adanaKebap = menu.find(m => m.name.toLowerCase().includes('adana kebap')) || { 
    name: 'Adana Kebap', 
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=400&h=300', 
    description: 'Zırh kıyması, acılı, közlenmiş sebzelerle' 
  };
  
  const tantuni = menu.find(m => m.name.toLowerCase().includes('tantuni')) || { 
    name: 'Et Tantuni', 
    image: 'https://images.unsplash.com/photo-1648695042186-0925298a00ce?auto=format&fit=crop&q=80&w=400&h=300', 
    description: 'Mersin usulü pamuk yağı ile kavrulmuş' 
  };

  const featuredItems = [cigerSis, adanaKebap, tantuni];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-red-500/30">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1920&h=1080" 
            alt="Grill Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-6">
              <Flame className="text-red-600 w-16 h-16 animate-pulse" />
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-yellow-500 tracking-tight mb-4 drop-shadow-lg">
              Ciğerci Apo <span className="text-red-600">Samsun</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-zinc-300 mb-8 font-light">
              Geleneksel Lezzetin Modern Deneyimi
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/menu')}
                className="bg-red-700 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(185,28,28,0.4)] hover:shadow-[0_0_30px_rgba(185,28,28,0.6)] flex items-center justify-center gap-2"
              >
                <Utensils size={24} />
                Menüyü İncele
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-zinc-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-500">Hakkımızda</h2>
            <p className="text-zinc-400 leading-relaxed text-lg">
              Samsun Atakum'da yılların tecrübesiyle, en taze malzemeleri odun ateşinin eşsiz aromasıyla buluşturuyoruz. 
              Özel terbiyeli ciğer şişimiz, zırh kıymasıyla hazırlanan Adana kebabımız ve yöresel lezzetlerimizle 
              unutulmaz bir ziyafet sunuyoruz.
            </p>
            <div className="flex gap-4 pt-4">
              <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex-1 transition-colors hover:border-red-500/50">
                <ChefHat className="text-red-500 mb-2" size={32} />
                <span className="font-bold text-zinc-200">Usta Eller</span>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex-1 transition-colors hover:border-orange-500/50">
                <Flame className="text-orange-500 mb-2" size={32} />
                <span className="font-bold text-zinc-200">Odun Ateşi</span>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex-1 transition-colors hover:border-yellow-500/50">
                <Star className="text-yellow-500 mb-2" size={32} />
                <span className="font-bold text-zinc-200">%100 Doğal</span>
              </motion.div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800&h=600" 
              alt="Restaurant Interior" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-20 px-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-4">Öne Çıkan Lezzetler</h2>
            <p className="text-zinc-400">En çok tercih edilen spesiyallerimiz</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 group"
              >
                <div className="h-48 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-zinc-100 mb-2">{item.name}</h3>
                  <p className="text-zinc-400 text-sm">{item.description || item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location (Local SEO) */}
      <section className="py-20 px-4 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-6">İletişim & Konum</h2>
                <p className="text-zinc-400">Sizi ağırlamaktan mutluluk duyarız. Rezervasyon veya paket servis için bize ulaşın.</p>
              </div>
              
              <div className="space-y-6">
                <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4 transition-transform">
                  <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 shrink-0">
                    <MapPin className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200">Adres</h4>
                    <p className="text-zinc-400">Cumhuriyet, Atatürk Bl. No:380/B,<br/>55200 Atakum/Samsun</p>
                  </div>
                </motion.div>
                
                <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4 transition-transform">
                  <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 shrink-0">
                    <Phone className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200">Telefon</h4>
                    <p className="text-zinc-400">(0362) 436 03 33</p>
                  </div>
                </motion.div>

                <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4 transition-transform">
                  <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 shrink-0">
                    <Clock className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200">Çalışma Saatleri</h4>
                    <p className="text-zinc-400">Her Gün: 09:00 - 02:00</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-[400px] rounded-3xl overflow-hidden border border-zinc-800"
            >
              {/* Google Maps Embed Simulation */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d95855.95475685834!2d36.21323445!3d41.3411444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x408877e8841b945f%3A0x6442650075485408!2sAtakum%2FSamsun!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 py-8 border-t border-zinc-900 text-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Ciğerci Apo Samsun. Tüm hakları saklıdır.
          </p>
          <button 
            onClick={() => navigate('/admin/login')}
            className="text-zinc-600 hover:text-yellow-500 text-sm transition-colors"
          >
            Yönetim Girişi
          </button>
        </div>
      </footer>
    </div>
  );
};
