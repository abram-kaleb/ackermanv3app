// src/App.tsx
import { useState, createContext } from 'react';
import Home from './pages/Home';

export const AppStatusContext = createContext({ rawRunning: false });

function App() {
    const [activePage] = useState<'home'>('home');

    return (
        <AppStatusContext.Provider value={{ rawRunning: false }}>
            <Home />
        </AppStatusContext.Provider>
    );
}

export default App;