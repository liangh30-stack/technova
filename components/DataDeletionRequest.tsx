import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, AlertTriangle, Send, CheckCircle, ArrowLeft, Shield, Info } from 'lucide-react';

interface DataDeletionRequestProps {
  customerEmail?: string;
  onBack: () => void;
  onSubmit: (data: DeletionRequestData) => void;
}

export interface DeletionRequestData {
  email: string;
  fullName: string;
  requestType: 'erasure' | 'restriction' | 'portability' | 'rectification';
  details: string;
  confirmIdentity: boolean;
  confirmConsequences: boolean;
}

const DataDeletionRequest: React.FC<DataDeletionRequestProps> = ({ customerEmail, onBack, onSubmit }) => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<DeletionRequestData>({
    email: customerEmail || '',
    fullName: '',
    requestType: 'erasure',
    details: '',
    confirmIdentity: false,
    confirmConsequences: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DeletionRequestData, string>>>({});

  const requestTypes: { value: DeletionRequestData['requestType']; label: string; description: string }[] = [
    {
      value: 'erasure',
      label: t('dataDeletionTypeErasure', 'Supresion (Derecho al olvido)'),
      description: t('dataDeletionTypeErasureDesc', 'Solicitar la eliminacion completa de todos sus datos personales.'),
    },
    {
      value: 'restriction',
      label: t('dataDeletionTypeRestriction', 'Limitacion del tratamiento'),
      description: t('dataDeletionTypeRestrictionDesc', 'Solicitar que se limite el uso de sus datos personales.'),
    },
    {
      value: 'portability',
      label: t('dataDeletionTypePortability', 'Portabilidad'),
      description: t('dataDeletionTypePortabilityDesc', 'Recibir sus datos en un formato estructurado y de uso comun.'),
    },
    {
      value: 'rectification',
      label: t('dataDeletionTypeRectification', 'Rectificacion'),
      description: t('dataDeletionTypeRectificationDesc', 'Corregir datos personales inexactos o incompletos.'),
    },
  ];

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DeletionRequestData, string>> = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('dataDeletionErrorEmail', 'Correo electronico invalido');
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('dataDeletionErrorName', 'Nombre completo requerido');
    }
    if (!formData.confirmIdentity) {
      newErrors.confirmIdentity = t('dataDeletionErrorIdentity', 'Debe confirmar su identidad');
    }
    if (formData.requestType === 'erasure' && !formData.confirmConsequences) {
      newErrors.confirmConsequences = t('dataDeletionErrorConsequences', 'Debe aceptar las consecuencias');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-light">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-brand-dark mb-2">
              {t('dataDeletionSuccessTitle', 'Solicitud Recibida')}
            </h2>
            <p className="text-sm text-brand-muted mb-6">
              {t('dataDeletionSuccessDesc', 'Hemos recibido su solicitud. Conforme al RGPD, responderemos en un plazo maximo de 30 dias. Le notificaremos al correo electronico proporcionado.')}
            </p>
            <p className="text-xs text-brand-muted mb-6">
              {t('dataDeletionSuccessRef', 'Referencia')}: <span className="font-mono font-medium text-brand-dark">RGPD-{Date.now().toString(36).toUpperCase()}</span>
            </p>
            <button
              onClick={onBack}
              className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors"
            >
              {t('dataDeletionBackToShop', 'Volver a la tienda')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-brand-muted hover:text-brand-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          {t('dataDeletionBack', 'Volver')}
        </button>

        <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-brand-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <Shield size={20} className="text-brand-primary" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-brand-dark">
                  {t('dataDeletionTitle', 'Ejercicio de Derechos RGPD')}
                </h1>
                <p className="text-xs text-brand-muted">
                  {t('dataDeletionSubtitle', 'Reglamento General de Proteccion de Datos (UE) 2016/679')}
                </p>
              </div>
            </div>
            <p className="text-sm text-brand-muted leading-relaxed">
              {t('dataDeletionDescription', 'Utilice este formulario para ejercer sus derechos de proteccion de datos. Responderemos en un plazo maximo de 30 dias conforme a la normativa vigente.')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Request type */}
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-3">
                {t('dataDeletionRequestType', 'Tipo de solicitud')}
              </label>
              <div className="space-y-2">
                {requestTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.requestType === type.value
                        ? 'border-brand-primary bg-brand-primary/5'
                        : 'border-brand-border hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="requestType"
                      value={type.value}
                      checked={formData.requestType === type.value}
                      onChange={(e) => setFormData({ ...formData, requestType: e.target.value as DeletionRequestData['requestType'] })}
                      className="mt-0.5 accent-brand-primary"
                    />
                    <div>
                      <p className="text-sm font-medium text-brand-dark">{type.label}</p>
                      <p className="text-xs text-brand-muted">{type.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1.5">
                {t('dataDeletionFullName', 'Nombre completo')} *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                  errors.fullName ? 'border-red-400 bg-red-50' : 'border-brand-border bg-white'
                }`}
                placeholder={t('dataDeletionFullNamePlaceholder', 'Su nombre y apellidos')}
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1.5">
                {t('dataDeletionEmail', 'Correo electronico')} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                  errors.email ? 'border-red-400 bg-red-50' : 'border-brand-border bg-white'
                }`}
                placeholder={t('dataDeletionEmailPlaceholder', 'correo@ejemplo.com')}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1.5">
                {t('dataDeletionDetails', 'Detalles adicionales')}
              </label>
              <textarea
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-brand-border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none"
                placeholder={t('dataDeletionDetailsPlaceholder', 'Explique brevemente su solicitud o indique los datos especificos...')}
              />
            </div>

            {/* Warning for erasure */}
            {formData.requestType === 'erasure' && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    {t('dataDeletionErasureWarningTitle', 'Aviso importante')}
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    {t('dataDeletionErasureWarningDesc', 'La eliminacion de sus datos es irreversible. Se eliminaran su cuenta, historial de pedidos, direcciones y preferencias. Los datos necesarios para obligaciones legales (facturas, 5 anos) seran conservados conforme a la ley.')}
                  </p>
                </div>
              </div>
            )}

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.confirmIdentity}
                  onChange={(e) => setFormData({ ...formData, confirmIdentity: e.target.checked })}
                  className="mt-0.5 accent-brand-primary"
                />
                <span className="text-sm text-brand-muted">
                  {t('dataDeletionConfirmIdentity', 'Confirmo que soy el titular de los datos personales o su representante autorizado.')} *
                </span>
              </label>
              {errors.confirmIdentity && <p className="text-xs text-red-500 ml-6">{errors.confirmIdentity}</p>}

              {formData.requestType === 'erasure' && (
                <>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.confirmConsequences}
                      onChange={(e) => setFormData({ ...formData, confirmConsequences: e.target.checked })}
                      className="mt-0.5 accent-brand-primary"
                    />
                    <span className="text-sm text-brand-muted">
                      {t('dataDeletionConfirmConsequences', 'Entiendo que la eliminacion de mis datos es irreversible y que perderé acceso a mi cuenta y servicios asociados.')} *
                    </span>
                  </label>
                  {errors.confirmConsequences && <p className="text-xs text-red-500 ml-6">{errors.confirmConsequences}</p>}
                </>
              )}
            </div>

            {/* Info box */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                {t('dataDeletionInfoAEPD', 'Si no esta satisfecho con nuestra respuesta, puede presentar una reclamacion ante la Agencia Espanola de Proteccion de Datos (AEPD) en www.aepd.es.')}
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors shadow-sm"
            >
              <Send size={16} />
              {t('dataDeletionSubmit', 'Enviar solicitud')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DataDeletionRequest;
