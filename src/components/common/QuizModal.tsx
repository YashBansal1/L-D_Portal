import React, { useState } from 'react';
import type { Quiz } from '../../types';
import GlassCard from './GlassCard';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizModalProps {
    quiz: Quiz;
    onClose: () => void;
    onComplete: (score: number, passed: boolean) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    const handleNext = () => {
        if (selectedOption === null) return;

        let newScore = score;
        if (selectedOption === currentQuestion.correctAnswer) {
            newScore = score + 1;
            setScore(newScore);
        }

        if (isLastQuestion) {
            setShowResult(true);
            // Final check passing score logic deferred to finish
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
        }
    };

    const handleFinish = () => {
        // Re-calculate final score because setScore is async-ish in nature (though synchronous in batch updates, better to use the state variable carefully or track logic)
        // Actually, score state is updated above. 
        // BUT wait, in handleNext, I updated state "score". In handleFinish, I read "score".
        // If I call handleFinish immediately after setters, it might be stale?
        // No, I set showResult=true. The UI re-renders with result view. Then user clicks "Finish".

        const passed = score >= quiz.passingScore;
        onComplete(score, passed);
    };

    if (showResult) {
        const passed = score >= quiz.passingScore;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <GlassCard className="w-full max-w-md text-center">
                    <div className="mb-6 flex justify-center">
                        {passed ? (
                            <div className="p-4 bg-green-100 text-green-600 rounded-full">
                                <CheckCircle size={48} />
                            </div>
                        ) : (
                            <div className="p-4 bg-red-100 text-red-600 rounded-full">
                                <XCircle size={48} />
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold mb-2">{passed ? 'Quiz Passed!' : 'Quiz Failed'}</h2>
                    <p className="text-slate-600 mb-6">You scored {score} out of {quiz.questions.length}</p>

                    <div className="flex gap-4 justify-center">
                        {passed ? (
                            <button
                                onClick={handleFinish}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                            >
                                Continue to Completion
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
                            >
                                Close & Retry Later
                            </button>
                        )}
                    </div>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <GlassCard className="w-full max-w-lg">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-slate-500">
                            Question {currentQuestionIndex + 1} of {quiz.questions.length}
                        </span>
                        <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold">
                            Score to Pass: {quiz.passingScore}
                        </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{currentQuestion.text}</h2>
                </div>

                <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedOption(index)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedOption === index
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                                : 'border-slate-100 dark:border-slate-700 hover:border-indigo-200'
                                }`}
                        >
                            <span className={`font-medium ${selectedOption === index ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                {option}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={selectedOption === null}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${selectedOption !== null
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};

export default QuizModal;
