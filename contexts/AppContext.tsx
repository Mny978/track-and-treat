import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Profile, TrackingState, Language, Assessment } from '../types';
import { appStrings } from '../constants/localization';

const PROFILE_STORAGE_KEY = 'trackandtreat-profile';

const initialProfile: Profile = {
    name: '',
    age: null,
    gender: 'Male',
    weight: null,
    height: null,
    activity: 'Sedentary',
    dietaryPreference: 'Veg',
    goal: 'Weight Loss',
    medicalConditions: '',
    allergies: '',
    likesDislikes: '',
    photoUrl: null,
    assessment: {
        bmi: null,
        tdee: null,
        target: null,
        bmiStatus: 'Enter details to calculate.',
    },
    proteinGoal: null,
    carbGoal: null,
    fatGoal: null,
};

const initialTracking: TrackingState = {
    waterIntake: 0,
    fruitVegServings: 0,
    mealLog: [],
};

interface AppContextType {
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
    tracking: TrackingState;
    setTracking: React.Dispatch<React.SetStateAction<TrackingState>>;
    language: Language;
    setLanguage: (lang: Language) => void;
    strings: typeof appStrings.en;
    calculateAssessment: (profileData: Profile) => Assessment;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<Profile>(() => {
        try {
            const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
            if (storedProfile) {
                const parsed = JSON.parse(storedProfile);
                // Basic validation to avoid corrupted state
                if (parsed && typeof parsed === 'object' && 'name' in parsed) {
                    return parsed;
                }
            }
        } catch (error) {
            console.error("Failed to load profile from localStorage", error);
        }
        return initialProfile;
    });
    
    const [tracking, setTracking] = useState<TrackingState>(initialTracking);
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        try {
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
        } catch (error) {
            console.error("Failed to save profile to localStorage", error);
        }
    }, [profile]);


    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        document.documentElement.lang = lang;
    };

    const strings = appStrings[language] || appStrings.en;

    const calculateAssessment = (profileData: Profile): Assessment => {
        const W = profileData.weight;
        const H = profileData.height;
        const A = profileData.age;
        const G = profileData.gender;
        const Act = profileData.activity;
        const Goal = profileData.goal;

        if (!W || !H || !A) return { bmi: null, tdee: null, target: null, bmiStatus: strings.dashBMICalc };

        const heightInMeters = H / 100;
        const bmi = parseFloat((W / (heightInMeters * heightInMeters)).toFixed(1));

        let bmr;
        if (G === 'Male') {
            bmr = 88.362 + (13.397 * W) + (4.799 * H) - (5.677 * A);
        } else {
            bmr = 447.593 + (9.247 * W) + (3.098 * H) - (4.330 * A);
        }

        const activityFactors = {
            Sedentary: 1.2, Light: 1.375, Moderate: 1.55, High: 1.725, Extreme: 1.9
        };
        const tdee = Math.round(bmr * (activityFactors[Act] || 1.2));

        let targetCalories = tdee;
        if (Goal === 'Weight Loss') targetCalories = tdee - 500;
        else if (Goal === 'Weight Gain') targetCalories = tdee + 500;
        else if (Goal === 'Muscle Gain') targetCalories = tdee + 300;

        let bmiStatus;
        if (bmi < 18.5) bmiStatus = 'Underweight';
        else if (bmi >= 18.5 && bmi < 23) bmiStatus = 'Healthy Weight';
        else if (bmi >= 23 && bmi < 25) bmiStatus = 'Overweight Risk';
        else bmiStatus = 'Obese';

        return { bmi, tdee, target: targetCalories, bmiStatus };
    }

    const value = {
        profile,
        setProfile,
        tracking,
        setTracking,
        language,
        setLanguage,
        strings,
        calculateAssessment,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
