import React, { useState } from 'react';
import { RepairJob, Employee, InventoryItem, Language } from '../types';
import { Search, Calendar, Filter, Plus, PenSquare, CheckCircle, Package, Phone, CalendarDays, FileSpreadsheet } from 'lucide-react';
import RepairForm from './RepairForm';
import DailyRepairReport from './DailyRepairReport';
import { useTranslation } from 'react-i18next';

interface KanbanBoardProps {
  repairs: RepairJob[];
  setRepairs: React.Dispatch<React.SetStateAction<RepairJob[]>>;
  employees: Employee[];
  currentUser: Employee;
  inventory: InventoryItem[];
  setInventory: (items: InventoryItem[]) => void;
  onDeleteRepair: (id: string) => void;
  lang: Language;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  repairs, setRepairs, employees, currentUser, inventory, setInventory, onDeleteRepair, lang
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOrder, setEditingOrder] = useState<RepairJob | null>(null);
  const [filterTech, setFilterTech] = useState('');
  const [showDailyReport, setShowDailyReport] = useState(false);

  const { t } = useTranslation();

  const columns = [
    { id: 'Received', label: t('formReceived'), headerBg: 'bg-brand-text-tertiary/10', headerText: 'text-brand-text-tertiary', borderColor: 'border-brand-text-tertiary' },
    { id: 'Diagnosing', label: t('formDiagnosing'), headerBg: 'bg-brand-info/10', headerText: 'text-brand-info', borderColor: 'border-brand-info' },
    { id: 'Waiting for Parts', label: t('formWaitingForParts'), headerBg: 'bg-brand-warning/10', headerText: 'text-brand-warning', borderColor: 'border-brand-warning' },
    { id: 'Repaired', label: t('formRepaired'), headerBg: 'bg-brand-success/10', headerText: 'text-brand-success', borderColor: 'border-brand-success' },
    { id: 'Ready for Pickup', label: t('formReadyForPickup'), headerBg: 'bg-brand-primary/10', headerText: 'text-brand-primary', borderColor: 'border-brand-primary' },
    { id: 'Finished', label: t('formFinished'), headerBg: 'bg-brand-muted/10', headerText: 'text-brand-muted', borderColor: 'border-brand-muted' }
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: any) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    setRepairs(prev => prev.map(r => r.id === id ? { ...r, status, progress: status === 'Finished' ? 100 : r.progress } : r));
  };

  const handleSaveOrder = (updatedOrder: RepairJob) => {
    if (repairs.find(r => r.id === updatedOrder.id)) {
      setRepairs(prev => prev.map(r => r.id === updatedOrder.id ? updatedOrder : r));
    } else {
      setRepairs([...repairs, updatedOrder]);
    }
    setEditingOrder(null);
  };

  const getBrandLogoUrl = (device: string) => {
    const brand = device.split(' ')[0].toLowerCase();
    const map: Record<string, string> = {
      iphone: 'apple',
      samsung: 'samsung',
      xiaomi: 'xiaomi',
      pixel: 'google',
      ipad: 'apple',
      oppo: 'oppo',
      huawei: 'huawei'
    };
    return `https://cdn.simpleicons.org/${map[brand] || 'android'}`;
  };

  const formatDate = (dateStr?: string) => {
      if (!dateStr) return 'N/A';
      return new Date(dateStr).toLocaleDateString(lang === 'CN' ? 'zh-CN' : 'en-US', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filteredRepairs = repairs.filter(r =>
    (r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     r.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
     r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (r.telefono && r.telefono.includes(searchTerm))) &&
    (filterTech ? r.technician === filterTech : true)
  );

  return (
    <div className="h-full flex flex-col" role="region" aria-label={t('dashboardWorkshop')}>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-3 top-3 text-brand-muted" size={18} />
          <input
            type="text"
            placeholder={t('kbSearchPlaceholder')}
            className="w-full bg-white border border-brand-border rounded-lg pl-10 pr-4 py-3 text-brand-dark placeholder:text-brand-text-tertiary focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label={t('kbSearchPlaceholder')}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="bg-white border border-brand-border text-brand-dark rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            value={filterTech}
            onChange={e => setFilterTech(e.target.value)}
            aria-label={t('allTechs')}
          >
            <option value="">{t('allTechs')}</option>
            {employees.filter(e => e.role === 'Technician').map(e => (
              <option key={e.id} value={e.name}>{e.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowDailyReport(true)}
            className="bg-brand-accent hover:bg-brand-accent/90 text-white px-4 py-3 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap transition-colors"
            aria-label={t('reportGenerate') || 'Generate Report'}
          >
            <FileSpreadsheet size={20} /> {t('reportGenerate') || 'Report'}
          </button>
          <button
            onClick={() => setEditingOrder({} as any)}
            className="bg-brand-primary hover:bg-brand-primary-dark text-white px-4 py-3 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap transition-colors"
            aria-label={t('newJob')}
          >
            <Plus size={20} /> {t('newJob')}
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto pb-4" role="list" aria-label="Kanban board columns">
        <div className="flex gap-4 min-w-[1200px] h-full">
          {columns.map(col => (
            <div
              key={col.id}
              className="flex-1 bg-brand-light rounded-2xl flex flex-col min-w-[280px] border border-brand-border"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              role="listitem"
              aria-label={col.label}
            >
              <div className={`p-3 rounded-t-2xl border-b border-brand-border flex justify-between items-center border-l-4 ${col.borderColor} ${col.headerBg}`}>
                <span className={`font-bold text-sm ${col.headerText}`}>{col.label}</span>
                <span className="bg-brand-critical text-white text-xs px-2 py-0.5 rounded-full font-medium" aria-label={`${filteredRepairs.filter(r => r.status === col.id).length} items`}>
                  {filteredRepairs.filter(r => r.status === col.id).length}
                </span>
              </div>

              <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                {filteredRepairs.filter(r => r.status === col.id).map(job => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, job.id)}
                    onClick={() => setEditingOrder(job)}
                    className="bg-white hover:bg-brand-primary-light border border-brand-border rounded-xl p-3 cursor-grab active:cursor-grabbing relative overflow-hidden group transition-all hover:scale-[1.02] hover:shadow-lg"
                    role="article"
                    aria-label={`${job.device} - ${job.customerName}`}
                  >
                    {/* Brand Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                       <img src={getBrandLogoUrl(job.device)} className="w-28 h-28 filter grayscale opacity-20" alt="" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2">
                         <span className="font-mono text-xs text-brand-muted bg-brand-light px-1.5 py-0.5 rounded border border-brand-border">{job.id}</span>
                         <button
                           onClick={(e) => { e.stopPropagation(); setEditingOrder(job); }}
                           className="text-brand-muted hover:text-brand-primary"
                           aria-label={`Edit ${job.id}`}
                         >
                           <PenSquare size={14} />
                         </button>
                      </div>

                      <h4 className="font-bold text-brand-dark text-sm mb-0.5">{job.device}</h4>
                      <div className="text-xs text-brand-text-tertiary mb-1 font-medium">{job.customerName}</div>

                      {/* Phone Display */}
                      <div className="flex items-center gap-1.5 text-[11px] text-brand-info mb-2 font-mono bg-brand-info/10 w-fit px-1.5 py-0.5 rounded">
                         <Phone size={10} />
                         {job.telefono || 'N/A'}
                      </div>

                      <div className="bg-brand-light rounded p-1.5 mb-2 border border-brand-border">
                        <p className="text-xs text-brand-muted line-clamp-2">{job.issue}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] text-brand-muted border-t border-brand-border pt-2 mb-2">
                         <div className="flex items-center gap-1">
                            <CalendarDays size={10} />
                            <span>{t('inDate')}: {formatDate(job.fechaEntrada)}</span>
                         </div>
                         {job.status === 'Finished' || job.status === 'Picked Up' ? (
                            <div className="flex items-center gap-1 text-brand-success">
                               <CheckCircle size={10} />
                               <span>{t('outDate')}: {job.estimatedCompletion}</span>
                            </div>
                         ) : (
                             <div className="flex items-center gap-1">
                               <span>Est: {job.estimatedCompletion}</span>
                            </div>
                         )}
                      </div>

                      <div className="flex justify-between items-center">
                         <div className="flex flex-col">
                           <span className="text-[10px] text-brand-muted">{t('techLabel')}: {job.technician || t('formUnassigned')}</span>
                           {job.price && (job.status === 'Finished' || job.status === 'Picked Up') && (
                             <span className="text-sm font-bold text-brand-success">{'\u20AC'}{job.price}</span>
                           )}
                         </div>
                         {job.status === 'Ready for Pickup' && (
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               setRepairs(prev => prev.map(r => r.id === job.id ? {...r, status: 'Finished', estimatedCompletion: new Date().toLocaleDateString()} : r));
                             }}
                             className="bg-brand-success hover:bg-brand-primary-dark text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg transition-colors"
                             aria-label={`${t('formFinishBtn')} ${job.id}`}
                           >
                             <CheckCircle size={10} /> {t('formFinishBtn')}
                           </button>
                         )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingOrder && (
        <RepairForm
          order={editingOrder.id ? editingOrder : undefined}
          employees={employees}
          commonProblems={['Screen', 'Battery', 'Charging Port', 'Water Damage']}
          onSave={handleSaveOrder}
          onCancel={() => setEditingOrder(null)}
          onDelete={onDeleteRepair}
        />
      )}

      {showDailyReport && (
        <DailyRepairReport
          repairs={repairs}
          onClose={() => setShowDailyReport(false)}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
