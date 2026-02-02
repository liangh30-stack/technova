import React, { useState } from 'react';
import { RepairJob, Employee } from '../types';
import { X, Save, Trash2, Printer } from 'lucide-react';

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
  const [formData, setFormData] = useState<Partial<RepairJob>>(order || {
    id: `WX-${Math.floor(Math.random() * 9000) + 1000}`,
    status: 'Received',
    progress: 0,
    publico: true,
    fechaEntrada: new Date().toISOString()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.device && formData.customerName && formData.issue) {
      onSave(formData as RepairJob);
    } else {
      alert("Please fill in required fields.");
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <h3 className="text-white font-bold text-lg">
            {order ? 'Edit Repair Order' : 'New Repair Ticket'}
          </h3>
          <div className="flex items-center gap-2">
            {order && onDelete && (
              <button onClick={() => onDelete(order.id)} className="text-red-400 hover:text-red-300 p-2">
                <Trash2 size={20} />
              </button>
            )}
            <button onClick={onCancel} className="text-slate-400 hover:text-white p-2">
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">Customer Name</label>
              <input 
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                value={formData.customerName || ''}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Phone</label>
              <input 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                value={formData.telefono || ''}
                onChange={e => setFormData({...formData, telefono: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Device Model</label>
              <input 
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                value={formData.device || ''}
                onChange={e => setFormData({...formData, device: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Status</label>
              <select 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                value={formData.status || 'Received'}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="Received">Received</option>
                <option value="Diagnosing">Diagnosing</option>
                <option value="Waiting for Parts">Waiting for Parts</option>
                <option value="Repaired">Repaired</option>
                <option value="Ready for Pickup">Ready for Pickup</option>
                <option value="Picked Up">Picked Up</option>
                <option value="Finished">Finished</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">Issue Description</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonProblems.map((prob) => (
                <button
                  key={prob}
                  type="button"
                  onClick={() => setFormData({...formData, issue: (formData.issue ? formData.issue + ', ' : '') + prob})}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded border border-slate-600"
                >
                  + {prob}
                </button>
              ))}
            </div>
            <textarea 
              required
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
              value={formData.issue || ''}
              onChange={e => setFormData({...formData, issue: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-slate-400 text-sm mb-1">Technician</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  value={formData.technician || ''}
                  onChange={e => setFormData({...formData, technician: e.target.value})}
                >
                  <option value="">Select Tech...</option>
                  {employees.filter(e => e.role === 'Technician').map(e => (
                    <option key={e.id} value={e.name}>{e.name}</option>
                  ))}
                </select>
             </div>
             <div>
                <label className="block text-slate-400 text-sm mb-1">Price (€)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  value={formData.price || ''}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                />
             </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-700">
             <button 
               type="button" 
               onClick={handlePrintLabel}
               className="text-slate-400 hover:text-white flex items-center gap-2 text-sm"
             >
               <Printer size={16} /> Print Label
             </button>
             <div className="flex gap-3">
               <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-300 hover:text-white">Cancel</button>
               <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                 <Save size={18} /> Save Order
               </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepairForm;
