
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import type { Profile } from '../types';
import { generateHealthSummary } from '../services/geminiService';
import { SparklesIcon, LoaderIcon, CameraIcon, DefaultAvatarIcon } from '../components/common/icons';
import Spinner from '../components/common/Spinner';

const ProfileView: React.FC = () => {
    const { profile, setProfile, strings, calculateAssessment } = useAppContext();
    const [formData, setFormData] = useState<Profile>(profile);
    const [statusMessage, setStatusMessage] = useState('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [aiSummary, setAiSummary] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync form data if profile from context changes (e.g., on initial load)
    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        // For number inputs, convert to number or null
        const isNumberField = ['age', 'weight', 'height', 'proteinGoal', 'carbGoal', 'fatGoal'].includes(id);
        const processedValue = isNumberField ? (value === '' ? null : parseFloat(value)) : value;
        setFormData(prev => ({ ...prev, [id]: processedValue }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const assessment = calculateAssessment(formData);
        const updatedProfile = { ...formData, assessment };
        setProfile(updatedProfile);
        setStatusMessage('Profile saved successfully! Assessment updated.');
        setAiSummary(''); // Clear previous summary on save
    };
    
    const handleGetAiSummary = async () => {
        if (!profile.assessment?.bmi) return;
        setIsSummaryLoading(true);
        setAiSummary('');
        const summary = await generateHealthSummary(profile.assessment);
        setAiSummary(summary);
        setIsSummaryLoading(false);
    }

    const { assessment, proteinGoal, carbGoal, fatGoal } = profile;
    const isAssessmentDone = !!assessment?.bmi;

    return (
        <section>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">{strings.profileHeader}</h2>
            <div className="bg-[var(--color-card)] p-6 rounded-2xl shadow-xl">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    
                    {/* Photo Upload Section */}
                    <div className="md:col-span-2 flex flex-col items-center gap-4 py-4 border-b border-[var(--color-border)]">
                         <div className="relative w-32 h-32">
                            {formData.photoUrl ? (
                                <img src={formData.photoUrl} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-gray-200 dark:border-slate-700" />
                            ) : (
                                <DefaultAvatarIcon className="w-full h-full rounded-full border-4 border-gray-200 dark:border-slate-700" />
                            )}
                            <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-1 right-1 bg-[var(--color-primary)] text-white p-2 rounded-full hover:bg-[var(--color-primary-hover)] transition-all shadow-md"
                                aria-label="Upload photo"
                            >
                                <CameraIcon />
                            </button>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handlePhotoChange} 
                            className="hidden" 
                            accept="image/png, image/jpeg, image/webp"
                        />
                    </div>

                    <div className="md:col-span-2"><h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2 border-b border-[var(--color-border)] pb-1">{strings.metricHeader}</h3></div>
                    
                    <div><label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-secondary)]">{strings.labelName}</label><input type="text" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-transparent border-[var(--color-border)] shadow-sm p-3 border focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]" /></div>
                    <div><label htmlFor="age" className="block text-sm font-medium text-[var(--color-text-secondary)]">{strings.labelAge}</label><input type="number" id="age" value={formData.age ?? ''} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-transparent border-[var(--color-border)] shadow-sm p-3 border focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]" /></div>
                    <div><label htmlFor="gender" className="block text-sm font-medium text-[var(--color-text-secondary)]">{strings.labelGender}</label><select id="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full rounded-md border-[var(--color-border)] shadow-sm p-3 border focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] bg-[var(--color-card)]"><option value="Male">{strings.genderMale}</option><option value="Female">{strings.genderFemale}</option><option value="Other">{strings.genderOther}</option></select></div>
                    <div><label htmlFor="weight" className="block text-sm font-medium text-[var(--color-text-secondary)]">{strings.labelWeight}</label><input type="number" step="0.1" id="weight" value={formData.weight ?? ''} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-transparent border-[var(--color-border)] shadow-sm p-3 border focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]" /></div>
                    <div><label htmlFor="height" className="block text-sm font-medium text-[var(--color-text-secondary)]">{strings.labelHeight}</label><input type="number" step="1" id="height" value={formData.height ?? ''} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-transparent border-[var(--color-border)] shadow-sm p-3 border focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]" /></div>
                    <div><label htmlFor="activity" className="block text-sm font-medium text-[var(--color-text-secondary)]">{strings.labelActivity}</label><select id="activity" value={formData.activity} onChange={handleChange} className="mt-1 block w-full rounded-md border-[var(--color-border)] shadow-sm p-3 border focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] bg-[var(--color-card)]">
                        <option value="Sedentary">{strings.activitySedentary}</option><option value="Light">{strings.activityLight}</option><option value="Moderate">{strings.activityModerate}</option><option value="High">{strings.activityHigh}</option><option value="Extreme">{strings.activityExtreme}</option>
                    </select></div>
                    <div><label htmlFor="dietaryPreference" className="block text-sm font-medium text-[var(--color-text-secondary)]">{strings.labelDiet}</label><select id="dietaryPreference" value={formData.dietaryPreference} onChange={handleChange} className="mt-1 block w-full rounded-md border-[var(--color-border)] shadow-sm p-3 border focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] bg-[var(--color-card)]">
                        <option value="Veg">{strings.dietVeg}</option><option value="Non-Veg">{strings.dietNonVeg}</option><option value="Vegan">{strings.dietVegan}</option><option value="Jain">{strings.dietJain}</option>
                    </select></div>
                    <div><label htmlFor="goal" className="block text-sm font-medium text-[var(--color-text-secondary)]">{strings.labelGoal}</label><select id="goal" value={formData.goal} onChange={handleChange} className="mt-1 block w-full rounded-md border-[var(--color-border)] shadow-sm p-3 border focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] bg-[var(--color-card)]">
                        <option value="Weight Loss">{strings.goalLoss}</option><option value="Weight Gain">{strings.goalGain}</option><option value="Maintenance">{strings.goalMaintain}</option><option value="Muscle Gain">{strings.goalMuscle}</option>
                    </select></div>

                    <div className="md:col-span-2 mt-4"><h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2 border-b border-[var(--color-border)] pb-1">{strings.medicalHeader}</h3></div>
                    <div className="md:col-span-2"><label htmlFor="medicalConditions" className="block text-sm font-medium text-[var(--color-text-secondary)]">{strings.labelCondition}</label><input type="text" id="medicalConditions" value={formData.medicalConditions} onChange={handleChange} placeholder="e.g., Type 2 Diabetes, Hypothyroidism, PCOS" className="mt-1 block w-full rounded-md bg-transparent border-[var(--color-border)] shadow-sm p-3 border focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]" /></div>
                    <div className="md:col-span-2"><label htmlFor="allergies" className="block text-sm font-medium text-[var(--color-text-secondary)]">{strings.labelAllergies}</label><input type="text" id="allergies" value={formData.allergies} onChange={handleChange} placeholder="e.g., Gluten, Dairy, Peanuts, Seafood" className="mt-1 block w-full rounded-md bg-transparent border-[var(--color-border)] shadow-sm p-3 border focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]" /></div>
                    <div className="md:col-span-2"><label htmlFor="likesDislikes" className="block text-sm font-medium text-[var(--color-text-secondary)]">{strings.labelDislikes}</label><input type="text" id="likesDislikes" value={formData.likesDislikes} onChange={handleChange} placeholder="e.g., Dislike okra, Love paneer and almonds" className="mt-1 block w-full rounded-md bg-transparent border-[var(--color-border)] shadow-sm p-3 border focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]" /></div>

                    <div className="md:col-span-2 mt-4"><h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2 border-b border-[var(--color-border)] pb-1">{strings.macroGoalsHeader}</h3></div>
                    <div><label htmlFor="proteinGoal" className="block text-sm font-medium text-[var(--color-text-secondary)]">{strings.labelProteinGoal}</label><input type="number" id="proteinGoal" value={formData.proteinGoal ?? ''} onChange={handleChange} className="mt-1 block w-full rounded-md bg-transparent border-[var(--color-border)] shadow-sm p-3 border focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]" /></div>
                    <div><label htmlFor="carbGoal" className="block text-sm font-medium text-[var(--color-text-secondary)]">{strings.labelCarbGoal}</label><input type="number" id="carbGoal" value={formData.carbGoal ?? ''} onChange={handleChange} className="mt-1 block w-full rounded-md bg-transparent border-[var(--color-border)] shadow-sm p-3 border focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]" /></div>
                    <div><label htmlFor="fatGoal" className="block text-sm font-medium text-[var(--color-text-secondary)]">{strings.labelFatGoal}</label><input type="number" id="fatGoal" value={formData.fatGoal ?? ''} onChange={handleChange} className="mt-1 block w-full rounded-md bg-transparent border-[var(--color-border)] shadow-sm p-3 border focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]" /></div>


                    <div className="md:col-span-2 pt-4">
                        <button type="submit" className="w-full py-3 px-4 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300 btn-primary-glow shadow-md shadow-[var(--color-primary)]/30">{strings.btnSaveProfile}</button>
                        {statusMessage && <p className="mt-2 text-center text-sm text-green-600">{statusMessage}</p>}
                        
                        <button type="button" onClick={handleGetAiSummary} disabled={!isAssessmentDone || isSummaryLoading} className="mt-4 w-full py-3 px-4 bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-all duration-300 shadow-md disabled:opacity-50 flex items-center justify-center">
                            {isSummaryLoading ? <LoaderIcon /> : <SparklesIcon />}
                            {isSummaryLoading ? "Generating..." : strings.btnAiSummary}
                        </button>
                    </div>
                </form>

                {isSummaryLoading && (
                     <div className="mt-6 flex justify-center"><Spinner /></div>
                )}
                {aiSummary && (
                    <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border-l-4 border-teal-500">
                        <h4 className="text-lg font-bold text-teal-700 dark:text-teal-300 mb-2">{strings.aiSummaryTitle}</h4>
                        <p className="text-[var(--color-text-primary)]">{aiSummary}</p>
                    </div>
                )}


                <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">{strings.assessmentHeader}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800"><p className="text-sm text-teal-600 dark:text-teal-300 font-medium">{strings.calcBMI}</p><p className="text-2xl font-bold text-teal-800 dark:text-teal-100">{assessment.bmi || '--'}</p></div>
                        <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800"><p className="text-sm text-teal-600 dark:text-teal-300 font-medium">{strings.calcBMIStatus}</p><p className="text-lg font-bold text-teal-800 dark:text-teal-100 mt-1">{assessment.bmiStatus || '--'}</p></div>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"><p className="text-sm text-blue-600 dark:text-blue-300 font-medium">{strings.calcTDEE}</p><p className="text-2xl font-bold text-blue-800 dark:text-blue-100">{assessment.tdee ? `${assessment.tdee} kcal` : '--'}</p></div>
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"><p className="text-sm text-amber-600 dark:text-amber-300 font-medium">{strings.calcReqCals}</p><p className="text-2xl font-bold text-amber-800 dark:text-amber-100">{assessment.target ? `${assessment.target} kcal` : '--'}</p></div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-200 dark:border-pink-800"><p className="text-sm text-pink-600 dark:text-pink-300 font-medium">{strings.calcProtein}</p><p className="text-2xl font-bold text-pink-800 dark:text-pink-100">{proteinGoal ? `${proteinGoal}g` : '--'}</p></div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"><p className="text-sm text-green-600 dark:text-green-300 font-medium">{strings.calcCarbs}</p><p className="text-2xl font-bold text-green-800 dark:text-green-100">{carbGoal ? `${carbGoal}g` : '--'}</p></div>
                        <div className="p-4 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-200 dark:border-sky-800"><p className="text-sm text-sky-600 dark:text-sky-300 font-medium">{strings.calcFat}</p><p className="text-2xl font-bold text-sky-800 dark:text-sky-100">{fatGoal ? `${fatGoal}g` : '--'}</p></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfileView;