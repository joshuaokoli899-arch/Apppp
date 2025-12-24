
import React from 'react';
import { AndroidIcon } from './icons';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 shadow-lg border-b-2 border-cyan-500">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center gap-4">
                <AndroidIcon />
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider">
                    Android Build Simulator
                </h1>
            </div>
        </header>
    );
};

export default Header;
