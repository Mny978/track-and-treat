
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    borderColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, borderColor }) => {
    return (
        <div className={`bg-[var(--color-card)] p-6 rounded-2xl shadow-xl border-t-4`} style={{ borderColor }}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">{title}</span>
                {icon}
            </div>
            <p className="text-3xl font-bold mt-2 text-[var(--color-text-primary)]">{value}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{subtitle}</p>
        </div>
    );
};

export default StatCard;
