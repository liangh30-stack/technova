import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Language, Product } from '../types';
import { BRAND_MODELS } from '../constants';
import {
  Upload, Smartphone, Loader2, CheckCircle2, ShoppingCart,
  ArrowLeft, RefreshCw, Image as ImageIcon, AlertCircle,
  Type, ZoomIn, ZoomOut, RotateCw, Move, Trash2,
  Package, Check, ChevronDown, X, Palette
} from 'lucide-react';

interface CustomCaseCreatorProps {
  lang: Language;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
}

// Case types with pricing
const CASE_TYPES = [
  { id: 'soft', name: 'Soft Silicone', nameES: 'Silicona Suave', nameCN: '软硅胶', price: 14.99, color: '#f0f0f0' },
  { id: 'hard', name: 'Hard Plastic', nameES: 'Plástico Duro', nameCN: '硬塑料', price: 12.99, color: '#e0e0e0' },
  { id: 'tough', name: 'Tough Armor', nameES: 'Armor Resistente', nameCN: '防摔装甲', price: 19.99, color: '#2a2a2a' },
  { id: 'clear', name: 'Crystal Clear', nameES: 'Cristal Transparente', nameCN: '透明水晶', price: 16.99, color: 'transparent' },
] as const;

// Predefined design templates
const DESIGN_TEMPLATES = [
  { id: 'blank', name: 'Blank', nameES: 'En Blanco', preview: null },
  { id: 'gradient1', name: 'Sunset', nameES: 'Atardecer', preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'gradient2', name: 'Ocean', nameES: 'Océano', preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 'gradient3', name: 'Forest', nameES: 'Bosque', preview: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { id: 'gradient4', name: 'Night', nameES: 'Noche', preview: 'linear-gradient(135deg, #0c0c0c 0%, #434343 100%)' },
  { id: 'pattern1', name: 'Marble', nameES: 'Mármol', preview: 'linear-gradient(135deg, #f5f5f5 25%, #e0e0e0 50%, #f5f5f5 75%)' },
];

const CustomCaseCreator: React.FC<CustomCaseCreatorProps> = ({ lang, onAddToCart, onBack }) => {
  // Phone selection
  const [selectedBrand, setSelectedBrand] = useState('Apple');
  const [selectedModel, setSelectedModel] = useState('iPhone 15 Pro');
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // Case type
  const [caseType, setCaseType] = useState<typeof CASE_TYPES[number]['id']>('soft');

  // Design state
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [showTextInput, setShowTextInput] = useState(false);

  // Image transform state
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMockup, setGeneratedMockup] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'design' | 'text'>('design');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Localization helper
  const t = (en: string, es: string, cn: string) => {
    if (lang === 'CN') return cn;
    if (lang === 'ES') return es;
    return en;
  };

  // Get current price
  const currentPrice = CASE_TYPES.find(c => c.id === caseType)?.price || 14.99;

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError(t('Image too large (max 10MB)', 'Imagen muy grande (máx 10MB)', '图片太大（最大10MB）'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setSelectedTemplate('blank');
        setImageScale(1);
        setImageRotation(0);
        setImagePosition({ x: 0, y: 0 });
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle mouse/touch drag for image positioning
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!userImage) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - imagePosition.x, y: clientY - imagePosition.y });
  };

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setImagePosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Generate the final mockup
  const generateMockup = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not available');

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Context not available');

      // Set canvas size
      canvas.width = 600;
      canvas.height = 800;

      // Background
      const bgGradient = ctx.createRadialGradient(300, 300, 0, 300, 400, 600);
      bgGradient.addColorStop(0, '#ffffff');
      bgGradient.addColorStop(1, '#f0f0f0');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 600, 800);

      // Case dimensions
      const caseX = 120;
      const caseY = 80;
      const caseW = 360;
      const caseH = 640;
      const radius = 45;

      // Shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetX = 15;
      ctx.shadowOffsetY = 20;
      ctx.beginPath();
      ctx.roundRect(caseX, caseY, caseW, caseH, radius);
      ctx.fillStyle = '#333';
      ctx.fill();
      ctx.restore();

      // Case border/frame
      const caseColor = CASE_TYPES.find(c => c.id === caseType)?.color || '#f0f0f0';
      ctx.beginPath();
      ctx.roundRect(caseX, caseY, caseW, caseH, radius);
      if (caseType === 'clear') {
        ctx.fillStyle = 'rgba(240, 240, 240, 0.3)';
      } else {
        ctx.fillStyle = caseColor;
      }
      ctx.fill();
      ctx.strokeStyle = caseType === 'tough' ? '#1a1a1a' : '#ddd';
      ctx.lineWidth = caseType === 'tough' ? 8 : 3;
      ctx.stroke();

      // Design area
      const designPadding = caseType === 'tough' ? 20 : 12;
      const designX = caseX + designPadding;
      const designY = caseY + designPadding;
      const designW = caseW - designPadding * 2;
      const designH = caseH - designPadding * 2;
      const designRadius = radius - designPadding / 2;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(designX, designY, designW, designH, designRadius);
      ctx.clip();

      // Draw template background
      const template = DESIGN_TEMPLATES.find(t => t.id === selectedTemplate);
      if (template?.preview && !userImage) {
        // Parse gradient and draw
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(designX, designY, designW, designH);

        // Simple gradient simulation
        if (template.preview.includes('gradient')) {
          const colors = template.preview.match(/#[a-fA-F0-9]{6}/g) || ['#ffffff', '#000000'];
          const grad = ctx.createLinearGradient(designX, designY, designX + designW, designY + designH);
          grad.addColorStop(0, colors[0]);
          grad.addColorStop(1, colors[1] || colors[0]);
          ctx.fillStyle = grad;
          ctx.fillRect(designX, designY, designW, designH);
        }
      } else if (!userImage) {
        ctx.fillStyle = '#f8f8f8';
        ctx.fillRect(designX, designY, designW, designH);
      }

      // Draw user image if exists
      if (userImage) {
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.save();
            ctx.translate(designX + designW / 2 + imagePosition.x * 0.5, designY + designH / 2 + imagePosition.y * 0.5);
            ctx.rotate((imageRotation * Math.PI) / 180);
            ctx.scale(imageScale, imageScale);

            const imgAspect = img.width / img.height;
            const areaAspect = designW / designH;
            let drawW, drawH;

            if (imgAspect > areaAspect) {
              drawH = designH;
              drawW = drawH * imgAspect;
            } else {
              drawW = designW;
              drawH = drawW / imgAspect;
            }

            ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();
            resolve();
          };
          img.onerror = reject;
          img.src = userImage;
        });
      }

      ctx.restore();

      // Draw custom text
      if (customText) {
        ctx.save();
        ctx.font = 'bold 36px "Poppins", sans-serif';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(customText, caseX + caseW / 2, caseY + caseH - 60);
        ctx.restore();
      }

      // Camera cutout
      const camW = 100;
      const camH = 100;
      const camX = caseX + caseW - camW - 25;
      const camY = caseY + 25;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(camX, camY, camW, camH, 20);
      ctx.fillStyle = '#0a0a0a';
      ctx.fill();
      ctx.restore();

      // Camera lenses
      const lensPositions = [
        { x: camX + 30, y: camY + 30 },
        { x: camX + 70, y: camY + 30 },
        { x: camX + 30, y: camY + 70 },
      ];
      lensPositions.forEach(pos => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#1a1a2e';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#0f0f1a';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pos.x - 3, pos.y - 3, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fill();
      });

      // Flash
      ctx.beginPath();
      ctx.arc(camX + 70, camY + 70, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#fffde7';
      ctx.fill();

      // Glossy effect
      if (caseType !== 'tough') {
        const glossGrad = ctx.createLinearGradient(caseX, caseY, caseX + caseW * 0.6, caseY + caseH * 0.4);
        glossGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
        glossGrad.addColorStop(0.5, 'rgba(255,255,255,0.05)');
        glossGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.roundRect(caseX, caseY, caseW, caseH, radius);
        ctx.fillStyle = glossGrad;
        ctx.fill();
      }

      // Watermark
      ctx.font = '12px system-ui';
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.textAlign = 'center';
      ctx.fillText('TechNova Custom', 300, 770);

      setGeneratedMockup(canvas.toDataURL('image/png', 0.95));
    } catch (err) {
      console.error('Generation error:', err);
      setError(t('Error generating preview', 'Error al generar vista previa', '生成预览时出错'));
    } finally {
      setIsGenerating(false);
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!generatedMockup) return;

    const product: Product = {
      id: `CUSTOM-${Date.now()}`,
      name: `${t('Custom Case', 'Funda Personalizada', '定制手机壳')} - ${selectedModel}`,
      price: currentPrice,
      category: 'Case',
      image: generatedMockup,
      description: `${CASE_TYPES.find(c => c.id === caseType)?.nameES || 'Custom'} - ${selectedModel}`,
      isCustom: true,
      customImage: userImage || undefined,
      selectedModel,
      brand: selectedBrand
    };

    onAddToCart(product);
    onBack();
  };

  // Reset design
  const resetDesign = () => {
    setUserImage(null);
    setSelectedTemplate('blank');
    setCustomText('');
    setImageScale(1);
    setImageRotation(0);
    setImagePosition({ x: 0, y: 0 });
    setGeneratedMockup(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hidden canvas for generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {t('Customize Your Case', 'Personaliza Tu Funda', '定制你的手机壳')}
              </h1>
              <p className="text-sm text-gray-500">{selectedModel}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-brand-pink">€{currentPrice.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{t('Free shipping', 'Envío gratis', '免费配送')}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: Preview */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-40">
              {/* Phone/Model Selector */}
              <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                <div className="flex gap-4">
                  <select
                    value={selectedBrand}
                    onChange={e => { setSelectedBrand(e.target.value); setSelectedModel(BRAND_MODELS[e.target.value]?.[0] || ''); }}
                    className="flex-1 px-4 py-3 border rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-pink outline-none"
                  >
                    {Object.keys(BRAND_MODELS).map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  <select
                    value={selectedModel}
                    onChange={e => setSelectedModel(e.target.value)}
                    className="flex-1 px-4 py-3 border rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-pink outline-none"
                  >
                    {(BRAND_MODELS[selectedBrand] || []).map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Preview */}
              <div
                ref={previewRef}
                className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 flex items-center justify-center min-h-[500px] relative overflow-hidden"
              >
                {/* Phone mockup preview */}
                <div
                  className="relative w-[200px] h-[420px] rounded-[35px] shadow-2xl overflow-hidden cursor-move select-none"
                  style={{
                    background: CASE_TYPES.find(c => c.id === caseType)?.color || '#f0f0f0',
                    border: caseType === 'tough' ? '6px solid #1a1a1a' : '3px solid #ddd'
                  }}
                  onMouseDown={handleDragStart}
                  onTouchStart={handleDragStart}
                >
                  {/* Design area */}
                  <div
                    className="absolute inset-3 rounded-[28px] overflow-hidden flex items-center justify-center"
                    style={{
                      background: !userImage && selectedTemplate !== 'blank'
                        ? DESIGN_TEMPLATES.find(t => t.id === selectedTemplate)?.preview || '#f8f8f8'
                        : '#f8f8f8'
                    }}
                  >
                    {userImage && (
                      <img
                        src={userImage}
                        alt="Your design"
                        className="w-full h-full object-cover pointer-events-none"
                        style={{
                          transform: `translate(${imagePosition.x * 0.3}px, ${imagePosition.y * 0.3}px) scale(${imageScale}) rotate(${imageRotation}deg)`
                        }}
                        draggable={false}
                      />
                    )}
                    {!userImage && selectedTemplate === 'blank' && (
                      <div className="text-center text-gray-400">
                        <ImageIcon size={40} className="mx-auto mb-2 opacity-30" />
                        <p className="text-xs">{t('Add your design', 'Añade tu diseño', '添加你的设计')}</p>
                      </div>
                    )}
                  </div>

                  {/* Custom text */}
                  {customText && (
                    <div
                      className="absolute bottom-8 left-0 right-0 text-center font-bold text-lg drop-shadow-lg"
                      style={{ color: textColor }}
                    >
                      {customText}
                    </div>
                  )}

                  {/* Camera cutout */}
                  <div className="absolute top-3 right-3 w-16 h-16 bg-black rounded-2xl flex flex-wrap items-center justify-center p-1.5 gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-4 h-4 rounded-full bg-gray-900 border-2 border-gray-800" />
                    ))}
                  </div>
                </div>

                {/* Drag hint */}
                {userImage && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                    <Move size={14} /> {t('Drag to adjust', 'Arrastra para ajustar', '拖动调整')}
                  </div>
                )}
              </div>

              {/* Generate & Add to Cart */}
              <div className="mt-4 space-y-3">
                {!generatedMockup ? (
                  <button
                    onClick={generateMockup}
                    disabled={isGenerating}
                    className="w-full bg-brand-pink text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <><Loader2 className="animate-spin" size={20} /> {t('Generating...', 'Generando...', '生成中...')}</>
                    ) : (
                      <>{t('Preview My Case', 'Ver Mi Funda', '预览我的手机壳')}</>
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-brand-pink text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} /> {t('Add to Cart', 'Añadir al Carrito', '加入购物车')} - €{currentPrice.toFixed(2)}
                    </button>
                    <button
                      onClick={() => setGeneratedMockup(null)}
                      className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={18} /> {t('Edit Design', 'Editar Diseño', '编辑设计')}
                    </button>
                  </>
                )}
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle size={18} /> {error}
                </div>
              )}
            </div>
          </div>

          {/* Right: Controls */}
          <div className="order-1 lg:order-2 space-y-4">

            {/* Case Type */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={18} /> {t('Case Type', 'Tipo de Funda', '壳体类型')}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {CASE_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setCaseType(type.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      caseType === type.id
                        ? 'border-brand-pink bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg border"
                        style={{ background: type.color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)' : type.color, backgroundSize: '8px 8px', backgroundPosition: '0 0, 4px 4px' }}
                      />
                      <div>
                        <p className="font-medium text-sm">{lang === 'ES' ? type.nameES : lang === 'CN' ? type.nameCN : type.name}</p>
                        <p className="text-brand-pink font-bold text-sm">€{type.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Design Tabs */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('design')}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'design' ? 'text-brand-pink border-b-2 border-brand-pink' : 'text-gray-500'}`}
                >
                  {t('Design', 'Diseño', '设计')}
                </button>
                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'text' ? 'text-brand-pink border-b-2 border-brand-pink' : 'text-gray-500'}`}
                >
                  {t('Text', 'Texto', '文字')}
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'design' && (
                  <div className="space-y-6">
                    {/* Upload */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-3">{t('Upload Your Photo', 'Sube Tu Foto', '上传你的照片')}</h4>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-brand-pink hover:bg-pink-50 ${userImage ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}
                      >
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                        {userImage ? (
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircle2 className="text-green-500" size={24} />
                            <span className="font-medium text-green-700">{t('Photo uploaded!', '¡Foto subida!', '照片已上传！')}</span>
                            <button onClick={(e) => { e.stopPropagation(); setUserImage(null); }} className="text-red-500 hover:text-red-700">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                            <p className="text-sm text-gray-600 font-medium">{t('Click to upload', 'Haz clic para subir', '点击上传')}</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG (max 10MB)</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Image Controls */}
                    {userImage && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3">{t('Adjust Image', 'Ajustar Imagen', '调整图片')}</h4>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setImageScale(s => Math.max(0.5, s - 0.1))} className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                            <ZoomOut size={18} />
                          </button>
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div className="bg-brand-pink h-full rounded-full transition-all" style={{ width: `${((imageScale - 0.5) / 1.5) * 100}%` }} />
                          </div>
                          <button onClick={() => setImageScale(s => Math.min(2, s + 0.1))} className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                            <ZoomIn size={18} />
                          </button>
                          <button onClick={() => setImageRotation(r => r + 90)} className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 ml-2">
                            <RotateCw size={18} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Templates */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-3">{t('Or Choose a Template', 'O Elige una Plantilla', '或选择模板')}</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {DESIGN_TEMPLATES.map(template => (
                          <button
                            key={template.id}
                            onClick={() => { setSelectedTemplate(template.id); if (template.id !== 'blank') setUserImage(null); }}
                            className={`aspect-[3/4] rounded-xl border-2 transition-all overflow-hidden ${selectedTemplate === template.id ? 'border-brand-pink ring-2 ring-brand-pink/30' : 'border-gray-200 hover:border-gray-300'}`}
                            style={{ background: template.preview || '#f8f8f8' }}
                          >
                            {template.id === 'blank' && (
                              <span className="text-xs text-gray-400">{lang === 'ES' ? template.nameES : template.name}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'text' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-3">{t('Add Your Name or Text', 'Añade Tu Nombre o Texto', '添加你的名字或文字')}</h4>
                      <input
                        type="text"
                        value={customText}
                        onChange={e => setCustomText(e.target.value.slice(0, 20))}
                        placeholder={t('Enter text...', 'Escribe aquí...', '输入文字...')}
                        maxLength={20}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-pink outline-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">{customText.length}/20</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-3">{t('Text Color', 'Color del Texto', '文字颜色')}</h4>
                      <div className="flex gap-2 flex-wrap">
                        {['#ffffff', '#000000', '#f43f5e', '#3b82f6', '#22c55e', '#eab308', '#a855f7'].map(color => (
                          <button
                            key={color}
                            onClick={() => setTextColor(color)}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${textColor === color ? 'border-brand-pink scale-110' : 'border-gray-300'}`}
                            style={{ background: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🚚', text: t('Free Shipping', 'Envío Gratis', '免费配送') },
                { icon: '⚡', text: t('48h Delivery', 'Entrega 48h', '48小时送达') },
                { icon: '✨', text: t('HD Print', 'Impresión HD', '高清印刷') },
              ].map((feature, i) => (
                <div key={i} className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <span className="text-2xl">{feature.icon}</span>
                  <p className="text-xs font-medium text-gray-600 mt-1">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCaseCreator;
