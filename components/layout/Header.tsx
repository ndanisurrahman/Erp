
import React from 'react';
import Icon from './Icon';
import { COLORS } from '../../constants';

interface HeaderProps {
    onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
    return (
        <header 
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
            style={{ 
                height: '60px', 
                backgroundColor: COLORS.primary, 
                color: COLORS.white,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
        >
            <button 
                onClick={onMenuToggle}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Open menu"
            >
                <Icon name="menu" />
            </button>
            <h1 className="text-xl font-semibold" style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                Pacific Attires
            </h1>
            <div style={{ width: '45px' }} />
        </header>
    );
};

export default Header;
