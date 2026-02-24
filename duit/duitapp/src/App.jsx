import React, { useState, useEffect } from 'react';
import { 
  Wallet, ArrowUpCircle, ArrowDownCircle, 
  Save, CheckCircle2, Loader2,
  Calendar as CalendarIcon,
  LogIn, LogOut, Eye, EyeOff,
  BarChart3, PlusCircle
} from 'lucide-react';

// Mengambil URL dari file .env
const GAS_URL = import.meta.env.VITE_GAS_URL;

/* ======================
   LOGIN COMPONENT
====================== */
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Username & Password Sederhana (bisa diganti ke database nanti)
    if (username === 'admin' && password === 'Nasrul0912') {
      localStorage.setItem('isLoggedIn', 'true');
      onLogin();
    } else {
      setError('Username atau Password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form 
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border"
      >
        <div className="flex items-center gap-2 mb-6">
          <Wallet className="text-indigo-600" />
          <h2 className="text-xl font-bold">Login App Keuangan</h2>
        </div>

        <div className="space-y-4">
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {/* Password with Eye Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

/* ======================
   POP UP SIMPAN
====================== */
const Modal = ({ type, message, onClose }) => {
  // Auto close 2 detik jika success
  useEffect(() => {
    if (type === 'success' && message) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [type, message, onClose]);

  if (!message) return null;

  return (
     <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose} // klik luar modal
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100 animate-[fadeIn_0.2s_ease]"
        onClick={(e) => e.stopPropagation()} // supaya klik dalam modal tidak close
      >

        <div className="flex items-center gap-2 mb-4">
          {type === 'success' && (
            <CheckCircle2 className="text-emerald-500" size={24} />
          )}
          {type === 'error' && (
            <div className="text-rose-500 text-xl font-bold">!</div>
          )}
          <h3 className="text-lg font-bold">
            {type === 'success' ? 'Berhasil' : 'Terjadi Kesalahan'}
          </h3>
        </div>

        <p className="text-slate-600 mb-6">
          {message}
        </p>

        <button
          onClick={onClose}
          className={`w-full py-2 rounded-xl font-semibold text-white transition-all active:scale-95 ${
            type === 'success'
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : 'bg-rose-500 hover:bg-rose-600'
          }`}
        >
          OK
        </button>

      </div>
    </div>
  );
};

/* ======================
   MAIN APP
====================== */
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const [activeTab, setActiveTab] = useState('input'); // 'input' | 'report'
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // State Laporan
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reportData, setReportData] = useState(null);
  
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    jenis: 'pemasukan',
    nama: '',
    jumlah: '',
    kategori: 'debit',
    subKategori: 'needs'
  });

  // Fungsi ambil data dari Google Sheet
  const fetchReport = async () => {
  if (!reportMonth) return;
  setLoading(true);
  setStatus({ type: '', message: '' }); // Reset status
  setReportData(null);
  try {
    // Ubah format "2026-02" menjadi "Februari 2026" agar sesuai nama Sheet
    const [year, month] = reportMonth.split('-');
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                        "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const formattedMonthName = `${monthNames[parseInt(month) - 1]} ${year}`;

    const response = await fetch(`${GAS_URL}?month=${encodeURIComponent(formattedMonthName)}`);
    const data = await response.json();

    if (data.error) {
      setStatus({ type: 'error', message: data.error });
    } else {
      setReportData(data);
    }

  } catch (error) {
    setStatus({ type: 'error', message: "Gagal terhubung ke server." });
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (formData.kategori === 'withdraw') {
      setFormData(prev => ({ ...prev, subKategori: 'needs' }));
    }
  }, [formData.kategori]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

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

  // Jika belum login → tampilkan halaman login
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-xl mx-auto pb-16">
        <div className="flex items-center bg-indigo-600 rounded-2xl justify-between mb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 pt-6 mx-2">
              <div className="bg-white-600 p-2 rounded-lg text-white tracking-tight"><Wallet size={24} /></div>
              <h1 className="text-2xl font-bold tracking-tight text-white">App Keuangan</h1>
            </div>
          </div>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 mx-2 rounded-xl shadow-md shadow-black-200 flex items-center gap-2 transition-all active:scale-95"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Main Form */}
        {activeTab === 'input' ? (
          /* HALAMAN INPUT (Kode form sebelumnya ada di sini) */
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
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
        ) : (
          /* HALAMAN LAPORAN */
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2"><BarChart3 size={20}/> Laporan Bulanan</h2>
            
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
                Cek
              </button>
            </div>

            {loading && <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>}

            {reportData && (
              <div className="space-y-6 pb-2">
                {/* Header Ringkasan */}
                <div className="grid grid-cols-2 gap-3">
                  {reportData.summary?.data?.map((item, idx) => (
                    <div key={idx} className="p-4 bg-indigo-600 text-white rounded-2xl shadow-sm">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className="text-[11px] opacity-90 uppercase font-bold tracking-wider">
                          {item[0]}
                        </p>
                        {/* Persentase disisipkan tipis di sebelah kanan judul */}
                        <p className="text-[12px] opacity-80 font-bold">
                          {(Number(item[2]) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <p className="text-lg font-bold">
                        Rp {Number(item[1]).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* List Transaksi - Kita loop kunci objeknya langsung */}
                {Object.keys(reportData).map((key) => {
                  // Kita lewati kunci 'summary' karena sudah ditampilkan di atas
                  if (key === 'summary') return null;

                  const table = reportData[key];
                  // Pastikan ada data di dalam tabel tersebut
                  if (!table.data || table.data.length === 0) return null;

                  return (
                    <div key={key} className="animate-in fade-in slide-in-from-bottom-2">
                      <h3 className="text-xs font-bold text-black-400 uppercase tracking-widest mb-2 px-1">
                        {table.title}
                      </h3>
                      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        {table.data.map((row, i) => (
                          <div key={i} className="flex justify-between items-center p-4 border-b border-slate-50 last:border-0">
                            <div>
                              <p className="text-slate-800 font-bold text-sm">{row[1]}</p>
                              <p className="text-[11px] text-black-400">
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
        )}

        {/* Floating Bottom Navigation */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/60 backdrop-blur-lg border border-white/21 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-full p-1.5 flex gap-1 transition-transform active:scale-95">
          <button 
            onClick={() => setActiveTab('input')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'input' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <PlusCircle size={16}/> Input
          </button>
          <button 
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'report' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <BarChart3 size={16}/> Laporan
          </button>
        </div>

      </div>
      <Modal
        type={status.type}
        message={status.message}
        onClose={() => setStatus({ type: '', message: '' })}
      />
    </div>
  );
};

export default App;