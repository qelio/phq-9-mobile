// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const StorageKeys = {
    USER_PREFERENCES: 'user_preferences',
    NOTIFICATIONS_ENABLED: 'notifications_enabled',
    THEME_MODE: 'theme_mode',
};

export const getItem = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error getting item from storage:', error);
        return null;
    }
};

export const setItem = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error setting item in storage:', error);
    }
};

export const removeItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing item from storage:', error);
    }
};

export const clearStorage = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('Error clearing storage:', error);
    }
};

export const secureGetItem = async (key) => {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.error('Error getting secure item:', error);
        return null;
    }
};

export const secureSetItem = async (key, value) => {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (error) {
        console.error('Error setting secure item:', error);
    }
};

export const secureDeleteItem = async (key) => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.error('Error deleting secure item:', error);
    }
};