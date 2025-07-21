import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from './context/ConfigContext'; // Ruta del context, configconestct.tsx

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </HashRouter>
  </StrictMode>,
);
