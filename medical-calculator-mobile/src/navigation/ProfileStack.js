// src/navigation/ProfileStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ProfileEditScreen from '../screens/profile/ProfileEditScreen';
import TelegramLinkScreen from '../screens/profile/TelegramLinkScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import AdminDashboardScreen from '../screens/profile/AdminDashboardScreen';

const Stack = createStackNavigator();

export default function ProfileStack() {
    const { user } = useAuthStore();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#2A9D8F',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                cardStyle: { backgroundColor: '#F8F9FA' },
            }}
        >
            <Stack.Screen
                name="ProfileMain"
                component={ProfileScreen}
                options={{ title: 'Профиль' }}
            />
            <Stack.Screen
                name="ProfileEdit"
                component={ProfileEditScreen}
                options={{ title: 'Редактирование профиля' }}
            />
            <Stack.Screen
                name="TelegramLink"
                component={TelegramLinkScreen}
                options={{ title: 'Привязка Telegram' }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Настройки' }}
            />
            {user?.is_admin && (
                <Stack.Screen
                    name="AdminDashboard"
                    component={AdminDashboardScreen}
                    options={{ title: 'Панель администратора' }}
                />
            )}
        </Stack.Navigator>
    );
}