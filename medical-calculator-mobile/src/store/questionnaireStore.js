// src/store/questionnaireStore.js
import { create } from 'zustand';
import { questionnaireAPI } from '../api/endpoints';

export const useQuestionnaireStore = create((set, get) => ({
    availableTests: [],
    currentTest: null,
    answers: {},
    currentQuestionIndex: 0,
    results: [],
    isLoading: false,
    error: null,

    // Получение доступных тестов
    fetchAvailableTests: async () => {
        set({ isLoading: true });
        try {
            const response = await questionnaireAPI.getAvailable();
            set({ availableTests: response.questionnaires, isLoading: false });
            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    // Загрузка конкретного теста
    loadQuestionnaire: async (code) => {
        set({ isLoading: true });
        try {
            const response = await questionnaireAPI.getPHQ9();
            set({
                currentTest: response.questionnaire,
                currentQuestionIndex: 0,
                answers: {},
                isLoading: false
            });
            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    // Ответ на вопрос
    answerQuestion: (questionId, value) => {
        const { answers } = get();
        set({
            answers: { ...answers, [questionId]: value },
            currentQuestionIndex: get().currentQuestionIndex + 1,
        });
    },

    // Назад к предыдущему вопросу
    goToPreviousQuestion: () => {
        const currentIndex = get().currentQuestionIndex;
        if (currentIndex > 0) {
            set({ currentQuestionIndex: currentIndex - 1 });
        }
    },

    // Отправка результатов
    submitQuestionnaire: async (clientType = 'mobile') => {
        set({ isLoading: true });
        try {
            const { currentTest, answers } = get();

            // Преобразуем answers в формат для API
            const answersArray = Object.entries(answers).map(([questionId, value]) => ({
                question_id: questionId,
                value: parseInt(value, 10),
            }));

            const data = {
                questionnaire_code: currentTest.code,
                answers: answersArray,
                client_type: clientType,
            };

            const response = await questionnaireAPI.submitQuestionnaire(data);

            // Сбрасываем текущий тест
            set({
                currentTest: null,
                answers: {},
                currentQuestionIndex: 0,
                isLoading: false
            });

            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    // Получение истории
    fetchHistory: async (page = 1) => {
        set({ isLoading: true });
        try {
            const response = await questionnaireAPI.getHistory(page);
            set({
                results: page === 1 ? response.results : [...get().results, ...response.results],
                isLoading: false
            });
            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    // Запрос интерпретации
    requestInterpretation: async (resultId) => {
        set({ isLoading: true });
        try {
            const response = await questionnaireAPI.requestInterpretation(resultId);
            set({ isLoading: false });
            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },
}));