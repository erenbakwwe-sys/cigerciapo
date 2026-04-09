import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, CreditCard, ScanLine, CheckCircle2, Users, Info, Star } from 'lucide-react';
import { useAppContext, Order } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { toast } from 'sonner';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { generateId } from '../../utils/format';

export const Checkout = () => {
  const { cart, removeFromCart, clearCart } = useAppContext();
  const navigate = useNavigate();
  const { tableId } = useParams();
  const tableNumber = tableId || 'Misafir';

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'pos'>('card');
  const [isScanning, setIsScanning] = useState(false);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '' });
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Shared Order State (from Firestore)
  const [sharedOrder, setSharedOrder] = useState<Order | null>(null);

  // Advanced Payment State
  const [paymentType, setPaymentType] = useState<'full' | 'equal' | 'custom'>('full');
  const [splitCount, setSplitCount] = useState<number>(2);
  const [customAmount, setCustomAmount] = useState<string>('');

  // Listen for active shared order for this table
  useEffect(() => {
    if (tableNumber === 'Misafir') return;
    
    const q = query(
      collection(db, 'orders'), 
      where('table', '==', tableNumber), 
      where('status', '==', 'awaiting_payment')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const orderData = snapshot.docs[0].data() as Order;
        setSharedOrder({ ...orderData, id: snapshot.docs[0].id });
      } else {
        setSharedOrder(null);
      }
    });

    return () => unsubscribe();
  }, [tableNumber]);

  // Determine what to display: Shared Order or Local Cart
  const displayItems = sharedOrder ? sharedOrder.items : cart;
  const total = sharedOrder ? sharedOrder.total : cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const paidAmount = sharedOrder?.paidAmount || 0;
  const remainingAmount = Math.max(0, total - paidAmount);

  let amountToPay = 0;
  if (paymentType === 'full') {
    amountToPay = remainingAmount;
  } else if (paymentType === 'equal') {
    amountToPay = Math.min(remainingAmount, total / splitCount);
  } else if (paymentType === 'custom') {
    amountToPay = Math.min(remainingAmount, Number(customAmount) || 0);
  }

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

  const handlePayment = async () => {
    if (!sharedOrder && cart.length === 0) return;
    if (tableNumber === 'Misafir') {
      toast.error('Sipariş vermek için masada olmalısınız. Lütfen QR kodu okutun.');
      return;
    }
    if (amountToPay <= 0 || amountToPay > remainingAmount) {
      toast.error('Lütfen geçerli bir tutar giriniz.');
      return;
    }
    if (paymentMethod === 'card' && (!cardData.number || !cardData.expiry || !cardData.cvv)) {
      toast.error('Lütfen kart bilgilerinizi eksiksiz girin.');
      return;
    }

    setIsPlacingOrder(true);
    
    // Simulate network delay and show animation
    setTimeout(async () => {
      try {
        const newPaidAmount = paidAmount + amountToPay;
        const isComplete = newPaidAmount >= total - 0.01; // floating point tolerance
        
        if (sharedOrder) {
          // Update existing shared order
          const updatedPayments = [...(sharedOrder.payments || []), { method: paymentMethod, amount: amountToPay, timestamp: Date.now() }];
          const finalMethod = updatedPayments.length > 1 ? 'mixed' : paymentMethod;
          
          await updateDoc(doc(db, 'orders', sharedOrder.id), {
            paidAmount: newPaidAmount,
            payments: updatedPayments,
            status: isComplete ? 'pending' : 'awaiting_payment',
            paymentMethod: finalMethod
          });
        } else {
          // Create new order
          const newId = generateId();
          const newOrder = {
            table: tableNumber,
            items: [...cart],
            total,
            status: isComplete ? 'pending' : 'awaiting_payment',
            paymentMethod: paymentMethod,
            paidAmount: newPaidAmount,
            payments: [{ method: paymentMethod, amount: amountToPay, timestamp: Date.now() }],
            createdAt: Date.now()
          };
          await setDoc(doc(db, 'orders', newId), newOrder);
          clearCart(); // Clear local cart since it's now in Firestore
        }

        if (isComplete) {
          setIsPlacingOrder(false);
          setIsSuccess(true);
          toast.success('Tüm ödemeler tamamlandı! Siparişiniz mutfağa iletildi.');
        } else {
          setIsPlacingOrder(false);
          toast.success(`${formatCurrency(amountToPay)} ödendi. Kalan: ${formatCurrency(total - newPaidAmount)}`);
          
          // Reset inputs for next payment
          if (paymentType === 'custom') setCustomAmount('');
          setCardData({ number: '', expiry: '', cvv: '' });
          setScannedImage(null);
        }
      } catch (error) {
        console.error("Payment error:", error);
        toast.error("Ödeme işlemi sırasında bir hata oluştu.");
        setIsPlacingOrder(false);
      }
    }, 1500);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center"
      >
        <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold text-zinc-100">Siparişiniz Alındı!</h2>
        <p className="text-zinc-400 max-w-md">
          Siparişiniz başarıyla mutfağa iletildi. Bizi tercih ettiğiniz için teşekkür ederiz, afiyet olsun!
        </p>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl mt-8 max-w-md w-full space-y-4">
          <div className="flex justify-center text-yellow-500 mb-2">
            <Star size={32} fill="currentColor" />
            <Star size={32} fill="currentColor" />
            <Star size={32} fill="currentColor" />
            <Star size={32} fill="currentColor" />
            <Star size={32} fill="currentColor" />
          </div>
          <h3 className="text-xl font-bold text-zinc-100">Deneyiminizi bizimle paylaşmak ister misiniz?</h3>
          <p className="text-sm text-zinc-400">Görüşleriniz bizim için çok değerli.</p>
          
          <div className="flex flex-col gap-3 pt-4">
            <a 
              href="https://search.google.com/local/writereview?placeid=ChIJb-49LBF_iEAR027RVQaYf-o"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Evet, Değerlendir
            </a>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-xl transition-colors"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Sepetim</h1>
      </div>

      {displayItems.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          Sepetiniz boş.
        </div>
      ) : (
        <>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {displayItems.map((item) => (
                <motion.div 
                  layout
                  variants={itemVariants}
                  exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                  key={item.cartItemId}
                  className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800 shadow-sm hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-zinc-800">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-100">{item.name}</h3>
                      <p className="text-sm text-zinc-400">{item.quantity} x {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-yellow-500">{formatCurrency(item.price * item.quantity)}</span>
                    {paidAmount === 0 && !sharedOrder && (
                      <motion.button 
                        whileHover={{ scale: 1.1, color: '#ef4444' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-zinc-500 hover:text-red-500 p-2 transition-colors"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-6 shadow-lg"
          >
            
            {/* Payment Summary */}
            <div className="space-y-2 pb-4 border-b border-zinc-800">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Toplam Hesap</span>
                <span className="text-lg font-bold text-zinc-100">{formatCurrency(total)}</span>
              </div>
              {paidAmount > 0 && (
                <div className="flex justify-between items-center text-green-500">
                  <span>Ödenen Tutar</span>
                  <span className="font-bold">-{formatCurrency(paidAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-zinc-800/50">
                <span className="text-lg text-zinc-300">Kalan Tutar</span>
                <span className="text-2xl font-bold text-yellow-500">{formatCurrency(remainingAmount)}</span>
              </div>
            </div>

            {paidAmount > 0 && remainingAmount > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex items-start gap-3"
              >
                <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-blue-400 font-bold text-sm">Masadakilerin Ödemesi Bekleniyor</h4>
                  <p className="text-blue-300/80 text-xs mt-1">
                    Kısmi ödeme alındı. Siparişin mutfağa iletilmesi için kalan tutarın ({formatCurrency(remainingAmount)}) ödenmesi bekleniyor. Lütfen sıradaki kişi için ödeme yöntemini seçin.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Payment Type Selection */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-400">Ödeme Şekli</h3>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => setPaymentType('full')} 
                  className={`py-2 rounded-lg border text-sm font-medium transition-colors ${paymentType === 'full' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                >
                  Tamamı
                </button>
                <button 
                  onClick={() => setPaymentType('equal')} 
                  className={`py-2 rounded-lg border text-sm font-medium transition-colors ${paymentType === 'equal' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                >
                  Eşit Bölüş
                </button>
                <button 
                  onClick={() => setPaymentType('custom')} 
                  className={`py-2 rounded-lg border text-sm font-medium transition-colors ${paymentType === 'custom' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                >
                  Özel Tutar
                </button>
              </div>
            </div>

            {/* Conditional Inputs based on Payment Type */}
            <AnimatePresence mode="wait">
              {paymentType === 'equal' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }} 
                  className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800"
                >
                  <span className="text-zinc-400 text-sm flex items-center gap-2"><Users size={16} /> Kişi Sayısı</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSplitCount(Math.max(2, splitCount - 1))} className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded text-zinc-300 hover:bg-zinc-700">-</button>
                    <span className="font-bold text-zinc-100 w-4 text-center">{splitCount}</span>
                    <button onClick={() => setSplitCount(Math.min(20, splitCount + 1))} className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded text-zinc-300 hover:bg-zinc-700">+</button>
                  </div>
                </motion.div>
              )}
              {paymentType === 'custom' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input 
                    type="number" 
                    placeholder="Ödenecek Tutar (TL)" 
                    value={customAmount} 
                    onChange={(e) => setCustomAmount(e.target.value)} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-yellow-500 transition-colors" 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Payment Method */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-400">Ödeme Yöntemi</h3>
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
            </div>

            {/* Card Details (if card) */}
            <AnimatePresence>
              {paymentMethod === 'card' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-4 border-t border-zinc-800 overflow-hidden"
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
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              className="w-full bg-red-700 hover:bg-red-600 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(185,28,28,0.3)] mt-4"
            >
              <CheckCircle2 size={24} />
              {paidAmount > 0 ? `${formatCurrency(amountToPay)} (Sıradaki) Öde` : `${formatCurrency(amountToPay)} Öde`}
            </motion.button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};
