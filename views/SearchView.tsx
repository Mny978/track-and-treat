
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { performGroundedSearch } from '../services/geminiService';
import type { GroundedSearchResult } from '../types';
import Spinner from '../components/common/Spinner';
import { LoaderIcon } from '../components/common/icons';

const SearchView: React.FC = () => {
    const { strings } = useAppContext();
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GroundedSearchResult | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setResult(null);
        const searchResult = await performGroundedSearch(query);
        setResult(searchResult);
        setIsLoading(false);
    };

    return (
        <section>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">{strings.searchMainHeader}</h2>
            <div className="bg-[var(--color-card)] p-6 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold text-[var(--color-primary)] mb-3">{strings.searchMainHeader}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">{strings.searchInstructions}</p>
                <textarea
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    rows={3}
                    placeholder={strings.searchInputPlaceholder}
                    className="w-full p-3 border border-[var(--color-border)] rounded-lg focus:border-[var(--color-primary)] mb-3 bg-transparent focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                <button
                    onClick={handleSearch}
                    disabled={!query.trim() || isLoading}
                    className="w-full py-2 bg-[var(--color-accent)] text-white font-semibold rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-300 shadow-md disabled:opacity-50 flex justify-center items-center"
                >
                    {isLoading ? <LoaderIcon /> : null} {isLoading ? "Searching..." : strings.btnSearch}
                </button>
                
                <div className="mt-6 p-4 bg-[var(--color-background)] rounded-lg min-h-[200px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full pt-8">
                            <Spinner />
                        </div>
                    ) : result ? (
                        <div>
                            <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{strings.searchResultsTitle}</h4>
                            <div className="prose prose-sm max-w-none text-[var(--color-text-primary)] mb-6" dangerouslySetInnerHTML={{ __html: result.text.replace(/\n/g, '<br />') }} />

                            {result.sources && result.sources.length > 0 && (
                                <>
                                    <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 border-t border-[var(--color-border)] pt-4">{strings.sourcesTitle}</h4>
                                    <ul className="list-disc list-inside space-y-2">
                                        {result.sources.map((source, index) => (
                                            <li key={index} className="text-sm">
                                                <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                                                    {source.web.title || source.web.uri}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    ) : (
                        <p className="text-[var(--color-text-secondary)] text-sm text-center pt-8">{strings.searchInitialPrompt}</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SearchView;