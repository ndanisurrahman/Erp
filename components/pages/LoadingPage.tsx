
import React from 'react';
import { COLORS } from '../../constants';

const LoadingPage: React.FC = () => {
    return (
        <div 
            className="flex flex-col items-center justify-center h-screen"
            style={{ backgroundColor: COLORS.primary }}
        >
            <div className="text-center text-white">
                <div 
                    className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-6 mx-auto"
                ></div>
                <h1 className="text-3xl font-bold mb-2">Production Solution</h1>
            </div>
            <p className="absolute bottom-6 text-white text-sm">Powered by SewTech</p>
        </div>
    );
};

export default LoadingPage;
