
import React from 'react';
import { Page, COLORS } from '../../constants';
import Icon from '../layout/Icon';

interface HomePageProps {
    navigateTo: (page: Page) => void;
}

interface NavButtonProps {
    page: Page;
    icon: string;
    label: string;
    navigateTo: (page: Page) => void;
}

const NavButton: React.FC<NavButtonProps> = ({ page, icon, label, navigateTo }) => (
    <div className="flex flex-col items-center">
        <button 
            onClick={() => navigateTo(page)}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-105 transition-transform duration-300"
            style={{ backgroundColor: COLORS.primary }}
        >
            <Icon name={icon} className="text-4xl" />
        </button>
        <p className="mt-2 text-center font-semibold" style={{ color: COLORS.primary }}>{label}</p>
    </div>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h2 className="text-2xl font-bold mb-6 text-left w-full" style={{ color: COLORS.secondary }}>
        {title}
    </h2>
);

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
    const hrButtons = [
        { page: Page.EmployeeInfo, icon: 'groups', label: 'Employees Information' },
    ];
    const productionButtons = [
        { page: Page.Input, icon: 'input', label: 'Input' },
        { page: Page.Output, icon: 'output', label: 'Output' },
        { page: Page.HourlyReport, icon: 'schedule', label: 'Hourly Production Report' },
        { page: Page.ProductionSummary, icon: 'summarize', label: 'Production Summary' },
        { page: Page.Conjunction, icon: 'link', label: 'Conjunction' },
    ];

    return (
        <div className="container mx-auto py-8">
            <div className="mb-12">
                <SectionHeader title="HR and Administration" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                    {hrButtons.map(btn => <NavButton key={btn.page} {...btn} navigateTo={navigateTo} />)}
                </div>
            </div>

            <div>
                <SectionHeader title="Sewing Production" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                    {productionButtons.map(btn => <NavButton key={btn.page} {...btn} navigateTo={navigateTo} />)}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
