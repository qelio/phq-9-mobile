// src/store/authStore.js
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../api/endpoints';
import { STORAGE_KEYS } from '../constants/config';

export const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isAdmin: false,
    isLoading: false,
    isAuthenticated: false,

    checkAuthState: async () => {
        try {
            // Используем новый API SecureStore
            const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
            const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);

            console.log('Token from storage:', token ? 'exists' : 'null');
            console.log('User data from storage:', userData ? 'exists' : 'null');

            if (token && userData) {
                const user = JSON.parse(userData);
                console.log('User parsed:', user.email);
                set({
                    user,
                    token,
                    isAdmin: user.is_admin || false,
                    isAuthenticated: true,
                    isLoading: false
                });
                return user;
            }
        } catch (error) {
            console.error('Error checking auth state:', error);
        }

        // Если нет токена или ошибка
        set({
            user: null,
            token: null,
            isAdmin: false,
            isAuthenticated: false,
            isLoading: false
        });
        return null;
    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await authAPI.login(email, password);

            await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
            await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);
            await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

            set({
                user: response.user,
                token: response.access_token,
                isAdmin: response.user.is_admin || false,
                isAuthenticated: true,
                isLoading: false,
            });

            console.log('Login successful for:', response.user.email);
            return response;
        } catch (error) {
            console.error('Login error:', error);
            set({ isLoading: false });
            throw error;
        }
    },

    // Регистрация
    register: async (userData) => {
        set({ isLoading: true });
        try {
            const response = await authAPI.register(userData);
            set({ isLoading: false });
            return response;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    // Обновление профиля
    updateProfile: async (profileData) => {
        set({ isLoading: true });
        try {
            const response = await authAPI.updateProfile(profileData);

            // Обновляем данные пользователя
            const updatedUser = { ...get().user, ...profileData };
            await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));

            set({ user: updatedUser, isLoading: false });
            return response;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    // Выход
    logout: async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }

        // Очищаем хранилище
        await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);

        // Сбрасываем состояние
        set({
            user: null,
            token: null,
            isAdmin: false,
            isAuthenticated: false,
        });
    },

    // Привязка Telegram
    linkTelegram: async (telegramUsername, verificationCode) => {
        set({ isLoading: true });
        try {
            const response = await authAPI.linkTelegram(telegramUsername, verificationCode);

            // Обновляем данные пользователя
            const updatedUser = {
                ...get().user,
                telegram_username: telegramUsername
            };
            await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));

            set({ user: updatedUser, isLoading: false });
            return response;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
}));