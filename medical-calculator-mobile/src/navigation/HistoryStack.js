// src/navigation/HistoryStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HistoryScreen from '../screens/history/HistoryScreen';
import ResultDetailScreen from '../screens/history/ResultDetailScreen';

const Stack = createStackNavigator();

export default function HistoryStack() {
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
                name="HistoryMain"
                component={HistoryScreen}
                options={{ title: 'История тестов' }}
            />
            <Stack.Screen
                name="ResultDetail"
                component={ResultDetailScreen}
                options={{ title: 'Детали результата' }}
            />
        </Stack.Navigator>
    );
}