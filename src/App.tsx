// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import Home from './pages/Home';
import RawData from './pages/RawData';

export const AppStatusContext = createContext({
  homeRunning: true,
  rawRunning: true,
  toggleHome: () => { },
  toggleRaw: () => { }
});

const NavigationMenu = () => {
  const { homeRunning, rawRunning, toggleHome, toggleRaw } = useContext(AppStatusContext);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const Switch = ({ active, onToggle, label }: { active: boolean, onToggle: () => void, label: string }) => (
    <div className="flex flex-col items-center gap-1 px-2">
      <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter">{label}</span>
      <button
        onClick={onToggle}
        className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${active ? 'bg-green-500' : 'bg-slate-700'}`}
      >
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${active ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      <div className="bg-slate-900/95 backdrop-blur-xl p-2 rounded-[28px] shadow-2xl border border-slate-800 flex items-center gap-2">
        <div className="flex items-center bg-slate-800/50 rounded-full p-1">
          <Link
            to="/"
            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isHome ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
          >
            Dashboard
          </Link>
          <Link
            to="/raw"
            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!isHome ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
          >
            Raw View
          </Link>
        </div>

        <div className="w-[1px] h-8 bg-slate-700 mx-1"></div>

        <div className="flex gap-1">
          <Switch active={homeRunning} onToggle={toggleHome} label="Home" />
          <Switch active={rawRunning} onToggle={toggleRaw} label="Raw" />
        </div>
      </div>
    </div>
  );
};

function App() {
  const [homeRunning, setHomeRunning] = useState(true);
  const [rawRunning, setRawRunning] = useState(true);

  const toggleHome = () => setHomeRunning(!homeRunning);
  const toggleRaw = () => setRawRunning(!rawRunning);

  return (
    <AppStatusContext.Provider value={{ homeRunning, rawRunning, toggleHome, toggleRaw }}>
      <Router>
        <div className="relative min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/raw" element={<RawData />} />
          </Routes>
          <NavigationMenu />
        </div>
      </Router>
    </AppStatusContext.Provider>
  );
}

export default App;