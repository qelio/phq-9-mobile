// src/api/client.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from '../constants/config';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor для добавления токена
apiClient.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor для обработки ошибок
apiClient.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // Если ошибка 401 и это не запрос на обновление токена
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Пробуем обновить токен
                const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);

                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    });

                    const { access_token } = response.data;

                    // Сохраняем новый токен
                    await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, access_token);

                    // Повторяем оригинальный запрос
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Если обновление не удалось, разлогиниваем пользователя
                console.log('Refresh token failed, logging out');
                // Здесь можно вызвать logout из store
            }
        }

        // Обработка других ошибок
        const errorMessage = error.response?.data?.error ||
            error.message ||
            'Произошла ошибка';

        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data,
        });
    }
);

export default apiClient;