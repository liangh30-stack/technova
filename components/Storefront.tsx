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
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
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
      {/* Promotional Banner */}
      <div className="bg-brand-primary py-3 px-4" aria-label={t('promoBanner', 'Promotional banner')}>
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
        {/* Categories Row */}
        <nav className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8" aria-label={t('categoryNavigation', 'Product categories')}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isActive ? '' : cat.id)}
                aria-pressed={isActive}
                aria-label={getCategoryLabel(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-dark text-white shadow-md'
                    : 'bg-brand-surface text-brand-muted hover:text-brand-dark hover:shadow-md border border-brand-border'
                }`}
              >
                <cat.icon size={16} />
                {getCategoryLabel(cat.id)}
              </button>
            );
          })}
        </nav>

        {/* Feature Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* AI Design Card */}
          <button
            onClick={onStartCustomDesign}
            aria-label={t('aiDesignTitle', 'AI Custom Design')}
            className="group relative overflow-hidden rounded-lg bg-brand-dark p-6 text-left text-white hover:shadow-md transition-shadow"
          >
            <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <Wand2 size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{t('aiDesignTitle')}</h3>
              <p className="text-white/50 text-sm">{t('aiDesignDesc')}</p>
              <div className="mt-4 flex items-center gap-1 text-brand-accent text-sm font-medium">
                {t('tryNow', 'Try now')} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Track Order Card */}
          <button
            onClick={() => onTrackOrderClick()}
            aria-label={t('trackTitle', 'Track your order')}
            className="group relative overflow-hidden rounded-lg bg-brand-surface p-6 text-left hover:shadow-md transition-shadow border border-brand-border"
          >
            <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Smartphone size={120} className="text-brand-primary" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-brand-primary-light rounded-lg flex items-center justify-center mb-4">
                <Search size={22} className="text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-1">{t('trackTitle')}</h3>
              <p className="text-brand-muted text-sm">{t('trackCardDesc')}</p>
              <div className="mt-4 flex items-center gap-1 text-brand-primary text-sm font-medium">
                {t('trackOrder', 'Track order')} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Special Offer Card */}
          <div
            className="group relative overflow-hidden rounded-lg bg-brand-accent p-6 text-white hover:shadow-md transition-shadow cursor-pointer"
            aria-label={t('offerTitle', 'Special offer')}
            role="region"
          >
            <div className="absolute -right-8 -top-8 opacity-10">
              <Percent size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp size={22} />
              </div>
              <h3 className="text-lg font-semibold mb-1">{t('offerTitle')}</h3>
              <p className="text-white/70 text-sm">{t('offerDesc')}</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                {t('limitedTime', 'Limited time')}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-brand-surface rounded-lg p-5 shadow-sm border border-brand-border mb-10" aria-label={t('filterProducts', 'Filter products')}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="text"
                placeholder={t('searchProducts')}
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                aria-label={t('searchProducts', 'Search products')}
                className="w-full pl-11 pr-4 py-3 bg-brand-light border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm text-brand-dark placeholder:text-brand-muted"
              />
              {productSearch && (
                <button
                  onClick={() => setProductSearch('')}
                  aria-label={t('clearSearch', 'Clear search')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Brand Select */}
            <select
              className="px-4 py-3 bg-brand-light border border-brand-border rounded-lg text-sm text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none min-w-[160px] cursor-pointer"
              value={selectedBrand}
              onChange={e => { setSelectedBrand(e.target.value); setSelectedModel(''); }}
              aria-label={t('allBrands', 'Select brand')}
            >
              <option value="">{t('allBrands')}</option>
              {Object.keys(BRAND_MODELS).map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            {/* Model Select */}
            <select
              className="px-4 py-3 bg-brand-light border border-brand-border rounded-lg text-sm text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none min-w-[160px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
              aria-label={t('selectModel', 'Select model')}
            >
              <option value="">{selectedBrand ? t('selectModel') : t('selectBrandFirst')}</option>
              {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            {(selectedBrand || selectedCategory || productSearch) && (
              <button
                onClick={() => { setSelectedBrand(''); setSelectedModel(''); setSelectedCategory(''); setProductSearch(''); }}
                aria-label={t('clearFilters', 'Clear all filters')}
                className="px-4 py-3 text-brand-primary font-semibold text-sm hover:bg-brand-primary-light rounded-lg transition-colors"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div id="product-grid" aria-label={t('productGrid', 'Product listing')}>
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
              <article
                key={product.id}
                className="group bg-brand-surface rounded-lg hover:shadow-md transition-shadow overflow-hidden border border-brand-border"
                aria-label={product.name}
              >
                {/* Image */}
                <div
                  className="relative aspect-square overflow-hidden cursor-pointer bg-brand-light"
                  onClick={() => openProductDetail(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badges */}
                  {product.isBundle && (
                    <div className="absolute top-3 left-3 bg-brand-accent text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                      <Flame size={12} fill="currentColor" /> {t('hotBundle')}
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                    aria-label={favorites.has(product.id) ? t('removeFromFavorites', 'Remove from favorites') : t('addToFavorites', 'Add to favorites')}
                    aria-pressed={favorites.has(product.id)}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      favorites.has(product.id)
                        ? 'bg-brand-primary text-white shadow-md'
                        : 'bg-white/90 text-brand-muted hover:text-brand-primary hover:bg-white'
                    }`}
                  >
                    <Heart size={16} fill={favorites.has(product.id) ? 'currentColor' : 'none'} />
                  </button>

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-brand-dark/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                    <div className="bg-brand-surface text-brand-dark px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-md">
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
                        <span className="text-xs text-brand-text-tertiary">({reviewCount})</span>
                      </div>
                    );
                  })()}

                  <span className="text-[11px] font-semibold text-brand-primary uppercase tracking-wider">
                    {product.brand || 'Universal'}
                  </span>

                  <h3 className="text-sm font-semibold text-brand-dark mt-1 mb-3 line-clamp-2 min-h-[40px] group-hover:text-brand-primary transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-brand-dark">{'\u20AC'}{product.price.toFixed(2)}</span>
                      {product.isBundle && (
                        <span className="text-xs text-brand-muted line-through ml-2">{'\u20AC'}{(product.price * 1.3).toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => onAddToCart(product)}
                      aria-label={t('addToCart', 'Add to cart')}
                      className="w-10 h-10 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-lg flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {detailProduct && (
        <>
          <div
            className="fixed inset-0 bg-brand-dark/80 z-[100]"
            onClick={() => { setDetailProduct(null); setDetailSelectedModel(''); }}
            aria-hidden="true"
          />
          <div
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl max-h-[90vh] bg-brand-surface z-[110] rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row"
            role="dialog"
            aria-modal="true"
            aria-label={detailProduct.name}
          >
            <button
              onClick={() => { setDetailProduct(null); setDetailSelectedModel(''); }}
              aria-label={t('closeModal', 'Close product details')}
              className="absolute top-4 right-4 z-[120] bg-brand-surface hover:bg-brand-light text-brand-muted hover:text-brand-dark p-2.5 rounded-lg shadow-sm transition-all border border-brand-border"
            >
              <X size={20} />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-brand-light relative overflow-hidden">
              <img src={detailProduct.image} className="w-full h-full object-cover" alt={detailProduct.name} loading="lazy" decoding="async" />
              {detailProduct.isBundle && (
                <div className="absolute top-4 left-4 bg-brand-accent text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
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
                      <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">{detailProduct.category}</span>
                      <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mt-2 mb-3 leading-tight tracking-tight">{detailProduct.name}</h2>

                      {/* Rating Summary */}
                      <div className="flex items-center gap-3 mb-5">
                        <StarRating rating={avgRating} size={18} />
                        <span className="text-lg font-semibold text-brand-dark">{avgRating}</span>
                        <span className="text-sm text-brand-muted">({reviewCount} {t('reviews')})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-brand-border">
                        <span className="text-3xl font-bold text-brand-dark">{'\u20AC'}{detailProduct.price.toFixed(2)}</span>
                        {detailProduct.isBundle && (
                          <span className="text-lg text-brand-muted line-through">{'\u20AC'}{(detailProduct.price * 1.3).toFixed(2)}</span>
                        )}
                        {detailProduct.isBundle && (
                          <span className="text-xs font-semibold text-brand-primary bg-brand-primary-light px-2 py-1 rounded-lg">{t('save30', 'Save 30%')}</span>
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
                            aria-label={t('selectYourModel', 'Select your model')}
                            className="w-full p-3.5 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm bg-brand-light cursor-pointer"
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
                        <div className="flex items-center gap-2.5 text-sm text-brand-muted bg-brand-light p-3 rounded-lg">
                          <div className="w-8 h-8 bg-brand-primary-light rounded-lg flex items-center justify-center">
                            <Shield size={16} className="text-brand-primary" />
                          </div>
                          {t('featureWarranty')}
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-brand-muted bg-brand-light p-3 rounded-lg">
                          <div className="w-8 h-8 bg-brand-primary-light rounded-lg flex items-center justify-center">
                            <Zap size={16} className="text-brand-primary" />
                          </div>
                          {t('featureFastShip')}
                        </div>
                      </div>

                      {/* Reviews Section */}
                      <div className="border-t border-brand-border pt-5 mt-3" aria-label={t('customerReviews', 'Customer reviews')}>
                        <h4 className="font-semibold text-brand-dark mb-4 flex items-center gap-2">
                          {t('customerReviews')}
                          <span className="text-xs bg-brand-primary-light text-brand-primary px-2.5 py-1 rounded-lg font-medium">{reviews.filter(r => r.rating >= 4).length}/{reviews.length} {t('positive')}</span>
                        </h4>

                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                          {displayReviews.map((review) => (
                            <div key={review.id} className="bg-brand-light rounded-lg p-4 border border-brand-border">
                              <div className="flex items-start justify-between mb-1">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 bg-brand-primary rounded-full flex items-center justify-center text-white text-xs font-bold" aria-hidden="true">
                                    {review.author.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold text-brand-dark">{review.author}</span>
                                      {review.verified && (
                                        <span className="flex items-center gap-0.5 text-[10px] text-brand-primary bg-brand-primary-light px-1.5 py-0.5 rounded-lg">
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
                            className="w-full text-center text-sm text-brand-primary font-medium mt-4 hover:underline"
                          >
                            {showAllReviews ? t('showLess') : `${t('showAll')} ${reviews.length} ${t('reviews')}`}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCartFromDetail}
                      disabled={detailProduct.compatibleModels && detailProduct.compatibleModels.length > 0 && !detailSelectedModel}
                      aria-label={t('addToCart', 'Add to cart')}
                      className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand-primary disabled:hover:shadow-sm mt-5"
                    >
                      <ShoppingBag size={20} /> {t('addToCart')}
                    </button>

                    {detailProduct.compatibleModels && detailProduct.compatibleModels.length > 0 && !detailSelectedModel && (
                      <p className="text-xs text-brand-warning mt-3 text-center font-medium" role="alert">{t('pleaseSelectModel')}</p>
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
