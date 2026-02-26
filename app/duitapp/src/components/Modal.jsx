import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';


const Modal = ({ type, message, onClose }) => {
  useEffect(() => {
    // const generate = async () => {
    //   const hash = await hashPassword("password", "DuitApp");
    //   console.log("HASH:", hash);
    // };
  // generate();
    // Auto close 2 detik jika success
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
          {type === 'success' ? (
            <CheckCircle2 className="text-emerald-500" size={24} />
          ) : (
            <AlertCircle className="text-rose-500" size={24} />
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

export default Modal;