// src/navigation/HomeStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/main/HomeScreen';
import QuestionnaireScreen from '../screens/main/QuestionnaireScreen';
import ResultScreen from '../screens/main/ResultScreen';
import InterpretationRequestScreen from '../screens/main/InterpretationRequestScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
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
                name="HomeMain"
                component={HomeScreen}
                options={{ title: 'Медицинский калькулятор' }}
            />
            <Stack.Screen
                name="Questionnaire"
                component={QuestionnaireScreen}
                options={({ route }) => ({
                    title: route.params?.questionnaireName || 'Тест'
                })}
            />
            <Stack.Screen
                name="Result"
                component={ResultScreen}
                options={{ title: 'Результаты теста' }}
            />
            <Stack.Screen
                name="InterpretationRequest"
                component={InterpretationRequestScreen}
                options={{ title: 'Запрос интерпретации' }}
            />
        </Stack.Navigator>
    );
}