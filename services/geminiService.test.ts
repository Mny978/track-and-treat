


import { describe, it, expect, jest, beforeEach } from '@jest/globals';
// FIX: Add startChat and sendMessageToChat to imports for testing.
import { 
    generateHealthSummary, 
    generateDetailedPlan, 
    analyzeMealLog, 
    generateRecipesByCondition,
    generateRecipesByIngredient,
    analyzeMedicalReport,
    getNutritionalGuidance,
    performGroundedSearch,
    startChat,
    sendMessageToChat,
} from './geminiService';
// FIX: Import ChatMessage type for test definitions.
import type { Profile, MealLogEntry, Assessment, GroundingChunk, ChatMessage } from '../types';

// --- Mocks ---
// FIX: Update mocks to support chat functionality.
// Fix: Explicitly type mocks to prevent type inference issues with mockResolvedValue/mockRejectedValue.
const mockGenerateContent: jest.Mock = jest.fn();
const mockSendMessage: jest.Mock = jest.fn();
const mockChatCreate: jest.Mock = jest.fn().mockImplementation(() => ({
    sendMessage: mockSendMessage,
}));

jest.mock('@google/genai', () => ({
    GoogleGenAI: jest.fn().mockImplementation(() => ({
        models: {
            generateContent: mockGenerateContent,
        },
        chats: {
            create: mockChatCreate,
        },
    })),
}));

describe('geminiService', () => {

    beforeEach(() => {
        // Clear all mock history and implementations before each test
        jest.clearAllMocks();
        // Default successful response
        // FIX: Cast mock to jest.Mock to resolve values without type errors.
        // Fix: Removed unnecessary cast as mock is now typed.
        mockGenerateContent.mockResolvedValue({ text: 'Mocked AI Response' });
        // Fix: Removed unnecessary cast as mock is now typed.
        mockSendMessage.mockResolvedValue({ text: 'Mocked Chat Response' });
    });

    describe('generateHealthSummary', () => {
        it('should call Gemini API with a correctly formatted prompt', async () => {
            const assessment: Assessment = { bmi: 24.5, tdee: 2200, target: 1700, bmiStatus: 'Healthy Weight' };
            await generateHealthSummary(assessment);
            
            expect(mockGenerateContent).toHaveBeenCalledTimes(1);
            // FIX: Cast mock call argument to any to access properties without type errors.
            const call = mockGenerateContent.mock.calls[0][0] as any;
            expect(call.model).toBe('gemini-2.5-flash');
            expect(call.config.systemInstruction).toContain('AI health assistant');
            expect(call.contents[0].parts[0].text).toContain('BMI: 24.5 (Healthy Weight)');
            expect(call.contents[0].parts[0].text).toContain('Target Daily Calories for goal: 1700 kcal');
        });
    });

    describe('generateDetailedPlan', () => {
        it('should include all profile details in the prompt', async () => {
            const profile: Profile = { 
                goal: 'Weight Loss',
                assessment: { target: 1800 } as Assessment,
                dietaryPreference: 'Veg',
                medicalConditions: 'PCOS',
                allergies: 'None',
                likesDislikes: 'Dislikes mushrooms'
            } as Profile;
            
            await generateDetailedPlan(profile);

            expect(mockGenerateContent).toHaveBeenCalledTimes(1);
            // FIX: Cast mock call argument to any to access properties without type errors.
            const call = mockGenerateContent.mock.calls[0][0] as any;
            const prompt = call.contents[0].parts[0].text;

            expect(prompt).toContain('Goal: Weight Loss');
            expect(prompt).toContain('Target Daily Calories: 1800 kcal');
            expect(prompt).toContain('Medical Conditions: PCOS');
            expect(prompt).toContain('Dislikes mushrooms');
            expect(call.config.systemInstruction).toContain('expert Indian dietitian');
        });
    });
    
    describe('analyzeMealLog', () => {
        it('should format meal log entries correctly in the prompt', async () => {
            const logEntries: MealLogEntry[] = [
                { id: '1', text: 'Oats with milk', kcal: 300, time: '09:00' },
                { id: '2', text: 'Salad', kcal: 250, time: '13:00' },
            ];
            const profile = { assessment: { target: 2000 }, goal: 'Maintenance' } as Profile;

            await analyzeMealLog(logEntries, profile);

            expect(mockGenerateContent).toHaveBeenCalledTimes(1);
            // FIX: Cast mock call argument to any to access properties without type errors.
            const prompt = (mockGenerateContent.mock.calls[0][0] as any).contents[0].parts[0].text;
            expect(prompt).toContain('Oats with milk (~300 kcal); Salad (~250 kcal)');
            expect(prompt).toContain('target of **2000 kcal**');
        });
    });

    describe('generateRecipesByCondition', () => {
        it('should specify the condition clearly in the prompt', async () => {
            await generateRecipesByCondition('Diabetes');
            expect(mockGenerateContent).toHaveBeenCalledTimes(1);
            // FIX: Cast mock call argument to any to access properties without type errors.
            const prompt = (mockGenerateContent.mock.calls[0][0] as any).contents[0].parts[0].text;
            expect(prompt).toContain('medical condition: **Diabetes**');
            expect(prompt).toContain('## Ingredients');
        });
    });
    
    describe('generateRecipesByIngredient', () => {
        it('should specify the ingredient clearly in the prompt', async () => {
            await generateRecipesByIngredient('Paneer');
            expect(mockGenerateContent).toHaveBeenCalledTimes(1);
            // FIX: Cast mock call argument to any to access properties without type errors.
            const prompt = (mockGenerateContent.mock.calls[0][0] as any).contents[0].parts[0].text;
            expect(prompt).toContain('focusing on **Paneer** as the main ingredient');
            expect(prompt).toContain("## Chef's Note");
        });
    });

    describe('analyzeMedicalReport', () => {
        it('should use the PRO model and include the report findings', async () => {
            await analyzeMedicalReport('HbA1c: 7.5%');
            expect(mockGenerateContent).toHaveBeenCalledTimes(1);
            // FIX: Cast mock call argument to any to access properties without type errors.
            const call = mockGenerateContent.mock.calls[0][0] as any;
            expect(call.model).toBe('gemini-3-pro-preview');
            expect(call.contents[0].parts[0].text).toContain('FINDINGS: HbA1c: 7.5%');
            expect(call.contents[0].parts[0].text).toContain('### Diagnosis/Explanation');
        });
    });

    describe('getNutritionalGuidance', () => {
        it('should generate the correct prompt for "food_sources"', async () => {
            await getNutritionalGuidance('Iron Deficiency', 'food_sources');
            expect(mockGenerateContent).toHaveBeenCalledTimes(1);
            // FIX: Cast mock call argument to any to access properties without type errors.
            const prompt = (mockGenerateContent.mock.calls[0][0] as any).contents[0].parts[0].text;
            expect(prompt).toContain('diagnosis/symptoms: Iron Deficiency');
            expect(prompt).toContain('### Top Indian Food Sources');
        });
    });

    describe('performGroundedSearch', () => {
        it('should call the API with the googleSearch tool and correctly parse the response', async () => {
            const mockSource: GroundingChunk = { web: { uri: 'http://example.com', title: 'Example' }};
            // FIX: Cast mock to jest.Mock to resolve values without type errors.
            // Fix: Removed unnecessary cast as mock is now typed.
            mockGenerateContent.mockResolvedValue({
                text: 'Grounded response.',
                candidates: [{ groundingMetadata: { groundingChunks: [mockSource] } }],
            });

            const result = await performGroundedSearch('latest health news');
            
            expect(mockGenerateContent).toHaveBeenCalledTimes(1);
            // FIX: Cast mock call argument to any to access properties without type errors.
            const call = mockGenerateContent.mock.calls[0][0] as any;
            expect(call.config.tools).toEqual([{ googleSearch: {} }]);
            
            expect(result.text).toBe('Grounded response.');
            expect(result.sources).toHaveLength(1);
            expect(result.sources[0].web.uri).toBe('http://example.com');
        });
    });
    
    // FIX: Add tests for startChat function.
    describe('startChat', () => {
        it('should create a chat session with correct history and system instruction', () => {
            const history: ChatMessage[] = [{ role: 'user', text: 'Hello' }];
            startChat(history);
            expect(mockChatCreate).toHaveBeenCalledTimes(1);
            // FIX: Cast mock call argument to any to access properties without type errors.
            const call = mockChatCreate.mock.calls[0][0] as any;
            expect(call.model).toBe('gemini-2.5-flash');
            expect(call.history).toEqual([{ role: 'user', parts: [{ text: 'Hello' }] }]);
            expect(call.config.systemInstruction).toContain('helpful and friendly AI assistant');
        });
    });

    // FIX: Add tests for sendMessageToChat function.
    describe('sendMessageToChat', () => {
        it('should send a message and return the response text', async () => {
            // Fix: Cast the mock chat object to 'any' to satisfy the Chat type requirement for the test.
            const chat = mockChatCreate() as any; // This gives us an object with sendMessage
            // FIX: Cast mock to jest.Mock to resolve values without type errors.
            // Fix: Removed unnecessary cast as mock is now typed.
            mockSendMessage.mockResolvedValue({ text: 'Hi there!' });

            const response = await sendMessageToChat(chat, 'Hello');

            expect(mockSendMessage).toHaveBeenCalledWith({ message: 'Hello' });
            expect(response).toBe('Hi there!');
        });
        
        it('should handle errors during sending message', async () => {
            // Fix: Cast the mock chat object to 'any' to satisfy the Chat type requirement for the test.
            const chat = mockChatCreate() as any;
            // FIX: Cast mock to jest.Mock to reject values without type errors.
            // Fix: Removed unnecessary cast as mock is now typed.
            mockSendMessage.mockRejectedValue(new Error('Send failed'));

            const response = await sendMessageToChat(chat, 'Hello');
            expect(response).toContain('Error: Failed to communicate with the AI service.');
            expect(response).toContain('Send failed');
        });
    });

    it('should handle API errors gracefully', async () => {
        // Configure mock to throw an error
        // FIX: Cast mock to jest.Mock to reject values without type errors.
        // Fix: Removed unnecessary cast as mock is now typed.
        mockGenerateContent.mockRejectedValue(new Error('API Limit Reached'));
        
        const result = await generateRecipesByCondition('Anything');

        expect(result).toContain('Error: Failed to communicate with the AI service.');
        expect(result).toContain('API Limit Reached');
    });
});
