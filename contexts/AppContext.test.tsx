

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

import { AppProvider, useAppContext } from './AppContext';
import type { Profile } from '../types';
import { appStrings } from '../constants/localization';

// A simple consumer component for testing context values
const TestConsumer: React.FC = () => {
    const { profile, language, setLanguage, strings } = useAppContext();
    return (
        <div>
            <div data-testid="name">{profile.name}</div>
            <div data-testid="language">{language}</div>
            <div data-testid="string">{strings.appTitle}</div>
            <button onClick={() => setLanguage('hi')}>Switch to Hindi</button>
        </div>
    );
};

describe('AppContext', () => {
    // Mock localStorage
    let storage: { [key: string]: string } = {};
    const localStorageMock = {
        getItem: (key: string) => storage[key] || null,
        setItem: (key: string, value: string) => {
            storage[key] = value;
        },
        clear: () => {
            storage = {};
        },
    };

    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    });

    afterEach(() => {
        localStorageMock.clear();
    });

    it('provides initial state correctly', () => {
        render(
            <AppProvider>
                <TestConsumer />
            </AppProvider>
        );
        expect(screen.getByTestId('name')).toHaveTextContent('');
        expect(screen.getByTestId('language')).toHaveTextContent('en');
        expect(screen.getByTestId('string')).toHaveTextContent('Track and Treat - Personalized Dietetics');
    });

    it('updates language and strings when setLanguage is called', () => {
        render(
            <AppProvider>
                <TestConsumer />
            </AppProvider>
        );

        act(() => {
            screen.getByText('Switch to Hindi').click();
        });

        expect(screen.getByTestId('language')).toHaveTextContent('hi');
        expect(screen.getByTestId('string')).toHaveTextContent('ट्रैक एंड ट्रीट - व्यक्तिगत पोषण');
    });

    it('loads profile from localStorage if it exists', () => {
        const storedProfile: Profile = {
            name: 'Stored User',
            age: 40,
            gender: 'Female',
            weight: 65,
            height: 165,
            activity: 'Light',
            dietaryPreference: 'Veg',
            goal: 'Maintenance',
            medicalConditions: '',
            allergies: '',
            likesDislikes: '',
            photoUrl: null,
            assessment: { bmi: 23.9, tdee: 1800, target: 1800, bmiStatus: 'Healthy Weight' },
            proteinGoal: 80, carbGoal: 180, fatGoal: 60,
        };
        localStorageMock.setItem('trackandtreat-profile', JSON.stringify(storedProfile));

        render(
            <AppProvider>
                <TestConsumer />
            </AppProvider>
        );

        expect(screen.getByTestId('name')).toHaveTextContent('Stored User');
    });

    describe('calculateAssessment', () => {
        let calculateAssessment: (profileData: Profile) => any;

        // Helper to get the function from the context
        const GetAssessmentCalculator: React.FC = () => {
            const context = useAppContext();
            calculateAssessment = context.calculateAssessment;
            return null;
        };

        beforeEach(() => {
            render(<AppProvider><GetAssessmentCalculator /></AppProvider>);
        });
        
        const baseProfile: Profile = {
            name: 'Test', age: 30, gender: 'Male', weight: 80, height: 180,
            activity: 'Moderate', dietaryPreference: 'Veg', goal: 'Maintenance',
            medicalConditions: '', allergies: '', likesDislikes: '', assessment: {} as any
        };

        it('calculates correctly for a standard male profile', () => {
            const assessment = calculateAssessment(baseProfile);
            expect(assessment.bmi).toBe(24.7);
            expect(assessment.tdee).toBe(2732);
            expect(assessment.target).toBe(2732); // Maintenance
            expect(assessment.bmiStatus).toBe('Overweight Risk');
        });

        it('calculates correctly for a standard female profile', () => {
            const femaleProfile = { ...baseProfile, gender: 'Female' as 'Female' };
            const assessment = calculateAssessment(femaleProfile);
            expect(assessment.bmi).toBe(24.7);
            expect(assessment.tdee).toBe(2487);
            expect(assessment.target).toBe(2487);
        });

        it('adjusts target calories for Weight Loss goal', () => {
            const lossProfile = { ...baseProfile, goal: 'Weight Loss' as 'Weight Loss' };
            const assessment = calculateAssessment(lossProfile);
            expect(assessment.target).toBe(2232); // 2732 - 500
        });
        
        it('adjusts target calories for Weight Gain goal', () => {
            const gainProfile = { ...baseProfile, goal: 'Weight Gain' as 'Weight Gain' };
            const assessment = calculateAssessment(gainProfile);
            expect(assessment.target).toBe(3232); // 2732 + 500
        });

        it('adjusts target calories for Muscle Gain goal', () => {
            const muscleProfile = { ...baseProfile, goal: 'Muscle Gain' as 'Muscle Gain' };
            const assessment = calculateAssessment(muscleProfile);
            expect(assessment.target).toBe(3032); // 2732 + 300
        });

        it('returns nulls for incomplete data', () => {
            const incompleteProfile = { ...baseProfile, weight: null };
            const assessment = calculateAssessment(incompleteProfile);
            expect(assessment.bmi).toBeNull();
            expect(assessment.tdee).toBeNull();
            expect(assessment.target).toBeNull();
            expect(assessment.bmiStatus).toBe(appStrings.en.dashBMICalc);
        });
    });
});