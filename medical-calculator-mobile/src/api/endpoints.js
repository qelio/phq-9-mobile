// src/api/endpoints.js
import apiClient from './client';

export const authAPI = {
    login: (email, password) =>
        apiClient.post('/auth/login', { email, password }),

    register: (userData) =>
        apiClient.post('/auth/register', userData),

    getProfile: () =>
        apiClient.get('/auth/profile'),

    updateProfile: (profileData) =>
        apiClient.put('/profile/update', profileData),

    changePassword: (oldPassword, newPassword) =>
        apiClient.post('/profile/change-password', { old_password: oldPassword, new_password: newPassword }),

    linkTelegram: (telegramUsername, verificationCode) =>
        apiClient.post('/auth/telegram/link', {
            telegram_username: telegramUsername,
            verification_code: verificationCode
        }),

    logout: () =>
        apiClient.post('/auth/logout'),
};

export const questionnaireAPI = {
    getAvailable: () =>
        apiClient.get('/questionnaires/available'),

    getPHQ9: () =>
        apiClient.get('/questionnaires/phq9/questions'),

    submitQuestionnaire: (data) =>
        apiClient.post('/results/submit', data),

    getHistory: (page = 1, perPage = 10) =>
        apiClient.get('/results/history', { params: { page, per_page: perPage } }),

    getResult: (resultId) =>
        apiClient.get(`/results/${resultId}`),

    requestInterpretation: (resultId) =>
        apiClient.post(`/results/${resultId}/request-interpretation`),
};

export const adminAPI = {
    getPendingResults: (page = 1, perPage = 10) =>
        apiClient.get('/admin/results/pending', { params: { page, per_page: perPage } }),

    interpretResult: (resultId, interpretationData) =>
        apiClient.post(`/admin/results/${resultId}/interpret`, interpretationData),

    getUsers: (page = 1, perPage = 20, search = '') =>
        apiClient.get('/admin/users', { params: { page, per_page: perPage, search } }),

    getStatistics: () =>
        apiClient.get('/admin/statistics'),

    getDetailedStatistics: (startDate, endDate) =>
        apiClient.get('/admin/statistics/detailed', {
            params: { start_date: startDate, end_date: endDate }
        }),

    toggleUserStatus: (userId, isActive) =>
        apiClient.put(`/admin/users/${userId}/status`, { is_active: isActive }),
};

export const notificationAPI = {
    getNotifications: () =>
        apiClient.get('/notifications'),

    markAsRead: (notificationId) =>
        apiClient.post(`/notifications/${notificationId}/read`),
};