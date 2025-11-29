

// FIX: Import Chat and Content types from @google/genai for chat functionality.
import { GoogleGenAI, type Chat, type Content } from "@google/genai";
// FIX: Import ChatMessage type.
import type { Profile, MealLogEntry, GroundedSearchResult, GroundingChunk, Assessment, ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable is not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const FLASH_MODEL = 'gemini-2.5-flash';
const PRO_MODEL = 'gemini-3-pro-preview';

const callGemini = async (prompt: string, systemInstruction: string, model: string = FLASH_MODEL): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                systemInstruction,
            },
        });
        return response.text ?? "Error: Could not get a valid response from the AI.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return `Error: Failed to communicate with the AI service. Details: ${error instanceof Error ? error.message : String(error)}`;
    }
};

// --- AI Functionalities ---

export const generateHealthSummary = async (assessment: Assessment): Promise<string> => {
    const { bmi, tdee, target, bmiStatus } = assessment;

    const summaryPrompt = `
        Based on the following health assessment, provide a concise, 2-3 sentence summary in an encouraging and informative tone.
        - BMI: ${bmi} (${bmiStatus})
        - TDEE (Total Daily Energy Expenditure): ${tdee} kcal
        - Target Daily Calories for goal: ${target} kcal

        Briefly explain what these numbers mean in simple terms and offer one actionable, general piece of advice based on the BMI status and goals implied by the target calories. Avoid specific medical advice.
    `;

    const systemInstruction = "You are an AI health assistant. Your tone is supportive and motivational. You provide simple explanations of health metrics and general wellness tips.";

    return callGemini(summaryPrompt, systemInstruction);
};

export const generateDetailedPlan = async (profile: Profile): Promise<string> => {
    const { assessment, goal, dietaryPreference, medicalConditions, allergies, likesDislikes } = profile;
    const { target } = assessment;

    const userDetails = `
        Goal: ${goal}.
        Target Daily Calories: ${target} kcal.
        Dietary Preference: ${dietaryPreference}.
        Medical Conditions: ${medicalConditions || 'None'}.
        Allergies/Intolerances: ${allergies || 'None'}.
        Food Likes/Dislikes: ${likesDislikes || 'None'}.
    `;

    const planPrompt = `
        As a specialized Indian dietitian, create a detailed, balanced, and complete 3-Day Meal Plan (Day 1, Day 2, Day 3).
        The plan MUST be tailored to the following user profile:
        ${userDetails}

        Constraints:
        1. All meals must strictly adhere to Indian cuisine (focus on homemade, simple dishes).
        2. Total calories for each day must average very close to the target of ${target} kcal/day.
        3. The plan must include 5 eating slots: Early Morning, Breakfast, Mid-Morning Snack, Lunch, Evening Snack, Dinner.
        4. Absolutely avoid all ingredients listed in the Allergies/Intolerances section.
        5. Provide a short health/cooking note for each meal, including an approximate calorie count for that meal.
        6. Structure the output clearly using Markdown headings for days and lists for meals. Do not use markdown tables.
    `;

    const systemInstruction = "You are an expert Indian dietitian. Generate the meal plan strictly following all constraints. Your response should be pure markdown text.";

    return callGemini(planPrompt, systemInstruction);
};

export const analyzeMealLog = async (logEntries: MealLogEntry[], profile: Profile): Promise<string> => {
    const logSummary = logEntries.map(e => `${e.text} (~${e.kcal} kcal)`).join('; ');
    const targetCalories = profile.assessment?.target || 2000;
    const goal = profile.goal || 'Maintenance';
    
    const logPrompt = `
        Analyze the following meal log against the user's goal of **${goal}** and **${targetCalories} kcal** target.
        Meal Log (Today): ${logSummary}
        
        Provide a concise, 3-point analysis in a friendly, encouraging tone:
        1. A brief summary of compliance (e.g., "Good protein intake, slightly high calories").
        2. One specific suggestion for improvement/a healthier swap based on the log.
        3. A final encouraging sentence.
    `;
    const systemInstruction = "You are a friendly, encouraging AI nutrition coach. Provide a concise, 3-point analysis of the user's meal log, using only text, no Markdown list formatting.";
    
    return callGemini(logPrompt, systemInstruction);
};

export const generateRecipesByCondition = async (condition: string): Promise<string> => {
    const prompt = `
        As an expert dietitian, generate 3 unique, simple Indian recipes specifically tailored for a person with the medical condition: **${condition}**.
        For each recipe:
        1. Provide the Recipe Name as a main heading (e.g., ### Recipe Name).
        2. Create a subheading named "## Ingredients". Below it, list all ingredients as a bulleted list (e.g., "* 1 cup Flour").
        3. Create a subheading named "## Method". Below it, list the step-by-step cooking instructions as a numbered list.
        4. Create a subheading named "## Health Note". Below it, briefly explain *why* this recipe is suitable for the specified condition.
    `;
    const systemInstruction = "You are a specialized Indian dietitian. Generate the recipe response strictly following the requested structured Markdown format.";
    return callGemini(prompt, systemInstruction);
};

export const generateRecipesByIngredient = async (ingredient: string): Promise<string> => {
    const prompt = `
        Generate 3 unique, innovative, healthy Indian recipe ideas focusing on **${ingredient}** as the main ingredient.
        For each recipe:
        1. Provide the Recipe Name as a main heading (e.g., ### Creative Recipe Name).
        2. Create a subheading named "## Ingredients". Below it, list all ingredients as a bulleted list (e.g., "* 1 cup Flour").
        3. Create a subheading named "## Method". Below it, list the step-by-step cooking instructions as a numbered list.
        4. Create a subheading named "## Chef's Note". Below it, briefly describe the innovative approach.
    `;
    const systemInstruction = "You are a creative Indian chef. Generate the recipe response strictly following the requested structured Markdown format.";
    return callGemini(prompt, systemInstruction);
};

export const analyzeMedicalReport = async (reportInput: string): Promise<string> => {
    const prompt = `
        Interpret the following medical findings:
        FINDINGS: ${reportInput}

        Provide the analysis in this format:
        ### Diagnosis/Explanation
        What do these values usually indicate? (Be general and non-definitive).
        ### Dietary Implication
        What immediate nutritional changes are suggested?
        ### Disclaimer
        (Always include: "This is for informational purposes only and is not a substitute for professional medical advice. Always consult a qualified physician.")
    `;
    const systemInstruction = "You are an AI Medical Assistant. Your response MUST be structured into the three requested sections. Be cautious, non-alarmist, and recommend consulting a doctor.";
    return callGemini(prompt, systemInstruction, PRO_MODEL);
};

export const getNutritionalGuidance = async (input: string, type: 'nutrients_and_avoid' | 'food_sources' | 'interactions'): Promise<string> => {
    let prompt = `Based on the user input (diagnosis/symptoms: ${input}), provide the following information:\n`;
    if (type === 'nutrients_and_avoid') {
        prompt += `
        ### Key Nutrients to Focus On
        List the 5-7 most critical nutrients (Vitamins, Minerals, etc.) and explain their importance for this condition.
        ### Foods to Avoid
        List the 5-7 most important foods/categories to avoid or limit.
        `;
    } else if (type === 'food_sources') {
        prompt += `### Top Indian Food Sources
        Generate a list of the 7-10 most beneficial Indian food sources (e.g., specific dals, millets, vegetables) that provide the required nutrients. Include a brief preparation/consumption tip for each.
        `;
    } else { // interactions
        prompt += `### Food & Drug Interactions
        Provide information on the most common and critical food and drug interactions relevant to the treatment of this condition. List 3-5 specific medication types and the corresponding foods/nutrients that interact with them. If no common interaction exists, state that clearly. Include a strong disclaimer to consult a doctor.
        `;
    }
    const systemInstruction = "You are an expert nutritionist. Provide concise, detailed, and structured information tailored to the user's request. Focus on an Indian/South Asian context.";
    return callGemini(prompt, systemInstruction);
};

export const performGroundedSearch = async (query: string): Promise<GroundedSearchResult> => {
    try {
        const response = await ai.models.generateContent({
            model: FLASH_MODEL,
            contents: [{ parts: [{ text: query }] }],
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text ?? "No text response received.";
        const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || [];
        
        const sources = groundingChunks.filter(chunk => chunk.web);

        return { text, sources };

    } catch (error) {
        console.error("Gemini Grounded Search API Error:", error);
        const errorMessage = `Error: Failed to perform grounded search. Details: ${error instanceof Error ? error.message : String(error)}`;
        return { text: errorMessage, sources: [] };
    }
};

// FIX: Export startChat function to initialize a new chat session.
export const startChat = (history: ChatMessage[]): Chat => {
    const chat = ai.chats.create({
        model: FLASH_MODEL,
        history: history.map(m => ({
            role: m.role,
            parts: [{ text: m.text }],
        })) as Content[],
        config: {
            systemInstruction: "You are a helpful and friendly AI assistant for the Track and Treat application. Provide concise and supportive answers related to health, nutrition, and fitness."
        }
    });
    return chat;
};

// FIX: Export sendMessageToChat function to send messages to an existing chat session.
export const sendMessageToChat = async (chat: Chat, message: string): Promise<string> => {
    try {
        const response = await chat.sendMessage({ message });
        return response.text ?? "Sorry, I couldn't get a response. Please try again.";
    } catch (error) {
        console.error("Gemini Chat API Error:", error);
        return `Error: Failed to communicate with the AI service. Details: ${error instanceof Error ? error.message : String(error)}`;
    }
};