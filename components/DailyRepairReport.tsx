import React, { useMemo } from 'react';
import { RepairJob } from '../types';
import { X, Printer, Download, FileSpreadsheet, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DailyRepairReportProps {
  repairs: RepairJob[];
  onClose: () => void;
}

const DailyRepairReport: React.FC<DailyRepairReportProps> = ({ repairs, onClose }) => {
  const { t } = useTranslation();

  const today = new Date();
  const todayStr = today.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });

  // Filter repairs received today
  const todayRepairs = useMemo(() => {
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const endOfDay = startOfDay + 86400000;

    return repairs.filter(r => {
      if (!r.fechaEntrada) return false;
      const entryTime = new Date(r.fechaEntrada).getTime();
      return entryTime >= startOfDay && entryTime < endOfDay;
    });
  }, [repairs]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    const rows = todayRepairs.map((r, i) => {
      const partsHtml = (r.parts && r.parts.length > 0)
        ? r.parts.map(p => `<span class="part">${p.name} <span class="type type-${p.type}">${p.type === 'original' ? 'ORI' : 'COMP'}</span></span>`).join('')
        : '<span class="na">-</span>';

      return `<tr>
        <td class="num">${i + 1}</td>
        <td>${r.id}</td>
        <td><strong>${r.brand || '-'}</strong></td>
        <td>${r.model || r.device || '-'}</td>
        <td class="parts">${partsHtml}</td>
        <td>${r.customerName}</td>
        <td>${r.technician || '-'}</td>
      </tr>`;
    }).join('');

    printWindow.document.write(`<!DOCTYPE html><html><head><title>TechNova - ${t('reportTitle') || 'Daily Repair Report'} ${todayStr}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;padding:32px}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #008060}
.logo{font-size:24px;font-weight:800;color:#008060}
.date{font-size:14px;color:#666}
.title{font-size:18px;font-weight:700;margin-bottom:4px}
.summary{display:flex;gap:24px;margin-bottom:20px}
.summary-item{background:#f4f6f8;padding:12px 20px;border-radius:8px;text-align:center}
.summary-item .num{font-size:28px;font-weight:800;color:#008060}
.summary-item .label{font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.5px}
table{width:100%;border-collapse:collapse;font-size:12px}
th{background:#008060;color:#fff;padding:10px 8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.5px}
td{padding:8px;border-bottom:1px solid #e5e5e5}
tr:nth-child(even){background:#fafafa}
.num{text-align:center;width:32px;color:#999;font-size:11px}
.parts{max-width:200px}
.part{display:inline-block;margin:2px 4px 2px 0;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600;background:#f0f0f0}
.type{font-size:9px;padding:1px 5px;border-radius:8px;margin-left:4px;font-weight:700}
.type-original{background:#008060;color:#fff}
.type-compatible{background:#B98900;color:#fff}
.na{color:#ccc}
.footer{margin-top:24px;padding-top:12px;border-top:1px solid #e5e5e5;display:flex;justify-content:space-between;font-size:11px;color:#999}
@media print{body{padding:16px}@page{margin:10mm}}
</style></head><body>
<div class="header">
  <div><div class="logo">TechNova</div><div class="title">${t('reportTitle') || 'Daily Repair Report'}</div></div>
  <div class="date">${todayStr}</div>
</div>
<div class="summary">
  <div class="summary-item"><div class="num">${todayRepairs.length}</div><div class="label">${t('reportTotalRepairs') || 'Total Repairs'}</div></div>
  <div class="summary-item"><div class="num">${todayRepairs.filter(r => r.parts?.some(p => p.type === 'original')).length}</div><div class="label">Original</div></div>
  <div class="summary-item"><div class="num">${todayRepairs.filter(r => r.parts?.some(p => p.type === 'compatible')).length}</div><div class="label">Compatible</div></div>
</div>
<table>
  <thead><tr>
    <th>#</th><th>ID</th><th>${t('formBrand') || 'Brand'}</th><th>${t('formModel') || 'Model'}</th><th>${t('formParts') || 'Parts'}</th><th>${t('formCustomerName') || 'Customer'}</th><th>${t('formTechnician') || 'Tech'}</th>
  </tr></thead>
  <tbody>${rows || `<tr><td colspan="7" style="text-align:center;padding:32px;color:#999">${t('reportNoRepairs') || 'No repairs today'}</td></tr>`}</tbody>
</table>
<div class="footer"><span>TechNova Ecosystem</span><span>${t('reportGenerated') || 'Generated'}: ${new Date().toLocaleTimeString()}</span></div>
</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExportCSV = () => {
    const headers = ['#', 'ID', t('formBrand') || 'Brand', t('formModel') || 'Model', t('formParts') || 'Parts', 'Original/Compatible', t('formCustomerName') || 'Customer', t('formTechnician') || 'Tech'];
    const csvRows = [headers.join(',')];

    todayRepairs.forEach((r, i) => {
      const partsStr = (r.parts || []).map(p => p.name).join('; ');
      const typesStr = (r.parts || []).map(p => p.type).join('; ');
      csvRows.push([
        i + 1,
        r.id,
        `"${r.brand || ''}"`,
        `"${r.model || r.device || ''}"`,
        `"${partsStr}"`,
        `"${typesStr}"`,
        `"${r.customerName}"`,
        `"${r.technician || ''}"`
      ].join(','));
    });

    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TechNova_Repairs_${today.toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
      <div className="bg-white w-full max-w-4xl rounded-xl border border-brand-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-brand-border bg-brand-light flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-primary flex items-center justify-center">
              <FileSpreadsheet size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-brand-dark font-bold text-lg">{t('reportTitle') || 'Daily Repair Report'}</h3>
              <div className="flex items-center gap-1 text-brand-text-tertiary text-xs">
                <Calendar size={12} />
                {todayStr}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download size={16} /> CSV
            </button>
            <button
              onClick={handlePrint}
              className="bg-brand-primary hover:bg-brand-primary-dark text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer size={16} /> {t('formPrintLabel') || 'Print'}
            </button>
            <button onClick={onClose} className="text-brand-text-tertiary hover:text-brand-dark p-2 transition-colors">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="px-6 pt-4 pb-2 flex gap-4">
          <div className="bg-brand-primary-light rounded-lg px-5 py-3 text-center flex-1">
            <div className="text-2xl font-extrabold text-brand-primary">{todayRepairs.length}</div>
            <div className="text-[10px] text-brand-muted uppercase tracking-wider font-medium">{t('reportTotalRepairs') || 'Total Repairs'}</div>
          </div>
          <div className="bg-[#EBF5FA] rounded-lg px-5 py-3 text-center flex-1">
            <div className="text-2xl font-extrabold text-brand-info">
              {todayRepairs.reduce((acc, r) => acc + (r.parts?.filter(p => p.type === 'original').length || 0), 0)}
            </div>
            <div className="text-[10px] text-brand-muted uppercase tracking-wider font-medium">Original</div>
          </div>
          <div className="bg-brand-accent-light rounded-lg px-5 py-3 text-center flex-1">
            <div className="text-2xl font-extrabold text-brand-warning">
              {todayRepairs.reduce((acc, r) => acc + (r.parts?.filter(p => p.type === 'compatible').length || 0), 0)}
            </div>
            <div className="text-[10px] text-brand-muted uppercase tracking-wider font-medium">Compatible</div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          {todayRepairs.length === 0 ? (
            <div className="text-center py-16">
              <FileSpreadsheet size={48} className="mx-auto mb-3 text-brand-border" />
              <p className="text-brand-text-tertiary font-medium">{t('reportNoRepairs') || 'No repairs received today'}</p>
              <p className="text-brand-text-tertiary text-sm mt-1">{t('reportNoRepairsHint') || 'Create new repair tickets and they will appear here'}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-brand-text-tertiary uppercase tracking-wider border-b-2 border-brand-border">
                  <th className="py-3 px-2 w-8">#</th>
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-2">{t('formBrand') || 'Brand'}</th>
                  <th className="py-3 px-2">{t('formModel') || 'Model'}</th>
                  <th className="py-3 px-2">{t('formParts') || 'Parts'}</th>
                  <th className="py-3 px-2">{t('formCustomerName') || 'Customer'}</th>
                  <th className="py-3 px-2">{t('formTechnician') || 'Tech'}</th>
                </tr>
              </thead>
              <tbody>
                {todayRepairs.map((r, i) => (
                  <tr key={r.id} className="border-b border-brand-border-subtle hover:bg-brand-light transition-colors">
                    <td className="py-3 px-2 text-brand-text-tertiary text-xs text-center">{i + 1}</td>
                    <td className="py-3 px-2 font-mono text-xs text-brand-muted">{r.id}</td>
                    <td className="py-3 px-2 font-semibold text-brand-dark">{r.brand || '-'}</td>
                    <td className="py-3 px-2 text-brand-muted">{r.model || r.device || '-'}</td>
                    <td className="py-3 px-2">
                      {r.parts && r.parts.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {r.parts.map((p, j) => (
                            <span
                              key={j}
                              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                p.type === 'original'
                                  ? 'bg-brand-primary-light text-brand-primary'
                                  : 'bg-brand-accent-light text-brand-warning'
                              }`}
                            >
                              {p.name}
                              <span className={`text-[9px] font-bold px-1 py-px rounded ${
                                p.type === 'original' ? 'bg-brand-primary text-white' : 'bg-brand-warning text-white'
                              }`}>
                                {p.type === 'original' ? 'ORI' : 'COMP'}
                              </span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-brand-text-tertiary">-</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-brand-dark">{r.customerName}</td>
                    <td className="py-3 px-2 text-brand-muted">{r.technician || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyRepairReport;
