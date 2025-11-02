
import React, { useState, useEffect } from 'react';
import { Page } from './constants';
import LoadingPage from './components/pages/LoadingPage';
import LoginPage from './components/pages/LoginPage';
import HomePage from './components/pages/HomePage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SliderMenu from './components/layout/SliderMenu';
import EmployeeInfoPage from './components/pages/EmployeeInfoPage';
import InputPage from './components/pages/InputPage';
import OutputPage from './components/pages/OutputPage';

const App: React.FC = () => {
    const [page, setPage] = useState<Page>(Page.Loading);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (page === Page.Loading) {
                setPage(Page.Login);
            }
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, [page]);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setPage(Page.Home);
    };

    const navigateTo = (newPage: Page) => {
        setPage(newPage);
        setIsMenuOpen(false);
    };

    const renderPage = () => {
        switch (page) {
            case Page.Home:
                return <HomePage navigateTo={navigateTo} />;
            case Page.EmployeeInfo:
                return <EmployeeInfoPage />;
            case Page.Input:
                return <InputPage />;
            case Page.Output:
                return <OutputPage />;
            default:
                return <HomePage navigateTo={navigateTo} />;
        }
    };

    if (page === Page.Loading) {
        return <LoadingPage />;
    }

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-h-screen bg-white">
            <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
            <SliderMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navigateTo={navigateTo} />
            
            <main className="pt-[60px] pb-[60px] px-4">
              {renderPage()}
            </main>

            <Footer currentPage={page} navigateTo={navigateTo} />
        </div>
    );
};

export default App;
