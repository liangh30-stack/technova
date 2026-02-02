import React, { useState } from 'react';
import { RepairJob, Employee, InventoryItem, Language } from '../types';
import { Search, Calendar, Filter, Plus, PenSquare, CheckCircle, Package, Phone, CalendarDays } from 'lucide-react';
import RepairForm from './RepairForm';
import { TRANSLATIONS } from '../constants';

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
  
  const t = TRANSLATIONS[lang];

  const columns = [
    { id: 'Received', label: 'Received', color: 'bg-slate-500' },
    { id: 'Diagnosing', label: 'Diagnosing', color: 'bg-blue-500' },
    { id: 'Waiting for Parts', label: 'Waiting', color: 'bg-yellow-500' },
    { id: 'Repaired', label: 'Repaired', color: 'bg-green-500' },
    { id: 'Ready for Pickup', label: 'Ready', color: 'bg-emerald-600' },
    { id: 'Finished', label: 'Finished', color: 'bg-slate-700' }
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
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-3 top-3 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder={t.kbSearchPlaceholder}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            className="bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none"
            value={filterTech}
            onChange={e => setFilterTech(e.target.value)}
          >
            <option value="">{t.allTechs}</option>
            {employees.filter(e => e.role === 'Technician').map(e => (
              <option key={e.id} value={e.name}>{e.name}</option>
            ))}
          </select>
          <button 
            onClick={() => setEditingOrder({} as any)} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} /> {t.newJob}
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1200px] h-full">
          {columns.map(col => (
            <div 
              key={col.id} 
              className="flex-1 bg-slate-900/50 rounded-2xl flex flex-col min-w-[280px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className={`p-3 rounded-t-2xl border-b border-slate-700 flex justify-between items-center ${col.color} bg-opacity-20`}>
                <span className={`font-bold text-sm ${col.color.replace('bg-', 'text-')}`}>{col.label}</span>
                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
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
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-3 cursor-grab active:cursor-grabbing relative overflow-hidden group transition-all hover:scale-[1.02] hover:shadow-lg"
                  >
                    {/* Brand Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                       <img src={getBrandLogoUrl(job.device)} className="w-28 h-28 filter grayscale opacity-20" alt="" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2">
                         <span className="font-mono text-xs text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">{job.id}</span>
                         <button 
                           onClick={(e) => { e.stopPropagation(); setEditingOrder(job); }}
                           className="text-slate-500 hover:text-white"
                         >
                           <PenSquare size={14} />
                         </button>
                      </div>
                      
                      <h4 className="font-bold text-white text-sm mb-0.5">{job.device}</h4>
                      <div className="text-xs text-slate-400 mb-1 font-medium">{job.customerName}</div>
                      
                      {/* Phone Display */}
                      <div className="flex items-center gap-1.5 text-[11px] text-blue-400 mb-2 font-mono bg-blue-500/10 w-fit px-1.5 py-0.5 rounded">
                         <Phone size={10} />
                         {job.telefono || 'N/A'}
                      </div>
                      
                      <div className="bg-slate-900/50 rounded p-1.5 mb-2 border border-slate-700/50">
                        <p className="text-xs text-slate-300 line-clamp-2">{job.issue}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] text-slate-500 border-t border-slate-700/50 pt-2 mb-2">
                         <div className="flex items-center gap-1">
                            <CalendarDays size={10} /> 
                            <span>{t.inDate}: {formatDate(job.fechaEntrada)}</span>
                         </div>
                         {job.status === 'Finished' || job.status === 'Picked Up' ? (
                            <div className="flex items-center gap-1 text-green-500/70">
                               <CheckCircle size={10} />
                               <span>{t.outDate}: {job.estimatedCompletion}</span>
                            </div>
                         ) : (
                             <div className="flex items-center gap-1">
                               <span>Est: {job.estimatedCompletion}</span>
                            </div>
                         )}
                      </div>

                      <div className="flex justify-between items-center">
                         <div className="flex flex-col">
                           <span className="text-[10px] text-slate-500">{t.techLabel}: {job.technician || 'Unassigned'}</span>
                           {job.price && (job.status === 'Finished' || job.status === 'Picked Up') && (
                             <span className="text-sm font-bold text-green-400">€{job.price}</span>
                           )}
                         </div>
                         {job.status === 'Ready for Pickup' && (
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               setRepairs(prev => prev.map(r => r.id === job.id ? {...r, status: 'Finished', estimatedCompletion: new Date().toLocaleDateString()} : r));
                             }}
                             className="bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg"
                           >
                             <CheckCircle size={10} /> Finish
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
    </div>
  );
};

export default KanbanBoard;