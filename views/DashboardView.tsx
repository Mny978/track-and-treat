
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import StatCard from '../components/common/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ScaleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[var(--color-primary)]"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>;
const ZapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[var(--color-secondary)]"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const DropletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[var(--color-accent)]"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>;
const AwardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-pink-500 dark:text-pink-400"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>;


const DashboardView: React.FC = () => {
    const { profile, tracking, strings } = useAppContext();
    const { assessment } = profile;

    const getDailyTip = () => {
        const { goal, medicalConditions, assessment } = profile;
        if (!assessment || !assessment.bmi) return strings.dashTipInitial;

        if (medicalConditions?.toLowerCase().includes('diabetes')) {
            return 'For **Diabetes**, focus on complex carbs like millets and ensure every meal includes protein and fiber to stabilize blood glucose.';
        }
        if (medicalConditions?.toLowerCase().includes('pcos')) {
            return 'For **PCOS**, prioritize a high-protein breakfast and healthy fats (nuts, seeds) to improve insulin sensitivity.';
        }
        if (goal === 'Weight Loss') {
            return 'For **Weight Loss**, drink 1-2 glasses of water before meals to aid satiety and prioritize green vegetables.';
        }
        if (assessment.bmi < 18.5) {
            return 'You are **Underweight**. Focus on calorie-dense, nutrient-rich foods like nuts, seeds, and healthy oils in every meal.';
        }
        return 'For **Health Maintenance**, aim for 30 minutes of moderate activity today and include at least one seasonal fruit.';
    };

    const generateHypotheticalWeightData = (startWeight: number) => {
        const data = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const weight = startWeight - (6 - i) * 0.15 + (Math.random() - 0.5) * 0.2;
            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                weight: parseFloat(weight.toFixed(1)),
            });
        }
        return data;
    };

    const weightData = generateHypotheticalWeightData(profile.weight || 75);

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">{strings.dashSnapshotHeader}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title={strings.dashBMI}
                    value={assessment?.bmi?.toString() || '--'}
                    subtitle={assessment?.bmi ? `${assessment.bmiStatus}` : strings.dashBMICalc}
                    icon={<ScaleIcon />}
                    borderColor="var(--color-primary)"
                />
                <StatCard 
                    title={strings.dashTarget}
                    value={assessment?.target ? `${assessment.target} kcal` : '-- kcal'}
                    subtitle={strings.dashBaseGoal}
                    icon={<ZapIcon />}
                    borderColor="var(--color-secondary)"
                />
                <StatCard 
                    title={strings.dashWater}
                    value={`${(tracking.waterIntake / 1000).toFixed(1)} L`}
                    subtitle={strings.dashWaterGoal}
                    icon={<DropletIcon />}
                    borderColor="var(--color-accent)"
                />
                 <StatCard 
                    title={strings.dashStreak}
                    value="0 Days"
                    subtitle={strings.dashKeepUp}
                    icon={<AwardIcon />}
                    borderColor="#ec4899" // Pink-500
                />
            </div>
            
            <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-2xl border border-teal-200 dark:border-teal-800">
                <h3 className="text-xl font-bold text-[var(--color-primary)] mb-3">{strings.dashTipHeader}</h3>
                <p className="text-[var(--color-text-primary)]" dangerouslySetInnerHTML={{ __html: getDailyTip().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
            </div>

            <div className="bg-[var(--color-card)] p-6 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">{strings.dashProgressHeader}</h3>
                <div className="h-64 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={weightData}
                            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis dataKey="date" stroke="var(--color-text-secondary)" fontSize={12} />
                            <YAxis
                                stroke="var(--color-text-secondary)"
                                fontSize={12}
                                domain={['dataMin - 1', 'dataMax + 1']}
                                label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', fill: 'var(--color-text-secondary)', dx: -10 }}
                             />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-card)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                }}
                                labelStyle={{ fontWeight: 'bold', color: 'var(--color-primary)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="var(--color-primary)"
                                strokeWidth={3}
                                activeDot={{ r: 8, fill: 'var(--color-primary)' }}
                                dot={{ stroke: 'var(--color-primary)', strokeWidth: 2, r: 4, fill: 'var(--color-card)' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
};

export default DashboardView;