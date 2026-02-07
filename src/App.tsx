// src/App.tsx

import React, { useState, createContext } from 'react';
import Home from './pages/Home';
import RawData from './pages/RawData';

export const AppStatusContext = createContext({ rawRunning: true });

function App() {
    const [activePage, setActivePage] = useState<'home' | 'raw'>('home');

    return (
        <AppStatusContext.Provider value={{ rawRunning: true }}>
            {/* <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-2xl">
                <button
                    onClick={() => setActivePage('home')}
                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activePage === 'home'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-slate-400 hover:text-white'
                        }`}
                >
                    DASHBOARD
                </button>
                <button
                    onClick={() => setActivePage('raw')}
                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activePage === 'raw'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-slate-400 hover:text-white'
                        }`}
                >
                    RAW_DATA
                </button>
            </div> */}

            {activePage === 'home' ? <Home /> : <RawData />}
        </AppStatusContext.Provider>
    );
}

export default App;