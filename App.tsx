import React, { useState, useEffect } from 'react';
import { ViewState, Product, Language, Employee, StockTransfer, RepairJob, InventoryItem, Order } from './types';
import { MOCK_PRODUCTS, TRANSLATIONS, EMPLOYEES, MOCK_INVENTORY, MOCK_REPAIRS } from './constants';
import Hero3D from './components/Hero3D';
import Storefront from './components/Storefront';
import RepairLookup from './components/RepairLookup';
import AIAssistant from './components/AIAssistant';
import Dashboard from './components/Dashboard';
import CustomCaseCreator from './components/CustomCaseCreator';
import { ShoppingCart, User, Globe, X, Trash2, ShoppingBag, CheckCircle2, LogIn, CreditCard, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [cart, setCart] = useState<Product[]>([]);
  const [lang, setLang] = useState<Language>('ES');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'none' | 'shipping' | 'payment' | 'success'>('none');
  
  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Auth State
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const saved = localStorage.getItem('current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loginPin, setLoginPin] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Order State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('shop_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Global Data State
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : MOCK_INVENTORY;
  });

  const [repairs, setRepairs] = useState<RepairJob[]>(() => {
    const saved = localStorage.getItem('repairs');
    return saved ? JSON.parse(saved) : MOCK_REPAIRS;
  });

  // 5-second Carousel Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('shop_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('current_user');
    }
  }, [currentUser]);

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleLogin = () => {
    const emp = EMPLOYEES.find(e => e.pin === loginPin);
    if (emp) {
      setCurrentUser(emp);
      setView(ViewState.EMPLOYEE_DASHBOARD);
      setIsLoginModalOpen(false);
      setLoginPin('');
    } else {
      alert("PIN incorrecto. Probar: 1234 (主管) o 8888 (工人)");
    }
  };

  const cartTotal = cart.reduce((acc, p) => acc + p.price, 0);

  const handlePlaceOrder = (paymentMethod: 'Stripe' | 'PayPal') => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: "Cliente Web",
      email: "cliente@technova.es",
      phone: "600 000 000",
      address: "Calle Tech, 123, Madrid",
      items: [...cart],
      total: cartTotal,
      status: 'Paid',
      paymentMethod,
      date: new Date().toISOString()
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('shop_orders', JSON.stringify(updatedOrders));
    setCart([]);
    setCheckoutStep('success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b h-20 flex items-center px-4">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(ViewState.HOME)}>
            <div className="bg-brand-pink text-white font-bold p-2 rounded-lg text-lg">TN</div>
            <span className="text-2xl font-bold tracking-tight text-brand-dark">TechNova</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => { setView(ViewState.HOME); window.scrollTo(0,0); }} className={`text-sm font-bold uppercase tracking-widest transition-colors ${view === ViewState.HOME ? 'text-brand-pink' : 'text-brand-dark hover:text-brand-pink'}`}>
              {TRANSLATIONS[lang].navShop}
            </button>
            <button onClick={() => { setView(ViewState.REPAIR_LOOKUP); window.scrollTo(0,0); }} className={`text-sm font-bold uppercase tracking-widest transition-colors ${view === ViewState.REPAIR_LOOKUP ? 'text-brand-pink' : 'text-brand-dark hover:text-brand-pink'}`}>
              {TRANSLATIONS[lang].navTrack}
            </button>
            <button onClick={() => { setView(ViewState.CUSTOM_CASE); window.scrollTo(0,0); }} className={`text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${view === ViewState.CUSTOM_CASE ? 'text-brand-pink' : 'text-brand-dark hover:text-brand-pink'}`}>
              <Sparkles size={16} /> DISEÑO AI
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 md:gap-4 text-brand-dark">
              <div className="relative">
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-1 hover:text-brand-pink transition-colors p-2">
                  <Globe size={20} />
                  <span className="text-xs font-bold">{lang}</span>
                </button>
                {isLangMenuOpen && (
                  <div className="absolute top-12 right-0 bg-white border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 w-24">
                    {(['EN', 'CN', 'ES', 'FR', 'DE'] as Language[]).map(l => (
                      <button key={l} onClick={() => { setLang(l); setIsLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-gray-50 ${lang === l ? 'text-brand-pink bg-pink-50' : 'text-gray-600'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative cursor-pointer group p-2" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart size={22} className="group-hover:text-brand-pink transition-colors" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-pink text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {cart.length}
                  </span>
                )}
              </div>

              <button 
                className={`transition-colors p-1 md:p-0 ${currentUser ? 'text-brand-pink' : 'hover:text-brand-pink text-brand-dark'}`} 
                onClick={() => {
                  if (currentUser) {
                    setView(ViewState.EMPLOYEE_DASHBOARD);
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
              >
                <User size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm animate-in fade-in" onClick={() => setIsLoginModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#0d1525] z-[110] rounded-[2rem] p-10 shadow-2xl border border-white/10 animate-in zoom-in-95">
             <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 rotate-3">
                   <LogIn size={36} className="text-white -mr-1" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">Staff Portal</h3>
                <p className="text-slate-400 text-sm mt-2 font-medium">Enter PIN to access Admin Dashboard</p>
             </div>
             
             <div className="relative group">
               <input 
                 type="password" 
                 maxLength={4}
                 value={loginPin}
                 onChange={e => setLoginPin(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleLogin()}
                 placeholder="••••"
                 autoFocus
                 className="w-full bg-[#050912] border border-white/10 rounded-2xl py-5 text-center text-4xl tracking-[1.2rem] text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none mb-8 font-mono transition-all placeholder:tracking-normal placeholder:text-slate-700"
               />
               <div className="absolute inset-x-0 -bottom-2 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
             </div>

             <button 
               onClick={handleLogin}
               className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-500 active:scale-95 transition-all shadow-2xl shadow-blue-500/30"
             >
               Enter Backend
             </button>

             <p className="text-center text-[10px] text-slate-500 mt-6 uppercase tracking-widest font-bold">Authorized Personnel Only</p>
          </div>
        </>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm animate-in fade-in" onClick={() => { setIsCartOpen(false); setCheckoutStep('none'); }} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
               <h3 className="text-xl font-bold flex items-center gap-2 text-brand-dark">
                  <ShoppingBag size={24} className="text-brand-pink" /> 
                  {checkoutStep === 'success' ? 'Orden Exitosa' : 'Tu Carrito'}
               </h3>
               <button onClick={() => { setIsCartOpen(false); setCheckoutStep('none'); }} className="p-2 hover:bg-gray-200 rounded-full">
                  <X size={24} />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {checkoutStep === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                     <CheckCircle2 size={48} />
                  </div>
                  <h4 className="text-2xl font-black text-brand-dark">¡Gracias por tu compra!</h4>
                  <p className="text-gray-500 text-sm">Tu pedido ha sido procesado. El equipo de TechNova lo gestionará de inmediato.</p>
                  <button onClick={() => { setIsCartOpen(false); setCheckoutStep('none'); }} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold">Volver</button>
                </div>
              ) : (
                <div className="space-y-4">
                   {cart.length === 0 ? (
                     <div className="py-20 text-center opacity-40">El carrito está vacío</div>
                   ) : (
                     cart.map((item, idx) => (
                       <div key={idx} className="flex gap-4 p-3 border rounded-xl bg-gray-50">
                          <img src={item.image} className="w-16 h-16 object-cover rounded-lg" alt="" />
                          <div className="flex-1">
                             <div className="text-sm font-bold text-brand-dark">{item.name}</div>
                             {item.selectedModel && <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.selectedModel}</div>}
                             <div className="text-brand-pink font-bold">€{item.price.toFixed(2)}</div>
                          </div>
                          <button onClick={() => removeFromCart(idx)}><Trash2 size={16} className="text-gray-300"/></button>
                       </div>
                     ))
                   )}
                </div>
              )}
            </div>

            {cart.length > 0 && checkoutStep !== 'success' && (
              <div className="p-6 border-t">
                 <div className="flex justify-between items-center mb-4 text-xl font-black">
                    <span>Total</span>
                    <span>€{cartTotal.toFixed(2)}</span>
                 </div>
                 <button 
                   onClick={() => handlePlaceOrder('Stripe')}
                   className="w-full bg-brand-pink text-white py-4 rounded-xl font-bold text-lg"
                 >
                   Pagar Ahora
                 </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="pt-20 flex-grow">
        {view === ViewState.HOME && (
          <>
            <div className="relative overflow-hidden h-[500px]">
              {/* Layer 1: 3D Interactive */}
              <div className={`absolute inset-0 transition-opacity duration-1000 ${carouselIndex === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <Hero3D />
              </div>
              
              {/* Layer 2: 3x2 Promo */}
              <div className={`absolute inset-0 transition-opacity duration-1000 ${carouselIndex === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <div className="relative bg-brand-pink text-white h-full overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-xs font-bold tracking-widest mb-4 uppercase">Promo de Verano</span>
                    <h1 className="text-5xl md:text-8xl font-black mb-4 leading-tight tracking-tight uppercase drop-shadow-lg">3x2 en Accesorios</h1>
                    <p className="text-xl md:text-3xl font-light text-white/90 mb-8 max-w-2xl mx-auto">Combina tus estilos favoritos</p>
                    <button className="bg-white text-brand-pink font-bold py-4 px-12 rounded-full text-xl hover:shadow-2xl transition-all active:scale-95">Comprar Ahora</button>
                  </div>
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                 <div 
                   className={`w-3 h-3 rounded-full transition-all cursor-pointer ${carouselIndex === 0 ? 'bg-white w-10 ring-2 ring-white/20' : 'bg-white/40 hover:bg-white/60'}`} 
                   onClick={() => setCarouselIndex(0)} 
                 />
                 <div 
                   className={`w-3 h-3 rounded-full transition-all cursor-pointer ${carouselIndex === 1 ? 'bg-white w-10 ring-2 ring-white/20' : 'bg-white/40 hover:bg-white/60'}`} 
                   onClick={() => setCarouselIndex(1)} 
                 />
              </div>
            </div>
            
            <Storefront 
              products={MOCK_PRODUCTS} 
              onAddToCart={addToCart} 
              lang={lang} 
              onTrackOrderClick={() => { setView(ViewState.REPAIR_LOOKUP); window.scrollTo(0,0); }} 
              onStartCustomDesign={() => { setView(ViewState.CUSTOM_CASE); window.scrollTo(0,0); }}
            />
          </>
        )}

        {view === ViewState.REPAIR_LOOKUP && <RepairLookup onBrowseShop={() => { setView(ViewState.HOME); window.scrollTo(0,0); }} lang={lang} />}
        {view === ViewState.CUSTOM_CASE && <CustomCaseCreator lang={lang} onAddToCart={addToCart} onBack={() => setView(ViewState.HOME)} />}
        
        {view === ViewState.EMPLOYEE_DASHBOARD && currentUser && (
          <Dashboard 
            lang={lang} 
            inventory={inventory} setInventory={setInventory} 
            repairs={repairs} setRepairs={setRepairs}
            employees={EMPLOYEES} setEmployees={() => {}} 
            currentUser={currentUser} 
            onLogout={() => { setCurrentUser(null); setView(ViewState.HOME); }}
            onDeleteRepair={(id) => setRepairs(prev => prev.filter(r => r.id !== id))}
            onClockIn={() => {}} onUpdateSchedule={() => {}}
            transfers={[]} onInitiateTransfer={() => {}} onConfirmTransfer={() => {}}
            showAttendance={true} setShowAttendance={() => {}}
            commonProblems={['Pantalla', 'Batería', 'Carga', 'Agua']} setCommonProblems={() => {}}
          />
        )}
      </main>

      {view !== ViewState.EMPLOYEE_DASHBOARD && <AIAssistant />}
      
      {view !== ViewState.EMPLOYEE_DASHBOARD && (
        <footer className="bg-brand-dark text-white py-16 px-4 border-t border-slate-800">
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold tracking-tight">TechNova</h3>
                <p className="text-gray-400 text-sm font-light">Professional Mobile Repair & Premium Fashion Accessories. Redefining your tech experience since 2018.</p>
              </div>
              <div>
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-pink">Support</h4>
                <ul className="text-sm text-gray-400 space-y-3">
                  <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={() => { setView(ViewState.REPAIR_LOOKUP); window.scrollTo(0,0); }}>Track Order</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-pink">Design</h4>
                <ul className="text-sm text-gray-400 space-y-3">
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={() => { setView(ViewState.CUSTOM_CASE); window.scrollTo(0,0); }}>AI Custom Case</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-pink">Portal</h4>
                <ul className="text-sm text-gray-400 space-y-3">
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setIsLoginModalOpen(true)}>Staff Login</li>
                </ul>
              </div>
           </div>
           <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-xs text-gray-500 font-medium">
             &copy; {new Date().getFullYear()} TechNova Ecosystem. All rights reserved.
           </div>
        </footer>
      )}
    </div>
  );
};

export default App;