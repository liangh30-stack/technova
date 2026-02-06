import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Employee } from '../types';
import { Clock, MapPin, UserCheck, AlertTriangle } from 'lucide-react';

interface AttendancePanelProps {
  employees: Employee[];
  onClockIn: (id: string, type: 'IN' | 'OUT' | 'BREAK_START' | 'BREAK_END', lat?: number, lng?: number) => void;
  currentUser: Employee;
  onUpdateSchedule: (id: string, start: string, end: string) => void;
}

const AttendancePanel: React.FC<AttendancePanelProps> = ({ employees, onClockIn, currentUser, onUpdateSchedule }) => {
  const { t } = useTranslation();
  const [selectedEmp, setSelectedEmp] = useState<string>('');
  const [pin, setPin] = useState('');
  
  const handleAction = (type: 'IN' | 'OUT' | 'BREAK_START' | 'BREAK_END') => {
    if (!selectedEmp) return;
    const emp = employees.find(e => e.id === selectedEmp);
    if (!emp) return;
    
    if (emp.pin !== pin) {
      alert(t('attendancePINError') || 'PIN Incorrecto');
      return;
    }

    // Mock Geo
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onClockIn(selectedEmp, type, pos.coords.latitude, pos.coords.longitude);
        setPin('');
        alert(t('attendanceSuccess') || 'Fichaje registrado con éxito');
      },
      (err) => {
        alert((t('attendanceLocationError') || 'Error de ubicación') + ': ' + err.message);
        // Fallback for dev without https
        onClockIn(selectedEmp, type, 42.1611, -8.6133); 
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg border border-brand-border p-8 text-center shadow-xl" role="form" aria-label={t('attendanceTitle') || 'Fichaje'}>
         <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-brand-border">
           <Clock size={48} className="text-brand-primary" />
         </div>
         <h2 className="text-3xl font-bold text-brand-dark mb-2" aria-live="polite">{new Date().toLocaleTimeString()}</h2>
         <p className="text-brand-text-tertiary mb-8">{new Date().toLocaleDateString()}</p>

         <div className="max-w-md mx-auto space-y-4">
           <select
             className="w-full bg-white border border-brand-border rounded-lg px-4 py-3 text-brand-dark outline-none"
             value={selectedEmp}
             onChange={e => setSelectedEmp(e.target.value)}
             aria-label={t('attendanceSelectEmployee') || 'Selecciona tu nombre'}
           >
             <option value="">{t('attendanceSelectEmployee') || 'Selecciona tu nombre...'}</option>
             {employees.filter(e => e.store === currentUser.store || currentUser.role === 'admin').map(e => (
               <option key={e.id} value={e.id}>{e.name}</option>
             ))}
           </select>

           {selectedEmp && (
             <input
               type="password"
               placeholder={t('attendancePINPlaceholder') || 'PIN de 4 dígitos'}
               className="w-full bg-white border border-brand-border rounded-lg px-4 py-3 text-brand-dark text-center tracking-[0.5em] outline-none"
               value={pin}
               onChange={e => setPin(e.target.value)}
               maxLength={4}
               aria-label={t('attendancePIN') || 'PIN'}
             />
           )}

           <div className="grid grid-cols-2 gap-4 pt-4">
             <button
               onClick={() => handleAction('IN')}
               className="bg-brand-success hover:opacity-90 text-white font-semibold py-4 rounded-lg active:scale-95 transition-transform"
             >
               {t('attendanceCheckIn') || 'ENTRADA'}
             </button>
             <button
               onClick={() => handleAction('OUT')}
               className="bg-brand-critical hover:opacity-90 text-white font-semibold py-4 rounded-lg active:scale-95 transition-transform"
             >
               {t('attendanceCheckOut') || 'SALIDA'}
             </button>
             <button
               onClick={() => handleAction('BREAK_START')}
               className="bg-brand-warning hover:opacity-90 text-white font-semibold py-3 rounded-lg text-sm"
             >
               {t('attendancePause') || 'PAUSA'} ({t('attendancePauseDetail') || 'Café/Comida'})
             </button>
             <button
               onClick={() => handleAction('BREAK_END')}
               className="bg-brand-info hover:opacity-90 text-white font-semibold py-3 rounded-lg text-sm"
             >
               {t('attendanceResume') || 'VOLVER'}
             </button>
           </div>
         </div>
      </div>
      
      {currentUser.role === 'admin' && (
        <div className="mt-8 bg-brand-light rounded-lg border border-brand-border p-6">
           <h3 className="text-xl font-bold text-brand-dark mb-4">{t('attendanceLog') || 'Registro de Fichajes'}</h3>
           <div className="space-y-2">
             {employees.filter(e => e.attendanceHistory.length > 0).map(e => {
               const today = e.attendanceHistory.find(r => r.date === new Date().toISOString().split('T')[0]);
               if (!today) return null;
               return (
                 <div key={e.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-brand-border">
                    <span className="text-brand-dark font-medium">{e.name}</span>
                    <div className="text-sm text-brand-text-tertiary">
                      IN: {today.clockIn ? new Date(today.clockIn).toLocaleTimeString() : '--'} |
                      OUT: {today.clockOut ? new Date(today.clockOut).toLocaleTimeString() : '--'}
                      {today.isLate && <span className="ml-2 text-brand-critical font-bold text-xs flex items-center inline-flex gap-1" role="alert"><AlertTriangle size={10}/> LATE ({today.latenessMinutes}m)</span>}
                    </div>
                 </div>
               );
             })}
           </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePanel;
