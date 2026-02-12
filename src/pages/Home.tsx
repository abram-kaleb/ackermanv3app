// src/pages/Home.tsx

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import EngineCanvas from '../components/EngineCanvas';
import MonitorWindow from '../components/HomeMonitor';

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

    useEffect(() => {
        fetch(`http://${SERVER_IP}:4000/api/data`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data) && data.length > 0) setEngineData(data[0]); })
            .catch(err => console.error(err));

        socket.on('data_update', (newData) => setEngineData(newData));
        return () => { socket.off('data_update'); };
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden font-sans text-white">
            <BackgroundFUI />




            {/* TOP CENTER: DATE, TIME & OPERATION INFO */}
            <div className="absolute top-[5vw] left-1/2 -translate-x-1/2 z-20 flex items-center gap-[3vw] px-[2vw] py-[0.8vw]">
                <div className="flex items-center gap-[2.5vw]">
                    {[
                        { label: "DATE", val: engineData?.["5"] },
                        { label: "TIME", val: engineData?.["6"] }
                    ].map((item, idx) => (
                        <div key={idx} className="relative flex flex-col items-start">
                            <div className="flex items-center gap-1.5 mb-[0.2vw]">
                                <div className="w-[2px] h-[0.6vw] bg-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                                <span className="text-[0.5vw] font-black text-white/70 tracking-[0.2em] uppercase">
                                    {item.label}
                                </span>
                            </div>
                            <span className="text-[1.2vw] font-light text-white leading-none tracking-[0.05em] pl-[calc(2px+0.3vw)]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                {item.val ?? "00000000"}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="w-[1px] h-[1.5vw] bg-white/20 self-end mb-1" />
                <div className="flex items-center gap-[2.5vw]">
                    {[
                        { label: "OPERATE", val: engineData?.["7"], unit: "H" },
                        { label: "START", val: engineData?.["21"], unit: "X" }
                    ].map((item, idx) => (
                        <div key={idx} className="relative flex flex-col items-start">
                            <div className="flex items-center gap-1.5 mb-[0.2vw]">
                                <div className="w-[2px] h-[0.6vw] bg-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                                <span className="text-[0.5vw] font-black text-white/70 tracking-[0.2em] uppercase">
                                    {item.label}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-[0.3vw] pl-[calc(2px+0.3vw)]">
                                <span className="text-[1.2vw] font-light text-white leading-none tracking-[0.02em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    {item.val ?? "0"}
                                </span>
                                <span className="text-[0.6vw] font-bold text-[#FFD700] italic opacity-60 uppercase">
                                    {item.unit}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* TOP CENTER SECONDARY: ROOM DATA */}
            <div className="absolute top-[9vw] left-1/2 -translate-x-1/2 z-10 flex flex-row gap-[3vw] px-[1.5vw] py-[0.5vw]">
                {[
                    { label: "ROOM PRESSURE", val: engineData?.["17"], unit: "mbar" },
                    { label: "ROOM TEMP", val: engineData?.["18"], unit: "°C" },
                    { label: "HUMIDITY", val: engineData?.["19"], unit: "%" }
                ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                        <span className="text-[0.5vw] font-black text-white/40 uppercase tracking-[0.2em] mb-[0.1vw]">
                            {item.label}
                        </span>
                        <div className="flex items-baseline gap-[0.2vw]">
                            <span className="text-[1.4vw] font-light text-white leading-none tracking-tighter" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                {item.val ?? "0"}
                            </span>
                            <span className="text-[0.6vw] font-bold text-yellow-400/60 italic uppercase">
                                {item.unit}
                            </span>
                        </div>
                        <div className="w-[1.5vw] h-[1px] bg-yellow-400/20 mt-1" />
                    </div>
                ))}
            </div>

            {/* LEFT SIDE: ENGINE PERFORMANCE GAUGES */}
            <div className="absolute left-[3vw] top-[20vw] -translate-y-1/2 z-10 flex flex-col gap-y-[1.5vw]">
                {[
                    { label: "ENGINE SPEED", val: engineData?.["8"], unit: "RPM", max: 900 },
                    { label: "BRAKE POWER", val: engineData?.["9"], unit: "kW", max: 1120 },
                    { label: "ENGINE LOAD", val: engineData?.["10"], unit: "%", max: 100 },
                ].map((item, idx) => {
                    const progress = Math.min((Number(item.val ?? 0) / item.max) * 100, 100);
                    const radius = 44;
                    const circumference = 2 * Math.PI * radius;
                    const offset = circumference - (progress / 100) * circumference;

                    return (
                        <div key={idx} className="flex flex-col gap-y-[0.6vw]">
                            <div className="flex items-center gap-[0.5vw] ml-[0.5vw]">
                                <div className="w-[0.3vw] h-[0.3vw] bg-yellow-400 rotate-45 shadow-[0_0_5px_rgba(250,204,21,0.8)]" />
                                <span className="text-[0.65vw] font-black text-white/90 tracking-[0.2em] uppercase italic">
                                    {item.label}
                                </span>
                            </div>

                            <div className="flex items-center gap-[1.2vw] group">
                                <div className="relative w-[7.5vw] h-[7.5vw]">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="3" className="text-white/5" />
                                        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="5" strokeDasharray={circumference}
                                            style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                            className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-[1.6vw] font-light text-white tracking-tighter leading-none opacity-90" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                            {item.val ?? "0"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start border-l border-white/10 pl-[1vw] py-[0.5vw]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-[1.2vw] h-[1.5px] bg-yellow-400/80 shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
                                        <span className="text-yellow-400 font-bold text-[0.6vw] italic opacity-70 uppercase">{item.unit}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* RIGHT SIDE: PRESSURE & FLUID INDICATORS */}
            <div className="absolute right-[2.5vw] top-1/2 -translate-y-1/2 z-10 grid grid-cols-2 gap-x-[2vw] gap-y-[2vw]">
                {[
                    { label: "STARTING AIR", val: engineData?.["11"], min: 0, max: 30, unit: "BAR" },
                    { label: "LUBE OIL", val: engineData?.["12"], min: 0, max: 10, unit: "BAR" },
                    { label: "FUEL", val: engineData?.["13"], min: 0, max: 15, unit: "BAR" },
                    { label: "LT WATER", val: engineData?.["14"], min: 0, max: 6, unit: "BAR" },
                    { label: "HT WATER", val: engineData?.["15"], min: 0, max: 6, unit: "BAR" },
                    { label: "CHARGE AIR", val: engineData?.["16"], min: 0, max: 4, unit: "BAR" }
                ].map((item, idx) => {
                    const progress = Math.min((Number(item.val ?? 0) / item.max) * 100, 100);
                    return (
                        <div key={idx} className="flex flex-col items-end group w-[10vw]">
                            <div className="flex items-center gap-2 mb-[0.2vw]">
                                <span className="text-[0.7vw] font-black text-white/40 uppercase tracking-widest">{item.label}</span>
                                <div className="w-[3px] h-[0.8vw] bg-yellow-400" />
                            </div>
                            <div className="flex items-baseline gap-[0.4vw]">
                                <span className="text-[1.8vw] font-light text-white leading-none tracking-tighter" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    {item.val ?? "0.0"}
                                </span>
                                <span className="text-[0.6vw] font-bold text-yellow-400/50 uppercase italic tracking-tighter">{item.unit}</span>
                            </div>
                            <div className="w-full mt-1.5">
                                <div className="flex justify-between w-full mb-1 px-[1px]">
                                    <span className="text-[0.4vw] font-bold text-white/20">{item.min}</span>
                                    <span className="text-[0.4vw] font-bold text-white/20">{item.max}</span>
                                </div>
                                <div className="relative w-full h-[3px] bg-white/5 overflow-hidden rounded-full">
                                    <div className="absolute inset-y-0 right-0 bg-gradient-to-l from-yellow-400 to-yellow-600 shadow-[0_0_8px_rgba(250,204,21,0.3)] transition-all duration-1000"
                                        style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CENTER: 3D ENGINE MODEL */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="w-[85vw] h-[75vh] relative">
                    <EngineCanvas />
                </div>
            </div>

            {/* BOTTOM CENTER: CONTROLS & STATUS */}
            <div className="absolute right-[2.5vw] bottom-[2vw] z-20 flex flex-col gap-[1vw]">
                <div className="flex gap-[1vw]">
                    {[
                        {
                            label: "SPEED CONTROL",
                            val: engineData?.["1"],
                            id: "1.1",
                            onPlus: () => console.log("Speed Plus"),
                            onMinus: () => console.log("Speed Minus")
                        },
                        {
                            label: "LOAD CONTROL",
                            val: engineData?.["2"],
                            id: "1.2",
                            onPlus: () => console.log("Load Plus"),
                            onMinus: () => console.log("Load Minus")
                        }
                    ].map((item) => (
                        <div key={item.id} className="flex flex-col items-start w-[12vw] backdrop-blur-md bg-black/20 p-[0.8vw] rounded-xl border border-white/10 shadow-xl">
                            <span className="text-[0.65vw] font-black text-white/50 uppercase tracking-[0.2em] mb-[0.8vw]">
                                {item.label} (%)
                            </span>
                            <div className="flex items-center justify-between w-full">
                                <button onClick={item.onMinus} className="w-[2vw] h-[2vw] rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center justify-center text-[1.2vw] font-light border border-white/10 text-white">-</button>
                                <span className="text-[2.2vw] font-light text-white tracking-tighter leading-none min-w-[4vw] text-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    {item.val ?? "0"}
                                </span>
                                <button onClick={item.onPlus} className="w-[2vw] h-[2vw] rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all flex items-center justify-center text-[1.2vw] font-light border border-white/10 text-white">+</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-[0.8vw]">
                    {[
                        { label: "STOP / RUN", active: engineData?.["3"] === "1", color: "bg-emerald-400", id: "1.3" },
                        { label: "LOCAL / REMOTE", active: engineData?.["4"] === "1", color: "bg-blue-400", id: "1.4" },
                        { label: "EMERGENCY", active: engineData?.["20"] !== "0", color: "bg-red-500", pulse: true, id: "1.20" }
                    ].map((stat) => (
                        <button
                            key={stat.id}
                            className="flex items-center gap-[0.6vw] py-[0.6vw] px-[1vw] backdrop-blur-md bg-black/20 hover:bg-white/5 transition-all rounded-lg border border-white/10"
                        >
                            <div className={`w-[0.32vw] h-[0.6vw] rounded-full ${stat.active ? `${stat.color} shadow-[0_0_8px_${stat.active ? 'currentColor' : ''}] ${stat.pulse ? 'animate-pulse' : ''}` : 'bg-white/10'}`} />
                            <span className="text-[0.6vw] font-black text-white/80 uppercase tracking-widest whitespace-nowrap">
                                {stat.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            {/* MONITOR TRIGGER BUTTON */}
            <div className="absolute bottom-[2vw] left-[2.4vw] z-50">
                <button
                    onClick={() => setIsMonitorOpen(true)}
                    className="group relative flex items-center gap-[0.8vw] px-[1.2vw] py-[0.7vw] bg-black/40 backdrop-blur-md border border-yellow-400/30 rounded-lg hover:border-yellow-400 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-yellow-400/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

                    <div className="relative flex flex-col gap-[2px]">
                        <div className="w-[1.2vw] h-[2px] bg-yellow-400 group-hover:w-[1.5vw] transition-all" />
                        <div className="w-[0.8vw] h-[2px] bg-yellow-400/60" />
                        <div className="w-[1.2vw] h-[2px] bg-yellow-400 group-hover:w-[0.6vw] transition-all" />
                    </div>

                    <div className="relative flex flex-col items-start border-l border-white/10 pl-[0.8vw]">

                        <span className="text-[0.8vw] font-black text-white uppercase tracking-[0.15em]">FULL MONITOR</span>
                    </div>
                </button>
            </div>

            {/* MONITOR WINDOW OVERLAY */}
            {isMonitorOpen && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-[4vw]">
                    <div className="relative w-full h-full max-w-[85vw] max-h-[85vh] flex flex-col">
                        {/* Close Action Triggered from Outside/Header Container */}
                        <button
                            onClick={() => setIsMonitorOpen(false)}
                            className="absolute -top-[1vw] -right-[1vw] z-[110] w-[2.5vw] h-[2.5vw] bg-red-500 text-white rounded-full flex items-center justify-center text-[1.2vw] font-bold shadow-xl hover:bg-red-600 transition-colors border-2 border-[#0f171d]"
                        >
                            ✕
                        </button>

                        <div className="w-full h-full overflow-hidden rounded-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                            <MonitorWindow />
                        </div>
                    </div>
                </div>
            )}






        </div>
    );
};

export default Home;