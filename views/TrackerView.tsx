
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { analyzeMealLog } from '../services/geminiService';
import { BrainCircuitIcon, LoaderIcon } from '../components/common/icons';
import RemindersCard from '../components/RemindersCard';
import type { Reminder } from '../types';

const REMINDERS_STORAGE_KEY = 'trackandtreat-reminders';

const TrackerView: React.FC = () => {
    const { profile, tracking, setTracking, strings } = useAppContext();
    const [newMealEntry, setNewMealEntry] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [showReminders, setShowReminders] = useState(false);

    useEffect(() => {
        try {
            const storedReminders = localStorage.getItem(REMINDERS_STORAGE_KEY);
            if (storedReminders) {
                setReminders(JSON.parse(storedReminders));
            }
        } catch (error) {
            console.error("Failed to load reminders from localStorage", error);
        }
    }, []);
    
    useEffect(() => {
        setAnalysisResult('');
    }, [tracking.mealLog]);


    const updateReminders = (updatedReminders: Reminder[]) => {
        setReminders(updatedReminders);
        try {
            localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updatedReminders));
        } catch (error) {
            console.error("Failed to save reminders to localStorage", error);
        }
    };

    const addReminder = (time: string, type: 'Meal' | 'Water') => {
        const newReminder: Reminder = { id: crypto.randomUUID(), time, type };
        const updated = [...reminders, newReminder].sort((a, b) => a.time.localeCompare(b.time));
        updateReminders(updated);
    };

    const deleteReminder = (id: string) => {
        const updated = reminders.filter(r => r.id !== id);
        updateReminders(updated);
    };

    const handleLogMeal = () => {
        if (!newMealEntry.trim()) return;
        const newLog = {
            id: crypto.randomUUID(),
            text: newMealEntry,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            kcal: Math.floor(Math.random() * (500 - 200 + 1) + 200), // Mock calories
        };
        setTracking(prev => ({ ...prev, mealLog: [newLog, ...prev.mealLog] }));
        setNewMealEntry('');
    };

    const handleRemoveMeal = (id: string) => {
        setTracking(prev => ({ ...prev, mealLog: prev.mealLog.filter(meal => meal.id !== id) }));
    };

    const handleAddWater = (ml: number) => {
        setTracking(prev => ({ ...prev, waterIntake: prev.waterIntake + ml }));
    };
    
    const handleAddServing = () => {
        setTracking(prev => ({ ...prev, fruitVegServings: Math.min(5, prev.fruitVegServings + 1) }));
    };
    
    const handleAnalyzeLog = async () => {
        if(tracking.mealLog.length === 0) return;
        setIsAnalyzing(true);
        setAnalysisResult('');
        const result = await analyzeMealLog(tracking.mealLog, profile);
        setAnalysisResult(result);
        setIsAnalyzing(false);
    }

    const waterGoal = 3500;
    const waterProgress = Math.min(100, (tracking.waterIntake / waterGoal) * 100);

    return (
        <section>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">{strings.trackerHeader}</h2>
            <div className="bg-[var(--color-card)] p-6 rounded-2xl shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{strings.logHeader}</h3>
                        <button onClick={handleAnalyzeLog} disabled={isAnalyzing || tracking.mealLog.length === 0} className="flex items-center text-sm px-3 py-1 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition-all duration-300 shadow-md disabled:opacity-50">
                             {isAnalyzing ? <LoaderIcon /> : <BrainCircuitIcon />} {isAnalyzing ? "Analyzing..." : strings.btnAnalyzeLog}
                        </button>
                    </div>

                    {analysisResult && (
                        <div className="p-3 mb-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                            <p className="font-semibold text-pink-700 dark:text-pink-300">{strings.logAnalysisTitle}</p>
                            <p className="text-sm text-pink-600 dark:text-pink-400 mt-1">{analysisResult}</p>
                        </div>
                    )}

                    <div className="space-y-3 custom-scroll max-h-96 overflow-y-auto pr-2">
                        {tracking.mealLog.length > 0 ? tracking.mealLog.map(log => (
                            <div key={log.id} className="flex items-center justify-between p-3 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
                                <div>
                                    <p className="font-medium text-[var(--color-text-primary)]">{log.text}</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">{log.time} | ~ {log.kcal} kcal</p>
                                </div>
                                <button onClick={() => handleRemoveMeal(log.id)} className="text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                </button>
                            </div>
                        )) : <p className="text-center text-[var(--color-text-secondary)] p-4">{strings.logEmpty}</p>}
                    </div>
                    <div className="mt-4">
                        <textarea value={newMealEntry} onChange={e => setNewMealEntry(e.target.value)} placeholder={strings.logInputPlaceholder} className="w-full p-3 border border-[var(--color-border)] rounded-lg focus:border-[var(--color-primary)] bg-transparent focus:ring-1 focus:ring-[var(--color-primary)]" />
                        <button onClick={handleLogMeal} className="mt-2 w-full py-2 bg-[var(--color-secondary)] text-white font-semibold rounded-xl hover:bg-[var(--color-secondary-hover)] transition-all duration-300">{strings.logBtn}</button>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 flex items-center">{strings.waterHeader}</h3>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{strings.waterGoal}</p>
                        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3 mt-2"><div className="bg-[var(--color-accent)] h-3 rounded-full" style={{ width: `${waterProgress}%` }}></div></div>
                        <button onClick={() => handleAddWater(250)} className="mt-3 text-sm px-3 py-1 bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-opacity">{strings.btnAddWater}</button>
                    </div>
                    <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-xl">
                        <h3 className="text-lg font-bold text-green-800 dark:text-green-200 flex items-center">{strings.servingsHeader}</h3>
                        <p className="text-3xl font-bold mt-2 text-center text-green-900 dark:text-green-100">{tracking.fruitVegServings} / 5</p>
                        <button onClick={handleAddServing} className="mt-3 text-sm px-3 py-1 bg-green-500 text-white rounded-lg hover:opacity-90 transition-opacity">{strings.btnAddServing}</button>
                    </div>
                    <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-xl">
                        <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200 flex items-center">{strings.reminderHeader}</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">{strings.reminderText}</p>
                        <button onClick={() => setShowReminders(!showReminders)} className="mt-3 text-sm px-3 py-1 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity">
                            {showReminders ? strings.btnHideReminders : strings.btnSetReminder}
                        </button>
                    </div>
                    {showReminders && (
                        <RemindersCard 
                            reminders={reminders}
                            onAddReminder={addReminder}
                            onDeleteReminder={deleteReminder}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default TrackerView;