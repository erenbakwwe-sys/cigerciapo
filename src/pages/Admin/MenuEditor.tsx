import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, X, Check, Database, Upload, Sparkles } from 'lucide-react';
import { useAppContext, MenuItem } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { toast } from 'sonner';
import { GoogleGenAI } from '@google/genai';

const initialMenu: Omit<MenuItem, 'id'>[] = [
  { name: 'Ciğer Şiş', category: 'Ciğer & Şişler', description: 'Kuyruk yağı ile harmanlanmış, mangal ateşinde pişmiş efsane ciğer şiş.', price: 280, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Adana Kebap', category: 'Kebaplar', description: 'Zırh kıyması, acılı, közlenmiş biber ve domates ile.', price: 320, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Urfa Kebap', category: 'Kebaplar', description: 'Zırh kıyması, acısız, közlenmiş biber ve domates ile.', price: 320, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Et Şiş', category: 'Ciğer & Şişler', description: 'Terbiyeli kuzu eti, lokum kıvamında.', price: 350, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Tavuk Şiş', category: 'Ciğer & Şişler', description: 'Özel sosla marine edilmiş tavuk göğsü.', price: 220, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Ciğer Dürüm', category: 'Ciğer & Şişler', description: 'Lavaş arası soğan piyazlı ciğer şiş.', price: 200, image: 'https://images.unsplash.com/photo-1626804475297-41609ea0eb4eb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Et Tantuni', category: 'Tantuni', description: 'Mersin usulü pamuk yağı ile kavrulmuş et tantuni.', price: 240, image: 'https://images.unsplash.com/photo-1626804475297-41609ea0eb4eb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Tavuk Tantuni', category: 'Tantuni', description: 'Mersin usulü tavuk tantuni.', price: 180, image: 'https://images.unsplash.com/photo-1626804475297-41609ea0eb4eb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Bafra Pidesi', category: 'Pide & Lahmacun', description: 'Samsun Bafra usulü kapalı kıymalı pide.', price: 260, image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'İşkembe Çorbası', category: 'Çorbalar', description: 'Sarımsak ve sirke ile terbiyeli.', price: 120, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Mercimek Çorbası', category: 'Çorbalar', description: 'Süzme mercimek, tereyağlı sos ile.', price: 90, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Künefe', category: 'Tatlılar', description: 'Hatay usulü peynirli künefe, fıstıklı.', price: 150, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Ayran', category: 'İçecekler', description: 'Köpüklü yayık ayranı.', price: 40, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400&h=300' },
  { name: 'Şalgam', category: 'İçecekler', description: 'Adana usulü acılı/acısız şalgam suyu.', price: 40, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400&h=300' }
];

export const MenuEditor = () => {
  const { menu, addMenuItem, deleteMenuItem, updateMenuItem } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  
  // AI Image Generation State
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '', category: '', description: '', price: 0, image: ''
  });

  const handleSeedMenu = async () => {
    setIsSeeding(true);
    try {
      for (const item of initialMenu) {
        await addMenuItem(item);
      }
      toast.success("Örnek menü başarıyla yüklendi!");
    } catch (error) {
      console.error(error);
      toast.error("Menü yüklenirken hata oluştu.");
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
        setShowAiPrompt(false);
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
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      image: item.image
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      deleteMenuItem(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-100">Menü Yönetimi</h1>
        <div className="flex gap-3">
          {menu.length === 0 && (
            <button
              onClick={handleSeedMenu}
              disabled={isSeeding}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Database size={20} />
              {isSeeding ? 'Yükleniyor...' : 'Örnek Menü Yükle'}
            </button>
          )}
          <button
            onClick={() => { setIsAdding(true); setFormData({ name: '', category: '', description: '', price: 0, image: '' }); }}
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
                <button 
                  type="button" 
                  onClick={() => setShowAiPrompt(!showAiPrompt)}
                  className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 bg-purple-500/10 px-2 py-1 rounded-lg transition-colors"
                >
                  <Sparkles size={14} /> AI ile Üret
                </button>
              </label>

              {showAiPrompt ? (
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
              ) : (
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-zinc-950 hover:file:bg-yellow-400" 
                />
              )}

              {formData.image && formData.image.startsWith('data:image') && (
                <img src={formData.image} alt="Preview" className="h-20 w-20 object-cover rounded-lg mt-2 border border-zinc-800" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map(item => (
          <motion.div layout key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
            {editingId === item.id ? (
              <form onSubmit={(e) => handleUpdate(item.id, e)} className="p-4 flex flex-col h-full gap-3">
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-100 text-sm" required />
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-100 text-sm" required />
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-100 text-sm" required min="1" />
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-400 flex items-center justify-between">
                    <span>Yeni Görsel Yükle</span>
                    <button 
                      type="button" 
                      onClick={() => setShowAiPrompt(!showAiPrompt)}
                      className="text-[10px] flex items-center gap-1 text-purple-400 hover:text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded transition-colors"
                    >
                      <Sparkles size={10} /> AI
                    </button>
                  </label>

                  {showAiPrompt ? (
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
                  ) : (
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-200" 
                    />
                  )}
                  {formData.image && formData.image !== item.image && formData.image.startsWith('data:image') && (
                    <img src={formData.image} alt="Preview" className="h-12 w-12 object-cover rounded mt-1 border border-zinc-800" />
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
                      <button onClick={() => startEdit(item)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
