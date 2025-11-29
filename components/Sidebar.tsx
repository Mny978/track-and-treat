
import React, { useState } from 'react';
import type { View, Language } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { HomeIcon, UserIcon, ChefHatIcon, ActivityIcon, UtensilsIcon, FileTextIcon, GraduationCapIcon, SearchIcon, MessageSquareIcon, XIcon, DefaultAvatarIcon } from './common/icons';
import FeedbackModal from './FeedbackModal';
import { LogoIcon } from './common/LogoIcon';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
    isMobileOpen: boolean;
    setMobileOpen: (isOpen: boolean) => void;
}

const navItems = [
    { id: 'dashboard', labelKey: 'navDashboard', icon: <HomeIcon /> },
    { id: 'profile', labelKey: 'navProfile', icon: <UserIcon /> },
    { id: 'plan', labelKey: 'navPlan', icon: <ChefHatIcon /> },
    { id: 'tracker', labelKey: 'navTracking', icon: <ActivityIcon /> },
    { id: 'recipes', labelKey: 'navRecipes', icon: <UtensilsIcon /> },
    { id: 'reports', labelKey: 'navReports', icon: <FileTextIcon /> },
    { id: 'guidance', labelKey: 'navGuidance', icon: <GraduationCapIcon /> },
    { id: 'search', labelKey: 'navSearch', icon: <SearchIcon /> },
] as const;

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isMobileOpen, setMobileOpen }) => {
    const { profile, language, setLanguage, strings } = useAppContext();
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as Language);
    };

    const handleNavItemClick = (view: View) => {
        setActiveView(view);
        setMobileOpen(false); // Close sidebar on mobile after navigation
    };

    const handleFeedbackClick = () => {
        setIsFeedbackModalOpen(true);
        setMobileOpen(false); // Close sidebar on mobile when opening modal
    };

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 md:hidden ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMobileOpen(false)}
            />

            <nav className={`
                bg-[var(--color-card)] p-4 shadow-2xl flex flex-col space-y-2 custom-scroll overflow-y-auto w-64 
                transition-transform duration-300 ease-in-out
                fixed inset-y-0 left-0 z-40
                md:relative md:translate-x-0 md:h-screen md:sticky
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="md:hidden flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                        <LogoIcon className="w-8 h-8" />
                        <span className="text-2xl font-black text-[var(--color-primary)] text-shadow-custom">
                            Track<span className="text-[var(--color-secondary)]"> & Treat</span>
                        </span>
                    </div>
                    <button onClick={() => setMobileOpen(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-1">
                        <XIcon />
                    </button>
                </div>
                
                <div className="hidden md:flex items-center gap-2 mb-2">
                     <LogoIcon className="w-9 h-9" />
                     <span className="text-2xl font-black text-[var(--color-primary)] text-shadow-custom">
                        Track<span className="text-[var(--color-secondary)]"> & Treat</span>
                    </span>
                </div>

                {/* User Profile Section */}
                <div className="flex items-center gap-3 p-2 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]">
                    {profile.photoUrl ? (
                        <img src={profile.photoUrl} alt="User" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                        <DefaultAvatarIcon className="w-12 h-12 rounded-full" />
                    )}
                    <div>
                        <p className="font-bold text-[var(--color-text-primary)] break-all">{profile.name || 'Welcome!'}</p>
                    </div>
                </div>

                <div className="w-full pt-2">
                    <label htmlFor="language-select" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">{strings.languageLabel}</label>
                    <select id="language-select" value={language} onChange={handleLanguageChange} className="w-full p-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-card)] text-[var(--color-text-primary)]">
                        <option value="en">English</option>
                        <option value="hi">हिन्दी (Hindi)</option>
                        <option value="gu">ગુજરાતી (Gujarati)</option>
                    </select>
                </div>
                
                <div className="flex-1 space-y-2 pt-2">
                    {navItems.map(item => {
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavItemClick(item.id)}
                                className={`nav-item flex items-center p-3 rounded-xl transition-all duration-300 w-full ${
                                    isActive
                                        ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30'
                                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)]'
                                }`}
                            >
                                {item.icon}
                                <span className="font-medium">{strings[item.labelKey]}</span>
                            </button>
                        );
                    })}
                </div>


                <div className="pt-2">
                    <button
                        onClick={handleFeedbackClick}
                        className="nav-item flex items-center p-3 rounded-xl transition-all duration-300 text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)] w-full"
                    >
                        <MessageSquareIcon />
                        <span className="font-medium">{strings.navFeedback}</span>
                    </button>
                </div>
            </nav>
            <FeedbackModal 
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
            />
        </>
    );
};

export default Sidebar;
