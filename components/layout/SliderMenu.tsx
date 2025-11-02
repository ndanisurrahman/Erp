
import React from 'react';
import Icon from './Icon';
import { Page } from '../../constants';
import { COLORS } from '../../constants';

interface SliderMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navigateTo: (page: Page) => void;
}

const SliderMenu: React.FC<SliderMenuProps> = ({ isOpen, onClose, navigateTo }) => {
    const menuItems = [
        { label: 'Cutting', icon: 'content_cut' },
        { label: 'Sewing', icon: 'styler' },
        { label: 'Finishing', icon: 'check_circle' },
        { label: 'Target', icon: 'flag_circle' },
        { label: 'Efficiency', icon: 'speed' },
        { label: 'Cycle Time', icon: 'hourglass_empty' },
        { label: 'SMV', icon: 'trending_up' },
        { label: 'Capacity', icon: 'memory' },
        { label: 'Manpower', icon: 'groups' },
        { label: '5S', icon: 'checklist' },
        { label: 'Sharp Tools', icon: 'construction' },
    ];

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <div 
                className={`fixed top-0 left-0 bottom-0 z-50 bg-white transform transition-transform duration-300 ease-in-out flex flex-col w-[320px] sm:w-[280px] xs:w-[260px] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{ width: '320px' }}
            >
                {/* Slider Header */}
                <div 
                    className="flex items-center px-4 flex-shrink-0"
                    style={{ height: '60px', backgroundColor: COLORS.primary, color: COLORS.white }}
                >
                    <button onClick={onClose} className="flex items-center gap-2 hover:bg-white/20 p-2 rounded-md transition-colors">
                        <Icon name="arrow_back" />
                        <span>Back</span>
                    </button>
                </div>

                {/* User Info */}
                <div className="p-4 flex flex-col items-center text-center flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                        <Icon name="person" className="text-6xl text-gray-500" />
                    </div>
                    <p className="font-semibold text-lg" style={{ color: COLORS.primary }}>Anisur Rahman</p>
                    <p className="text-gray-600 text-sm">anisur.rahman@example.com</p>
                    <p className="text-gray-600 text-sm">+880 1234 567890</p>
                </div>

                <div className="h-px w-full flex-shrink-0" style={{ backgroundColor: COLORS.primary }}></div>

                {/* Menu Items */}
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    {menuItems.map((item, index) => (
                        <button 
                            key={index}
                            onClick={onClose} 
                            className="w-full text-left flex items-center gap-4 px-6 py-4 hover:bg-gray-100 transition-colors border-b border-gray-200"
                        >
                            <Icon name={item.icon} style={{ color: COLORS.primary, fontSize: '1.4rem' }} />
                            <span className="text-md font-medium" style={{ color: COLORS.primary }}>{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SliderMenu;
