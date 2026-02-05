import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ViewState, Product, Language, Employee, RepairJob, InventoryItem, Order } from './types';
import { MOCK_PRODUCTS, EMPLOYEES, MOCK_INVENTORY, MOCK_REPAIRS, HOT_BUNDLE } from './constants';
import { toLegacyLang, toI18nLang, LegacyLanguage } from './i18n';
import { getProducts } from './services/productService';
import { handleAsyncError } from './utils/errorHandler';
import { onAuthChange, AdminUser } from './services/authService';
import NavBar from './components/NavBar';
import MobileMenu from './components/MobileMenu';
import LoginModal from './components/LoginModal';
import CartDrawer from './components/CartDrawer';
import HomeCarousel from './components/HomeCarousel';
import SiteFooter from './components/SiteFooter';
import { useCart } from './hooks/useCart';
import { useCheckout } from './hooks/useCheckout';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components for better performance
const Hero3D = lazy(() => import('./components/Hero3D'));
const Storefront = lazy(() => import('./components/Storefront'));
const NotFound = lazy(() => import('./components/NotFound'));
const RepairLookup = lazy(() => import('./components/RepairLookup'));
const AIAssistant = lazy(() => import('./components/AIAssistant'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const CustomCaseCreator = lazy(() => import('./components/CustomCaseCreator'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));
const ProductManager = lazy(() => import('./components/ProductManager'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader2 size={32} className="animate-spin text-brand-pink" />
  </div>
);

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const { cart, setCart, addToCart, removeFromCart, updateCartQuantity, cartTotal, cartItemCount } = useCart();
  // Keep legacy lang state for backwards compatibility with child components
  const [lang, setLang] = useState<Language>(() => toLegacyLang(i18n.language));
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Sync i18next language changes to legacy lang state
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLang(toLegacyLang(lng));
    };
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Language change handler that updates both i18next and legacy state
  const handleLanguageChange = (legacyLang: LegacyLanguage) => {
    const i18nLang = toI18nLang(legacyLang);
    i18n.changeLanguage(i18nLang);
    setLang(legacyLang);
    setIsLangMenuOpen(false);
  };
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [repairSearchTerm, setRepairSearchTerm] = useState('');

  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Auth State
  const [currentUser, setCurrentUser] = useLocalStorageState<Employee | null>({
    key: 'current_user',
    fallback: null,
    removeOnNull: true
  });
  const [loginPin, setLoginPin] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Order State
  const [orders, setOrders] = useLocalStorageState<Order[]>({
    key: 'shop_orders',
    fallback: []
  });

  // Global Data State
  const [inventory, setInventory] = useLocalStorageState<InventoryItem[]>({
    key: 'inventory',
    fallback: MOCK_INVENTORY
  });

  const [repairs, setRepairs] = useLocalStorageState<RepairJob[]>({
    key: 'repairs',
    fallback: MOCK_REPAIRS
  });

  // Firebase Admin State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // 5-second Carousel Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load products from Firestore (with unified error handling)
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      await handleAsyncError(
        async () => {
          const firestoreProducts = await getProducts();
          if (firestoreProducts.length > 0) {
            setProducts(firestoreProducts);
          } else {
            setProducts([HOT_BUNDLE, ...MOCK_PRODUCTS]);
          }
        },
        undefined,
        () => setProducts([HOT_BUNDLE, ...MOCK_PRODUCTS])
      );
      setIsLoadingProducts(false);
    };

    loadProducts();
  }, []);

  // Listen for admin auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setAdminUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleAdminLogout = () => {
    setAdminUser(null);
    setView(ViewState.HOME);
    void handleAsyncError(
      async () => {
        const list = await getProducts();
        if (list.length > 0) setProducts(list);
      },
      undefined,
      () => {}
    );
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

  const {
    checkoutStep,
    setCheckoutStep,
    customerInfo,
    setCustomerInfo,
    formErrors,
    handleProceedToPayment,
    handlePlaceOrder
  } = useCheckout({
    cart,
    cartTotal,
    orders,
    setOrders,
    setCart
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Navigation */}
      <NavBar
        view={view}
        setView={setView}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        isLangMenuOpen={isLangMenuOpen}
        setIsLangMenuOpen={setIsLangMenuOpen}
        cartItemCount={cartItemCount}
        onCartClick={() => { setIsCartOpen(true); setCheckoutStep('cart'); }}
        onUserClick={() => {
          if (currentUser) {
            setView(ViewState.EMPLOYEE_DASHBOARD);
          } else {
            setIsLoginModalOpen(true);
          }
        }}
        onMobileMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        adminUser={adminUser}
        currentUser={!!currentUser}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        loginPin={loginPin}
        setLoginPin={setLoginPin}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        setView={setView}
      />

      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        cartTotal={cartTotal}
        cartItemCount={cartItemCount}
        checkoutStep={checkoutStep}
        setCheckoutStep={setCheckoutStep}
        onClose={() => setIsCartOpen(false)}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        formErrors={formErrors}
        onProceedToPayment={handleProceedToPayment}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Main Content */}
      <main className="pt-20 flex-grow">
        <Suspense fallback={<PageLoader />}>
        {view === ViewState.HOME && (
          <>
            <HomeCarousel
              carouselIndex={carouselIndex}
              setCarouselIndex={setCarouselIndex}
              layerOne={<Hero3D />}
            />
            
            {isLoadingProducts ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-brand-pink" />
              </div>
            ) : (
              <Storefront
                products={products}
                onAddToCart={handleAddToCart}
                lang={lang}
                onTrackOrderClick={(searchTerm) => {
                  if (searchTerm) setRepairSearchTerm(searchTerm);
                  setView(ViewState.REPAIR_LOOKUP);
                  window.scrollTo(0,0);
                }}
                onStartCustomDesign={() => { setView(ViewState.CUSTOM_CASE); window.scrollTo(0,0); }}
              />
            )}
          </>
        )}

        {view === ViewState.REPAIR_LOOKUP && (
          <RepairLookup
            onBrowseShop={() => { setView(ViewState.HOME); window.scrollTo(0,0); }}
            lang={lang}
            initialSearchTerm={repairSearchTerm}
            onClearSearch={() => setRepairSearchTerm('')}
          />
        )}
        {view === ViewState.CUSTOM_CASE && <CustomCaseCreator lang={lang} onAddToCart={handleAddToCart} onBack={() => setView(ViewState.HOME)} />}
        
        {view === ViewState.EMPLOYEE_DASHBOARD && !currentUser && (
          <NotFound
            onBack={() => setView(ViewState.HOME)}
            title="请先登录"
            message="您需要登录员工账号才能访问此页面。"
          />
        )}
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

        {/* Admin Panel Views */}
        {view === ViewState.ADMIN && !adminUser && (
          <AdminLogin
            onLoginSuccess={() => {}}
            onBack={() => setView(ViewState.HOME)}
          />
        )}

        {view === ViewState.ADMIN && adminUser && (
          <ProductManager
            adminUser={adminUser}
            onLogout={handleAdminLogout}
            onBack={() => setView(ViewState.HOME)}
          />
        )}
        </Suspense>
      </main>

      {view !== ViewState.EMPLOYEE_DASHBOARD && view !== ViewState.ADMIN && (
        <Suspense fallback={null}>
          <AIAssistant />
        </Suspense>
      )}

      {view !== ViewState.EMPLOYEE_DASHBOARD && view !== ViewState.ADMIN && (
        <SiteFooter onOpenLogin={() => setIsLoginModalOpen(true)} setView={setView} />
      )}
    </div>
  );
};

export default App;
