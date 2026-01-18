// src/navigation/HomeStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/main/HomeScreen';
import QuestionnaireScreen from '../screens/main/QuestionnaireScreen';
import ResultScreen from '../screens/main/ResultScreen';
import InterpretationRequestScreen from '../screens/main/InterpretationRequestScreen';
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";

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
                options={({ navigation }) => ({
                    title: 'Результаты теста',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.reset({
                                index: 0,
                                routes: [{ name: 'HomeMain' }]
                            })}
                            style={{ paddingHorizontal: 16 }}
                        >
                            <Ionicons name="home" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="InterpretationRequest"
                component={InterpretationRequestScreen}
                options={{ title: 'Запрос интерпретации' }}
            />
        </Stack.Navigator>
    );
}