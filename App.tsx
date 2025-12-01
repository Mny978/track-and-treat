
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import ProfileView from './views/ProfileView';
import PlanView from './views/PlanView';
import TrackerView from './views/TrackerView';
import RecipesView from './views/RecipesView';
import ReportsView from './views/ReportsView';
import GuidanceView from './views/GuidanceView';
import SearchView from './views/SearchView';
import ChatView from './views/ChatView';
import { AppProvider } from './contexts/AppContext';
import type { View } from './types';
import { MenuIcon } from './components/common/icons';
import { LogoIcon } from './components/common/LogoIcon';

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardView />;
            case 'profile':
                return <ProfileView />;
            case 'plan':
                return <PlanView />;
            case 'tracker':
                return <TrackerView />;
            case 'recipes':
                return <RecipesView />;
            case 'reports':
                return <ReportsView />;
            case 'guidance':
                return <GuidanceView />;
            case 'search':
                return <SearchView />;
            case 'chat':
                return <ChatView />;
            default:
                return <DashboardView />;
        }
    };

    return (
        <AppProvider>
            <div className="min-h-screen flex flex-col md:flex-row bg-[var(--color-background)]">
                <Sidebar
                    activeView={activeView}
                    setActiveView={setActiveView}
                    isMobileOpen={isMobileSidebarOpen}
                    setMobileOpen={setIsMobileSidebarOpen}
                />
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Mobile Header */}
                    <header className="md:hidden flex items-center justify-between p-4 bg-[var(--color-card)] shadow-md sticky top-0 z-20">
                        <button onClick={() => setIsMobileSidebarOpen(true)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-1">
                            <MenuIcon />
                        </button>
                        <div className="flex items-center gap-2">
                            <LogoIcon className="w-7 h-7" />
                            <span className="text-xl font-black text-[var(--color-primary)] text-shadow-custom">
                                Track<span className="text-[var(--color-secondary)]"> & Treat</span>
                            </span>
                        </div>
                        <div className="w-8 h-8"></div> {/* Spacer */}
                    </header>
                    <main className={`flex-1 bg-[var(--color-background)] ${activeView === 'chat' ? 'p-4 md:p-8 flex flex-col' : 'p-4 md:p-8 overflow-y-auto'}`}>
                        {renderView()}
                    </main>
                </div>
            </div>
        </AppProvider>
    );
};

export default App;