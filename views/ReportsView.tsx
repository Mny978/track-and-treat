
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { analyzeMedicalReport } from '../services/geminiService';
import Spinner from '../components/common/Spinner';
import { LoaderIcon } from '../components/common/icons';

const ReportsView: React.FC = () => {
    const { strings } = useAppContext();
    const [reportInput, setReportInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');

    const handleAnalyzeReport = async () => {
        if (!reportInput.trim()) return;
        setIsLoading(true);
        setAnalysisResult('');
        const result = await analyzeMedicalReport(reportInput);
        setAnalysisResult(result);
        setIsLoading(false);
    };

    return (
        <section>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">{strings.reportsMainHeader}</h2>
            <div className="bg-[var(--color-card)] p-6 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold text-[var(--color-primary)] mb-3 flex items-center">{strings.reportsAnalyzeHeader}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">{strings.reportsInstructions}</p>
                <textarea 
                    value={reportInput} 
                    onChange={e => setReportInput(e.target.value)} 
                    rows={4} 
                    placeholder={strings.reportsInputPlaceholder} 
                    className="w-full p-3 border border-[var(--color-border)] rounded-lg focus:border-[var(--color-primary)] mb-3 bg-transparent focus:ring-1 focus:ring-[var(--color-primary)]" 
                />
                <button 
                    onClick={handleAnalyzeReport} 
                    disabled={!reportInput.trim() || isLoading} 
                    className="w-full py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300 shadow-md disabled:opacity-50 flex justify-center items-center"
                >
                    {isLoading && <LoaderIcon />} {isLoading ? "Analyzing..." : strings.btnInterpretReport}
                </button>
                <div className="mt-6 p-4 bg-[var(--color-background)] rounded-lg min-h-[100px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spinner />
                        </div>
                    ) : (
                        analysisResult && <div className="p-4 bg-red-100 dark:bg-red-900/20 text-[var(--color-text-primary)] rounded-lg border-l-4 border-red-500" dangerouslySetInnerHTML={{ __html: analysisResult.replace(/### (.*?)\n/g, '<h3 class="font-bold text-md mb-1 mt-3">$1</h3>').replace(/\n/g, '<br />') }}></div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ReportsView;
