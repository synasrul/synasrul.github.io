// src/components/MonthlyReport.jsx
import React, { useState } from 'react';
import { BarChart3, Calendar as CalendarIcon, Loader2 } from 'lucide-react';

const MonthlyReport = ({gasUrl}) => {
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fungsi ambil data dari Google Sheet
  const fetchReport = async () => {
    if (!reportMonth) return;
    setLoading(true);
    setError('');
    setReportData(null);
    try {
      // Ubah format "2026-02" menjadi "Februari 2026" agar sesuai nama Sheet
      const [year, month] = reportMonth.split('-');
      const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                          "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const formattedMonthName = `${monthNames[parseInt(month) - 1]} ${year}`;

      const response = await fetch(`${gasUrl}?month=${encodeURIComponent(formattedMonthName)}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setReportData(data);
      }

    } catch (error) {
      setError("Gagal terhubung ke server. Pastikan URL Google Scripts benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
      <h2 className="text-lg font-bold flex items-center gap-2"><BarChart3 size={20}/> Laporan Bulanan</h2>
      
      {/* Filter Tanggal */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <CalendarIcon className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="month" 
            className="w-full pl-10 pr-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            value={reportMonth}
            onChange={(e) => setReportMonth(e.target.value)}
          />
        </div>
        <button 
          onClick={fetchReport} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-all active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Cek'}
        </button>
      </div>

      {/* {loading && <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>} */}
      {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium">{error}</div>}

      {reportData && (
        <div className="space-y-6 pb-2 animate-in fade-in duration-500">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            {reportData.summary?.data?.map((item, idx) => (
              <div key={idx} className="p-4 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-100">
                <div className="flex justify-between items-center mb-0.5">
                  <p className="text-[11px] opacity-80 uppercase font-black tracking-widest">{item[0]}</p>
                  <p className="text-[11px] font-bold bg-white/20 px-1.5 rounded">
                    {(Number(item[2]) * 100).toFixed(0)}%
                  </p>
                </div>
                <p className="text-lg font-bold">
                  Rp {Number(item[1]).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>

          {/* Dynamic Transaction Tables */}
          {Object.keys(reportData).map((key) => {
            if (key === 'summary') return null;
            const table = reportData[key];
            if (!table.data || table.data.length === 0) return null;

            return (
              <div key={key} className="animate-in fade-in slide-in-from-bottom-2 space-y-2">
                <h3 className="text-[15px] font-bold text-black-400 uppercase tracking-widest mb-2 px-1">
                  {table.title}
                </h3>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  {table.data.map((row, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <div>
                        <p className="text-slate-800 font-bold text-sm">{row[1]}</p>
                        <p className="text-[13px] text-black-400">
                          {row[0] ? new Date(row[0]).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : ''}
                        </p>
                      </div>
                      <p className="text-indigo-700 font-extrabold text-sm">
                        Rp {Number(row[2]).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MonthlyReport;