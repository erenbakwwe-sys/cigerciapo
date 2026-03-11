import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'sonner';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'supervisor') navigate('/admin');
      else if (user.role === 'kitchen') navigate('/admin/orders');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (username === 'apo55' && password === 'samsun55') {
      setUser({ username: 'apo55', role: 'supervisor' });
      toast.success('Giriş başarılı');
      navigate('/admin');
    } else if (username === 'usta' && password === 'ciger123') {
      setUser({ username: 'usta', role: 'kitchen' });
      toast.success('Giriş başarılı');
      navigate('/admin/orders');
    } else {
      toast.error('Hatalı kullanıcı adı veya şifre');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-red-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-red-900/50">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-yellow-500 tracking-tight">Yönetim Paneli</h1>
          <p className="text-zinc-400 text-sm mt-1">Ciğerci Apo Samsun</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="Kullanıcı adınızı girin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="Şifrenizi girin"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold text-lg py-3 rounded-xl transition-colors mt-6 disabled:opacity-50"
          >
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-zinc-600">
          <p>Süpervizör: apo55 / samsun55</p>
          <p>Mutfak: usta / ciger123</p>
        </div>
      </div>
    </div>
  );
};
