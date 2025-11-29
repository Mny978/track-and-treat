
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { generateRecipesByCondition, generateRecipesByIngredient } from '../services/geminiService';
import Spinner from '../components/common/Spinner';
import { LoaderIcon } from '../components/common/icons';

const RecipeCard: React.FC<{ content: string; borderColor: string }> = ({ content, borderColor }) => {
    const lines = content.trim().split('\n');
    const title = lines.shift()?.replace(/^[#\s]+/, '') || 'Untitled Recipe';
    const body = lines.join('\n').trim();

    const sections: { [key: string]: string[] } = {};
    const parts = body.split(/^(##\s.*)$/m);

    for (let i = 1; i < parts.length; i += 2) {
        const header = parts[i].replace('## ', '').trim();
        const sectionContent = parts[i + 1]?.trim().split('\n').filter(line => line.trim() !== '');
        if (header && sectionContent) {
            sections[header] = sectionContent;
        }
    }
    
    const ingredients = sections['Ingredients'] || [];
    const method = sections['Method'] || [];
    const note = sections['Health Note'] || sections["Chef's Note"] || [];
    const noteTitle = sections['Health Note'] ? "Health Note" : "Chef's Note";

    return (
        <div 
            className="p-5 mb-4 bg-[var(--color-card)] rounded-xl border-l-4 shadow-lg transition-shadow hover:shadow-xl" 
            style={{ borderLeftColor: borderColor }}
        >
            <h4 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">{title}</h4>
            
            {ingredients.length > 0 && (
                <div className="mb-4">
                    <h5 className="font-bold text-[var(--color-text-primary)] mb-2">Ingredients</h5>
                    <ul className="list-disc list-inside space-y-1 text-[var(--color-text-secondary)] text-sm pl-2">
                        {ingredients.map((item, index) => (
                            <li key={index}>{item.replace(/[-*]\s*/, '')}</li>
                        ))}
                    </ul>
                </div>
            )}

            {method.length > 0 && (
                <div className="mb-4">
                    <h5 className="font-bold text-[var(--color-text-primary)] mb-2">Method</h5>
                    <ol className="list-decimal list-inside space-y-2 text-[var(--color-text-secondary)] text-sm pl-2">
                        {method.map((item, index) => (
                             <li key={index} className="pl-1">{item.replace(/^\d+\.\s*/, '')}</li>
                        ))}
                    </ol>
                </div>
            )}
            
            {note.length > 0 && (
                 <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                    <h5 className="font-bold text-[var(--color-text-primary)] mb-2">{noteTitle}</h5>
                    <p className="text-sm text-[var(--color-text-secondary)] italic">{note.join(' ')}</p>
                </div>
            )}
        </div>
    );
};


const RecipesView: React.FC = () => {
    const { profile, strings } = useAppContext();
    const [ingredient, setIngredient] = useState('');
    const [diagLoading, setDiagLoading] = useState(false);
    const [ingrLoading, setIngrLoading] = useState(false);
    const [diagResults, setDiagResults] = useState<string[]>([]);
    const [ingrResults, setIngrResults] = useState<string[]>([]);

    const condition = profile.medicalConditions || 'None';
    const isConditionSet = condition && condition.toLowerCase() !== 'none' && condition.trim() !== '';

    const handleGenerateDiagRecipes = async () => {
        if (!isConditionSet) return;
        setDiagLoading(true);
        setDiagResults([]);
        const result = await generateRecipesByCondition(condition);
        setDiagResults(result.split('### ').filter(p => p.trim()));
        setDiagLoading(false);
    };

    const handleGenerateIngrRecipes = async () => {
        if (!ingredient.trim()) return;
        setIngrLoading(true);
        setIngrResults([]);
        const result = await generateRecipesByIngredient(ingredient);
        setIngrResults(result.split('### ').filter(p => p.trim()));
        setIngrLoading(false);
    };

    return (
        <section>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">{strings.recipesMainHeader}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Part 1: Recipes by Diagnosis */}
                <div className="bg-[var(--color-card)] p-6 rounded-2xl shadow-xl flex flex-col">
                    <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-4 flex items-center">{strings.recipeDiagHeader}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-3">{strings.recipeDiagStatus} (<span className="font-semibold">{condition}</span>).</p>
                    <button onClick={handleGenerateDiagRecipes} disabled={!isConditionSet || diagLoading} className="w-full py-2 bg-[var(--color-secondary)] text-white font-semibold rounded-xl hover:bg-[var(--color-secondary-hover)] transition-all duration-300 shadow-md disabled:opacity-50 flex items-center justify-center">
                        {diagLoading && <LoaderIcon />} {diagLoading ? "Generating..." : strings.btnGenerateDiag}
                    </button>
                    <div className="mt-4 flex-1 custom-scroll overflow-y-auto pr-2">
                        {diagLoading && <div className="flex justify-center p-4"><Spinner /></div>}
                        {diagResults.length > 0 && diagResults.map((recipe, index) => (
                            <RecipeCard key={`diag-${index}`} content={recipe} borderColor="var(--color-secondary)" />
                        ))}
                    </div>
                </div>

                {/* Part 2: Recipes by Ingredient */}
                <div className="bg-[var(--color-card)] p-6 rounded-2xl shadow-xl flex flex-col">
                    <h3 className="text-xl font-bold text-[var(--color-accent)] mb-4 flex items-center">{strings.recipeIngrHeader}</h3>
                    <textarea value={ingredient} onChange={e => setIngredient(e.target.value)} placeholder={strings.ingrInputPlaceholder} className="w-full p-3 border border-[var(--color-border)] rounded-lg focus:border-[var(--color-accent)] bg-transparent mb-3 focus:ring-1 focus:ring-[var(--color-accent)]" />
                    <button onClick={handleGenerateIngrRecipes} disabled={!ingredient.trim() || ingrLoading} className="w-full py-2 bg-[var(--color-accent)] text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-md disabled:opacity-50 flex items-center justify-center">
                        {ingrLoading && <LoaderIcon />} {ingrLoading ? "Generating..." : strings.btnSuggestRecipes}
                    </button>
                    <div className="mt-4 flex-1 custom-scroll overflow-y-auto pr-2">
                        {ingrLoading && <div className="flex justify-center p-4"><Spinner /></div>}
                        {ingrResults.length > 0 && ingrResults.map((recipe, index) => (
                            <RecipeCard key={`ingr-${index}`} content={recipe} borderColor="var(--color-accent)" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecipesView;
