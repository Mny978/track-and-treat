

import React from 'react';

const iconProps = {
    className: "w-5 h-5 mr-3",
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round" as "round",
    strokeLinejoin: "round" as "round",
};

export const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
export const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
export const ChefHatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path d="M19 14v3.129a3 3 0 0 1-1.205 2.454L15 21l-2.83-1.415a3 3 0 0 1-1.04-4.996L12 14" /><path d="M19 14V5a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v9" /><path d="M12 14V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v9" /><path d="M6 14V5a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v9" /><path d="M3 14v3.129a3 3 0 0 0 1.205 2.454L7 21l2.83-1.415a3 3 0 0 0 1.04-4.996L10 14" /></svg>;
export const ActivityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
export const UtensilsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z" /></svg>;
export const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>;
export const GraduationCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.084a1 1 0 0 0 0 1.838l8.57 3.908a2 2 0 0 0 1.66 0z" /><path d="M22 10v6" /><path d="M6 12v5c0 3 2.5 5 5 5s5-2 5-5v-5" /></svg>;
export const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
export const MessageSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...iconProps}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
// FIX: Add BotMessageSquareIconClean icon for the chat view.
export const BotMessageSquareIconClean = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-600"><path d="M12 6V2H8"/><path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z"/><path d="M2 12h2"/><path d="M9 12h2"/><path d="M15 12h2"/><path d="M16 6h-4"/><path d="M16 2v4"/></svg>;
export const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
export const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
export const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>;

export const DefaultAvatarIcon = ({ className }: { className?: string }) => (
    <div className={className}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="50" cy="50" r="50" fill="#E5E7EB"/>
            <path d="M50 62.5C60.3553 62.5 68.75 54.1053 68.75 43.75C68.75 33.3947 60.3553 25 50 25C39.6447 25 31.25 33.3947 31.25 43.75C31.25 54.1053 39.6447 62.5 50 62.5Z" fill="#9CA3AF"/>
            <path d="M75 87.5C75 74.0278 63.8071 62.5 50 62.5C36.1929 62.5 25 74.0278 25 87.5H75Z" fill="#9CA3AF"/>
        </svg>
    </div>
);


const smallIconProps = {
  className: "w-4 h-4 mr-2",
  strokeWidth: "2",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as "round",
  strokeLinejoin: "round" as "round",
};
export const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...smallIconProps}><path d="m12 3-1.9 4.2-4.2 1.9 4.2 1.9L12 21l1.9-4.2 4.2-1.9-4.2-1.9L12 3z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>;
export const LoaderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...smallIconProps} className="w-4 h-4 mr-2 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>;
export const BrainCircuitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...smallIconProps}><path d="M12 5a3 3 0 1 0-5.993.25" /><path d="M18 13a3 3 0 1 0-3 2.83" /><path d="M6 13a3 3 0 1 0-3 2.83" /><path d="M18.12 8A3 3 0 1 0 15 5.17" /><path d="M12 12a3 3 0 1 0 5.993-.25" /><path d="M14.68 18.32A3 3 0 1 0 12 21.15" /><path d="M6.01 5.25A3 3 0 1 0 9 8" /><path d="m6.25 15.75 2.5-1.5" /><path d="M14.9 15.58 12.4 14" /><path d="m9.25 10-2.5-1.5" /><path d="m12.25 7-2.5-1.5" /><path d="m15.1 10-2.6-1.5" /><path d="m15.1 15.5-2.6 1.5" /><path d="M9.08 18.07A3 3 0 1 0 6 21.15" /></svg>;

export const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>;