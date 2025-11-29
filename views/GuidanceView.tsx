
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { getNutritionalGuidance } from '../services/geminiService';
import Spinner from '../components/common/Spinner';
import { LoaderIcon } from '../components/common/icons';

type GuidanceType = 'nutrients_and_avoid' | 'food_sources' | 'interactions';

const GuidanceView: React.FC = () => {
    const { strings } = useAppContext();
    const [guidanceInput, setGuidanceInput] = useState('');
    const [loadingType, setLoadingType] = useState<GuidanceType | null>(null);
    const [guidanceResult, setGuidanceResult] = useState('');
    const [resultType, setResultType] = useState<GuidanceType | null>(null);

    const handleGetGuidance = async (type: GuidanceType) => {
        if (!guidanceInput.trim()) return;
        setLoadingType(type);
        setGuidanceResult('');
        const result = await getNutritionalGuidance(guidanceInput, type);
        setGuidanceResult(result);
        setResultType(type);
        setLoadingType(null);
    };
    
    const getBorderColor = () => {
        switch (resultType) {
            case 'nutrients_and_avoid': return 'var(--color-accent)';
            case 'food_sources': return 'var(--color-secondary)';
            case 'interactions': return '#ef4444'; // red-500
            default: return 'transparent';
        }
    };

    return (
        <section>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">{strings.guidanceMainHeader}</h2>
            <div className="bg-[var(--color-card)] p-6 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold text-[var(--color-primary)] mb-3 flex items-center">{strings.guidanceFindHeader}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">{strings.guidanceInstructions}</p>
                <textarea 
                    value={guidanceInput}
                    onChange={e => setGuidanceInput(e.target.value)}
                    rows={3} 
                    placeholder={strings.guidanceInputPlaceholder} 
                    className="w-full p-3 border border-[var(--color-border)] rounded-lg focus:border-[var(--color-primary)] mb-3 bg-transparent focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button onClick={() => handleGetGuidance('nutrients_and_avoid')} disabled={!guidanceInput.trim() || !!loadingType} className="w-full py-2 bg-[var(--color-accent)] text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-md disabled:opacity-50 flex items-center justify-center">
                        {loadingType === 'nutrients_and_avoid' ? <LoaderIcon/> : strings.btnNutrientsAvoid}
                    </button>
                    <button onClick={() => handleGetGuidance('food_sources')} disabled={!guidanceInput.trim() || !!loadingType} className="w-full py-2 bg-[var(--color-secondary)] text-white font-semibold rounded-xl hover:bg-[var(--color-secondary-hover)] transition-all duration-300 shadow-md disabled:opacity-50 flex items-center justify-center">
                        {loadingType === 'food_sources' ? <LoaderIcon/> : strings.btnFoodSources}
                    </button>
                    <button onClick={() => handleGetGuidance('interactions')} disabled={!guidanceInput.trim() || !!loadingType} className="w-full py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300 shadow-md disabled:opacity-50 flex items-center justify-center">
                        {loadingType === 'interactions' ? <LoaderIcon/> : strings.btnInteractions}
                    </button>
                </div>

                <div className="mt-6 p-4 bg-[var(--color-background)] rounded-lg min-h-[150px]">
                    {loadingType ? (
                        <div className="flex justify-center items-center h-full pt-8">
                            <Spinner />
                        </div>
                    ) : (
                        guidanceResult ? (
                            <div style={{ borderLeftColor: getBorderColor() }} className="p-4 bg-[var(--color-card)] rounded-lg border-l-4 shadow-md space-y-2">
                                <div className="prose" dangerouslySetInnerHTML={{ __html: guidanceResult.replace(/### (.*?)\n/g, '<h3 class="font-bold text-md mb-1 mt-3">$1</h3>').replace(/\n/g, '<br />') }}></div>
                            </div>
                        ) : (
                            <p className="text-[var(--color-text-secondary)] text-sm text-center pt-8">{strings.guidanceOutputInitial}</p>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};

export default GuidanceView;
