import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, CreditCard, ScanLine, CheckCircle2, Users } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { toast } from 'sonner';

export const Checkout = () => {
  const { cart, removeFromCart, placeOrder } = useAppContext();
  const navigate = useNavigate();
  const { tableId } = useParams();
  const tableNumber = tableId || 'Misafir';

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'pos'>('card');
  const [isScanning, setIsScanning] = useState(false);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '' });
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // Bill split state
  const [splitCount, setSplitCount] = useState<number>(1);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const splitTotal = total / splitCount;

  const handleScanCard = () => {
    setIsScanning(true);
    toast.info('Kamera açılıyor, kartınızı okutun...', { duration: 2000 });
    
    // Simulate OCR
    setTimeout(() => {
      setCardData({
        number: '4532 1234 5678 9012',
        expiry: '12/28',
        cvv: ''
      });
      setScannedImage('https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=100&h=60');
      setIsScanning(false);
      toast.success('Kart bilgileri başarıyla okundu!');
    }, 2500);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    if (tableNumber === 'Misafir') {
      toast.error('Sipariş vermek için masada olmalısınız. Lütfen QR kodu okutun.');
      return;
    }
    if (paymentMethod === 'card' && (!cardData.number || !cardData.expiry || !cardData.cvv)) {
      toast.error('Lütfen kart bilgilerinizi eksiksiz girin.');
      return;
    }

    setIsPlacingOrder(true);
    
    // Simulate network delay and show animation
    setTimeout(() => {
      placeOrder(tableNumber, paymentMethod);
      setIsPlacingOrder(false);
      toast.success('Siparişiniz alındı! Afiyet olsun.');
      navigate('/');
    }, 2000);
  };

  if (isPlacingOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-red-600"
        >
          {/* Simulated smoking liver icon */}
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v2" />
            <path d="M12 8v2" />
            <path d="M16 4v2" />
            <path d="M16 10v2" />
            <path d="M8 4v2" />
            <path d="M8 10v2" />
            <path d="M4 14a8 8 0 0 0 16 0" />
            <path d="M4 14h16" />
          </svg>
        </motion.div>
        <h2 className="text-xl font-bold text-yellow-500">Siparişiniz Hazırlanıyor...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Sepetim</h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          Sepetiniz boş.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <motion.div 
                layout
                key={item.cartItemId}
                className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-100">{item.name}</h3>
                    <p className="text-sm text-zinc-400">{item.quantity} x {formatCurrency(item.price)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-yellow-500">{formatCurrency(item.price * item.quantity)}</span>
                  <button 
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-red-500 hover:text-red-400 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-6">
            
            {/* Bill Split Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <Users size={16} />
                  Hesabı Bölüş (Alman Usulü)
                </h3>
                <div className="flex items-center gap-3 bg-zinc-950 rounded-lg p-1 border border-zinc-800">
                  <button 
                    onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                    className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded text-zinc-300 hover:bg-zinc-700"
                  >-</button>
                  <span className="font-bold text-zinc-100 w-4 text-center">{splitCount}</span>
                  <button 
                    onClick={() => setSplitCount(Math.min(10, splitCount + 1))}
                    className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded text-zinc-300 hover:bg-zinc-700"
                  >+</button>
                </div>
              </div>
              {splitCount > 1 && (
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Kişi Başı Düşen Tutar:</span>
                  <span className="font-bold text-yellow-500">{formatCurrency(splitTotal)}</span>
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-zinc-100 pt-4 border-t border-zinc-800">Ödeme Yöntemi</h2>
            
            <div className="flex gap-4">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3 rounded-xl border-2 font-medium transition-colors ${
                  paymentMethod === 'card' 
                    ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' 
                    : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                Kredi Kartı
              </button>
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`flex-1 py-3 rounded-xl border-2 font-medium transition-colors ${
                  paymentMethod === 'cash' 
                    ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' 
                    : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                Nakit
              </button>
              <button
                onClick={() => setPaymentMethod('pos')}
                className={`flex-1 py-3 rounded-xl border-2 font-medium transition-colors ${
                  paymentMethod === 'pos' 
                    ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' 
                    : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                Fiziksel POS
              </button>
            </div>

            {paymentMethod === 'card' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-4 border-t border-zinc-800"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-zinc-400">Kart Bilgileri</h3>
                  <button
                    onClick={handleScanCard}
                    disabled={isScanning}
                    className="flex items-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg transition-colors border border-zinc-700"
                  >
                    <ScanLine size={16} />
                    {isScanning ? 'Taranıyor...' : 'Kartı Tara'}
                  </button>
                </div>

                {isScanning && (
                  <div className="relative h-32 bg-zinc-950 rounded-xl border-2 border-dashed border-yellow-500/50 overflow-hidden flex items-center justify-center">
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                    />
                    <span className="text-zinc-500 text-sm">Kamera simülasyonu aktif...</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Kart Numarası"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                    {scannedImage && (
                      <div className="absolute right-2 top-2 w-12 h-8 rounded overflow-hidden border border-zinc-700">
                        <img src={scannedImage} alt="Scanned Card" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="AA/YY"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-lg text-zinc-400">Toplam Tutar</span>
              <span className="text-2xl font-bold text-yellow-500">{formatCurrency(total)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-red-700 hover:bg-red-600 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(185,28,28,0.3)]"
            >
              <CheckCircle2 size={24} />
              {splitCount > 1 ? `${formatCurrency(splitTotal)} Öde ve Siparişi Onayla` : 'Siparişi Onayla'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
