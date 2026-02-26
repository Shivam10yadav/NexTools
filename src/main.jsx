import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(() => console.log("SW registered ✅"))
      .catch((err) => console.log("SW failed ❌", err));
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window._pwaInstallPrompt = e;
  const btn = document.getElementById('pwa-install-btn');
  if (btn) {
    btn.classList.remove('hidden');
    btn.classList.add('flex');
  }
});

window.addEventListener('appinstalled', () => {
  const btn = document.getElementById('pwa-install-btn');
  if (btn) btn.classList.add('hidden');
  window._pwaInstallPrompt = null;
});