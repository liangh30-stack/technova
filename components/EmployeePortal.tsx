import React, { useState } from 'react';
import { MOCK_INVENTORY, MOCK_REPAIRS } from '../constants';
import { Package, Wrench, Clock, Search, PlusCircle, Save } from 'lucide-react';
import { Language } from '../types';

interface EmployeePortalProps {
  lang: Language;
}

const EmployeePortal: React.FC<EmployeePortalProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'repairs' | 'clock'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Repair Form State
  const [showNewRepair, setShowNewRepair] = useState(false);
  const [newRepair, setNewRepair] = useState({ device: '', issue: '', customer: '' });

  // Inventory Logic
  const filteredInventory = MOCK_INVENTORY.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto h-full min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h2 className="text-3xl font-bold text-white">Employee Portal</h2>
           <p className="text-slate-400">Technician Dashboard & Inventory Control</p>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-xl">
           <button 
             onClick={() => setActiveTab('inventory')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
           >
             <div className="flex items-center gap-2"><Package size={16}/> Stock</div>
           </button>
           <button 
             onClick={() => setActiveTab('repairs')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'repairs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
           >
              <div className="flex items-center gap-2"><Wrench size={16}/> Work Orders</div>
           </button>
           <button 
             onClick={() => setActiveTab('clock')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'clock' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
           >
              <div className="flex items-center gap-2"><Clock size={16}/> Time Clock</div>
           </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-700/50">
        
        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="p-6">
            <div className="flex justify-between mb-6">
               <h3 className="text-xl font-bold text-white">Global Parts Search</h3>
               <div className="relative">
                 <input 
                   type="text" 
                   placeholder="Search Part Name or SKU..." 
                   className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 w-64"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700 text-sm">
                    <th className="py-3 px-4">Part Name</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4 text-center bg-blue-900/20">Downtown (Current)</th>
                    <th className="py-3 px-4 text-center">Mall Branch</th>
                    <th className="py-3 px-4 text-center">HQ Warehouse</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-white">{item.name}</td>
                      <td className="py-3 px-4 text-xs font-mono text-slate-500">{item.sku}</td>
                      <td className="py-3 px-4 text-center font-bold bg-blue-900/10 text-blue-300">{item.stores.downtown}</td>
                      <td className="py-3 px-4 text-center">{item.stores.mall}</td>
                      <td className="py-3 px-4 text-center">{item.stores.hq}</td>
                      <td className="py-3 px-4">
                        <button className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded border border-slate-600">Request Transfer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPAIRS TAB */}
        {activeTab === 'repairs' && (
           <div className="p-6">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-white">Active Work Orders</h3>
               <button 
                onClick={() => setShowNewRepair(!showNewRepair)}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold"
               >
                 <PlusCircle size={16} /> New Ticket
               </button>
             </div>

             {/* New Ticket Form */}
             {showNewRepair && (
               <div className="bg-slate-800/50 border border-slate-600 p-4 rounded-xl mb-6 animate-in slide-in-from-top-2">
                 <h4 className="text-white font-bold mb-4">Create New Repair Ticket</h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                   <input 
                     placeholder="Device Model" 
                     className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
                     value={newRepair.device}
                     onChange={e => setNewRepair({...newRepair, device: e.target.value})}
                   />
                   <input 
                     placeholder="Customer Name" 
                     className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
                     value={newRepair.customer}
                     onChange={e => setNewRepair({...newRepair, customer: e.target.value})}
                   />
                   <input 
                     placeholder="Issue Description" 
                     className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
                     value={newRepair.issue}
                     onChange={e => setNewRepair({...newRepair, issue: e.target.value})}
                   />
                 </div>
                 <div className="flex justify-end gap-2">
                   <button onClick={() => setShowNewRepair(false)} className="text-slate-400 hover:text-white px-3 py-1">Cancel</button>
                   <button 
                      onClick={() => {
                        alert(`Generated Ticket ID: WX-${Math.floor(Math.random() * 9000) + 1000}`);
                        setShowNewRepair(false);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                      <Save size={16}/> Generate ID
                   </button>
                 </div>
               </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {MOCK_REPAIRS.map(job => (
                 <div key={job.id} className="bg-slate-900/50 border border-slate-700 p-4 rounded-xl">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-mono text-slate-500">{job.id}</span>
                     <span className={`text-xs px-2 py-1 rounded-full ${
                       job.status === 'Picked Up' ? 'bg-purple-500/20 text-purple-400' :
                       job.progress === 100 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                     }`}>
                       {job.status}
                     </span>
                   </div>
                   <h4 className="font-bold text-white mb-1">{job.device}</h4>
                   <p className="text-sm text-slate-400 mb-4">{job.issue}</p>
                   <div className="flex justify-between items-center text-xs text-slate-500">
                     <span>Due: {job.estimatedCompletion}</span>
                     <button className="text-blue-400 hover:text-blue-300">Update Status</button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* CLOCK IN TAB */}
        {activeTab === 'clock' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
             <div className="w-32 h-32 rounded-full border-4 border-slate-700 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
               <Clock size={48} className="text-blue-500" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">{new Date().toLocaleTimeString()}</h3>
             <p className="text-slate-400 mb-8">{new Date().toLocaleDateString()}</p>
             
             <div className="flex gap-4">
               <button className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95">
                 Clock In
               </button>
               <button className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95">
                 Clock Out
               </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EmployeePortal;
