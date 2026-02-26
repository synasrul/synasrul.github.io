import { useEffect } from 'react';

export default function useSessionTimeout (isLoggedIn, onLogout, timeoutMs = 10 * 60 * 1000) {
  useEffect(() => {
    if (!isLoggedIn) return;

    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onLogout();
        alert("Session berakhir karena idle 10 menit.");
      }, timeoutMs);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isLoggedIn, onLogout, timeoutMs]);
};