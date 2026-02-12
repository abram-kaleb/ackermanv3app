// src/App.tsx

import { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Replay from './pages/Replay';
import RawData from './pages/RawData';
import Simulation from './pages/Simulation';
import Login from './pages/Login';

export const AppStatusContext = createContext({
    rawRunning: true,
    setRawRunning: (val: boolean) => { },
    isInitialized: false,
    setIsInitialized: (val: boolean) => { }
});

const FloatingNav = () => {
    const location = useLocation();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = time.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/:/g, ' : ');

    const formattedDate = time.toLocaleDateString('en-GB').replace(/\//g, ' / ');

    const menu = [
        { path: '/', label: 'MONITORING' },
        { path: '/replay', label: 'REPLAY' },
        { path: '/simulation', label: 'SIMULATION' },
        { path: '/raw', label: 'RAW DATA' }
    ];

    return (
        <div className="fixed top-0 left-0 w-full z-[9999] flex items-center h-[4vw] px-[2vw]">
            <div className="absolute left-[2vw] top-[1.2vw] z-20">
                <div className="flex flex-col gap-0 w-fit">
                    <div className="flex items-baseline gap-2">
                        <span
                            className="text-[1.2vw] font-medium text-white tracking-[0.05em] uppercase leading-none opacity-90"
                            style={{
                                fontFamily: "'Courier New', Courier, monospace",
                                textShadow: '0 0 5px rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            {formattedTime}
                        </span>
                        <span className="text-[0.55vw] font-bold text-white/20 tracking-[0.1em] uppercase font-mono">
                            | {formattedDate}
                        </span>
                    </div>
                    <div className="relative mt-1">
                        <div className="w-full h-[0.5px] bg-white/20" />
                        <div className="absolute right-0 top-[-1px] w-[2px] h-[2px] bg-white/40 rounded-full" />
                    </div>
                </div>
            </div>

            <nav className="flex items-center justify-center w-full h-full">
                <div className="flex items-center h-full">
                    {menu.map((item, idx) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <div key={item.path} className="flex items-center h-full">
                                <Link
                                    to={item.path}
                                    className={`relative flex items-center justify-center px-[3vw] h-[3vw] transition-all duration-200 group
                                        ${isActive
                                            ? 'bg-white text-black'
                                            : 'text-white/20 hover:text-white/90 hover:bg-white/5'}`}
                                >
                                    {isActive && (
                                        <>
                                            <div className="absolute left-0 top-[-0.4vw] bottom-[-0.4vw] w-[1.5px] bg-white" />
                                            <div className="absolute right-0 top-[-0.4vw] bottom-[-0.4vw] w-[1.5px] bg-white" />
                                        </>
                                    )}
                                    <span className="text-[0.75vw] font-black tracking-[0.2em] uppercase transition-colors">
                                        {item.label}
                                    </span>
                                </Link>
                                {idx < menu.length - 1 && (
                                    <div className="h-[1.2vw] w-[1px] bg-white/20" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>

            <div className="absolute right-[2vw] z-20">
                <span className="text-[0.7vw] font-black text-white/30 tracking-[0.3em] uppercase font-mono">
                    Ackerman v3
                </span>
            </div>
        </div>
    );
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [rawRunning, setRawRunning] = useState(true);
    const [isInitialized, setIsInitialized] = useState(true);
    const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

    useEffect(() => {
        const handleResize = () => setIsLandscape(window.innerWidth > window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isLandscape) {
        return (
            <div className="fixed inset-0 z-[9999] bg-slate-900 flex flex-col items-center justify-center text-white p-[5vw] text-center">
                <h2 className="text-[2.5vw] font-black uppercase tracking-[0.5em]">Rotate Device</h2>
                <p className="text-[1vw] font-mono text-slate-500 mt-[1vw]">SYSTEM ACCESSIBLE IN LANDSCAPE ONLY</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Login onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <AppStatusContext.Provider value={{ rawRunning, setRawRunning, isInitialized, setIsInitialized }}>
            <Router>
                <div className="relative w-screen h-screen bg-[#0f171d] overflow-hidden">
                    <FloatingNav />
                    <main className="w-full h-full relative">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/replay" element={<Replay />} />
                            <Route path="/raw" element={<RawData />} />
                            <Route path="/simulation" element={<Simulation />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AppStatusContext.Provider>
    );
};

export default App;