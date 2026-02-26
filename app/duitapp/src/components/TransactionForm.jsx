import React, { useEffect } from 'react';
import { 
  PlusCircle, Calendar as CalendarIcon, 
  ArrowUpCircle, ArrowDownCircle, Save, 
  Loader2 } from 'lucide-react';

const TransactionForm = ({ formData, setFormData, onSubmit, loading }) => {
  useEffect(() => {
    if (formData.kategori === 'withdraw') {
      setFormData(prev => ({ ...prev, subKategori: 'needs' }));
    }
  }, [formData.kategori]);
  
  return(
    <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
      <h2 className="text-lg font-bold flex items-center gap-2"><PlusCircle size={20}/> Input Transaksi</h2>
      {/* ... Form Fields Sama Seperti Sebelumnya ... */}
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
              : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-black-500'
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
              : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-black-500'
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
      </div>
    </form>
  );
};

export default TransactionForm;