import React, { useState, useMemo } from 'react';
import { Product, Language } from '../types';
import { ShoppingBag, Star, Flame, ChevronRight, Smartphone, Shield, Zap, Battery, Plug, Headphones, Grid, Layers, Menu, X, Info, Sparkles, Wand2 } from 'lucide-react';
import { TRANSLATIONS, BRAND_MODELS, MOCK_PRODUCTS, HOT_BUNDLE } from '../constants';

interface StorefrontProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  lang: Language;
  onTrackOrderClick: () => void;
  onStartCustomDesign: () => void;
}

const Storefront: React.FC<StorefrontProps> = ({ products, onAddToCart, lang, onTrackOrderClick, onStartCustomDesign }) => {
  const t = TRANSLATIONS[lang];
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(''); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [trackInput, setTrackInput] = useState('');

  const availableModels = selectedBrand ? BRAND_MODELS[selectedBrand] || [] : [];
  const allProducts = [HOT_BUNDLE, ...MOCK_PRODUCTS];

  const displayProducts = useMemo(() => {
    return allProducts.filter(p => {
      if (selectedBrand && p.brand && p.brand !== selectedBrand && p.brand !== 'Universal' && !p.isBundle) return false;
      if (selectedModel) {
        if (p.brand === 'Universal') return true; 
        if (p.isBundle) return true; 
        if (p.compatibleModels && !p.compatibleModels.includes(selectedModel)) return false;
      }
      if (selectedCategory && p.category !== selectedCategory && !p.isBundle) return false;
      return true;
    });
  }, [selectedBrand, selectedModel, selectedCategory]);

  const CATEGORIES = [
    { id: '', label: 'All Accessories', icon: Grid },
    { id: 'Case', label: 'Phone Cases', icon: Smartphone },
    { id: 'Screen Protector', label: 'Screen Protectors', icon: Shield },
    { id: 'Charger', label: 'Chargers', icon: Zap },
    { id: 'Cable', label: 'Cables', icon: Plug },
    { id: 'Power Bank', label: 'Power Banks', icon: Battery },
    { id: 'Strap', label: 'Straps & Chains', icon: Layers },
    { id: 'Audio', label: 'Audio', icon: Headphones },
  ];

  const getCategoryLabel = (id: string, lang: Language) => {
    const map: Record<string, Record<string, string>> = {
      '': { EN: 'All Products', CN: '全部商品', ES: 'Todos', FR: 'Tous', DE: 'Alle' },
      'Case': { EN: 'Phone Cases', CN: '手机壳', ES: 'Fundas', FR: 'Coques', DE: 'Hüllen' },
      'Screen Protector': { EN: 'Screen Protectors', CN: '保护膜', ES: 'Protectores', FR: 'Protections', DE: 'Schutzfolien' },
      'Charger': { EN: 'Chargers', CN: '充电器', ES: 'Cargadores', FR: 'Chargeurs', DE: 'Ladegeräte' },
      'Cable': { EN: 'Cables', CN: '数据线', ES: 'Cables', FR: 'Câbles', DE: 'Kabel' },
      'Power Bank': { EN: 'Power Banks', CN: '充电宝', ES: 'Power Banks', FR: 'Batteries ext.', DE: 'Powerbanks' },
      'Strap': { EN: 'Straps', CN: '挂绳', ES: 'Colgantes', FR: 'Lanières', DE: 'Bänder' },
      'Audio': { EN: 'Audio', CN: '音频', ES: 'Audio', FR: 'Audio', DE: 'Audio' },
    };
    return map[id]?.[lang] || (CATEGORIES.find(c => c.id === id)?.label || id);
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* 1. REPAIR TRACKER BAR (Quick Access) */}
      <div className="bg-brand-dark py-4 px-4 sticky top-16 z-30 shadow-md">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
             <button 
               onClick={onTrackOrderClick}
               className="flex items-center gap-3 text-white hover:text-brand-pink transition-colors group p-1 rounded-lg"
             >
                <div className="p-2 bg-white/10 rounded-full group-hover:bg-brand-pink/20"><Smartphone size={20}/></div>
                <span className="font-medium text-sm md:text-base">{t.trackTitle}</span>
             </button>
             <div className="flex w-full md:w-auto gap-2">
                <input 
                  type="text" 
                  placeholder={t.kbSearchPlaceholder}
                  className="flex-1 md:w-64 px-4 py-2 rounded-full text-sm border-none focus:ring-2 focus:ring-brand-teal outline-none"
                  value={trackInput}
                  onChange={e => setTrackInput(e.target.value)}
                />
                <button 
                  onClick={onTrackOrderClick}
                  className="bg-brand-teal text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition-colors"
                >
                  {t.searchButton}
                </button>
             </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
           <aside className="w-full lg:w-64 flex-shrink-0">
             <div className="lg:sticky lg:top-40 space-y-2">
                
                {/* AI Design CTA */}
                <button 
                  onClick={onStartCustomDesign}
                  className="w-full mb-6 p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative overflow-hidden group shadow-xl hover:scale-[1.02] transition-all"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                    <Sparkles size={64} />
                  </div>
                  <div className="relative z-10 text-left">
                    <div className="bg-white/20 w-fit p-2 rounded-xl mb-3">
                      <Wand2 size={24} />
                    </div>
                    <h4 className="font-black text-xl leading-tight mb-2">Diseña tu Propio Case con AI</h4>
                    <p className="text-white/80 text-xs font-medium">Sube tu foto y mira el resultado en 3D al instante.</p>
                  </div>
                </button>

                <div className="flex items-center justify-between lg:hidden mb-4">
                  <h3 className="font-bold text-lg text-brand-dark">Categorías</h3>
                  <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 border rounded-lg">
                    <Menu size={20} />
                  </button>
                </div>

                <div className={`space-y-1 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive 
                            ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'
                        }`}
                      >
                        <cat.icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                        {getCategoryLabel(cat.id, lang)}
                      </button>
                    );
                  })}
                </div>
             </div>
           </aside>

           <div className="flex-1">
              <div className="bg-brand-light rounded-3xl p-6 mb-8 shadow-sm border border-brand-teal/10">
                 <h3 className="text-brand-dark font-bold text-lg mb-4 flex items-center gap-2">
                   Filter by Device <ChevronRight className="text-brand-pink" size={18}/>
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-brand-dark/60 uppercase tracking-wider">Marca</label>
                       <select 
                         className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none shadow-sm"
                         value={selectedBrand}
                         onChange={e => {
                           setSelectedBrand(e.target.value);
                           setSelectedModel('');
                         }}
                       >
                         <option value="">Todas las Marcas</option>
                         {Object.keys(BRAND_MODELS).map(b => <option key={b} value={b}>{b}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-brand-dark/60 uppercase tracking-wider">Modelo</label>
                       <select 
                         className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none shadow-sm disabled:bg-gray-100"
                         value={selectedModel}
                         onChange={e => setSelectedModel(e.target.value)}
                         disabled={!selectedBrand}
                       >
                         <option value="">{selectedBrand ? 'Seleccionar Modelo' : 'Primero elige Marca'}</option>
                         {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                       </select>
                    </div>
                 </div>
              </div>

              <div id="product-grid">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-dark mb-1">
                      {selectedCategory ? getCategoryLabel(selectedCategory, lang) : t.trending}
                    </h2>
                    <p className="text-gray-500 text-xs">{displayProducts.length} items found</p>
                  </div>
                  {(selectedBrand || selectedCategory) && (
                    <button onClick={() => {setSelectedBrand(''); setSelectedModel(''); setSelectedCategory('');}} className="text-brand-pink text-xs font-bold underline">Limpiar Filtros</button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayProducts.map((product) => (
                    <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 p-3 hover-lift relative flex flex-col h-full">
                      {product.isBundle && (
                         <div className="absolute top-0 left-0 bg-brand-pink text-white text-[10px] font-bold px-3 py-1 rounded-br-xl rounded-tl-xl z-20 flex items-center gap-1">
                            <Flame size={10} fill="currentColor" /> {t.hotBundle}
                         </div>
                      )}
                      <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden mb-3 bg-gray-100 cursor-zoom-in" onClick={() => setDetailProduct(product)}>
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                           <Info size={32} className="text-white" />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{product.brand || 'Universal'}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-brand-dark mb-1 leading-tight group-hover:text-brand-pink line-clamp-2">{product.name}</h3>
                        <div className="mt-auto pt-2 flex items-center justify-between">
                          <span className="text-sm font-bold text-brand-dark">€{product.price.toFixed(2)}</span>
                          <button onClick={() => onAddToCart(product)} className="text-[10px] font-bold px-3 py-1 rounded-full border border-gray-200 hover:bg-brand-dark hover:text-white transition-colors">{t.addToCart}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>
      </div>

      {detailProduct && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm animate-in fade-in" onClick={() => setDetailProduct(null)} />
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl max-h-[90vh] bg-white z-[110] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95">
             <button onClick={() => setDetailProduct(null)} className="absolute top-4 right-4 z-[120] bg-white/80 hover:bg-white text-brand-dark p-2 rounded-full shadow-lg"><X size={20} /></button>
             <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img src={detailProduct.image} className="w-full h-full object-cover" alt={detailProduct.name} />
             </div>
             <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <div className="flex items-center gap-2 mb-2 text-brand-pink text-xs font-bold uppercase tracking-widest">{detailProduct.category}</div>
                <h2 className="text-3xl font-black text-brand-dark mb-4 leading-tight">{detailProduct.name}</h2>
                <div className="text-3xl font-bold text-brand-pink mb-6">€{detailProduct.price.toFixed(2)}</div>
                <p className="text-gray-600 mb-8">{detailProduct.description}</p>
                <button 
                  onClick={() => { onAddToCart(detailProduct); setDetailProduct(null); }}
                  className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-teal transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  <ShoppingBag size={20} /> Añadir al Carrito
                </button>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Storefront;