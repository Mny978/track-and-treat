
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { generateDetailedPlan } from '../services/geminiService';
import Spinner from '../components/common/Spinner';
import { SparklesIcon, LoaderIcon } from '../components/common/icons';

const PlanView: React.FC = () => {
    const { profile, strings } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [planOutput, setPlanOutput] = useState('');

    const handleGeneratePlan = async () => {
        if (!profile.assessment?.target) return;
        setIsLoading(true);
        setPlanOutput('');
        const result = await generateDetailedPlan(profile);
        setPlanOutput(result);
        setIsLoading(false);
    };

    const isProfileComplete = !!profile.assessment?.target;

    return (
        <section>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2 sm:mb-0">{strings.planHeader}</h2>
                <button 
                    onClick={handleGeneratePlan} 
                    disabled={!isProfileComplete || isLoading}
                    className="flex items-center px-4 py-2 bg-[var(--color-secondary)] text-white font-semibold rounded-xl hover:bg-[var(--color-secondary-hover)] transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <LoaderIcon /> : <SparklesIcon />}
                    {isLoading ? 'Generating...' : strings.btnGeneratePlan}
                </button>
            </div>

            {!isProfileComplete && !planOutput && !isLoading && (
                <div className="bg-[var(--color-card)] p-6 rounded-2xl shadow-xl">
                    <p className="text-[var(--color-text-secondary)] text-lg p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-[var(--color-secondary)]">
                        {strings.planInitialPrompt}
                    </p>
                </div>
            )}

            {(isLoading || planOutput) && (
                <div className="mt-6">
                    {isLoading ? (
                         <div className="flex flex-col items-center justify-center p-8 text-center text-[var(--color-text-secondary)] bg-[var(--color-background)] rounded-xl shadow-inner">
                            <Spinner />
                            <p className="text-xl font-semibold mt-4 mb-2">Creating your hyper-personalized 3-Day Plan...</p>
                            <p>This may take up to 30 seconds.</p>
                        </div>
                    ) : (
                        <div className="p-6 bg-teal-50 dark:bg-teal-900/20 rounded-xl border-t-4 border-[var(--color-primary)] shadow-xl">
                            <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-200 mb-4 flex items-center">AI Generated Plan Complete</h3>
                            <div className="prose" dangerouslySetInnerHTML={{ __html: planOutput.replace(/\n/g, '<br />').replace(/### (.*?)<br \/>/g, '<h3>$1</h3>') }} />
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default PlanView;