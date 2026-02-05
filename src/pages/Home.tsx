// src/pages/Home.tsx
import { useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AppStatusContext } from '../App';
import Header from '../components/Header';
import TimeSection from '../components/TimeSection';
import ControlSection from '../components/ControlSection';
import EngineSection from '../components/EngineSection';
import EnvironmentSection from '../components/EnvironmentSection';
import type { Language } from '../data/translations';

const socket = io('http://localhost:4000');

const Home = () => {
    const [engineData, setEngineData] = useState<any>(null);
    const [lang, setLang] = useState<Language>('id');
    const { homeRunning } = useContext(AppStatusContext);

    useEffect(() => {
        if (!homeRunning) {
            socket.disconnect();
            return;
        }

        socket.connect();

        fetch('http://localhost:4000/api/data')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setEngineData(data[0]);
                }
            })
            .catch(err => console.error("Fetch error:", err));

        socket.on('data_update', (newData) => {
            setEngineData(newData);
        });

        return () => {
            socket.off('data_update');
        };
    }, [homeRunning]);

    return (
        <div className={`min-h-screen bg-[#f8fafc] transition-all duration-500 ${!homeRunning ? 'grayscale opacity-50' : 'opacity-100'}`}>
            <Header lang={lang} setLang={setLang} />

            <main className="max-w-[1400px] mx-auto px-6 md:px-10 pb-20">
                <div className="space-y-2">
                    <TimeSection data={engineData} lang={lang} />

                    <div className="grid grid-cols-1 gap-2">
                        <ControlSection data={engineData} lang={lang} />
                        <EngineSection data={engineData} lang={lang} />
                        <EnvironmentSection data={engineData} lang={lang} />
                    </div>
                </div>

                <footer className="mt-20 pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em]">
                        &copy; 2026 Engine Monitoring System • v1.4.2
                    </div>
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${homeRunning ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Database Linked</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${homeRunning ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Socket IO</span>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Home;