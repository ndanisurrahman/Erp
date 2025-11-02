
import React from 'react';
import Icon from './Icon';
import { Page } from '../../constants';
import { COLORS } from '../../constants';

interface FooterProps {
    currentPage: Page;
    navigateTo: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ currentPage, navigateTo }) => {
    const footerItems = [
        { id: Page.Home, icon: 'home', label: 'Home' },
        { id: 'Calculator', icon: 'calculate', label: 'Calculator' },
        { id: 'Settings', icon: 'settings', label: 'Settings' },
        { id: 'Message', icon: 'chat_bubble', label: 'Message' },
        { id: 'Call', icon: 'call', label: 'Call' },
    ];

    return (
        <footer 
            className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
            style={{ 
                height: '60px', 
                backgroundColor: COLORS.primary,
                boxShadow: '0 -2px 4px rgba(0,0,0,0.2)'
            }}
        >
            {footerItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                    <button 
                        key={item.id} 
                        onClick={() => item.id !== 'Calculator' && item.id !== 'Settings' && item.id !== 'Message' && item.id !== 'Call' && navigateTo(item.id as Page)}
                        className="flex flex-col items-center justify-center"
                        aria-label={item.label}
                    >
                        <div 
                            className="flex items-center justify-center rounded-full transition-all duration-300"
                            style={{
                                width: '45px',
                                height: '45px',
                                backgroundColor: isActive ? '#cccccc' : COLORS.white,
                            }}
                        >
                            <Icon 
                                name={item.icon} 
                                className="text-2xl"
                                style={{ color: isActive ? COLORS.white : COLORS.primary }}
                            />
                        </div>
                    </button>
                );
            })}
        </footer>
    );
};

export default Footer;
