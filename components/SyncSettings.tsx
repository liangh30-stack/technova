import React, { useState } from 'react';
import { CloudDownload, AlertCircle, CheckCircle } from 'lucide-react';

interface SyncSettingsProps {
  onSync: (url: string) => Promise<boolean>;
}

const SyncSettings: React.FC<SyncSettingsProps> = ({ onSync }) => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleSyncClick = async () => {
    if (!url) return;
    setStatus('loading');
    const success = await onSync(url);
    if (success) {
      setStatus('success');
      setMsg('Synchronized successfully!');
    } else {
      setStatus('error');
      setMsg('Failed to sync. Check URL.');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <CloudDownload size={24} className="text-blue-400" /> Cloud Sync Setup
      </h2>
      
      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-6">
        <h3 className="text-white font-bold mb-2">Instructions</h3>
        <ol className="list-decimal list-inside text-slate-400 text-sm space-y-2">
          <li>Open your Google Sheet (Database).</li>
          <li>Go to Extensions &gt; Apps Script.</li>
          <li>Paste the helper script (available in documentation).</li>
          <li>Deploy as Web App (Execute as: Me, Access: Anyone).</li>
          <li>Paste the generated URL below.</li>
        </ol>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-slate-400 text-sm mb-1">Apps Script URL</label>
          <input 
            type="text" 
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="https://script.google.com/macros/s/..."
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>

        {status === 'error' && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {msg}
          </div>
        )}
        
        {status === 'success' && (
          <div className="bg-green-500/10 text-green-400 p-3 rounded-lg flex items-center gap-2 text-sm">
            <CheckCircle size={16} /> {msg}
          </div>
        )}

        <button 
          onClick={handleSyncClick}
          disabled={status === 'loading'}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
        >
          {status === 'loading' ? 'Syncing...' : 'Connect & Sync'}
        </button>
      </div>
    </div>
  );
};

export default SyncSettings;
