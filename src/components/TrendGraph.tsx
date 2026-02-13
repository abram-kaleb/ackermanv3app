// components/TrendGraph.tsx

import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sensorLabels: Record<string, string> = {
    "1": "Fahrhebel Drehzahl",
    "2": "Fahrhebel Bremslast",
    "8": "Drehzahl Motor",
    "9": "Bremsleistung",
    "10": "Füllung Motor",
    "11": "Anlaßluftdruck",
    "12": "Schmieröldruck",
    "13": "Kraftstoffdruck",
    "14": "LT Kühlwasserdruck",
    "15": "HT Kühlwasserdruck",
    "16": "Ladeluftdruck",
    "18": "Temp. Maschinenraum",
    "22": "Temp. Zyl 1",
    "28": "Temp. vor ATL",
    "32": "Drehzahl ATL",
    "57": "HT Wasser Temp Inlet",
    "64": "HT Wasser Temp Outlet",
    "87": "Lube Oil Pressure",
    "100": "Charge Air Temp",
    "132": "Fuel HFO Temp"
};

const CustomTooltip = ({ active, payload, selectedKey }: any) => {
    if (active && payload && payload.length && payload[0].value !== null) {
        return (
            <div className="bg-black/95 border border-yellow-500/20 p-2 rounded-lg shadow-2xl z-[100]">
                <p className="text-yellow-500 font-mono text-[0.9vw] font-bold">{payload[0].value}</p>
                <p className="text-white/40 text-[0.5vw] uppercase font-bold tracking-tighter">{sensorLabels[selectedKey]}</p>
            </div>
        );
    }
    return null;
};

const TrendGraph = ({ data }: { data: any[] }) => {
    const [selectedKey, setSelectedKey] = useState("8");
    const [rangeType, setRangeType] = useState("5m");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);

    const ranges: any = {
        "5m": { label: "5M", points: 30 },
        "15m": { label: "15M", points: 90 },
        "1h": { label: "1H", points: 360 },
        "12h": { label: "12H", points: 4320 }
    };

    const availableKeys = useMemo(() => {
        if (!data || data.length === 0) return [];
        return Object.keys(data[0]).filter(key => sensorLabels[key]);
    }, [data]);

    const processedData = useMemo(() => {
        const config = ranges[rangeType];
        const maxPoints = config.points;
        const latestData = data.slice(-maxPoints);

        if (latestData.length < maxPoints) {
            const padding = Array.from({ length: maxPoints - latestData.length }, (_, i) => ({
                virtualIndex: i,
                [selectedKey]: null
            }));

            return [...padding, ...latestData.map((d, i) => ({
                ...d,
                virtualIndex: i + padding.length
            }))];
        }

        return latestData.map((d, i) => ({ ...d, virtualIndex: i }));
    }, [data, rangeType, selectedKey]);

    return (
        <div className="relative flex flex-col w-full h-full">
            <div className="flex justify-between items-center mb-3 px-1">
                <div className="flex-1" />

                <div className="relative flex-1 flex justify-center">
                    <button onClick={() => { setIsMenuOpen(!isMenuOpen); setIsTimeMenuOpen(false); }} className="flex items-center gap-2 group">
                        <h2 className="text-white/80 text-[0.9vw] font-black tracking-[0.2em] uppercase italic transition-colors group-hover:text-yellow-500 whitespace-nowrap">
                            {sensorLabels[selectedKey]}
                        </h2>
                        <svg className={`w-3 h-3 text-white/20 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 15l7-7 7 7" />
                        </svg>
                    </button>

                    {isMenuOpen && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[16vw] max-h-[18vw] overflow-y-auto bg-black border border-white/10 rounded-xl shadow-2xl z-[110] py-2 custom-scrollbar">
                            {availableKeys.map(key => (
                                <button
                                    key={key}
                                    onClick={() => { setSelectedKey(key); setIsMenuOpen(false); }}
                                    className={`w-full text-center px-4 py-2 text-[0.65vw] uppercase font-bold tracking-widest transition-all ${selectedKey === key ? 'text-yellow-500 bg-yellow-500/10' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
                                >
                                    {sensorLabels[key]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1 flex justify-end">
                    <div className="relative">
                        <button onClick={() => { setIsTimeMenuOpen(!isTimeMenuOpen); setIsMenuOpen(false); }} className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:border-yellow-500/50 transition-all">
                            <span className="text-yellow-500 font-black text-[0.7vw] tracking-tighter">{ranges[rangeType].label}</span>
                            <svg className={`w-2.5 h-2.5 text-white/40 transition-transform ${isTimeMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isTimeMenuOpen && (
                            <div className="absolute bottom-full right-0 mb-2 w-20 bg-black border border-white/10 rounded-lg shadow-2xl z-[110] py-1 overflow-hidden">
                                {Object.keys(ranges).map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => { setRangeType(r); setIsTimeMenuOpen(false); }}
                                        className={`w-full text-center py-2 text-[0.6vw] font-black transition-all ${rangeType === r ? 'text-yellow-500 bg-yellow-500/10' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {ranges[r].label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative w-full h-[12vw] bg-black/30 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={processedData}
                        margin={{ top: 15, right: 0, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#eab308" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="5 5" stroke="rgba(255,255,255,0.02)" vertical={false} />
                        <XAxis
                            dataKey="virtualIndex"
                            hide
                            type="number"
                            domain={[0, ranges[rangeType].points - 1]}
                        />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip content={<CustomTooltip selectedKey={selectedKey} />} isAnimationActive={false} />
                        <Area
                            isAnimationActive={false}
                            type="monotone"
                            dataKey={selectedKey}
                            stroke="#eab308"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorYellow)"
                            connectNulls={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TrendGraph;