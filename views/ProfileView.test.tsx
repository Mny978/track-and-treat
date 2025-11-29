
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

import ProfileView from './ProfileView';
import { useAppContext } from '../contexts/AppContext';
import { appStrings } from '../constants/localization';
import type { Profile, Assessment } from '../types';

// Mock the useAppContext hook to provide controlled context for tests
jest.mock('../contexts/AppContext', () => ({
    ...jest.requireActual('../contexts/AppContext'),
    useAppContext: jest.fn(),
}));

jest.mock('../services/geminiService', () => ({
    generateHealthSummary: jest.fn(),
}));


const mockUseAppContext = useAppContext as jest.Mock;

describe('ProfileView', () => {
    let mockSetProfile: jest.Mock;
    let mockCalculateAssessment: jest.Mock;
    const initialProfile: Profile = {
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        weight: 75,
        height: 180,
        activity: 'Moderate',
        dietaryPreference: 'Non-Veg',
        goal: 'Maintenance',
        medicalConditions: 'None',
        allergies: 'Peanuts',
        likesDislikes: 'Loves chicken',
        proteinGoal: 150,
        carbGoal: 250,
        fatGoal: 70,
        assessment: {
            bmi: 23.1,
            tdee: 2500,
            target: 2500,
            bmiStatus: 'Healthy Weight',
        },
    };

    beforeEach(() => {
        // Reset mocks before each test
        mockSetProfile = jest.fn();
        mockCalculateAssessment = jest.fn(
            (profileData: Profile): Assessment => ({
                bmi: 22.9,
                tdee: 2450,
                target: 2450,
                bmiStatus: 'Healthy Weight',
            })
        );

        // Provide the mock context value
        mockUseAppContext.mockReturnValue({
            profile: initialProfile,
            setProfile: mockSetProfile,
            strings: appStrings.en,
            calculateAssessment: mockCalculateAssessment,
        });
    });

    it('renders with initial profile data from context', () => {
        render(<ProfileView />);

        // Assert that form fields are populated with the initial profile data
        expect(screen.getByLabelText('Name')).toHaveValue('John Doe');
        expect(screen.getByLabelText('Age (Years)')).toHaveValue(30);
        expect(screen.getByLabelText('Weight (kg)')).toHaveValue(75);
        expect(screen.getByLabelText('Allergies & Intolerances')).toHaveValue('Peanuts');
        expect(screen.getByLabelText('Protein Goal (g)')).toHaveValue(150);
        expect(screen.getByLabelText('Carbohydrate Goal (g)')).toHaveValue(250);
        expect(screen.getByLabelText('Fat Goal (g)')).toHaveValue(70);
    });

    it('handles user input and updates internal form state', () => {
        render(<ProfileView />);
        
        const nameInput = screen.getByLabelText('Name');
        // Simulate a user typing a new name into the input field
        fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
        
        // Assert that the input field's value has been updated
        expect(nameInput).toHaveValue('Jane Doe');
    });

    it('submits the form and calls context functions with updated data', async () => {
        render(<ProfileView />);

        // Simulate user changing multiple form fields
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByLabelText('Weight (kg)'), { target: { value: '70' } });
        fireEvent.change(screen.getByLabelText('Protein Goal (g)'), { target: { value: '160' } });

        // Simulate clicking the submit button
        fireEvent.click(screen.getByRole('button', { name: 'Save Profile & Generate Assessment' }));

        // Wait for state updates to process
        await waitFor(() => {
            // 1. Verify that calculateAssessment was called with the latest form data
            expect(mockCalculateAssessment).toHaveBeenCalledTimes(1);
            const capturedProfileForAssessment = mockCalculateAssessment.mock.calls[0][0];
            expect(capturedProfileForAssessment.name).toBe('Jane Doe');
            expect(capturedProfileForAssessment.weight).toBe(70); 

            // 2. Verify that setProfile was called with the full updated profile, including the new assessment
            expect(mockSetProfile).toHaveBeenCalledTimes(1);
            const finalProfileToSave = mockSetProfile.mock.calls[0][0];
            expect(finalProfileToSave.name).toBe('Jane Doe');
            expect(finalProfileToSave.weight).toBe(70);
            expect(finalProfileToSave.proteinGoal).toBe(160);
            // Check that the assessment from the mocked calculateAssessment was included
            expect(finalProfileToSave.assessment).toEqual({
                bmi: 22.9,
                tdee: 2450,
                target: 2450,
                bmiStatus: 'Healthy Weight',
            });
        });
        
        // 3. Check if the success message appears on the screen
        expect(screen.getByText('Profile saved successfully! Assessment updated.')).toBeInTheDocument();
    });
});
