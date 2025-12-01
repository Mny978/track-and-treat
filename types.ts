export type Language = 'en' | 'hi' | 'gu';

export type View = 'dashboard' | 'profile' | 'plan' | 'tracker' | 'recipes' | 'reports' | 'guidance' | 'search' | 'chat';

export type Gender = 'Male' | 'Female' | 'Other';
export type ActivityLevel = 'Sedentary' | 'Light' | 'Moderate' | 'High' | 'Extreme';
export type DietaryPreference = 'Veg' | 'Non-Veg' | 'Vegan' | 'Jain';
export type Goal = 'Weight Loss' | 'Weight Gain' | 'Maintenance' | 'Muscle Gain';

export interface Assessment {
    bmi: number | null;
    tdee: number | null;
    target: number | null;
    bmiStatus: string;
}

export interface Profile {
    name: string;
    age: number | null;
    gender: Gender;
    weight: number | null;
    height: number | null;
    activity: ActivityLevel;
    dietaryPreference: DietaryPreference;
    goal: Goal;
    medicalConditions: string;
    allergies: string;
    likesDislikes: string;
    assessment: Assessment;
    photoUrl?: string | null;
    proteinGoal?: number | null; // in grams
    carbGoal?: number | null; // in grams
    fatGoal?: number | null; // in grams
}

export interface MealLogEntry {
    id: string;
    text: string;
    time: string;
    kcal: number;
}

export interface TrackingState {
    waterIntake: number;
    fruitVegServings: number;
    mealLog: MealLogEntry[];
}

export interface Reminder {
    id: string;
    time: string; // "HH:MM" format
    type: 'Meal' | 'Water';
}

export interface FeedbackEntry {
    id: string;
    type: 'Bug Report' | 'Suggestion' | 'General';
    content: string;
    timestamp: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface GroundingChunk {
    web: {
        uri: string;
        title: string;
    };
}

export interface GroundedSearchResult {
    text: string;
    sources: GroundingChunk[];
}