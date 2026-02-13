// src/pages/Home.tsx

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import EngineCanvas from '../components/EngineCanvas';
import HomeMonitor from '../components/HomeMonitorDemo';
import ConditionPanel from '../components/ConditionPanel';
import AlarmPanel from '../components/AlarmPanel';
import TrendGraph from '../components/TrendGraph';
import HomeMonitorDemo from '../components/HomeMonitorDemo';


const SERVER_IP = '192.168.137.1';
const socket = io(`http://${SERVER_IP}:4000`, {
    transports: ['websocket', 'polling'],
    autoConnect: true
});


const BackgroundFUI = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#0f171d]">
            <div className="absolute -left-[5%] -bottom-[5%] w-[60vw] h-[60vw] opacity-40 blur-[80px]" style={{ background: 'radial-gradient(circle at bottom left, rgba(100, 210, 255, 0.25) 0%, transparent 70%)' }} />
            <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] opacity-40 blur-[110px] scale-x-[1.5] -rotate-[15deg]" style={{ background: 'radial-gradient(circle, rgba(140, 180, 200, 0.3) 0%, transparent 70%)' }} />
            <div className="absolute bottom-[10%] right-[5%] w-[40vw] h-[60vw] opacity-30 blur-[90px] -skew-x-[20deg]" style={{ background: 'radial-gradient(circle, rgba(100, 150, 180, 0.25) 0%, transparent 75%)' }} />
            <div className="absolute inset-0 opacity-[0.08] mix-blend-lighten blur-[1px]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/snow.png")` }} />
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(to right, rgba(100,200,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,200,255,0.15) 1px, transparent 1px)', backgroundSize: '4vw 4vw' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.5)_130%)]" />
        </div>
    );
};


const Home = () => {
    const [engineData, setEngineData] = useState<any>(null);
    const [lang, setLang] = useState<Language>('de');

    const [isMonitorOpen, setIsMonitorOpen] = useState(false);
    const [historicalData, setHistoricalData] = useState<any[]>([]);

    useEffect(() => {
        if (engineData) {
            setHistoricalData(prev => {

                const newData = [...prev, engineData];

                if (newData.length > 100) return newData.slice(1);
                return newData;
            });
        }
    }, [engineData]);

    useEffect(() => {
        fetch(`http://${SERVER_IP}:4000/api/sim-data`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data) && data.length > 0) setEngineData(data[0]); })
            .catch(err => console.error(err));

        socket.on('sim_update', (newData) => setEngineData(newData));
        return () => { socket.off('sim_update'); };
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden font-sans text-white">
            <BackgroundFUI />


            <div className="absolute top-[4.4vw] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                <div className="flex items-center bg-[#0b1217]/60 backdrop-blur-xl border border-white/20 px-[2vw] py-[1vw] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] via-[#FFD700]/30 to-transparent" />

                    <div className="flex items-center gap-[3vw]">
                        {[
                            { label: "DATE", val: engineData?.["5"], type: "text" },
                            { label: "TIME", val: engineData?.["6"], type: "text" },
                            { label: "OPERATE", val: engineData?.["7"], unit: "H", type: "number" },
                            { label: "START", val: engineData?.["21"], unit: "X", type: "number" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center group relative">
                                <div className="flex flex-col items-center mb-[0.2vw]">
                                    <span className="text-[0.65vw] font-black text-[#FFD700]/40 uppercase tracking-[0.3em] mb-[0.4vw] group-hover:text-[#FFD700]/80 transition-colors">
                                        {item.label}
                                    </span>
                                    <div className="flex items-baseline gap-[0.2vw]">
                                        <span className={`text-[1.6vw] font-mono leading-none tracking-tighter ${item.type === 'number' ? 'font-bold text-white' : 'font-medium text-white/90'}`}>
                                            {item.val ?? "---"}
                                        </span>
                                        {item.unit && (
                                            <span className="text-[0.8vw] font-black text-[#FFD700] italic opacity-40 uppercase">
                                                {item.unit}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {idx !== 3 && (
                                    <div className="absolute -right-[1.5vw] top-1/2 -translate-y-1/2 w-[1px] h-[2vw] bg-white/20" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

            </div>

            {/* RIGHT SIDE PANELS CONTAINER */}
            <div className="absolute top-[4vw] right-[2vw] z-50 flex flex-col gap-[1vw] pointer-events-none">

                <AlarmPanel
                    engineData={engineData}
                    lang={lang}
                />
                <ConditionPanel
                    engineData={engineData}
                    lang={lang}
                />

            </div>


            {/* CENTER: 3D ENGINE MODEL */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="w-[45vw] h-[25vw] absolute top-[10vw] left-1/2 -translate-x-1/2">
                    <EngineCanvas />
                </div>
            </div>


            <div className="absolute left-[1vw] top-[23vw] -translate-y-1/2 z-20 w-[28vw] h-[37vw] bg-[#0b1217]/80 backdrop-blur-2xl border border-white/20 overflow-hidden  pointer-events-auto flex flex-col font-sans">
                <div className="relative h-[0.2vw] w-full bg-white/5 shrink-0">
                    <div
                        className="absolute inset-y-0 left-0 bg-yellow-500  transition-all duration-1000"
                        style={{ width: `${Math.min((Number(engineData?.["10"] ?? 0)), 100)}%` }}
                    />
                </div>

                <button
                    onClick={() => setIsMonitorOpen(true)}
                    className="group relative flex items-center justify-between px-[0.8vw] py-[0.5vw] bg-white/[0.03] border-b border-white/[0.05] hover:bg-yellow-400/[0.02] transition-all overflow-hidden text-left w-full shrink-0"
                >
                    <div className="absolute inset-0 bg-yellow-400/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <div className="relative flex items-center gap-[0.8vw]">
                        <div className="flex flex-col gap-[2px]">
                            <div className="w-[0.8vw] h-[1.5px] bg-yellow-500 group-hover:w-[1.2vw] transition-all duration-300" />
                            <div className="w-[0.5vw] h-[1.5px] bg-yellow-500/80" />
                            <div className="w-[1vw] h-[1.5px] bg-yellow-500 group-hover:w-[0.7vw] transition-all duration-300" />
                        </div>
                        <div className="flex flex-col items-start border-l border-white/10 pl-[0.8vw]">
                            <span className="text-[1vw] font-bold text-white uppercase tracking-tight group-hover:text-yellow-400 transition-colors">FULL MONITOR</span>
                        </div>
                    </div>
                </button>

                <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-[1.2vw] space-y-[1.0vw]">
                    <div className="flex flex-row justify-between items-center gap-x-[1vw]">
                        {[
                            { label: "ENGINE SPEED", val: engineData?.["8"], unit: "RPM", max: 900 },
                            { label: "BRAKE POWER", val: engineData?.["9"], unit: "kW", max: 1120 },
                            { label: "ENGINE LOAD", val: engineData?.["10"], unit: "%", max: 100 },
                        ].map((item, idx) => {
                            const progress = Math.min((Number(item.val ?? 0) / item.max) * 100, 100);
                            const radius = 2.2;
                            const circumference = 2 * Math.PI * radius;
                            const offset = circumference - (progress / 100) * circumference;

                            return (
                                <div key={idx} className="relative flex-1 p-[1vw] bg-white/[0.02] border border-white/5  flex flex-col items-center group">
                                    <span className="text-[0.8vw] font-black text-white/40 uppercase tracking-widest text-center leading-tight mb-3">
                                        {item.label}
                                    </span>
                                    <div className="relative flex items-center justify-center">
                                        <svg className="w-[5.5vw] h-[5.5vw] -rotate-90">
                                            <circle cx="2.75vw" cy="2.75vw" r="2.2vw" stroke="currentColor" strokeWidth="0.3vw" fill="transparent" className="text-white/5" />
                                            <circle
                                                cx="2.75vw" cy="2.75vw" r="2.2vw"
                                                stroke="currentColor" strokeWidth="0.4vw"
                                                fill="transparent"
                                                strokeDasharray={`${circumference}vw`}
                                                style={{ strokeDashoffset: `${offset}vw` }}
                                                className="text-yellow-500 transition-all duration-1000 "
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-[1.2vw] font-mono font-bold text-white tracking-tighter leading-none">{item.val ?? "0"}</span>
                                            <span className="text-[0.6vw] font-bold text-yellow-500/50 uppercase">{item.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-3 gap-[0.8vw]">
                        {[
                            { label: "START AIR", val: engineData?.["11"], max: 30, unit: "BAR" },
                            { label: "LUBE OIL", val: engineData?.["12"], max: 10, unit: "BAR" },
                            { label: "FUEL", val: engineData?.["13"], max: 15, unit: "BAR" },
                            { label: "LT WATER", val: engineData?.["14"], max: 6, unit: "BAR" },
                            { label: "HT WATER", val: engineData?.["15"], max: 6, unit: "BAR" },
                            { label: "CHARGE AIR", val: engineData?.["16"], max: 4, unit: "BAR" }
                        ].map((item, idx) => {
                            const progress = Math.min((Number(item.val ?? 0) / item.max) * 100, 100);
                            return (
                                <div key={idx} className="relative p-[0.8vw] bg-white/[0.02] border border-white/5  overflow-hidden hover:border-white/10 transition-all">
                                    <span className="text-[0.8vw] text-white/40 font-black uppercase tracking-tight block mb-1">{item.label}</span>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-[1.2vw] font-mono text-white font-medium leading-none">{item.val ?? "0.0"}</span>
                                        <span className="text-[0.8vw] text-yellow-500/50 font-bold uppercase">{item.unit}</span>
                                    </div>
                                    <div className="h-[3px] w-full bg-white/5  overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-500/40 transition-all duration-1000"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-[1fr_1.5fr] gap-[1.5vw] p-[1.2vw] bg-[#0b1217] border border-white/5 w-full select-none">
                        <div className="flex flex-col gap-[1.5vw] pr-[1vw] border-r border-white/10">
                            {[
                                { label: "ROOM PRESSURE", val: engineData?.["17"] ?? "1017.2", unit: "MBAR" },
                                { label: "ROOM TEMP", val: engineData?.["18"] ?? "19.1", unit: "°C" },
                                { label: "HUMIDITY", val: engineData?.["19"] ?? "57", unit: "%" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-start">
                                    <span className="text-[0.6vw] font-black text-white/30 uppercase tracking-widest mb-[0.2vw]">{item.label}</span>
                                    <div className="flex items-baseline gap-[0.4vw]">
                                        <span className="text-[1.3vw] font-medium text-white leading-none font-mono tracking-tighter">{item.val}</span>
                                        <span className="text-[0.7vw] font-bold text-yellow-500/60 uppercase">{item.unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col justify-between pl-[0.5vw]">
                            <div className="grid grid-cols-2 gap-[1vw] mb-[1.5vw]">
                                {[
                                    { label: "SPEED CONTROL", val: engineData?.["1"] ?? "0" },
                                    { label: "LOAD CONTROL", val: engineData?.["2"] ?? "0" }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col">
                                        <div className="flex items-center gap-1.5 mb-[0.5vw] h-[1.8vw]">
                                            <div className="w-[2px] h-[0.8vw] bg-yellow-400" />
                                            <span className="text-[0.65vw] font-bold text-white/90 uppercase tracking-tighter leading-tight">
                                                {item.label.split(' ').map((word, idx) => (
                                                    <span key={idx} className="block">{word}</span>
                                                ))}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-[0.3vw]">
                                            <span className="text-[2vw] font-medium text-white tracking-tighter leading-none font-mono">{item.val}</span>
                                            <span className="text-[0.9vw] font-bold text-yellow-400/60 italic uppercase">%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-y-[0.7vw] pt-3 border-t border-white/5">
                                {[
                                    { label: "STOP / RUN", active: engineData?.["3"] === "1", color: "bg-emerald-400" },
                                    { label: "LOCAL / REMOTE", active: engineData?.["4"] === "1", color: "bg-blue-400" },
                                    { label: "EMERGENCY", active: engineData?.["20"] !== "0", color: "bg-red-500", pulse: true }
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center gap-[0.8vw]">
                                        <div className={`w-[0.7vw] h-[0.7vw] transition-all duration-500 ${stat.active
                                            ? `${stat.color}  ${stat.pulse ? 'animate-pulse' : ''}`
                                            : 'bg-white/10 shadow-inner'
                                            }`} />
                                        <span className={`text-[0.8vw] font-bold uppercase tracking-tighter whitespace-nowrap leading-none ${stat.active ? 'text-white/90' : 'text-white/20'}`}>
                                            {stat.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* MONITOR WINDOW OVERLAY */}
            {
                isMonitorOpen && (
                    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-[4vw]">
                        <div className="relative w-full h-full max-w-[85vw] max-h-[85vh] flex flex-col">
                            {/* Close Action Triggered from Outside/Header Container */}
                            <button
                                onClick={() => setIsMonitorOpen(false)}
                                className="absolute -top-[1vw] -right-[1vw] z-[110] w-[2.5vw] h-[2.5vw] bg-red-500 text-white flex items-center justify-center text-[1.2vw] font-bold  hover:bg-red-600 transition-colors border-2 border-[#0f171d]"
                            >
                                ✕
                            </button>

                            <div className="w-full h-full overflow-hidden  border border-white/10 ">
                                <HomeMonitorDemo />
                            </div>
                        </div>
                    </div>
                )
            }


            <div className="absolute right-1/2 translate-x-1/2 bottom-[1vw] h-[10vw] w-[35vw] z-20">
                <TrendGraph data={historicalData} />
            </div>




        </div >
    );
};

export default Home;