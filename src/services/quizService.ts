import type { Quiz } from '../types';

const MOCK_QUIZZES: Quiz[] = [
    {
        id: 'q1',
        trainingId: '1', // React Basics
        passingScore: 2,
        questions: [
            {
                id: '1',
                text: 'What is a Hook in React?',
                options: [
                    'A specialized function that lets you hook into React features',
                    'A CSS framework',
                    'A database connection tool',
                    'A Redux middleware'
                ],
                correctAnswer: 0
            },
            {
                id: '2',
                text: 'Which hook is used for side effects?',
                options: [
                    'useState',
                    'useReducer',
                    'useEffect',
                    'useContext'
                ],
                correctAnswer: 2
            },
            {
                id: '3',
                text: 'How do you pass data to a child component?',
                options: [
                    'State',
                    'Props',
                    'Redux',
                    'Services'
                ],
                correctAnswer: 1
            }
        ]
    }
];

export const QuizService = {
    getQuizByTrainingId: async (trainingId: string): Promise<Quiz | null> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const quiz = MOCK_QUIZZES.find(q => q.trainingId === trainingId);
                resolve(quiz || null);
            }, 300);
        });
    }
};
