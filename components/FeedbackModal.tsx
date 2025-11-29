
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import type { FeedbackEntry } from '../types';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FEEDBACK_STORAGE_KEY = 'trackandtreat-feedback';

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const { strings } = useAppContext();
    const [type, setType] = useState<'Bug Report' | 'Suggestion' | 'General'>('Suggestion');
    const [content, setContent] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Reset form when modal is opened
        if (isOpen) {
            setContent('');
            setType('Suggestion');
            setIsSubmitted(false);
        }
    }, [isOpen]);
    
    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        const newFeedback: FeedbackEntry = {
            id: new Date().toISOString(),
            type,
            content,
            timestamp: new Date().toLocaleString()
        };

        try {
            const existingFeedback = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
            existingFeedback.push(newFeedback);
            localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(existingFeedback));
            setIsSubmitted(true);
            setTimeout(() => {
                onClose();
            }, 2000); // Close modal after 2 seconds
        } catch (error) {
            console.error("Failed to save feedback to localStorage", error);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-[var(--color-card)] rounded-2xl shadow-xl w-full max-w-md p-6 relative"
                onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">{strings.feedbackTitle}</h3>
                
                {isSubmitted ? (
                    <div className="text-center py-8">
                        <p className="text-lg font-semibold text-green-600">{strings.feedbackSuccess}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="feedback-type" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">{strings.feedbackType}</label>
                            <select 
                                id="feedback-type"
                                value={type}
                                onChange={(e) => setType(e.target.value as any)}
                                className="w-full p-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-card)]"
                            >
                                <option value="Suggestion">{strings.feedbackTypeSuggestion}</option>
                                <option value="Bug Report">{strings.feedbackTypeBug}</option>
                                <option value="General">{strings.feedbackTypeGeneral}</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="feedback-content" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">{strings.feedbackContent}</label>
                            <textarea 
                                id="feedback-content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={5}
                                required
                                placeholder="..."
                                className="w-full p-2 border border-[var(--color-border)] rounded-lg focus:border-[var(--color-primary)] bg-transparent focus:ring-1 focus:ring-[var(--color-primary)]"
                            />
                        </div>
                        <button type="submit" className="w-full py-2 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300">
                            {strings.btnSubmitFeedback}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FeedbackModal;
