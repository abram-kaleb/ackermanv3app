// src/components/Header.tsx


const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-black/10">
            <div className="max-w-full mx-auto px-10 h-16 flex items-center">
                <h1 className="font-black text-black uppercase italic tracking-[0.2em] text-xl select-none">
                    Engine Monitor
                </h1>
            </div>
        </header>
    );
};

export default Header;