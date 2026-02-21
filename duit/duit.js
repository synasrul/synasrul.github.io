import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Save, 
  CheckCircle2, 
  Loader2,
  Calendar as CalendarIcon
} from 'lucide-react';

// Mengambil URL dari file .env
const GAS_URL = import.meta.env.VITE_GAS_URL;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    jenis: 'pemasukan',
    nama: '',
    jumlah: '',
    kategori: 'debit',
    subKategori: 'needs'
  });

  useEffect(() => {
    if (formData.kategori === 'withdraw') {
      setFormData(prev => ({ ...prev, subKategori: 'needs' }));
    }
  }, [formData.kategori]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi apakah URL sudah terpasang di .env
    if (!GAS_URL) {
      setStatus({ 
        type: 'error', 
        message: 'URL Google Apps Script belum dikonfigurasi di file .env' 
      });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      setStatus({ type: 'success', message: 'Data berhasil disimpan ke Cloud!' });
      setFormData({ ...formData, nama: '', jumlah: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Gagal mengirim data: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Wallet size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">App Keuangan</h1>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <div className="space-y-6">
            
            {/* Tanggal */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Tanggal</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="date"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                />
              </div>
            </div>

            {/* Jenis Transaksi Toggle */}
            <label className="block text-sm font-semibold mb-2 text-slate-700">Jenis</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, jenis: 'pemasukan'})}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                  formData.jenis === 'pemasukan' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold' 
                  : 'border-slate-100 bg-slate-50 text-slate-400'
                }`}
              >
                <ArrowUpCircle size={20} /> Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, jenis: 'pengeluaran'})}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                  formData.jenis === 'pengeluaran' 
                  ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' 
                  : 'border-slate-100 bg-slate-50 text-slate-400'
                }`}
              >
                <ArrowDownCircle size={20} /> Pengeluaran
              </button>
            </div>

            {/* Nama & Jumlah */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Keterangan Nama</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gaji, Belanja, dll..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Jumlah (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.jumlah}
                  onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
                />
              </div>
            </div>

            {/* Pengeluaran Specific Fields */}
            {formData.jenis === 'pengeluaran' && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Kategori Transaksi</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    value={formData.kategori}
                    onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                  >
                    <option value="debit">Debit</option>
                    <option value="kredit">Kredit</option>
                    <option value="saving">Saving</option>
                    <option value="withdraw">Withdraw</option>
                  </select>
                </div>

                {(formData.kategori === 'debit' || formData.kategori === 'kredit' || formData.kategori === 'withdraw') && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">Klasifikasi</label>
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white disabled:bg-slate-50 disabled:text-slate-500"
                      value={formData.subKategori}
                      disabled={formData.kategori === 'withdraw'}
                      onChange={(e) => setFormData({...formData, subKategori: e.target.value})}
                    >
                      <option value="needs">Needs (Kebutuhan)</option>
                      <option value="wants">Wants (Keinginan)</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>

            {/* Status Message */}
            {status.message && (
              <div className={`p-4 rounded-lg flex items-center gap-2 text-sm ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {status.type === 'success' && <CheckCircle2 size={18} />}
                {status.message}
              </div>
            )}

          </div>
        </form>
      </div>
    </div>
  );
};

export default App;