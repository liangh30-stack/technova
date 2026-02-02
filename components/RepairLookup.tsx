import React, { useState } from 'react';
import { 
  Search, CheckCircle2, Circle, Clock, Smartphone, 
  FileText, Download, MessageCircle, ArrowRight, AlertCircle,
  CreditCard, ShieldCheck, MapPin
} from 'lucide-react';
import { MOCK_REPAIRS, TRANSLATIONS } from '../constants';
import { RepairJob, Language } from '../types';

interface RepairLookupProps {
  onBrowseShop: () => void;
  lang: Language;
}

const RepairLookup: React.FC<RepairLookupProps> = ({ onBrowseShop, lang }) => {
  const t = TRANSLATIONS[lang];
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<RepairJob | null | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Simulated data enrichment for the UI (since our mock data is simple)
  const getEnrichedData = (repair: RepairJob) => ({
    ...repair,
    imei: "35698801******9",
    warranty: "6 Months",
    deposit: 20.00,
    total: repair.price || 89.00,
    technicianName: repair.technician || "Alex D.",
    storeName: "TechNova Porriño"
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(undefined);
    setErrorMsg('');
    setLoading(true);
    
    setTimeout(() => {
      const found = MOCK_REPAIRS.find(r => r.id.toLowerCase() === orderId.toLowerCase());
      
      if (found) {
        if (found.telefono) {
            const inputPhone = phone.replace(/\D/g, '');
            const recordPhone = found.telefono.replace(/\D/g, '');
            if (!inputPhone || !recordPhone.includes(inputPhone)) {
                setResult(null);
                setErrorMsg(lang === 'CN' ? '手机号码不匹配' : 'Verification failed: Phone number does not match.');
                setLoading(false);
                return;
            }
        }
        setResult(found);
      } else {
        setResult(null);
        setErrorMsg(lang === 'CN' ? '未找到该订单' : 'Order not found. Please check your details.');
      }
      setLoading(false);
    }, 800);
  };

  // Helper to generate timeline steps based on current status
  const getTimeline = (currentStatus: string) => {
    const steps = [
      { status: 'Received', label: 'Device Received', date: '2023-10-25 10:00' },
      { status: 'Diagnosing', label: 'Expert Diagnosis', date: '2023-10-25 14:30' },
      { status: 'Waiting for Parts', label: 'Parts Ordered', date: '2023-10-26 09:00' },
      { status: 'Repaired', label: 'Repair Completed', date: '2023-10-27 16:00' },
      { status: 'Ready for Pickup', label: 'Ready for Collection', date: '2023-10-27 17:00' },
      { status: 'Picked Up', label: 'Job Closed', date: '2023-10-28 11:00' },
    ];

    // Find index of current status
    const currentIndex = steps.findIndex(s => s.status === currentStatus);
    // If status is "Finished", assume all done
    const effectiveIndex = currentStatus === 'Finished' ? steps.length - 1 : (currentIndex === -1 ? 0 : currentIndex);

    return steps.map((step, idx) => ({
      ...step,
      completed: idx <= effectiveIndex,
      current: idx === effectiveIndex
    }));
  };

  const enrichedResult = result ? getEnrichedData(result) : null;
  const timeline = result ? getTimeline(result.status) : [];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 font-sans text-brand-dark">
      
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">{t.trackTitle}</h1>
        <p className="text-gray-500">{t.trackDesc}</p>
      </div>

      {/* Search Box - Professional Card Style */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12 relative z-10">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">{t.orderLabel}</label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="e.g., WX-8888"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-brand-dark font-medium focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">{t.phoneLabel}</label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="e.g., 600123456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-brand-dark font-medium focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-dark hover:bg-brand-teal text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-dark/20 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="animate-pulse">Searching...</span>
            ) : (
              <>
                <Search size={20} />
                {t.searchButton}
              </>
            )}
          </button>
        </form>

        {errorMsg && (
           <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3 text-sm animate-in fade-in">
             <AlertCircle size={20} />
             {errorMsg}
           </div>
        )}
      </div>

      {/* Result View - Clean Professional Layout */}
      {enrichedResult && (
        <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Status Timeline */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-brand-dark text-lg mb-6 flex items-center gap-2">
                  <Clock size={20} className="text-brand-pink"/> Repair Timeline
                </h3>
                
                <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                  {timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Dot */}
                      <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 ${
                        step.completed 
                          ? 'bg-brand-teal border-brand-teal' 
                          : step.current 
                            ? 'bg-white border-brand-pink animate-pulse' 
                            : 'bg-white border-gray-300'
                      }`} />
                      
                      <div className={`${step.completed || step.current ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                        <h4 className={`text-sm font-bold ${step.current ? 'text-brand-pink' : 'text-brand-dark'}`}>
                          {step.label}
                        </h4>
                        <span className="text-xs text-gray-500 block mb-1">{step.completed ? step.date : 'Pending'}</span>
                        {step.current && (
                          <span className="inline-block bg-brand-pink/10 text-brand-pink text-[10px] font-bold px-2 py-0.5 rounded mt-1">
                            Current Status
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Card */}
              <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                 <h4 className="font-bold text-green-800 mb-2">Need help?</h4>
                 <p className="text-xs text-green-700 mb-4">Chat directly with the workshop about Order #{enrichedResult.id}</p>
                 <button className="w-full bg-white text-green-600 font-bold py-2 rounded-lg border border-green-200 hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm">
                   <MessageCircle size={16}/> WhatsApp Us
                 </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Details & Financials */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Main Device Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start gap-6">
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        enrichedResult.status === 'Picked Up' ? 'bg-gray-100 text-gray-600' : 
                        enrichedResult.status === 'Ready for Pickup' ? 'bg-green-100 text-green-600' : 
                        'bg-brand-pink/10 text-brand-pink'
                      }`}>
                        {enrichedResult.status}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">#{enrichedResult.id}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-brand-dark mb-2">{enrichedResult.device}</h2>
                    <p className="text-gray-500 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-brand-teal"/>
                      Issue: <span className="font-medium text-brand-dark">{enrichedResult.issue}</span>
                    </p>
                 </div>
                 <div className="text-right">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Estimated Cost</div>
                    <div className="text-3xl font-bold text-brand-dark">€{enrichedResult.total.toFixed(2)}</div>
                    {enrichedResult.deposit > 0 && (
                      <div className="text-xs text-green-600 mt-1">
                        Deposit Paid: €{enrichedResult.deposit.toFixed(2)}
                      </div>
                    )}
                 </div>
              </div>

              {/* Technical Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-gray-400 text-xs uppercase font-bold mb-2">Device Info</div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                       <span className="text-sm text-gray-600">IMEI / SN</span>
                       <span className="text-sm font-mono font-medium">{enrichedResult.imei}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                       <span className="text-sm text-gray-600">Warranty</span>
                       <span className="text-sm font-medium text-green-600">{enrichedResult.warranty}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                       <span className="text-sm text-gray-600">Technician</span>
                       <span className="text-sm font-medium">{enrichedResult.technicianName}</span>
                    </div>
                 </div>

                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-gray-400 text-xs uppercase font-bold mb-2">Payment Summary</div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                       <span className="text-sm text-gray-600">Subtotal</span>
                       <span className="text-sm font-medium">€{(enrichedResult.total / 1.21).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                       <span className="text-sm text-gray-600">VAT (21%)</span>
                       <span className="text-sm font-medium">€{(enrichedResult.total - (enrichedResult.total / 1.21)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                       <span className="text-sm font-bold text-brand-dark">Balance Due</span>
                       <span className="text-lg font-bold text-brand-pink">€{(enrichedResult.total - enrichedResult.deposit).toFixed(2)}</span>
                    </div>
                 </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                    onClick={() => window.print()}
                    className="flex-1 bg-white border border-gray-200 text-brand-dark font-bold py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
                 >
                   <FileText size={18} /> Download Invoice
                 </button>
                 
                 {/* Upsell Logic integrated subtly */}
                 <button 
                    onClick={onBrowseShop}
                    className="flex-1 bg-brand-pink text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-pink/20"
                 >
                   <Smartphone size={18} /> Shop Accessories
                   <ArrowRight size={16} />
                 </button>
              </div>

              <div className="text-center">
                 <p className="text-xs text-gray-400">
                    Terms & Conditions apply. Repair warranty covers replaced parts only.
                    <br/>TechNova {enrichedResult.storeName}
                 </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairLookup;