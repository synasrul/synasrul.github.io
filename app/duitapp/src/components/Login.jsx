import React, { useState } from 'react';
import { Wallet, LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';
import { hashPassword } from '../utils/crypto';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [attempts, setAttempts] = useState(
    parseInt(localStorage.getItem("login_attempts")) || 0
  );

  const [lockUntil, setLockUntil] = useState(
    parseInt(localStorage.getItem("lock_until")) || 0
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return; // cegah double click

    const now = Date.now();
    // 🔒 Jika masih terkunci
    if (lockUntil && now < lockUntil) {
      const remaining = Math.ceil((lockUntil - now) / 1000);
      setError(`Akun terkunci. Coba lagi dalam ${remaining} detik.`);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    // 🔥 Delay anti brute force (acak 800-1500ms)
    await new Promise(res => 
      setTimeout(res, 800 + Math.random() * 700)
    );

    const SALT = "DuitApp";
    const inputHash = await hashPassword(password, SALT);
    const STORED_HASH = "04677b475086f2308fdf389144be88343129ca8f1ffd463aa06cc1f20936d61a";


    if (username === 'admin' && inputHash === STORED_HASH) {
    // if (username === 'admin' && password === 'Nasrul0912') {
      localStorage.removeItem("login_attempts");
      localStorage.removeItem("lock_until");
    //   localStorage.setItem('isLoggedIn', 'true');
      onLogin();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("login_attempts", newAttempts);
      if (newAttempts >= 3) {
        const lockTime = now + 60 * 1000; // 1 menit
        localStorage.setItem("lock_until", lockTime);
        setLockUntil(lockTime);
        setError("Terlalu banyak percobaan. Akun dikunci 1 menit.");
      } else {
        setError(`Password salah (${newAttempts}/3)`);
      }
    }
    setLoading(false);
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
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 font-bold transition-all active:scale-95 disabled:bg-indigo-400"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            {loading ? 'Loading...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;