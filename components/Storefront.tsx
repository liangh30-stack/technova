import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Product, Language } from '../types';
import { ShoppingBag, Star, Flame, ChevronRight, Smartphone, Shield, Zap, Battery, Plug, Headphones, Grid, Layers, X, Sparkles, Wand2, Search, Heart, Eye, Clock, TrendingUp, Gift, Percent, ThumbsUp, CheckCircle } from 'lucide-react';
import { BRAND_MODELS } from '../constants';

// Review type
interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
  helpful: number;
}

// Fake reviews data - realistic mix of ratings and comments
const FAKE_REVIEWS: Record<string, Review[]> = {
  default: [
    { id: 'r1', author: 'María G.', rating: 5, date: '2026-01-28', text: 'Excelente calidad, llegó antes de lo esperado. Muy contenta con la compra.', verified: true, helpful: 24 },
    { id: 'r2', author: 'Carlos M.', rating: 4, date: '2026-01-25', text: 'Buen producto, aunque el color es un poco diferente a la foto. Por lo demás perfecto.', verified: true, helpful: 18 },
    { id: 'r3', author: 'Ana P.', rating: 5, date: '2026-01-22', text: 'Mi tercera compra aquí, siempre productos de calidad. 100% recomendado.', verified: true, helpful: 31 },
    { id: 'r4', author: 'Luis R.', rating: 3, date: '2026-01-20', text: 'Cumple su función pero esperaba mejor acabado por el precio.', verified: false, helpful: 8 },
    { id: 'r5', author: 'Elena S.', rating: 5, date: '2026-01-18', text: 'Increíble relación calidad-precio. El envío muy rápido.', verified: true, helpful: 42 },
  ],
  case: [
    { id: 'c1', author: 'Pablo V.', rating: 5, date: '2026-01-30', text: 'La funda ajusta perfectamente, muy buena protección. Ya se me cayó el móvil y ni un rasguño.', verified: true, helpful: 67 },
    { id: 'c2', author: 'Laura B.', rating: 4, date: '2026-01-27', text: 'Bonito diseño y buena calidad. Solo le doy 4 estrellas porque tarda un poco en llegar.', verified: true, helpful: 23 },
    { id: 'c3', author: 'Miguel A.', rating: 5, date: '2026-01-24', text: 'Es la segunda que compro, la primera duró 2 años sin problemas. Muy resistente.', verified: true, helpful: 89 },
    { id: 'c4', author: 'Sofía L.', rating: 4, date: '2026-01-21', text: 'Me encanta el tacto mate, no se resbala. Los botones responden bien.', verified: true, helpful: 34 },
    { id: 'c5', author: 'Javier T.', rating: 3, date: '2026-01-19', text: 'Está bien pero he visto fundas similares más baratas. La calidad es correcta.', verified: false, helpful: 12 },
    { id: 'c6', author: 'Carmen R.', rating: 5, date: '2026-01-15', text: 'Compré para mi iPhone y para el Samsung de mi marido. Ambas perfectas!', verified: true, helpful: 45 },
  ],
  charger: [
    { id: 'ch1', author: 'David H.', rating: 5, date: '2026-01-29', text: 'Carga súper rápido, en 30 min ya tengo el 50%. Muy satisfecho.', verified: true, helpful: 78 },
    { id: 'ch2', author: 'Isabel M.', rating: 4, date: '2026-01-26', text: 'Funciona muy bien, aunque calienta un poco. Nada preocupante.', verified: true, helpful: 29 },
    { id: 'ch3', author: 'Roberto C.', rating: 5, date: '2026-01-23', text: 'Por fin un cargador que cumple lo que promete. Carga rápida de verdad.', verified: true, helpful: 56 },
    { id: 'ch4', author: 'Patricia N.', rating: 3, date: '2026-01-20', text: 'El cargador bien pero no incluye cable. Debería especificarlo mejor.', verified: true, helpful: 41 },
    { id: 'ch5', author: 'Fernando G.', rating: 4, date: '2026-01-17', text: 'Compacto y potente. Lo uso para el móvil y tablet sin problemas.', verified: true, helpful: 33 },
  ],
  protector: [
    { id: 'p1', author: 'Lucía F.', rating: 5, date: '2026-01-28', text: 'Se instala facilísimo con la guía incluida. Ni una burbuja. Perfecto.', verified: true, helpful: 92 },
    { id: 'p2', author: 'Andrés K.', rating: 4, date: '2026-01-25', text: 'Buena protección, el tacto es muy similar al cristal original.', verified: true, helpful: 38 },
    { id: 'p3', author: 'Marta J.', rating: 5, date: '2026-01-22', text: 'Ya van 3 meses y ni un rasguño. Resistente a todo. Muy recomendable.', verified: true, helpful: 64 },
    { id: 'p4', author: 'Sergio P.', rating: 3, date: '2026-01-19', text: 'El protector está bien pero el kit de instalación es básico.', verified: false, helpful: 15 },
    { id: 'p5', author: 'Cristina D.', rating: 4, date: '2026-01-16', text: 'Muy transparente, apenas se nota que está puesto. Buen producto.', verified: true, helpful: 27 },
  ],
  bundle: [
    { id: 'b1', author: 'Alejandro R.', rating: 5, date: '2026-01-30', text: 'El pack completo a un precio increíble. Todo de buena calidad. Súper oferta!', verified: true, helpful: 156 },
    { id: 'b2', author: 'Natalia S.', rating: 5, date: '2026-01-27', text: 'Compré este pack para mi móvil nuevo. Tiene todo lo necesario. Muy contenta.', verified: true, helpful: 89 },
    { id: 'b3', author: 'Diego M.', rating: 4, date: '2026-01-24', text: 'Muy buen pack, solo que la funda podría tener más colores para elegir.', verified: true, helpful: 34 },
    { id: 'b4', author: 'Raquel V.', rating: 5, date: '2026-01-21', text: 'Regalé este pack a mi hermano y está encantado. Gran relación calidad-precio.', verified: true, helpful: 67 },
  ],
  cable: [
    { id: 'ca1', author: 'Víctor L.', rating: 4, date: '2026-01-29', text: 'Cable resistente, ya llevo 4 meses usándolo a diario sin problemas.', verified: true, helpful: 43 },
    { id: 'ca2', author: 'Beatriz A.', rating: 5, date: '2026-01-26', text: 'Por fin un cable que no se rompe en 2 meses. La trenza es muy resistente.', verified: true, helpful: 71 },
    { id: 'ca3', author: 'Óscar E.', rating: 3, date: '2026-01-23', text: 'Funciona bien pero es un poco corto para mi gusto. 1.5m estaría mejor.', verified: true, helpful: 22 },
    { id: 'ca4', author: 'Teresa G.', rating: 5, date: '2026-01-20', text: 'Carga rápida y transferencia de datos sin problemas. Excelente compra.', verified: true, helpful: 38 },
  ],
  powerbank: [
    { id: 'pb1', author: 'Rubén M.', rating: 5, date: '2026-01-28', text: 'Capacidad real, he cargado mi móvil 4 veces completas. Impresionante.', verified: true, helpful: 134 },
    { id: 'pb2', author: 'Alicia T.', rating: 4, date: '2026-01-25', text: 'Muy potente y compacta. Un poco pesada pero merece la pena.', verified: true, helpful: 56 },
    { id: 'pb3', author: 'Gonzalo R.', rating: 5, date: '2026-01-22', text: 'Perfecta para viajes. La uso para móvil, tablet y auriculares.', verified: true, helpful: 89 },
    { id: 'pb4', author: 'Inés C.', rating: 3, date: '2026-01-19', text: 'Buena batería pero tarda bastante en cargarse ella misma.', verified: true, helpful: 47 },
  ],
};

// Get reviews for a product based on category
const getProductReviews = (product: Product): Review[] => {
  if (product.isBundle) return FAKE_REVIEWS.bundle;
  const category = product.category.toLowerCase();
  if (category.includes('case') || category.includes('funda')) return FAKE_REVIEWS.case;
  if (category.includes('charger') || category.includes('cargador')) return FAKE_REVIEWS.charger;
  if (category.includes('protector') || category.includes('screen')) return FAKE_REVIEWS.protector;
  if (category.includes('cable')) return FAKE_REVIEWS.cable;
  if (category.includes('power') || category.includes('bank') || category.includes('batería')) return FAKE_REVIEWS.powerbank;
  return FAKE_REVIEWS.default;
};

// Calculate average rating from reviews
const getAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 4.5;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

// Generate pseudo-random but consistent rating count based on product id
const getReviewCount = (productId: string): number => {
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = ((hash << 5) - hash) + productId.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash % 180) + 28; // 28-207 reviews
};

interface StorefrontProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  lang: Language;
  onTrackOrderClick: (searchTerm?: string) => void;
  onStartCustomDesign: () => void;
}

const Storefront: React.FC<StorefrontProps> = ({ products, onAddToCart, lang, onTrackOrderClick, onStartCustomDesign }) => {
  const { t } = useTranslation();
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailSelectedModel, setDetailSelectedModel] = useState<string>('');
  const [productSearch, setProductSearch] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showAllReviews, setShowAllReviews] = useState(false);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  // Star rating component
  const StarRating = ({ rating, size = 12 }: { rating: number; size?: number }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          fill={star <= Math.floor(rating) ? '#fbbf24' : (star - 0.5 <= rating ? '#fbbf24' : 'none')}
          className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );

  const openProductDetail = (product: Product) => {
    setDetailProduct(product);
    setDetailSelectedModel(product.compatibleModels?.[0] || '');
  };

  const handleAddToCartFromDetail = () => {
    if (!detailProduct) return;
    const productWithModel = {
      ...detailProduct,
      selectedModel: detailSelectedModel || undefined
    };
    onAddToCart(productWithModel);
    setDetailProduct(null);
    setDetailSelectedModel('');
  };

  const availableModels = selectedBrand ? BRAND_MODELS[selectedBrand] || [] : [];

  const displayProducts = useMemo(() => {
    return products.filter(p => {
      if (productSearch.trim()) {
        const searchLower = productSearch.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          (p.brand && p.brand.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }
      if (selectedBrand && p.brand && p.brand !== selectedBrand && p.brand !== 'Universal' && !p.isBundle) return false;
      if (selectedModel) {
        if (p.brand === 'Universal') return true;
        if (p.isBundle) return true;
        if (p.compatibleModels && !p.compatibleModels.includes(selectedModel)) return false;
      }
      if (selectedCategory && p.category !== selectedCategory && !p.isBundle) return false;
      return true;
    });
  }, [products, selectedBrand, selectedModel, selectedCategory, productSearch]);

  const CATEGORIES = [
    { id: '', label: 'All', icon: Grid },
    { id: 'Case', label: 'Cases', icon: Smartphone },
    { id: 'Screen Protector', label: 'Protectors', icon: Shield },
    { id: 'Charger', label: 'Chargers', icon: Zap },
    { id: 'Cable', label: 'Cables', icon: Plug },
    { id: 'Power Bank', label: 'Power Banks', icon: Battery },
    { id: 'Strap', label: 'Straps', icon: Layers },
    { id: 'Audio', label: 'Audio', icon: Headphones },
  ];

  const getCategoryLabel = (id: string) => {
    const map: Record<string, string> = {
      '': t('catAll'),
      'Case': t('catCases'),
      'Screen Protector': t('catProtectors'),
      'Charger': t('catChargers'),
      'Cable': t('catCables'),
      'Power Bank': t('catPowerBanks'),
      'Strap': t('catStraps'),
      'Audio': t('catAudio'),
    };
    return map[id] || id;
  };

  return (
    <div className="bg-brand-light min-h-screen pb-20 font-sans">
      {/* Promotional Banner - Stripe style gradient */}
      <div className="bg-gradient-to-r from-brand-purple via-brand-blue to-brand-cyan py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-white text-sm">
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <Gift size={12} />
          </div>
          <span className="font-medium">{t('promoBanner')}</span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="hidden sm:flex items-center gap-1.5 text-white/80">
            <Clock size={14} />
            {t('promoEnds')}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Categories Row - Stripe style pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isActive ? '' : cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-dark text-white shadow-lg shadow-brand-dark/25'
                    : 'bg-white text-brand-muted hover:text-brand-dark hover:shadow-md border border-gray-200/60'
                }`}
              >
                <cat.icon size={16} />
                {getCategoryLabel(cat.id)}
              </button>
            );
          })}
        </div>

        {/* Feature Cards Row - Stripe style bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* AI Design Card */}
          <button
            onClick={onStartCustomDesign}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand-secondary to-brand-dark p-6 text-left text-white hover-lift"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 via-transparent to-brand-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-purple to-brand-cyan rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Wand2 size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{t('aiDesignTitle')}</h3>
              <p className="text-white/50 text-sm">{t('aiDesignDesc')}</p>
              <div className="mt-4 flex items-center gap-1 text-brand-cyan text-sm font-medium">
                Try now <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Track Order Card */}
          <button
            onClick={() => onTrackOrderClick()}
            className="group relative overflow-hidden rounded-2xl bg-white p-6 text-left hover-lift border border-gray-200/60"
          >
            <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Smartphone size={120} className="text-brand-purple" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-brand-purple/10 rounded-xl flex items-center justify-center mb-4">
                <Search size={22} className="text-brand-purple" />
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-1">{t('trackTitle')}</h3>
              <p className="text-brand-muted text-sm">{t('trackCardDesc')}</p>
              <div className="mt-4 flex items-center gap-1 text-brand-purple text-sm font-medium">
                Track order <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Special Offer Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-purple via-brand-blue to-brand-cyan p-6 text-white hover-lift cursor-pointer">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
            </div>
            <div className="absolute -right-8 -top-8 opacity-10">
              <Percent size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <TrendingUp size={22} />
              </div>
              <h3 className="text-lg font-semibold mb-1">{t('offerTitle')}</h3>
              <p className="text-white/70 text-sm">{t('offerDesc')}</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Limited time
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar - Stripe style clean */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="text"
                placeholder={t('searchProducts')}
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-brand-light border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none text-sm text-brand-dark placeholder:text-brand-muted"
              />
              {productSearch && (
                <button onClick={() => setProductSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Brand Select */}
            <select
              className="px-4 py-3 bg-brand-light border border-gray-200/80 rounded-xl text-sm text-brand-dark focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none min-w-[160px] cursor-pointer"
              value={selectedBrand}
              onChange={e => { setSelectedBrand(e.target.value); setSelectedModel(''); }}
            >
              <option value="">{t('allBrands')}</option>
              {Object.keys(BRAND_MODELS).map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            {/* Model Select */}
            <select
              className="px-4 py-3 bg-brand-light border border-gray-200/80 rounded-xl text-sm text-brand-dark focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none min-w-[160px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
            >
              <option value="">{selectedBrand ? t('selectModel') : t('selectBrandFirst')}</option>
              {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            {(selectedBrand || selectedCategory || productSearch) && (
              <button
                onClick={() => { setSelectedBrand(''); setSelectedModel(''); setSelectedCategory(''); setProductSearch(''); }}
                className="px-4 py-3 text-brand-purple font-semibold text-sm hover:bg-brand-purple/5 rounded-xl transition-colors"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div id="product-grid">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-brand-dark tracking-tight">
                {productSearch ? `"${productSearch}"` : selectedCategory ? getCategoryLabel(selectedCategory) : t('trending')}
              </h2>
              <p className="text-brand-muted text-sm mt-1">{displayProducts.length} {t('productsFound')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl hover-lift overflow-hidden border border-gray-100/80"
              >
                {/* Image */}
                <div
                  className="relative aspect-square overflow-hidden cursor-pointer bg-brand-light"
                  onClick={() => openProductDetail(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badges */}
                  {product.isBundle && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-brand-purple to-brand-cyan text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <Flame size={12} fill="currentColor" /> {t('hotBundle')}
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-sm ${
                      favorites.has(product.id)
                        ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30'
                        : 'bg-white/80 text-brand-muted hover:text-brand-purple hover:bg-white'
                    }`}
                  >
                    <Heart size={16} fill={favorites.has(product.id) ? 'currentColor' : 'none'} />
                  </button>

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                    <div className="bg-white text-brand-dark px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-xl">
                      <Eye size={16} /> {t('quickView')}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {(() => {
                    const reviews = getProductReviews(product);
                    const avgRating = getAverageRating(reviews);
                    const reviewCount = getReviewCount(product.id);
                    return (
                      <div className="flex items-center gap-1.5 mb-2">
                        <StarRating rating={avgRating} size={12} />
                        <span className="text-xs text-brand-muted">{avgRating}</span>
                        <span className="text-xs text-gray-400">({reviewCount})</span>
                      </div>
                    );
                  })()}

                  <span className="text-[11px] font-semibold text-brand-purple uppercase tracking-wider">
                    {product.brand || 'Universal'}
                  </span>

                  <h3 className="text-sm font-semibold text-brand-dark mt-1 mb-3 line-clamp-2 min-h-[40px] group-hover:text-brand-purple transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-brand-dark">€{product.price.toFixed(2)}</span>
                      {product.isBundle && (
                        <span className="text-xs text-brand-muted line-through ml-2">€{(product.price * 1.3).toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-10 h-10 bg-brand-dark hover:bg-brand-purple text-white rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-brand-purple/30"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Detail Modal - Stripe style */}
      {detailProduct && (
        <>
          <div className="fixed inset-0 bg-brand-dark/80 z-[100] backdrop-blur-md" onClick={() => { setDetailProduct(null); setDetailSelectedModel(''); }} />
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl max-h-[90vh] bg-white z-[110] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <button
              onClick={() => { setDetailProduct(null); setDetailSelectedModel(''); }}
              className="absolute top-4 right-4 z-[120] bg-white hover:bg-gray-50 text-brand-muted hover:text-brand-dark p-2.5 rounded-full shadow-lg transition-all border border-gray-100"
            >
              <X size={20} />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-brand-light relative overflow-hidden">
              <img src={detailProduct.image} className="w-full h-full object-cover" alt={detailProduct.name} />
              {detailProduct.isBundle && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-brand-purple to-brand-cyan text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <Flame size={16} fill="currentColor" /> {t('hotBundle')}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col">
              {(() => {
                const reviews = getProductReviews(detailProduct);
                const avgRating = getAverageRating(reviews);
                const reviewCount = getReviewCount(detailProduct.id);
                const displayReviews = showAllReviews ? reviews : reviews.slice(0, 3);

                return (
                  <>
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-brand-purple uppercase tracking-wider">{detailProduct.category}</span>
                      <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mt-2 mb-3 leading-tight tracking-tight">{detailProduct.name}</h2>

                      {/* Rating Summary */}
                      <div className="flex items-center gap-3 mb-5">
                        <StarRating rating={avgRating} size={18} />
                        <span className="text-lg font-semibold text-brand-dark">{avgRating}</span>
                        <span className="text-sm text-brand-muted">({reviewCount} {t('reviews')})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-gray-100">
                        <span className="text-3xl font-bold text-brand-dark">€{detailProduct.price.toFixed(2)}</span>
                        {detailProduct.isBundle && (
                          <span className="text-lg text-brand-muted line-through">€{(detailProduct.price * 1.3).toFixed(2)}</span>
                        )}
                        {detailProduct.isBundle && (
                          <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Save 30%</span>
                        )}
                      </div>

                      <p className="text-brand-muted mb-5 text-sm leading-relaxed">{detailProduct.description}</p>

                      {/* Model Selection */}
                      {detailProduct.compatibleModels && detailProduct.compatibleModels.length > 0 && (
                        <div className="mb-5">
                          <label className="text-sm font-semibold text-brand-dark mb-2 block">{t('selectYourModel')}</label>
                          <select
                            value={detailSelectedModel}
                            onChange={e => setDetailSelectedModel(e.target.value)}
                            className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none text-sm bg-brand-light cursor-pointer"
                          >
                            <option value="">{t('chooseModel')}</option>
                            {detailProduct.compatibleModels.map(model => (
                              <option key={model} value={model}>{model}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="flex items-center gap-2.5 text-sm text-brand-muted bg-brand-light p-3 rounded-xl">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Shield size={16} className="text-green-600" />
                          </div>
                          {t('featureWarranty')}
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-brand-muted bg-brand-light p-3 rounded-xl">
                          <div className="w-8 h-8 bg-brand-purple/10 rounded-lg flex items-center justify-center">
                            <Zap size={16} className="text-brand-purple" />
                          </div>
                          {t('featureFastShip')}
                        </div>
                      </div>

                      {/* Reviews Section */}
                      <div className="border-t border-gray-100 pt-5 mt-3">
                        <h4 className="font-semibold text-brand-dark mb-4 flex items-center gap-2">
                          {t('customerReviews')}
                          <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">{reviews.filter(r => r.rating >= 4).length}/{reviews.length} {t('positive')}</span>
                        </h4>

                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                          {displayReviews.map((review) => (
                            <div key={review.id} className="bg-brand-light rounded-xl p-4 border border-gray-100/50">
                              <div className="flex items-start justify-between mb-1">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 bg-gradient-to-br from-brand-purple to-brand-cyan rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {review.author.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold text-brand-dark">{review.author}</span>
                                      {review.verified && (
                                        <span className="flex items-center gap-0.5 text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                                          <CheckCircle size={10} /> {t('verified')}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <StarRating rating={review.rating} size={10} />
                                      <span className="text-[10px] text-brand-muted">{review.date}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-brand-muted mt-2 leading-relaxed">{review.text}</p>
                              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-brand-muted">
                                <ThumbsUp size={10} />
                                <span>{review.helpful} {t('foundHelpful')}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {reviews.length > 3 && (
                          <button
                            onClick={() => setShowAllReviews(!showAllReviews)}
                            className="w-full text-center text-sm text-brand-purple font-medium mt-4 hover:underline"
                          >
                            {showAllReviews ? t('showLess') : `${t('showAll')} ${reviews.length} ${t('reviews')}`}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button - Stripe style */}
                    <button
                      onClick={handleAddToCartFromDetail}
                      disabled={detailProduct.compatibleModels && detailProduct.compatibleModels.length > 0 && !detailSelectedModel}
                      className="w-full bg-brand-dark hover:bg-brand-purple text-white py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-brand-purple/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand-dark disabled:hover:shadow-lg mt-5"
                    >
                      <ShoppingBag size={20} /> {t('addToCart')}
                    </button>

                    {detailProduct.compatibleModels && detailProduct.compatibleModels.length > 0 && !detailSelectedModel && (
                      <p className="text-xs text-amber-600 mt-3 text-center font-medium">{t('pleaseSelectModel')}</p>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Storefront;