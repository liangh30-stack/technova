import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Language, Product } from '../types';
import { TRANSLATIONS, BRAND_MODELS } from '../constants';
import { Upload, Smartphone, Wand2, Loader2, CheckCircle2, ShoppingCart, ArrowLeft, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';

interface CustomCaseCreatorProps {
  lang: Language;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
}

const CustomCaseCreator: React.FC<CustomCaseCreatorProps> = ({ lang, onAddToCart, onBack }) => {
  const [step, setStep] = useState<'upload' | 'designing' | 'preview'>('upload');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [mockupImage, setMockupImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateMockup = async () => {
    if (!imageFile || !selectedModel) return;

    setIsGenerating(true);
    setStep('designing');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = imageFile.split(',')[1];
      
      const prompt = `Create a realistic, high-quality professional 3D product mockup of a mobile phone case for a ${selectedModel}. The design printed on the case must be the user-provided image. The background should be a clean, minimalist studio aesthetic. Make the case look premium and glossy.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
            { text: prompt }
          ]
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setMockupImage(`data:image/png;base64,${part.inlineData.data}`);
          setStep('preview');
          break;
        }
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Lo sentimos, hubo un error al generar la vista previa. Por favor, intenta de nuevo.");
      setStep('upload');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = () => {
    if (!mockupImage || !imageFile) return;

    const customProduct: Product = {
      id: `CUSTOM-${Date.now()}`,
      name: `Custom Case - ${selectedModel}`,
      price: 29.99,
      category: 'Case',
      image: mockupImage, // Using mockup for cart preview
      description: `Diseño personalizado para ${selectedModel}. Imagen única subida por el cliente.`,
      isCustom: true,
      customImage: imageFile, // Store original high-res for production
      selectedModel: selectedModel,
      brand: selectedBrand
    };

    onAddToCart(customProduct);
    onBack();
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex items-center gap-4 mb-8">
           <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
             <ArrowLeft size={20} className="text-brand-dark" />
           </button>
           <div>
             <h1 className="text-2xl font-black text-brand-dark tracking-tight flex items-center gap-2">
               <Sparkles className="text-indigo-600" size={24} /> 
               AI Design Studio
             </h1>
             <p className="text-gray-500 text-sm font-medium">Crea tu protector de celular único</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Design Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-indigo-500/5 border border-indigo-100">
               <h3 className="text-lg font-bold text-brand-dark mb-6 flex items-center gap-2">
                 <Smartphone size={20} className="text-indigo-600" /> 1. Elige tu Modelo
               </h3>
               
               <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Marca</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={selectedBrand}
                      onChange={e => { setSelectedBrand(e.target.value); setSelectedModel(''); }}
                    >
                      <option value="">Seleccionar Marca</option>
                      {Object.keys(BRAND_MODELS).map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Modelo Exacto</label>
                    <select 
                      disabled={!selectedBrand}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-40"
                      value={selectedModel}
                      onChange={e => setSelectedModel(e.target.value)}
                    >
                      <option value="">Seleccionar Modelo</option>
                      {selectedBrand && BRAND_MODELS[selectedBrand].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-indigo-500/5 border border-indigo-100">
               <h3 className="text-lg font-bold text-brand-dark mb-6 flex items-center gap-2">
                 <Upload size={20} className="text-indigo-600" /> 2. Sube tu Foto
               </h3>
               
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${imageFile ? 'border-green-400 bg-green-50/30' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}
               >
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                 {imageFile ? (
                   <>
                     <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                       <CheckCircle2 size={32} />
                     </div>
                     <span className="text-sm font-bold text-green-700">Foto Lista</span>
                     <p className="text-xs text-green-600/60 mt-1">Haz clic para cambiar</p>
                   </>
                 ) : (
                   <>
                     <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center mb-4">
                       <Upload size={32} />
                     </div>
                     <span className="text-sm font-bold text-slate-500">Subir imagen</span>
                     <p className="text-xs text-slate-400 mt-1">Sube una foto de alta calidad</p>
                   </>
                 )}
               </div>
            </div>

            <button 
              disabled={!imageFile || !selectedModel || isGenerating}
              onClick={generateMockup}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Wand2 size={24} />}
              {step === 'preview' ? 'Re-Generar Diseño' : 'Generar Vista AI'}
            </button>
          </div>

          {/* Right Panel: AI Preview Display */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 rounded-[3rem] p-4 lg:p-12 shadow-2xl relative overflow-hidden min-h-[600px] flex items-center justify-center group">
               {/* Decorative background grid */}
               <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
               <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
               <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-700"></div>

               {step === 'upload' && (
                 <div className="text-center space-y-6 relative z-10 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                      <ImageIcon size={40} className="text-white/20" />
                    </div>
                    <div>
                      <h4 className="text-white text-xl font-bold mb-2">Tu Diseño Aparecerá Aquí</h4>
                      <p className="text-slate-400 text-sm max-w-xs mx-auto">Selecciona tu modelo y sube una foto para que nuestra AI cree un render profesional.</p>
                    </div>
                 </div>
               )}

               {step === 'designing' && (
                 <div className="text-center relative z-10 space-y-6">
                    <div className="relative">
                       <Loader2 size={80} className="text-indigo-500 animate-spin mx-auto mb-4" />
                       <Sparkles size={32} className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <div className="animate-pulse space-y-2">
                       <h4 className="text-white text-2xl font-black">Esculpiendo tu Case...</h4>
                       <p className="text-indigo-400 font-mono text-xs uppercase tracking-[0.3em]">IA procesando píxeles</p>
                    </div>
                 </div>
               )}

               {step === 'preview' && mockupImage && (
                 <div className="relative z-10 w-full h-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
                    <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                       <img src={mockupImage} className="w-full h-full object-cover" alt="Mockup Preview" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                          <p className="text-white text-sm font-medium italic">Renderizado profesional de TechNova Studio AI</p>
                       </div>
                    </div>
                    
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">
                       <button 
                         onClick={handleAddToCart}
                         className="flex-1 bg-white text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors shadow-xl"
                       >
                         <ShoppingCart size={20} /> Añadir al Carrito
                       </button>
                       <button 
                         onClick={() => setStep('upload')}
                         className="px-6 py-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-colors border border-white/10 flex items-center justify-center"
                       >
                         <RefreshCw size={20} />
                       </button>
                    </div>
                 </div>
               )}
            </div>
            
            <div className="mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-4">
               <div className="p-2 bg-indigo-600 rounded-lg text-white">
                 <CheckCircle2 size={20} />
               </div>
               <div>
                  <h5 className="font-bold text-indigo-900 text-sm">Producción Premium Garantizada</h5>
                  <p className="text-indigo-700/70 text-xs mt-1">
                    Utilizamos impresión UV de alta definición. El render AI es una representación fiel, pero el producto físico es aún mejor. 
                    Incluye bordes reforzados y protección de cámara.
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomCaseCreator;