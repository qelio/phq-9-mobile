// src/navigation/AdminNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PendingResultsScreen from '../screens/admin/PendingResultsScreen';
import InterpretationScreen from '../screens/admin/InterpretationScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import StatisticsScreen from '../screens/admin/StatisticsScreen';

const Stack = createStackNavigator();

export default function AdminNavigator() {
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
                name="PendingResults"
                component={PendingResultsScreen}
                options={{ title: 'Результаты на интерпретацию' }}
            />
            <Stack.Screen
                name="Interpretation"
                component={InterpretationScreen}
                options={{ title: 'Интерпретация результата' }}
            />
            <Stack.Screen
                name="UserManagement"
                component={UserManagementScreen}
                options={{ title: 'Управление пользователями' }}
            />
            <Stack.Screen
                name="Statistics"
                component={StatisticsScreen}
                options={{ title: 'Статистика' }}
            />
        </Stack.Navigator>
    );
}