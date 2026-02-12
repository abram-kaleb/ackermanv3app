// src/App.tsx

import { useState, createContext } from 'react';
import Home from './pages/Home';
import RawData from './pages/RawData';

export const AppStatusContext = createContext({ rawRunning: true });

function App() {
    const [activePage] = useState<'home' | 'raw'>('home');

    return (
        <AppStatusContext.Provider value={{ rawRunning: true }}>


            {activePage === 'home' ? <Home /> : <RawData />}
        </AppStatusContext.Provider>
    );
}

export default App;