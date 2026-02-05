import React from 'react';
import { LogIn } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  loginPin: string;
  setLoginPin: (value: string) => void;
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, loginPin, setLoginPin, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#0d1525] z-[110] rounded-[2rem] p-10 shadow-2xl border border-white/10 animate-in zoom-in-95">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 rotate-3">
            <LogIn size={36} className="text-white -mr-1" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">Staff Portal</h3>
          <p className="text-slate-400 text-sm mt-2 font-medium">Enter PIN to access Admin Dashboard</p>
        </div>

        <div className="relative group">
          <input
            type="password"
            maxLength={4}
            value={loginPin}
            onChange={e => setLoginPin(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onLogin()}
            placeholder="••••"
            autoFocus
            className="w-full bg-[#050912] border border-white/10 rounded-2xl py-5 text-center text-4xl tracking-[1.2rem] text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none mb-8 font-mono transition-all placeholder:tracking-normal placeholder:text-slate-700"
          />
          <div className="absolute inset-x-0 -bottom-2 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
        </div>

        <button
          onClick={onLogin}
          className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-500 active:scale-95 transition-all shadow-2xl shadow-blue-500/30"
        >
          Enter Backend
        </button>

        <p className="text-center text-[10px] text-slate-500 mt-6 uppercase tracking-widest font-bold">Authorized Personnel Only</p>
      </div>
    </>
  );
};

export default LoginModal;
