// src/pages/Login.tsx

import React, { useState } from 'react';

const Login = ({ onLogin }: { onLogin: () => void }) => {
    const [passcode, setPasscode] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcode === '1234') {
            onLogin();
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] bg-[#0f171d] flex items-center justify-center font-sans">
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle, rgba(100,200,255,0.2) 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                }}
            />

            <div className="relative w-[25vw] flex flex-col items-center">
                <div className="mb-[2vw] text-center">
                    <h1 className="text-white text-[1.5vw] font-black tracking-[0.5em] uppercase"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        System Access
                    </h1>
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-2" />
                </div>

                <form onSubmit={handleLogin} className="w-full space-y-[1.5vw]">
                    <div className="relative group">
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            placeholder="ENTER PASSCODE"
                            className="w-full bg-white/5 border border-white/10 px-[1.5vw] py-[1vw] text-white text-center text-[0.8vw] tracking-[0.3em] focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
                        />
                        <div className="absolute left-0 top-0 w-[2px] h-full bg-cyan-500 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black py-[0.8vw] text-[0.7vw] font-black tracking-[0.4em] uppercase hover:bg-cyan-400 transition-colors"
                    >
                        Initialize Session
                    </button>
                </form>

                <div className="mt-[2vw] flex gap-4 opacity-20">
                    <span className="text-[0.5vw] text-white font-mono uppercase tracking-widest">Encrypted Connection</span>
                    <span className="text-[0.5vw] text-white font-mono uppercase tracking-widest">v3.0.4</span>
                </div>
            </div>
        </div>
    );
};

export default Login;