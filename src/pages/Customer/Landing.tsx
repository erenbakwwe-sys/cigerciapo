import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Star, ChefHat, Flame, Utensils } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-red-500/30">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1920&h=1080" 
            alt="Grill Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <Flame className="text-red-600 w-16 h-16 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-yellow-500 tracking-tight mb-4 drop-shadow-lg">
              Ciğerci Apo <span className="text-red-600">Samsun</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 mb-8 font-light">
              Geleneksel Lezzetin Modern Deneyimi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/menu')}
                className="bg-red-700 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(185,28,28,0.4)] hover:shadow-[0_0_30px_rgba(185,28,28,0.6)] flex items-center justify-center gap-2"
              >
                <Utensils size={24} />
                Menüyü İncele
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-zinc-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-500">Hakkımızda</h2>
            <p className="text-zinc-400 leading-relaxed text-lg">
              Samsun Atakum'da yılların tecrübesiyle, en taze malzemeleri odun ateşinin eşsiz aromasıyla buluşturuyoruz. 
              Özel terbiyeli ciğer şişimiz, zırh kıymasıyla hazırlanan Adana kebabımız ve yöresel lezzetlerimizle 
              unutulmaz bir ziyafet sunuyoruz.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex flex-col items-center p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex-1">
                <ChefHat className="text-red-500 mb-2" size={32} />
                <span className="font-bold text-zinc-200">Usta Eller</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex-1">
                <Flame className="text-orange-500 mb-2" size={32} />
                <span className="font-bold text-zinc-200">Odun Ateşi</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex-1">
                <Star className="text-yellow-500 mb-2" size={32} />
                <span className="font-bold text-zinc-200">%100 Doğal</span>
              </div>
            </div>
          </motion.div>
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800&h=600" 
              alt="Restaurant Interior" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-20 px-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-4">Öne Çıkan Lezzetler</h2>
            <p className="text-zinc-400">En çok tercih edilen spesiyallerimiz</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Ciğer Şiş', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400&h=300', desc: 'Kuyruk yağı ile harmanlanmış efsane lezzet' },
              { name: 'Adana Kebap', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300', desc: 'Zırh kıyması, acılı, közlenmiş sebzelerle' },
              { name: 'Et Tantuni', image: 'https://images.unsplash.com/photo-1626804475297-41609ea0eb4eb?auto=format&fit=crop&q=80&w=400&h=300', desc: 'Mersin usulü pamuk yağı ile kavrulmuş' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 group"
              >
                <div className="h-48 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-zinc-100 mb-2">{item.name}</h3>
                  <p className="text-zinc-400 text-sm">{item.desc}</p>
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
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-6">İletişim & Konum</h2>
                <p className="text-zinc-400">Sizi ağırlamaktan mutluluk duyarız. Rezervasyon veya paket servis için bize ulaşın.</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 shrink-0">
                    <MapPin className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200">Adres</h4>
                    <p className="text-zinc-400">Cumhuriyet Mah. Adnan Menderes Bulvarı No: 123<br/>Atakum / Samsun</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 shrink-0">
                    <Phone className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200">Telefon</h4>
                    <p className="text-zinc-400">+90 (362) 123 45 67</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 shrink-0">
                    <Clock className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200">Çalışma Saatleri</h4>
                    <p className="text-zinc-400">Her Gün: 11:00 - 02:00</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-[400px] rounded-3xl overflow-hidden border border-zinc-800">
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
            </div>
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
