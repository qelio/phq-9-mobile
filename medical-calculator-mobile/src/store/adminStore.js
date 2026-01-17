// src/store/adminStore.js
import { create } from 'zustand';
import { adminAPI } from '../api/endpoints';

export const useAdminStore = create((set, get) => ({
    pendingResults: [],
    users: [],
    statistics: null,
    isLoading: false,
    error: null,

    // Получение результатов для интерпретации
    fetchPendingResults: async (page = 1) => {
        set({ isLoading: true });
        try {
            const response = await adminAPI.getPendingResults(page);
            set({
                pendingResults: page === 1 ? response.results : [...get().pendingResults, ...response.results],
                isLoading: false
            });
            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    // Добавление интерпретации
    interpretResult: async (resultId, interpretationData) => {
        set({ isLoading: true });
        try {
            const response = await adminAPI.interpretResult(resultId, interpretationData);

            // Удаляем интерпретированный результат из списка ожидания
            set(state => ({
                pendingResults: state.pendingResults.filter(result => result.id !== resultId),
                isLoading: false
            }));

            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    // Получение пользователей
    fetchUsers: async (page = 1, search = '') => {
        set({ isLoading: true });
        try {
            const response = await adminAPI.getUsers(page, search);
            set({
                users: page === 1 ? response.users : [...get().users, ...response.users],
                isLoading: false
            });
            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    // Получение статистики
    fetchStatistics: async () => {
        set({ isLoading: true });
        try {
            const response = await adminAPI.getStatistics();
            set({ statistics: response, isLoading: false });
            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    // Получение детальной статистики
    fetchDetailedStatistics: async (startDate, endDate) => {
        set({ isLoading: true });
        try {
            const response = await adminAPI.getDetailedStatistics(startDate, endDate);
            set({ isLoading: false });
            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    // Изменение статуса пользователя
    toggleUserStatus: async (userId, isActive) => {
        set({ isLoading: true });
        try {
            const response = await adminAPI.toggleUserStatus(userId, isActive);

            // Обновляем пользователя в списке
            set(state => ({
                users: state.users.map(user =>
                    user.id === userId ? { ...user, is_active: isActive } : user
                ),
                isLoading: false
            }));

            return response;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },
}));