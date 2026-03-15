import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Loader from './components/Loader.jsx'
import PageTransitionLoader from './components/PageTransitionLoader.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { LoaderProvider, useLoader } from './context/LoaderContext.jsx'
import { usePageTransition } from './hooks/usePageTransition.js'

function safeSessionGet(key) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSessionSet(key, value) {
  try {
    window.sessionStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function RoutesWithTransition() {
  usePageTransition();

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Root() {
  // Mostrar loader siempre (comentar la línea siguiente para verlo en cada recarga)
  safeSessionGet('xlerion_intro_seen');
  const [showIntro, setShowIntro] = useState(false); // Deshabilitado temporalmente para ver el intro de Total Darkness
  const { isLoading } = useLoader();

  const handleIntroComplete = () => {
    safeSessionSet('xlerion_intro_seen', 'true');
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <Loader onComplete={handleIntroComplete} />}
      {isLoading && <PageTransitionLoader />}
      <BrowserRouter>
        <RoutesWithTransition />
      </BrowserRouter>

    </>
  );
}

export function RootComponent() {
  return (
    <StrictMode>
      <LanguageProvider>
        <LoaderProvider>
          <Root />
        </LoaderProvider>
      </LanguageProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<RootComponent />);
