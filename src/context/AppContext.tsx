import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateId } from '../utils/format';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { toast } from 'sonner';

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
};

export type CartItem = MenuItem & { quantity: number; cartItemId: string };

export type Order = {
  id: string;
  table: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  paymentMethod?: 'cash' | 'card' | 'pos' | 'mixed';
  createdAt: number;
};

export type WaiterCall = {
  id: string;
  table: string;
  status: 'active' | 'resolved';
  createdAt: number;
};

export type User = {
  username: string;
  role: 'supervisor' | 'kitchen';
} | null;

type AppContextType = {
  menu: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  
  orders: Order[];
  placeOrder: (table: string, paymentMethod: 'cash' | 'card' | 'pos' | 'mixed') => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  
  calls: WaiterCall[];
  callWaiter: (table: string) => Promise<void>;
  resolveCall: (id: string) => Promise<void>;
  
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
  isAuthReady: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Error handling helper
function handleFirestoreError(error: unknown, operationType: string, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  toast.error("İşlem sırasında bir hata oluştu veya yetkiniz yok.");
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('apo_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [calls, setCalls] = useState<WaiterCall[]>([]);
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('apo_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthReady, setIsAuthReady] = useState(false);
  const ordersRef = React.useRef<Order[]>([]);

  // Sync cart and user to localStorage (local state)
  useEffect(() => { localStorage.setItem('apo_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { 
    if (user) {
      localStorage.setItem('apo_user', JSON.stringify(user)); 
    } else {
      localStorage.removeItem('apo_user');
    }
  }, [user]);

  // Auth State Listener (Bypassed Firebase Auth)
  useEffect(() => {
    setIsAuthReady(true);
  }, []);

  // Firestore Listeners
  useEffect(() => {
    if (!isAuthReady) return;

    // Menu Listener (Public)
    const unsubMenu = onSnapshot(collection(db, 'menu'), (snapshot) => {
      const menuData: MenuItem[] = [];
      snapshot.forEach((doc) => {
        menuData.push({ id: doc.id, ...doc.data() } as MenuItem);
      });
      setMenu(menuData);
    }, (error) => handleFirestoreError(error, 'get', 'menu'));

    let unsubOrders: () => void;
    let unsubCalls: () => void;

    // Staff Listeners
    if (user?.role === 'supervisor' || user?.role === 'kitchen') {
      let initialOrdersLoad = true;
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
        const ordersData: Order[] = [];
        snapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(ordersData);

        if (!initialOrdersLoad) {
          snapshot.docChanges().forEach((change) => {
            const order = change.doc.data() as Order;
            
            // Trigger notification for new pending orders, or orders that just became pending
            if (
              (change.type === 'added' && order.status === 'pending') ||
              (change.type === 'modified' && order.status === 'pending')
            ) {
              const wasAlreadyPending = ordersRef.current.some(o => o.id === order.id && o.status === 'pending');
              
              if (!wasAlreadyPending) {
                toast.success(`Yeni Sipariş Geldi! (Masa: ${order.table})`, {
                  duration: 5000,
                  icon: '🔔',
                  style: { background: '#ef4444', color: '#fff', border: 'none' }
                });
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play().catch(e => console.log('Audio play failed:', e));
              }
            }
          });
        }
        initialOrdersLoad = false;
        ordersRef.current = ordersData;
      }, (error) => handleFirestoreError(error, 'get', 'orders'));

      let initialCallsLoad = true;
      const callsQuery = query(collection(db, 'calls'), orderBy('createdAt', 'desc'));
      unsubCalls = onSnapshot(callsQuery, (snapshot) => {
        const callsData: WaiterCall[] = [];
        snapshot.forEach((doc) => {
          callsData.push({ id: doc.id, ...doc.data() } as WaiterCall);
        });
        setCalls(callsData);

        if (!initialCallsLoad) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const call = change.doc.data() as WaiterCall;
              toast.success(`Garson Çağrısı! (Masa: ${call.table})`, {
                duration: 5000,
                icon: '👋',
                style: { background: '#eab308', color: '#000', border: 'none' }
              });
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
              audio.play().catch(e => console.log('Audio play failed:', e));
            }
          });
        }
        initialCallsLoad = false;
      }, (error) => handleFirestoreError(error, 'get', 'calls'));
    }

    return () => {
      unsubMenu();
      if (unsubOrders) unsubOrders();
      if (unsubCalls) unsubCalls();
    };
  }, [isAuthReady, user]);

  // Menu Actions
  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const newId = generateId();
      await setDoc(doc(db, 'menu', newId), item);
      toast.success("Ürün eklendi");
    } catch (error) {
      handleFirestoreError(error, 'write', 'menu');
    }
  };
  
  const deleteMenuItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'menu', id));
      toast.success("Ürün silindi");
    } catch (error) {
      handleFirestoreError(error, 'delete', `menu/${id}`);
    }
  };
  
  const updateMenuItem = async (id: string, item: Partial<MenuItem>) => {
    try {
      await updateDoc(doc(db, 'menu', id), item);
      toast.success("Ürün güncellendi");
    } catch (error) {
      handleFirestoreError(error, 'update', `menu/${id}`);
    }
  };

  // Cart Actions
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1, cartItemId: generateId() }];
    });
    toast.success(`${item.name} sepete eklendi`);
  };
  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(c => c.cartItemId !== cartItemId));
  };
  const clearCart = () => setCart([]);

  // Order Actions
  const placeOrder = async (table: string, paymentMethod: 'cash' | 'card' | 'pos' | 'mixed') => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newId = generateId();
    const newOrder = {
      table,
      items: [...cart],
      total,
      status: 'pending',
      paymentMethod,
      createdAt: Date.now()
    };
    
    try {
      await setDoc(doc(db, 'orders', newId), newOrder);
      clearCart();
      toast.success("Siparişiniz alındı!");
    } catch (error) {
      handleFirestoreError(error, 'write', 'orders');
    }
  };
  
  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
    } catch (error) {
      handleFirestoreError(error, 'update', `orders/${id}`);
    }
  };

  // Call Actions
  const callWaiter = async (table: string) => {
    const newId = generateId();
    try {
      await setDoc(doc(db, 'calls', newId), {
        table,
        status: 'active',
        createdAt: Date.now()
      });
      toast.success("Garson çağrıldı");
    } catch (error) {
      handleFirestoreError(error, 'write', 'calls');
    }
  };
  
  const resolveCall = async (id: string) => {
    try {
      await updateDoc(doc(db, 'calls', id), { status: 'resolved' });
    } catch (error) {
      handleFirestoreError(error, 'update', `calls/${id}`);
    }
  };

  // Auth Actions
  const logout = () => {
    setUser(null);
    toast.success("Çıkış yapıldı");
  };

  return (
    <AppContext.Provider value={{
      menu, addMenuItem, deleteMenuItem, updateMenuItem,
      cart, addToCart, removeFromCart, clearCart,
      orders, placeOrder, updateOrderStatus,
      calls, callWaiter, resolveCall,
      user, setUser, logout, isAuthReady
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
