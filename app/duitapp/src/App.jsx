import React, { useState } from 'react';
import { Wallet, LogOut, BarChart3, PlusCircle } from 'lucide-react';
import Login from './components/Login';
import Modal from './components/Modal';
import TransactionForm from './components/TransactionForm';
import MonthlyReport from './components/MonthlyReport';
import useSessionTimeout from './hooks/useSessionTimeout';

// Mengambil URL dari file .env
const GAS_URL = import.meta.env.VITE_GAS_URL;


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const [activeTab, setActiveTab] = useState('input'); // 'input' | 'report'
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

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  useSessionTimeout(isLoggedIn, handleLogout);

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
  if (!isLoggedIn) return <Login onLogin={() => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  }} />;

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

        {/* Main Content */}
        {activeTab === 'input' ? (
          <TransactionForm 
            formData={formData} 
            setFormData={setFormData} 
            onSubmit={handleSubmit} 
            loading={loading} 
          />
        ) : (
          <MonthlyReport gasUrl={GAS_URL} />
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