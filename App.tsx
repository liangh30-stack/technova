import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ViewState, Product, Language, Employee, RepairJob, InventoryItem, Order, CustomerAddress, CustomerOrder } from './types';
import { MOCK_PRODUCTS, EMPLOYEES, MOCK_INVENTORY, MOCK_REPAIRS, HOT_BUNDLE } from './constants';
import { toLegacyLang, toI18nLang, LegacyLanguage } from './i18n';
import { getProducts } from './services/productService';
import { handleAsyncError } from './utils/errorHandler';
import { onAuthChange, AdminUser } from './services/authService';
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, getCustomerOrders } from './services/customerService';
import NavBar from './components/NavBar';
import MobileMenu from './components/MobileMenu';
import LoginModal from './components/LoginModal';
import CartDrawer from './components/CartDrawer';
import HomeCarousel from './components/HomeCarousel';
import SiteFooter from './components/SiteFooter';
import { useCart } from './hooks/useCart';
import { useCheckout } from './hooks/useCheckout';
import { useCustomerAuth } from './hooks/useCustomerAuth';
import { useFavorites } from './hooks/useFavorites';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { Loader2 } from 'lucide-react';

// Lazy load customer components
const CustomerAuthModal = lazy(() => import('./components/CustomerAuthModal'));
const MyAccountPage = lazy(() => import('./components/MyAccountPage'));

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
const LegalPage = lazy(() => import('./components/LegalPage'));
const CookieConsentBanner = lazy(() => import('./components/CookieConsentBanner'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader2 size={32} className="animate-spin text-brand-primary" />
  </div>
);

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [view, setView] = useState<ViewState>(ViewState.HOME);

  // Customer Auth
  const { customer, login: customerLogin, register: customerRegister, logout: customerLogout, resetPassword: customerResetPassword, updateProfile: customerUpdateProfile } = useCustomerAuth();
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);

  // Cart with customer sync
  const { cart, setCart, addToCart, removeFromCart, updateCartQuantity, cartTotal, cartItemCount } = useCart(customer?.uid ?? null);

  // Favorites with customer sync
  const { favorites, toggleFavorite } = useFavorites(customer?.uid ?? null);

  // Customer addresses & orders
  const [customerAddresses, setCustomerAddresses] = useState<CustomerAddress[]>([]);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);

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

  // Load customer addresses & orders when customer logs in
  useEffect(() => {
    if (customer?.uid) {
      getAddresses(customer.uid).then(setCustomerAddresses).catch(() => {});
      getCustomerOrders(customer.uid).then(setCustomerOrders).catch(() => {});
    } else {
      setCustomerAddresses([]);
      setCustomerOrders([]);
    }
  }, [customer?.uid]);

  // Customer address CRUD callbacks
  const handleAddAddress = useCallback(async (address: Omit<CustomerAddress, 'id'>) => {
    if (!customer) return;
    const newAddr = await addAddress(customer.uid, address);
    setCustomerAddresses(prev => [...prev, newAddr]);
  }, [customer]);

  const handleUpdateAddress = useCallback(async (id: string, data: Partial<CustomerAddress>) => {
    if (!customer) return;
    await updateAddress(customer.uid, id, data);
    setCustomerAddresses(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  }, [customer]);

  const handleDeleteAddress = useCallback(async (id: string) => {
    if (!customer) return;
    await deleteAddress(customer.uid, id);
    setCustomerAddresses(prev => prev.filter(a => a.id !== id));
  }, [customer]);

  const handleSetDefaultAddress = useCallback(async (id: string) => {
    if (!customer) return;
    await setDefaultAddress(customer.uid, id);
    setCustomerAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  }, [customer]);

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
    acceptTerms,
    setAcceptTerms,
    acceptPrivacy,
    setAcceptPrivacy,
    handleProceedToPayment,
    handlePlaceOrder
  } = useCheckout({
    cart,
    cartTotal,
    orders,
    setOrders,
    setCart,
    customerUid: customer?.uid ?? null
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light overflow-x-hidden">
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
          if (customer) {
            setView(ViewState.CUSTOMER_ACCOUNT);
            window.scrollTo(0, 0);
          } else if (currentUser) {
            setView(ViewState.EMPLOYEE_DASHBOARD);
          } else {
            setIsCustomerAuthOpen(true);
          }
        }}
        onMobileMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        adminUser={adminUser}
        currentUser={!!currentUser}
        customer={customer}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        loginPin={loginPin}
        setLoginPin={setLoginPin}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Customer Auth Modal */}
      <Suspense fallback={null}>
        <CustomerAuthModal
          isOpen={isCustomerAuthOpen}
          onClose={() => setIsCustomerAuthOpen(false)}
          onLoginSuccess={() => {}}
          login={customerLogin}
          register={customerRegister}
          resetPassword={customerResetPassword}
        />
      </Suspense>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        setView={setView}
        customer={customer}
        onCustomerAccountClick={() => { setView(ViewState.CUSTOMER_ACCOUNT); window.scrollTo(0, 0); }}
        onSignInClick={() => setIsCustomerAuthOpen(true)}
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
        acceptTerms={acceptTerms}
        setAcceptTerms={setAcceptTerms}
        acceptPrivacy={acceptPrivacy}
        setAcceptPrivacy={setAcceptPrivacy}
        onProceedToPayment={handleProceedToPayment}
        onPlaceOrder={handlePlaceOrder}
        customer={customer}
        onSignInClick={() => { setIsCartOpen(false); setIsCustomerAuthOpen(true); }}
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
                <Loader2 size={32} className="animate-spin text-brand-primary" />
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
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
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

        {/* Customer Account */}
        {view === ViewState.CUSTOMER_ACCOUNT && customer && (
          <MyAccountPage
            customer={customer}
            onLogout={async () => { await customerLogout(); setView(ViewState.HOME); }}
            onBack={() => { setView(ViewState.HOME); window.scrollTo(0, 0); }}
            orders={customerOrders}
            addresses={customerAddresses}
            favorites={favorites}
            products={products}
            onUpdateProfile={customerUpdateProfile}
            onAddAddress={handleAddAddress}
            onUpdateAddress={handleUpdateAddress}
            onDeleteAddress={handleDeleteAddress}
            onSetDefaultAddress={handleSetDefaultAddress}
            onToggleFavorite={toggleFavorite}
            onAddToCart={handleAddToCart}
          />
        )}
        {view === ViewState.CUSTOMER_ACCOUNT && !customer && (
          <NotFound
            onBack={() => setView(ViewState.HOME)}
            title="Please sign in"
            message="You need to sign in to access your account."
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

        {/* Legal Pages */}
        {view === ViewState.LEGAL_PRIVACY && (
          <LegalPage page="privacy" onBack={() => setView(ViewState.HOME)} onNavigate={(p) => {
            const map = { privacy: ViewState.LEGAL_PRIVACY, terms: ViewState.LEGAL_TERMS, legal: ViewState.LEGAL_NOTICE, cookies: ViewState.LEGAL_COOKIES };
            setView(map[p]); window.scrollTo(0, 0);
          }} />
        )}
        {view === ViewState.LEGAL_TERMS && (
          <LegalPage page="terms" onBack={() => setView(ViewState.HOME)} onNavigate={(p) => {
            const map = { privacy: ViewState.LEGAL_PRIVACY, terms: ViewState.LEGAL_TERMS, legal: ViewState.LEGAL_NOTICE, cookies: ViewState.LEGAL_COOKIES };
            setView(map[p]); window.scrollTo(0, 0);
          }} />
        )}
        {view === ViewState.LEGAL_NOTICE && (
          <LegalPage page="legal" onBack={() => setView(ViewState.HOME)} onNavigate={(p) => {
            const map = { privacy: ViewState.LEGAL_PRIVACY, terms: ViewState.LEGAL_TERMS, legal: ViewState.LEGAL_NOTICE, cookies: ViewState.LEGAL_COOKIES };
            setView(map[p]); window.scrollTo(0, 0);
          }} />
        )}
        {view === ViewState.LEGAL_COOKIES && (
          <LegalPage page="cookies" onBack={() => setView(ViewState.HOME)} onNavigate={(p) => {
            const map = { privacy: ViewState.LEGAL_PRIVACY, terms: ViewState.LEGAL_TERMS, legal: ViewState.LEGAL_NOTICE, cookies: ViewState.LEGAL_COOKIES };
            setView(map[p]); window.scrollTo(0, 0);
          }} />
        )}
        </Suspense>
      </main>

      {view !== ViewState.EMPLOYEE_DASHBOARD && view !== ViewState.ADMIN && view !== ViewState.CUSTOMER_ACCOUNT && (
        <Suspense fallback={null}>
          <AIAssistant />
        </Suspense>
      )}

      {view !== ViewState.EMPLOYEE_DASHBOARD && view !== ViewState.ADMIN && view !== ViewState.CUSTOMER_ACCOUNT && (
        <SiteFooter
          onOpenLogin={() => setIsLoginModalOpen(true)}
          setView={setView}
          customer={!!customer}
          onCustomerAccountClick={() => { setView(ViewState.CUSTOMER_ACCOUNT); window.scrollTo(0, 0); }}
        />
      )}

      {/* Cookie Consent Banner */}
      <Suspense fallback={null}>
        <CookieConsentBanner onViewCookiePolicy={() => { setView(ViewState.LEGAL_COOKIES); window.scrollTo(0, 0); }} />
      </Suspense>
    </div>
  );
};

export default App;
