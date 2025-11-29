
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import type { Reminder } from '../types';

interface RemindersCardProps {
    reminders: Reminder[];
    onAddReminder: (time: string, type: 'Meal' | 'Water') => void;
    onDeleteReminder: (id: string) => void;
}

const RemindersCard: React.FC<RemindersCardProps> = ({ reminders, onAddReminder, onDeleteReminder }) => {
    const { strings } = useAppContext();
    const [time, setTime] = useState('09:00');
    const [type, setType] = useState<'Meal' | 'Water'>('Meal');

    const handleAddClick = () => {
        if (time) {
            onAddReminder(time, type);
            // Reset form for better UX
            setTime('09:00');
            setType('Meal');
        }
    };

    return (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <h4 className="text-md font-bold text-amber-900 dark:text-amber-200 mb-3">{strings.newReminder}</h4>
            <div className="flex items-center gap-2 mb-3">
                <div className="flex-1">
                    <label htmlFor="reminder-time" className="text-xs text-amber-800 dark:text-amber-300">{strings.reminderTime}</label>
                    <input 
                        id="reminder-time"
                        type="time" 
                        value={time} 
                        onChange={(e) => setTime(e.target.value)} 
                        className="w-full p-1 border border-amber-300 dark:border-amber-700 rounded-md bg-transparent"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="reminder-type" className="text-xs text-amber-800 dark:text-amber-300">{strings.reminderType}</label>
                    <select 
                        id="reminder-type"
                        value={type} 
                        onChange={(e) => setType(e.target.value as 'Meal' | 'Water')}
                        className="w-full p-1 border border-amber-300 dark:border-amber-700 rounded-md bg-[var(--color-card)]"
                    >
                        <option value="Meal">{strings.reminderMeal}</option>
                        <option value="Water">{strings.reminderWater}</option>
                    </select>
                </div>
            </div>
            <button onClick={handleAddClick} className="w-full py-1 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">{strings.btnAddReminder}</button>
        
            <div className="mt-4 pt-3 border-t border-amber-200 dark:border-amber-800">
                {reminders.length > 0 ? (
                    <ul className="space-y-2">
                        {reminders.map(reminder => (
                            <li key={reminder.id} className="flex justify-between items-center text-sm p-2 bg-amber-100 dark:bg-amber-900/30 rounded-md">
                                <span className="font-semibold text-amber-900 dark:text-amber-200">{reminder.time} - {reminder.type === 'Meal' ? strings.reminderMeal : strings.reminderWater}</span>
                                <button onClick={() => onDeleteReminder(reminder.id)} className="text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18 18 6M6 6l12 12"/></svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-xs text-center text-amber-700 dark:text-amber-400">{strings.noRemindersSet}</p>
                )}
            </div>
        </div>
    );
};

export default RemindersCard;
