import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, X, Check, Database, Upload, Sparkles } from 'lucide-react';
import { useAppContext, MenuItem } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { toast } from 'sonner';
import { GoogleGenAI } from '@google/genai';

const initialMenu: Omit<MenuItem, 'id'>[] = [
  // Kebaplar & Izgaralar
  { name: 'Ciğer Şiş', category: 'Kebaplar & Izgaralar', description: '10 çeşit meze ikramı ile birlikte.', price: 730, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Et Şiş', category: 'Kebaplar & Izgaralar', description: '10 çeşit meze ikramı ile birlikte.', price: 730, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Karışık Şiş', category: 'Kebaplar & Izgaralar', description: '10 çeşit meze ikramı ile birlikte.', price: 730, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Adana Kebap', category: 'Kebaplar & Izgaralar', description: '10 çeşit meze ikramı ile birlikte.', price: 730, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Yoğurtlu Adana', category: 'Kebaplar & Izgaralar', description: '10 çeşit meze ikramı ile birlikte.', price: 800, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Urfa Kebap', category: 'Kebaplar & Izgaralar', description: '10 çeşit meze ikramı ile birlikte.', price: 730, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Tavuk Kanat', category: 'Kebaplar & Izgaralar', description: '10 çeşit meze ikramı ile birlikte.', price: 700, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Tavuk Şiş', category: 'Kebaplar & Izgaralar', description: '10 çeşit meze ikramı ile birlikte.', price: 700, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Yürek Şiş', category: 'Kebaplar & Izgaralar', description: '10 çeşit meze ikramı ile birlikte.', price: 700, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Izgara Köfte', category: 'Kebaplar & Izgaralar', description: '10 çeşit meze ikramı ile birlikte.', price: 700, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Ciğer Şiş (Yarım Porsiyon)', category: 'Kebaplar & Izgaralar', description: '10 çeşit meze ikramı ile birlikte.', price: 550, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Et Şiş (Yarım Porsiyon)', category: 'Kebaplar & Izgaralar', description: '10 çeşit meze ikramı ile birlikte.', price: 550, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Tavuk Şiş (Yarım Porsiyon)', category: 'Kebaplar & Izgaralar', description: '10 çeşit meze ikramı ile birlikte.', price: 500, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Köfte (Yarım Porsiyon)', category: 'Kebaplar & Izgaralar', description: '10 çeşit meze ikramı ile birlikte.', price: 500, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=400&h=300' },

  // Et Döner & İskender
  { name: 'Sade Et Döner', category: 'Et Döner & İskender', description: '(140 gr.) 10 çeşit meze ikramı ile birlikte.', price: 700, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: '1,5 Porsiyon Sade Döner', category: 'Et Döner & İskender', description: 'Özenle hazırlanmış lezzet.', price: 1050, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Yarım Porsiyon Sade Döner 70 Gr.', category: 'Et Döner & İskender', description: 'Özenle hazırlanmış lezzet.', price: 500, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Pilav Üstü Et Döner', category: 'Et Döner & İskender', description: '(140 gr.) 10 çeşit meze ikramı ile birlikte.', price: 700, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'İskender (Et Dönerden)', category: 'Et Döner & İskender', description: '(140 gr.) 10 çeşit meze ikramı ile birlikte.', price: 750, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'İskender (Yarım Porsiyon)', category: 'Et Döner & İskender', description: '(70 gr.) 10 çeşit meze ikramı ile birlikte.', price: 550, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Et Döner Dürüm', category: 'Et Döner & İskender', description: '(70 gr.) Soğan, yeşillik, domates, patates kızartması', price: 400, image: 'https://images.unsplash.com/photo-1626804475297-41609ea0eb4eb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Yarım Porsiyon Pilav Üstü Et Döner', category: 'Et Döner & İskender', description: 'Özenle hazırlanmış lezzet.', price: 500, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300' },

  // Tantuniler
  { name: 'Yoğurtlu Tantuni', category: 'Tantuniler', description: '4 çeşit meze ikramı ile birlikte.', price: 500, image: 'https://images.unsplash.com/photo-1626804475297-41609ea0eb4eb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Et Dürüm Tantuni', category: 'Tantuniler', description: '4 çeşit meze ikramı ile birlikte.', price: 400, image: 'https://images.unsplash.com/photo-1626804475297-41609ea0eb4eb?auto=format&fit=crop&q=80&w=400&h=300' },

  // Pide & Lahmacun
  { name: 'Lahmacun', category: 'Pide & Lahmacun', description: '5 çeşit meze ikramı ile birlikte.', price: 300, image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Kaşarlı Lahmacun', category: 'Pide & Lahmacun', description: 'Kaşar, 5 çeşit meze ikramı ile birlikte.', price: 350, image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Kavurmalı Bafra Pidesi (Açık)', category: 'Pide & Lahmacun', description: 'Özel kavurma, tereyağı. 10 çeşit meze ikramı ile birlikte.', price: 625, image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Karışık Bafra Pidesi (Açık)', category: 'Pide & Lahmacun', description: 'Dana kuşbaşı, domates, biber, pastırma, kaşar peyniri. / 10 çeşit meze ikramı ile birlikte.', price: 625, image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Bafra Yağlı Yumurtalı (Açık)', category: 'Pide & Lahmacun', description: 'Köy yumurtası, tereyağı. / 10 çeşit meze ikramı ile birlikte.', price: 625, image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Pastırmalı Bafra Pidesi (Açık)', category: 'Pide & Lahmacun', description: 'Pastırma, tereyağı. / 10 çeşit meze ikramı ile birlikte.', price: 625, image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Kıymalı Bafra Pidesi (Açık)', category: 'Pide & Lahmacun', description: 'Dana kıyma, soğan, tereyağı, karabiber. / 10 çeşit meze ikramı ile birlikte.', price: 625, image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Sucuklu Bafra Pidesi (Açık)', category: 'Pide & Lahmacun', description: 'Özel dana sucuk, tereyağı. / 10 çeşit meze ikramı ile birlikte.', price: 625, image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Kaşarlı Bafra Pidesi (Açık)', category: 'Pide & Lahmacun', description: '10 çeşit meze ikramı ile birlikte.', price: 625, image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Kuşbaşılı Bafra Pidesi (Açık) Porsiyon', category: 'Pide & Lahmacun', description: 'Pastırma, tereyağı. / 10 çeşit meze ikramı ile birlikte.', price: 625, image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Kıymalı Bafra Pidesi (Kapalı)', category: 'Pide & Lahmacun', description: 'Dana kıyma, soğan, tereyağı, karabiber. / 10 çeşit meze ikramı ile birlikte.', price: 625, image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=400&h=300' },

  // Kahvaltı
  { name: '(2 Kişilik) Sınırsız Kahvaltı', category: 'Kahvaltı', description: 'Kuymak, menemen, sahanda yumurta, patates kızartması ve sosis kızartması, pişi, sigara böreği, mersin katmeri, zeytin çeşitleri, peynir çeşitleri, bal, tereyağı, reçel çeşitleri, salata söğüş, demlik çay (Tüm ürünler Sınırsız).', price: 1500, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: '(3 Kişilik) Sınırsız Kahvaltı', category: 'Kahvaltı', description: 'Kuymak, menemen, sahanda yumurta, patates kızartması ve sosis kızartması, pişi, sigara böreği, mersin katmeri, zeytin çeşitleri, peynir çeşitleri, bal, tereyağı, reçel çeşitleri, salata söğüş, demlik çay (Tüm ürünler Sınırsız).', price: 2250, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: '(4 Kişilik) Sınırsız Kahvaltı', category: 'Kahvaltı', description: 'Kuymak, menemen, sahanda yumurta, patates kızartması ve sosis kızartması, pişi, sigara böreği, mersin katmeri, zeytin çeşitleri, peynir çeşitleri, bal, tereyağı, reçel çeşitleri, salata söğüş, demlik çay (Tüm ürünler Sınırsız).', price: 3000, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: '(2 Kişilik) Serpme Kahvaltı', category: 'Kahvaltı', description: '( SEÇMELİ Kuymak /Menemen ) sahanda yumurta, patates kızartması ve sosis kızartması, pişi, sigara böreği, mersin katmeri, zeytin çeşitleri, peynir çeşitleri, bal, tereyağı, reçel çeşitleri, salata söğüş, demlik çay', price: 1200, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: '(3 Kişilik) Serpme Kahvaltı', category: 'Kahvaltı', description: '( SEÇMELİ Kuymak /Menemen ) sahanda yumurta, patates kızartması ve sosis kızartması, pişi, sigara böreği, mersin katmeri, zeytin çeşitleri, peynir çeşitleri, bal, tereyağı, reçel çeşitleri, salata söğüş, demlik çay', price: 1800, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: '(4 Kişilik) Serpme Kahvaltı', category: 'Kahvaltı', description: '( SEÇMELİ Kuymak /Menemen ) sahanda yumurta, patates kızartması ve sosis kızartması, pişi, sigara böreği, mersin katmeri, zeytin çeşitleri, peynir çeşitleri, bal, tereyağı, reçel çeşitleri, salata söğüş, demlik çay', price: 2400, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Kuymak', category: 'Kahvaltı', description: 'Özenle hazırlanmış lezzet.', price: 350, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Menemen', category: 'Kahvaltı', description: 'Özenle hazırlanmış lezzet.', price: 350, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Sucuklu Yumurta', category: 'Kahvaltı', description: 'Özenle hazırlanmış lezzet.', price: 350, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Pastırmalı Yumurta', category: 'Kahvaltı', description: 'Özenle hazırlanmış lezzet.', price: 350, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Kavurmalı Yumurta', category: 'Kahvaltı', description: 'Özenle hazırlanmış lezzet.', price: 350, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400&h=300' },

  // Tatlılar
  { name: 'Klasik Künefe', category: 'Tatlılar', description: 'Özenle hazırlanmış lezzet.', price: 300, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Hasır Künefe', category: 'Tatlılar', description: 'Özenle hazırlanmış lezzet.', price: 350, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Paşa Künefe', category: 'Tatlılar', description: 'Özenle hazırlanmış lezzet.', price: 350, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Fıstıklı Tel Kadayıf (250 gr.)', category: 'Tatlılar', description: 'Özenle hazırlanmış lezzet.', price: 300, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Fıstıklı Hasır Kadayıf (250 gr.)', category: 'Tatlılar', description: 'Özenle hazırlanmış lezzet.', price: 350, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Fıstıklı Burma Kadayıf (250 gr.)', category: 'Tatlılar', description: 'Özenle hazırlanmış lezzet.', price: 350, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Fıstıkzade', category: 'Tatlılar', description: 'Özenle hazırlanmış lezzet.', price: 350, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Billuriye', category: 'Tatlılar', description: 'Özenle hazırlanmış lezzet.', price: 350, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: '2 Kişilik Special', category: 'Tatlılar', description: 'Özenle hazırlanmış lezzet.', price: 700, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: '4 Kişilik Special', category: 'Tatlılar', description: 'Özenle hazırlanmış lezzet.', price: 1400, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Hamsiköy Sütlacı Fıstıklı', category: 'Tatlılar', description: 'Özenle hazırlanmış lezzet.', price: 150, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Dondurma (Porsiyon)', category: 'Tatlılar', description: 'Özenle hazırlanmış lezzet.', price: 100, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400&h=300' },

  // İçecekler
  { name: 'Coca-Cola (33 cl.)', category: 'İçecekler', description: 'Özenle hazırlanmış lezzet.', price: 95, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Sprite (33 cl.)', category: 'İçecekler', description: 'Özenle hazırlanmış lezzet.', price: 95, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Fanta (33 cl.)', category: 'İçecekler', description: 'Özenle hazırlanmış lezzet.', price: 95, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Cappy (33 cl.)', category: 'İçecekler', description: 'Özenle hazırlanmış lezzet.', price: 95, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Ayran (33 cl.) (Cam Şişe)', category: 'İçecekler', description: 'Özenle hazırlanmış lezzet.', price: 95, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Soda (20 cl.)', category: 'İçecekler', description: 'Özenle hazırlanmış lezzet.', price: 50, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Su (33 cl.)', category: 'İçecekler', description: 'Özenle hazırlanmış lezzet.', price: 30, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400&h=300' },

  // Ara Sıcaklar
  { name: 'Kase Yoğurt', category: 'Ara Sıcaklar', description: 'Özenle hazırlanmış lezzet.', price: 100, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Pirinç Pilavı', category: 'Ara Sıcaklar', description: 'Özenle hazırlanmış lezzet.', price: 100, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Meze', category: 'Ara Sıcaklar', description: 'Özenle hazırlanmış lezzet.', price: 400, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Cips', category: 'Ara Sıcaklar', description: 'Özenle hazırlanmış lezzet.', price: 150, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'İçli Köfte', category: 'Ara Sıcaklar', description: 'Özenle hazırlanmış lezzet.', price: 130, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=400&h=300' },

  // Çorbalar
  { name: 'Az Çorba', category: 'Çorbalar', description: 'Özenle hazırlanmış lezzet.', price: 100, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Mercimek Çorbası', category: 'Çorbalar', description: 'Özenle hazırlanmış lezzet.', price: 150, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400&h=300' }
];

export const MenuEditor = () => {
  const { menu, addMenuItem, deleteMenuItem, updateMenuItem } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  
  // AI Image Generation State
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageMode, setImageMode] = useState<'file' | 'url' | 'ai'>('file');
  const [aiPrompt, setAiPrompt] = useState('');

  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '', category: '', description: '', price: 0, image: ''
  });

  const handleModeChange = (mode: 'file' | 'url' | 'ai') => {
    setImageMode(mode);
    if (mode === 'url' && formData.image.startsWith('data:image')) {
      setFormData({ ...formData, image: '' });
    }
  };

  const handleSeedMenu = async () => {
    setIsSeeding(true);
    try {
      // Önce mevcut tüm menüyü sil
      for (const item of menu) {
        await deleteMenuItem(item.id);
      }
      
      // Sonra yeni menüyü yükle
      for (const item of initialMenu) {
        await addMenuItem(item);
      }
      toast.success("Eski menü temizlendi ve yeni menü başarıyla yüklendi!");
    } catch (error) {
      console.error(error);
      toast.error("Menü güncellenirken hata oluştu.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!aiPrompt) {
      toast.error("Lütfen bir resim açıklaması girin.");
      return;
    }

    try {
      // @ts-ignore
      if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }

      setIsGeneratingImage(true);

      // @ts-ignore
      const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY || process.env.GEMINI_API_KEY : import.meta.env.VITE_GEMINI_API_KEY;
      
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            {
              text: `Professional food photography of ${aiPrompt}, high quality, restaurant menu style, appetizing, well-lit, 4k resolution`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "4:3",
            imageSize: "512px"
          }
        },
      });

      let base64EncodeString = '';
      if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            base64EncodeString = part.inlineData.data;
            break;
          }
        }
      }

      if (base64EncodeString) {
        const imageUrl = `data:image/jpeg;base64,${base64EncodeString}`;
        setFormData({ ...formData, image: imageUrl });
        toast.success("Yapay zeka resmi oluşturuldu!");
        setImageMode('file');
        setAiPrompt('');
      } else {
        toast.error("Resim oluşturulamadı. Lütfen tekrar deneyin.");
      }
    } catch (error: any) {
      console.error("AI Image Generation Error:", error);
      toast.error("Resim oluşturulurken hata: " + error.message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Sıkıştırılmış Base64 verisi (Kalite: 0.7)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setFormData({ ...formData, image: dataUrl });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.price <= 0) {
      toast.error('Lütfen zorunlu alanları doldurun (Ad, Kategori, Fiyat > 0)');
      return;
    }
    addMenuItem({
      ...formData,
      image: formData.image || `https://picsum.photos/seed/${formData.name.replace(/\s+/g, '')}/400/300`
    });
    setIsAdding(false);
    setFormData({ name: '', category: '', description: '', price: 0, image: '' });
  };

  const handleUpdate = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    updateMenuItem(id, formData);
    setEditingId(null);
  };

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setImageMode('file');
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      image: item.image
    });
  };

  const handleDelete = (id: string) => {
    deleteMenuItem(id);
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
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-100">Menü Yönetimi</h1>
        <div className="flex gap-3">
          <button
            onClick={handleSeedMenu}
            disabled={isSeeding}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Database size={20} />
            {isSeeding ? 'Yükleniyor...' : 'Menüyü Sıfırla'}
          </button>
          <button
            onClick={() => { setIsAdding(true); setFormData({ name: '', category: '', description: '', price: 0, image: '' }); setImageMode('file'); }}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 px-4 py-2 rounded-xl font-bold transition-colors"
          >
            <Plus size={20} />
            Yeni Ürün
          </button>
        </div>
      </div>

      {isAdding && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleAdd}
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4"
        >
          <h2 className="text-xl font-bold text-yellow-500 mb-4">Yeni Ürün Ekle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Ürün Adı" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-100" required />
            <input type="text" placeholder="Kategori (Örn: Ciğer, İçecek)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-100" required />
            <input type="number" placeholder="Fiyat (TL)" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-100" required min="1" />
            
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-400 flex items-center justify-between">
                <span className="flex items-center gap-2"><Upload size={16} /> Ürün Görseli</span>
                <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
                  <button 
                    type="button" 
                    onClick={() => handleModeChange('file')}
                    className={`text-xs px-2 py-1 rounded-md transition-colors ${imageMode === 'file' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-300'}`}
                  >
                    Dosya
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleModeChange('url')}
                    className={`text-xs px-2 py-1 rounded-md transition-colors ${imageMode === 'url' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-300'}`}
                  >
                    URL
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleModeChange('ai')}
                    className={`text-xs px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${imageMode === 'ai' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-purple-300'}`}
                  >
                    <Sparkles size={12} /> AI
                  </button>
                </div>
              </label>

              {imageMode === 'ai' && (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Örn: Porselen tabakta dumanı tüten Adana Kebap" 
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    className="flex-1 bg-zinc-950 border border-purple-500/50 rounded-xl px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-purple-500"
                  />
                  <button 
                    type="button"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    {isGeneratingImage ? 'Üretiliyor...' : 'Üret'}
                  </button>
                </div>
              )}
              
              {imageMode === 'url' && (
                <input 
                  type="text" 
                  placeholder="https://ornek.com/resim.jpg" 
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-100 w-full"
                />
              )}

              {imageMode === 'file' && (
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-zinc-950 hover:file:bg-yellow-400" 
                />
              )}

              {formData.image && (
                <img src={formData.image} alt="Preview" className="h-20 w-20 object-cover rounded-lg mt-2 border border-zinc-800" referrerPolicy="no-referrer" />
              )}
            </div>

            <textarea placeholder="Açıklama" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-100 md:col-span-2" rows={2} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-zinc-400 hover:text-zinc-200">İptal</button>
            <button type="submit" className="bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-medium">Kaydet</button>
          </div>
        </motion.form>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {menu.map(item => (
            <motion.div 
              layout 
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              key={item.id} 
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
            >
              {editingId === item.id ? (
              <form onSubmit={(e) => handleUpdate(item.id, e)} className="p-4 flex flex-col h-full gap-3">
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-100 text-sm" required />
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-100 text-sm" required />
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-100 text-sm" required min="1" />
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-400 flex items-center justify-between">
                    <span>Yeni Görsel</span>
                    <div className="flex bg-zinc-950 rounded p-0.5 border border-zinc-800">
                      <button 
                        type="button" 
                        onClick={() => handleModeChange('file')}
                        className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${imageMode === 'file' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-300'}`}
                      >
                        Dosya
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleModeChange('url')}
                        className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${imageMode === 'url' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-300'}`}
                      >
                        URL
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleModeChange('ai')}
                        className={`text-[10px] flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors ${imageMode === 'ai' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-purple-300'}`}
                      >
                        <Sparkles size={10} /> AI
                      </button>
                    </div>
                  </label>

                  {imageMode === 'ai' && (
                    <div className="flex gap-1">
                      <input 
                        type="text" 
                        placeholder="Örn: İskender Kebap" 
                        value={aiPrompt}
                        onChange={e => setAiPrompt(e.target.value)}
                        className="flex-1 bg-zinc-950 border border-purple-500/50 rounded-md px-2 py-1 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                      />
                      <button 
                        type="button"
                        onClick={handleGenerateImage}
                        disabled={isGeneratingImage}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        {isGeneratingImage ? '...' : 'Üret'}
                      </button>
                    </div>
                  )}
                  
                  {imageMode === 'url' && (
                    <input 
                      type="text" 
                      placeholder="https://ornek.com/resim.jpg" 
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-zinc-100 text-xs w-full"
                    />
                  )}

                  {imageMode === 'file' && (
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-200" 
                    />
                  )}
                  {formData.image && formData.image !== item.image && (
                    <img src={formData.image} alt="Preview" className="h-12 w-12 object-cover rounded mt-1 border border-zinc-800" referrerPolicy="no-referrer" />
                  )}
                </div>

                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-100 text-sm flex-1" rows={2} />
                <div className="flex justify-end gap-2 mt-auto pt-2">
                  <button type="button" onClick={() => setEditingId(null)} className="p-2 text-zinc-400 hover:text-zinc-200 bg-zinc-800 rounded-lg"><X size={18} /></button>
                  <button type="submit" className="p-2 text-green-500 hover:text-green-400 bg-green-500/10 rounded-lg"><Check size={18} /></button>
                </div>
              </form>
            ) : (
              <>
                <div className="h-40 w-full bg-zinc-800 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-2 right-2 bg-zinc-950/80 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-yellow-500">
                    {item.category}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-zinc-100">{item.name}</h3>
                  <p className="text-sm text-zinc-400 mt-1 flex-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
                    <span className="font-bold text-yellow-500 text-lg">{formatCurrency(item.price)}</span>
                    <div className="flex gap-2">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => startEdit(item)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"><Edit2 size={18} /></motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={18} /></motion.button>
                    </div>
                  </div>
                </div>
              </>
            )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
