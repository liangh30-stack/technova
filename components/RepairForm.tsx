import React, { useState } from 'react';
import { RepairJob, Employee, RepairPart, PartType } from '../types';
import { X, Save, Trash2, Printer, Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RepairFormProps {
  order?: RepairJob;
  employees: Employee[];
  commonProblems: string[];
  onSave: (order: RepairJob) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

const RepairForm: React.FC<RepairFormProps> = ({
  order, employees, commonProblems, onSave, onCancel, onDelete
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<Partial<RepairJob>>(order || {
    id: `WX-${Math.floor(Math.random() * 9000) + 1000}`,
    status: 'Received',
    progress: 0,
    publico: true,
    fechaEntrada: new Date().toISOString()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((formData.device || (formData.brand && formData.model)) && formData.customerName && formData.issue) {
      if (!formData.device && formData.brand && formData.model) {
        formData.device = `${formData.brand} ${formData.model}`.trim();
      }
      onSave(formData as RepairJob);
    } else {
      alert(t('formFillRequired'));
    }
  };

  const handlePrintLabel = () => {
    const printWindow = window.open('', '', 'width=400,height=300');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Label ${formData.id}</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding: 10px; }
              .id { font-size: 24px; font-weight: bold; margin: 5px 0; }
              .meta { font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="meta">TechNova Repair</div>
            <div class="id">${formData.id}</div>
            <div class="meta">${formData.device}</div>
            <div class="meta">${formData.customerName}</div>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://technova.app/track/${formData.id}" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const modalTitle = order ? t('formEditRepairOrder') : t('formNewRepairTicket');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={modalTitle}
    >
      <div className="bg-white w-full max-w-2xl rounded-lg border border-brand-border shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-brand-border flex justify-between items-center bg-brand-light">
          <h3 className="text-brand-dark font-bold text-lg">
            {modalTitle}
          </h3>
          <div className="flex items-center gap-2">
            {order && onDelete && (
              <button
                onClick={() => onDelete(order.id)}
                className="bg-brand-critical/10 text-brand-critical hover:bg-brand-critical/20 rounded-lg p-2 transition-colors"
                aria-label={t('formCancel')}
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={onCancel}
              className="text-brand-text-tertiary hover:text-brand-dark p-2 transition-colors"
              aria-label={t('formCancel')}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4" role="form" aria-label={modalTitle}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-brand-dark font-medium text-sm mb-1">{t('formCustomerName')}</label>
              <input
                required
                className="w-full bg-white border border-brand-border rounded-lg px-3 py-2 text-brand-dark placeholder:text-brand-text-tertiary focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-colors"
                value={formData.customerName || ''}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
                aria-label={t('formCustomerName')}
              />
            </div>
            <div>
              <label className="block text-brand-dark font-medium text-sm mb-1">{t('formPhone')}</label>
              <input
                className="w-full bg-white border border-brand-border rounded-lg px-3 py-2 text-brand-dark placeholder:text-brand-text-tertiary focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-colors"
                value={formData.telefono || ''}
                onChange={e => setFormData({...formData, telefono: e.target.value})}
                aria-label={t('formPhone')}
              />
            </div>
            <div>
              <label className="block text-brand-dark font-medium text-sm mb-1">{t('formBrand') || 'Brand'}</label>
              <select
                className="w-full bg-white border border-brand-border rounded-lg px-3 py-2 text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-colors"
                value={formData.brand || ''}
                onChange={e => setFormData({...formData, brand: e.target.value})}
                aria-label={t('formBrand') || 'Brand'}
              >
                <option value="">{t('formSelectBrand') || 'Select brand...'}</option>
                {['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OPPO', 'Google', 'OnePlus', 'Motorola', 'Sony', 'Other'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-brand-dark font-medium text-sm mb-1">{t('formModel') || 'Model'}</label>
              <input
                className="w-full bg-white border border-brand-border rounded-lg px-3 py-2 text-brand-dark placeholder:text-brand-text-tertiary focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-colors"
                placeholder={t('formModelPlaceholder') || 'e.g. iPhone 15 Pro Max'}
                value={formData.model || ''}
                onChange={e => setFormData({...formData, model: e.target.value, device: `${formData.brand || ''} ${e.target.value}`.trim()})}
                aria-label={t('formModel') || 'Model'}
              />
            </div>
            <div>
              <label className="block text-brand-dark font-medium text-sm mb-1">{t('formStatus')}</label>
              <select
                className="w-full bg-white border border-brand-border rounded-lg px-3 py-2 text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-colors"
                value={formData.status || 'Received'}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
                aria-label={t('formStatus')}
              >
                <option value="Received">{t('formReceived')}</option>
                <option value="Diagnosing">{t('formDiagnosing')}</option>
                <option value="Waiting for Parts">{t('formWaitingForParts')}</option>
                <option value="Repaired">{t('formRepaired')}</option>
                <option value="Ready for Pickup">{t('formReadyForPickup')}</option>
                <option value="Picked Up">{t('formPickedUp')}</option>
                <option value="Finished">{t('formFinished')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-brand-dark font-medium text-sm mb-1">{t('formIssueDescription')}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonProblems.map((prob) => (
                <button
                  key={prob}
                  type="button"
                  onClick={() => setFormData({...formData, issue: (formData.issue ? formData.issue + ', ' : '') + prob})}
                  className="bg-brand-light hover:bg-brand-border text-brand-dark border border-brand-border rounded-lg text-xs px-2 py-1 transition-colors"
                >
                  + {prob}
                </button>
              ))}
            </div>
            <textarea
              required
              rows={3}
              className="w-full bg-white border border-brand-border rounded-lg px-3 py-2 text-brand-dark placeholder:text-brand-text-tertiary focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-colors"
              value={formData.issue || ''}
              onChange={e => setFormData({...formData, issue: e.target.value})}
              aria-label={t('formIssueDescription')}
            />
          </div>

          {/* Parts / Accessories */}
          <div>
            <label className="block text-brand-dark font-medium text-sm mb-1">{t('formParts') || 'Parts / Accessories'}</label>
            <div className="space-y-2 mb-2">
              {(formData.parts || []).map((part, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-brand-light rounded-lg p-2 border border-brand-border">
                  <input
                    className="flex-1 bg-white border border-brand-border rounded px-2 py-1 text-sm text-brand-dark focus:ring-1 focus:ring-brand-primary/20 outline-none"
                    value={part.name}
                    placeholder={t('formPartName') || 'Part name (e.g. Screen, Battery)'}
                    onChange={e => {
                      const updated = [...(formData.parts || [])];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      setFormData({...formData, parts: updated});
                    }}
                  />
                  <select
                    className="bg-white border border-brand-border rounded px-2 py-1 text-sm text-brand-dark focus:ring-1 focus:ring-brand-primary/20 outline-none"
                    value={part.type}
                    onChange={e => {
                      const updated = [...(formData.parts || [])];
                      updated[idx] = { ...updated[idx], type: e.target.value as PartType };
                      setFormData({...formData, parts: updated});
                    }}
                  >
                    <option value="original">Original</option>
                    <option value="compatible">Compatible</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (formData.parts || []).filter((_, i) => i !== idx);
                      setFormData({...formData, parts: updated});
                    }}
                    className="text-brand-critical hover:bg-brand-critical/10 p-1 rounded transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setFormData({...formData, parts: [...(formData.parts || []), { name: '', type: 'original' }]})}
              className="text-brand-primary hover:bg-brand-primary-light text-sm px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors border border-brand-primary/30"
            >
              <Plus size={14} /> {t('formAddPart') || 'Add part'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-brand-dark font-medium text-sm mb-1">{t('formTechnician')}</label>
                <select
                  className="w-full bg-white border border-brand-border rounded-lg px-3 py-2 text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-colors"
                  value={formData.technician || ''}
                  onChange={e => setFormData({...formData, technician: e.target.value})}
                  aria-label={t('formTechnician')}
                >
                  <option value="">{t('formSelectTech')}</option>
                  {employees.filter(e => e.role === 'Technician').map(e => (
                    <option key={e.id} value={e.name}>{e.name}</option>
                  ))}
                </select>
             </div>
             <div>
                <label className="block text-brand-dark font-medium text-sm mb-1">{t('formPrice')}</label>
                <input
                  type="number"
                  className="w-full bg-white border border-brand-border rounded-lg px-3 py-2 text-brand-dark placeholder:text-brand-text-tertiary focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-colors"
                  value={formData.price || ''}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  aria-label={t('formPrice')}
                />
             </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-brand-border">
             <button
               type="button"
               onClick={handlePrintLabel}
               className="text-brand-muted hover:text-brand-primary flex items-center gap-2 text-sm transition-colors"
               aria-label={t('formPrintLabel')}
             >
               <Printer size={16} /> {t('formPrintLabel')}
             </button>
             <div className="flex gap-3">
               <button
                 type="button"
                 onClick={onCancel}
                 className="bg-brand-light hover:bg-brand-border text-brand-muted rounded-lg px-4 py-2 transition-colors"
               >
                 {t('formCancel')}
               </button>
               <button
                 type="submit"
                 className="bg-brand-primary hover:bg-brand-primary-dark text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
               >
                 <Save size={18} /> {t('formSaveOrder')}
               </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepairForm;
