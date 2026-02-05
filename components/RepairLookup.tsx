import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, CheckCircle, Clock, Smartphone,
  FileText, MessageCircle, ArrowLeft, AlertCircle,
  Wrench, Package, Truck, CircleDot, Phone, Copy, Check, Shield, User
} from 'lucide-react';
import { MOCK_REPAIRS } from '../constants';
import { RepairJob, Language } from '../types';

interface RepairLookupProps {
  onBrowseShop: () => void;
  lang: Language;
  initialSearchTerm?: string;
  onClearSearch?: () => void;
}

const RepairLookup: React.FC<RepairLookupProps> = ({ onBrowseShop, initialSearchTerm, onClearSearch }) => {
  const { t } = useTranslation();
  const [orderId, setOrderId] = useState(initialSearchTerm || '');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<RepairJob | null | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialSearchTerm) {
      setOrderId(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  useEffect(() => {
    return () => {
      if (onClearSearch) onClearSearch();
    };
  }, [onClearSearch]);

  const getEnrichedData = (repair: RepairJob) => ({
    ...repair,
    imei: "356988******49",
    warranty: "6 meses",
    deposit: 20.00,
    total: repair.price || 89.00,
    technicianName: repair.technician || "Alex D.",
    storeName: "TechNova Porriño",
    storePhone: "+34 986 123 456"
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
            setErrorMsg(t('repairPhoneMismatch'));
            setLoading(false);
            return;
          }
        }
        setResult(found);
      } else {
        setResult(null);
        setErrorMsg(t('repairNotFound'));
      }
      setLoading(false);
    }, 600);
  };

  const copyOrderId = () => {
    if (result) {
      navigator.clipboard.writeText(result.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusStep = (status: string): number => {
    const statusMap: Record<string, number> = {
      'Received': 0,
      'Diagnosing': 1,
      'Waiting for Parts': 2,
      'Repaired': 3,
      'Ready for Pickup': 4,
      'Picked Up': 5,
      'Finished': 5
    };
    return statusMap[status] ?? 0;
  };

  const steps = [
    { icon: Package, label: t('repairStepReceived') },
    { icon: Search, label: t('repairStepDiagnosis') },
    { icon: Clock, label: t('repairStepParts') },
    { icon: Wrench, label: t('repairStepRepair') },
    { icon: Truck, label: t('repairStepReady') },
  ];

  const enrichedResult = result ? getEnrichedData(result) : null;
  const currentStep = result ? getStatusStep(result.status) : 0;

  return (
    <div className="min-h-screen bg-brand-light py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header - Stripe style */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-purple to-brand-cyan rounded-2xl mb-5 shadow-lg shadow-brand-purple/25">
            <Search size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-brand-dark mb-3 tracking-tight">{t('trackTitle')}</h1>
          <p className="text-brand-muted text-base max-w-md mx-auto">{t('trackDesc')}</p>
        </div>

        {/* Search Form - Stripe style card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100/80 p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">{t('orderLabel')}</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                  <input
                    type="text"
                    placeholder="WX-8888"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                    className="w-full bg-brand-light border border-gray-200/80 rounded-xl pl-12 pr-4 py-3.5 text-brand-dark font-medium focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">{t('phoneLabel')}</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                  <input
                    type="tel"
                    placeholder="600 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-brand-light border border-gray-200/80 rounded-xl pl-12 pr-4 py-3.5 text-brand-dark font-medium focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-dark hover:bg-brand-purple text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg hover:shadow-brand-purple/25"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={18} />
                  {t('searchButton')}
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-5 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm border border-red-100">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle size={18} />
              </div>
              {errorMsg}
            </div>
          )}
        </div>

        {/* Result - Stripe style */}
        {enrichedResult && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">

            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100/80 overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-brand-muted uppercase tracking-wider">{t('repairOrder')}</span>
                    <button
                      onClick={copyOrderId}
                      className="flex items-center gap-2 bg-brand-light hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors border border-gray-200/50"
                    >
                      <span className="font-mono font-semibold text-brand-dark text-sm">{enrichedResult.id}</span>
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-brand-muted" />}
                    </button>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                    currentStep >= 4 ? 'bg-green-100 text-green-700' : 'bg-gradient-to-r from-brand-purple/10 to-brand-cyan/10 text-brand-purple'
                  }`}>
                    {currentStep >= 4 ? t('repairStatusReady') : t('repairStatusProgress')}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-brand-dark tracking-tight">{enrichedResult.device}</h2>
                <p className="text-brand-muted text-sm mt-1">{enrichedResult.issue}</p>
              </div>

              {/* Progress Steps - Stripe style */}
              <div className="p-6 bg-brand-light">
                <div className="flex items-center justify-between relative">
                  {/* Progress line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 mx-8" />
                  <div
                    className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-cyan mx-8 transition-all duration-500"
                    style={{ width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 4rem)` }}
                  />

                  {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = idx < currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={idx} className="flex flex-col items-center flex-1 relative z-10">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          isCompleted ? 'bg-gradient-to-br from-brand-purple to-brand-cyan text-white shadow-lg shadow-brand-purple/25' :
                          isCurrent ? 'bg-white text-brand-purple ring-2 ring-brand-purple shadow-lg' :
                          'bg-white text-brand-muted border border-gray-200'
                        }`}>
                          {isCompleted ? <CheckCircle size={20} /> : <Icon size={18} />}
                        </div>
                        <span className={`text-[11px] mt-2.5 text-center font-medium leading-tight max-w-[60px] ${
                          isCompleted || isCurrent ? 'text-brand-dark' : 'text-brand-muted'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Details Grid - Stripe style */}
            <div className="grid grid-cols-2 gap-5">
              {/* Device Info */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100/80 shadow-lg shadow-gray-200/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-brand-purple/10 rounded-lg flex items-center justify-center">
                    <Smartphone size={16} className="text-brand-purple" />
                  </div>
                  <h4 className="text-sm font-semibold text-brand-dark">{t('repairDeviceInfo')}</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">IMEI</span>
                    <span className="font-mono font-medium text-brand-dark">{enrichedResult.imei}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">{t('repairTechnician')}</span>
                    <span className="font-medium text-brand-dark flex items-center gap-1.5">
                      <User size={12} />
                      {enrichedResult.technicianName}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">{t('repairWarranty')}</span>
                    <span className="font-medium text-green-600 flex items-center gap-1.5">
                      <Shield size={12} />
                      {enrichedResult.warranty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100/80 shadow-lg shadow-gray-200/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText size={16} className="text-green-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-brand-dark">{t('repairPayment')}</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">{t('repairTotal')}</span>
                    <span className="font-semibold text-brand-dark">€{enrichedResult.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">{t('repairDeposit')}</span>
                    <span className="font-medium text-green-600">-€{enrichedResult.deposit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
                    <span className="font-semibold text-brand-dark">{t('repairBalance')}</span>
                    <span className="font-bold text-brand-purple text-lg">€{(enrichedResult.total - enrichedResult.deposit).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions - Stripe style */}
            <div className="flex gap-4">
              <a
                href={`https://wa.me/34986123456?text=${encodeURIComponent(`Hola, consulta sobre pedido ${enrichedResult.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5 text-sm shadow-lg shadow-green-500/25"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
              <button
                onClick={onBrowseShop}
                className="flex-1 bg-white hover:bg-brand-light text-brand-dark font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5 text-sm border border-gray-200/80 shadow-sm"
              >
                <ArrowLeft size={18} />
                {t('repairBackToShop')}
              </button>
            </div>

            {/* Store Info */}
            <div className="text-center py-4">
              <p className="text-sm text-brand-muted">
                {enrichedResult.storeName} · {enrichedResult.storePhone}
              </p>
            </div>
          </div>
        )}

        {/* Empty State Hint - Stripe style */}
        {result === undefined && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CircleDot size={40} className="text-brand-muted/50" />
            </div>
            <p className="text-brand-muted">{t('repairHint')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairLookup;
