import React, { useState, useEffect } from 'react';
import { 
  Package, Wrench, Clock, Users, BarChart3, Settings, 
  LogOut, Plus, Search, RefreshCw, AlertTriangle, CheckCircle2,
  TrendingUp, Activity, PieChart, AlertCircle, Download, CloudDownload,
  ToggleLeft, ToggleRight, Shield, X, ShoppingBag, CreditCard, Printer, Eye,
  Sparkles, DownloadCloud, Smartphone
} from 'lucide-react';
import { InventoryItem, RepairJob, Language, Employee, StockTransfer, Order, Product } from '../types';
import KanbanBoard from './KanbanBoard';
import AttendancePanel from './AttendancePanel';
import SyncSettings from './SyncSettings';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePie, Pie, BarChart, Bar } from 'recharts';

interface DashboardProps {
  lang: Language;
  inventory: InventoryItem[];
  setInventory: (items: InventoryItem[]) => void;
  repairs: RepairJob[];
  setRepairs: React.Dispatch<React.SetStateAction<RepairJob[]>>;
  commonProblems: string[];
  setCommonProblems: (problems: string[]) => void;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  currentUser: Employee;
  onLogout: () => void;
  onDeleteRepair: (id: string) => void;
  onClockIn: (id: string, type: 'IN' | 'OUT' | 'BREAK_START' | 'BREAK_END', lat?: number, lng?: number) => void;
  onUpdateSchedule: (id: string, start: string, end: string) => void;
  transfers: StockTransfer[];
  onInitiateTransfer: (item: InventoryItem, from: string, to: string, qty: number) => void;
  onConfirmTransfer: (id: string) => void;
  showAttendance: boolean;
  setShowAttendance: (show: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  lang, inventory, setInventory, repairs, setRepairs, 
  commonProblems, setCommonProblems, employees, setEmployees, 
  currentUser, onLogout, onDeleteRepair, onClockIn, onUpdateSchedule,
  transfers, onInitiateTransfer, onConfirmTransfer,
  showAttendance, setShowAttendance
}) => {
  const [activeTab, setActiveTab] = useState('kanban');
  const [showSync, setShowSync] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedCustomImage, setSelectedCustomImage] = useState<string | null>(null);
  
  // Shop Orders State
  const [shopOrders, setShopOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('shop_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Role Helpers
  const isManager = currentUser.role === 'Manager' || currentUser.role === 'admin';

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('shop_orders');
      if (saved) setShopOrders(JSON.parse(saved));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handlePrintOrder = (order: Order) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      const itemsHtml = order.items.map(item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            ${item.name}
            ${item.isCustom ? '<br/><span style="color:#6366f1; font-weight:bold; font-size:10px;">PROYECTO PERSONALIZADO</span>' : ''}
            ${item.selectedModel ? `<br/><span style="font-size:10px;">Modelo: ${item.selectedModel}</span>` : ''}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">€${item.price.toFixed(2)}</td>
        </tr>
      `).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Recibo de Venta - ${order.id}</title>
            <style>
              body { font-family: 'Poppins', sans-serif; color: #1D3557; padding: 40px; }
              .header { text-align: center; margin-bottom: 40px; }
              .logo { font-size: 32px; font-weight: bold; color: #E63946; }
              .details { margin-bottom: 30px; display: flex; justify-content: space-between; }
              table { width: 100%; border-collapse: collapse; }
              .total { font-size: 24px; font-weight: bold; text-align: right; margin-top: 20px; color: #E63946; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">TechNova Ecosystem</div>
              <div>Mobile Repair & Accessories</div>
              <div style="margin-top: 10px;">ID Pedido: ${order.id}</div>
            </div>
            <div class="details">
              <div>
                <strong>Cliente:</strong><br/>
                ${order.customerName}<br/>
                ${order.phone}
              </div>
              <div style="text-align: right;">
                <strong>Fecha:</strong><br/>
                ${new Date(order.date).toLocaleString()}<br/>
                <strong>Pago:</strong> ${order.paymentMethod}
              </div>
            </div>
            <table>
              <thead>
                <tr style="background: #f1f1f1;">
                  <th style="padding: 10px; text-align: left;">Producto</th>
                  <th style="padding: 10px; text-align: right;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div class="total">Total: €${order.total.toFixed(2)}</div>
            <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #888;">
              Gracias por su compra en TechNova.
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownloadImage = (base64: string, name: string) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = `PRODUCCION-${name.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { id: 'kanban', label: 'Taller', icon: Wrench },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'attendance', label: 'Fichaje', icon: Clock },
  ];

  // Restricted tabs
  if (isManager) {
    tabs.splice(1, 0, { id: 'sales', label: 'Ventas', icon: ShoppingBag });
    tabs.push({ id: 'reports', label: 'Reportes', icon: BarChart3 });
    tabs.push({ id: 'sync', label: 'Sincronización', icon: RefreshCw });
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800 hidden lg:block">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-bold truncate">{currentUser.name}</span>
                <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{currentUser.role}</span>
              </div>
           </div>
        </div>
        
        <div className="flex-1 py-6 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-3 transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <tab.icon size={22} />
              <span className="hidden lg:block font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-800">
           <button onClick={onLogout} className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-400 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
             <LogOut size={18} />
             <span className="hidden lg:inline text-xs font-bold">Log Out</span>
           </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 bg-slate-950 overflow-y-auto p-4 lg:p-8 relative">
        {activeTab === 'kanban' && (
          <KanbanBoard repairs={repairs} setRepairs={setRepairs} employees={employees} currentUser={currentUser} inventory={inventory} setInventory={setInventory} onDeleteRepair={onDeleteRepair} lang={lang} />
        )}

        {activeTab === 'attendance' && (
          <AttendancePanel 
            employees={employees} 
            onClockIn={onClockIn} 
            currentUser={currentUser} 
            onUpdateSchedule={onUpdateSchedule} 
          />
        )}

        {activeTab === 'sales' && isManager && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ShoppingBag className="text-brand-pink" /> Gestión de Pedidos Online
              </h2>
              <div className="flex gap-2">
                 <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
                   <span className="text-xs text-slate-500 uppercase font-bold">Total Ventas</span>
                   <span className="text-white font-black text-lg">€{shopOrders.reduce((a,b)=>a+b.total,0).toFixed(2)}</span>
                 </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {shopOrders.length === 0 ? (
                 <div className="col-span-full py-20 text-center bg-slate-900 rounded-2xl border border-slate-800 opacity-50">
                   <ShoppingBag size={48} className="mx-auto mb-4" />
                   <p className="text-white">No hay pedidos registrados aún.</p>
                 </div>
               ) : (
                 shopOrders.map(order => (
                   <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors group relative overflow-hidden flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <span className="text-[10px] font-mono text-slate-500 bg-black px-2 py-1 rounded">{order.id}</span>
                            <h3 className="text-white font-bold mt-2">{order.customerName || 'Cliente Web'}</h3>
                         </div>
                         <div className={`px-2 py-1 rounded-full text-[10px] font-bold ${order.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                           {order.status}
                         </div>
                      </div>
                      
                      <div className="space-y-4 mb-4 flex-1">
                        {order.items.map((item, i) => (
                          <div key={i} className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-2">
                             <div className="text-xs text-slate-400 flex justify-between items-center">
                                <span className="truncate max-w-[150px] font-bold flex items-center gap-2">
                                  {item.isCustom && <Sparkles size={12} className="text-indigo-400"/>}
                                  {item.name}
                                </span>
                                <span className="font-mono text-white">€{item.price.toFixed(2)}</span>
                             </div>
                             
                             {item.isCustom && (
                               <div className="flex items-center gap-4 mt-2">
                                  <div 
                                    onClick={() => setSelectedCustomImage(item.customImage || null)}
                                    className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden cursor-zoom-in border border-white/10 hover:border-indigo-500 transition-colors"
                                  >
                                    <img src={item.image} className="w-full h-full object-cover" alt="Preview" />
                                  </div>
                                  <div className="flex-1">
                                     <div className="text-[10px] text-slate-500 uppercase font-black">Modelo de Impresión</div>
                                     <div className="text-xs text-indigo-400 font-bold flex items-center gap-1"><Smartphone size={10}/> {item.selectedModel}</div>
                                     <button 
                                       onClick={() => handleDownloadImage(item.customImage || '', `${order.id}-${item.selectedModel}`)}
                                       className="text-[10px] text-white bg-indigo-600 px-2 py-1 rounded mt-1 hover:bg-indigo-500 flex items-center gap-1"
                                     >
                                       <DownloadCloud size={10} /> Descargar Original
                                     </button>
                                  </div>
                               </div>
                             )}
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-slate-800 pt-4 flex justify-between items-end">
                         <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 flex items-center gap-1"><CreditCard size={10}/> {order.paymentMethod}</span>
                            <span className="text-xl font-black text-white">€{order.total.toFixed(2)}</span>
                         </div>
                         <button 
                           onClick={() => handlePrintOrder(order)}
                           className="bg-brand-pink text-white p-2.5 rounded-xl hover:scale-110 active:scale-90 transition-all shadow-lg shadow-brand-pink/20"
                           title="Imprimir Recibo"
                         >
                            <Printer size={18} />
                         </button>
                      </div>
                   </div>
                 ))
               )}
            </div>
          </div>
        )}

        {/* Custom Image Modal */}
        {selectedCustomImage && (
          <>
            <div className="fixed inset-0 bg-black/90 z-[100] backdrop-blur-xl animate-in fade-in" onClick={() => setSelectedCustomImage(null)} />
            <div className="fixed inset-12 z-[110] flex items-center justify-center animate-in zoom-in-95" onClick={() => setSelectedCustomImage(null)}>
               <img src={selectedCustomImage} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl shadow-black" alt="Production HD" />
               <button onClick={() => setSelectedCustomImage(null)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full"><X size={32}/></button>
            </div>
          </>
        )}

        {activeTab === 'inventory' && (
           <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                 <Package className="text-blue-500" /> Stock Local: {currentUser.store}
               </h2>
             </div>
             <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-800/50 text-slate-400 text-[10px] uppercase tracking-widest">
                     <tr>
                        <th className="p-4">Pieza</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4 text-center">Stock</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {inventory.map(item => (
                       <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                             <div className="text-white font-bold">{item.name}</div>
                             <div className="text-[10px] text-slate-500">{item.id}</div>
                          </td>
                          <td className="p-4 font-mono text-xs text-slate-400">{item.sku}</td>
                          <td className="p-4 text-center">
                             <span className={`px-3 py-1 rounded-full text-xs font-black ${item.stores[currentUser.store.toLowerCase()] > 5 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {item.stores[currentUser.store.toLowerCase()] || 0}
                             </span>
                          </td>
                       </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>
        )}

        {activeTab === 'reports' && isManager && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                   <h3 className="text-slate-500 font-bold mb-1 uppercase text-[10px] tracking-widest">Ingresos Totales</h3>
                   <div className="text-4xl font-black text-white">€{(shopOrders.reduce((a,b)=>a+b.total,0) + repairs.filter(r => r.status === 'Finished' || r.status === 'Picked Up').reduce((a,b)=>a+(b.price||0),0)).toFixed(2)}</div>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                   <h3 className="text-slate-500 font-bold mb-1 uppercase text-[10px] tracking-widest">Reparaciones Hoy</h3>
                   <div className="text-4xl font-black text-blue-500">{repairs.length}</div>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                   <h3 className="text-slate-500 font-bold mb-1 uppercase text-[10px] tracking-widest">Pedidos Tienda</h3>
                   <div className="text-4xl font-black text-brand-pink">{shopOrders.length}</div>
                </div>
             </div>
             <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 h-[300px] flex items-center justify-center">
                <p className="text-slate-500 text-sm italic font-medium">Gráficos de rendimiento en tiempo real...</p>
             </div>
          </div>
        )}

        {activeTab === 'sync' && isManager && (
           <SyncSettings onSync={async (url) => { console.log("Sync requested to:", url); return true; }} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;