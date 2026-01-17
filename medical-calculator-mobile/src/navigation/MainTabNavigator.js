// src/navigation/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import colors from '../constants/colors';

// Tab Stacks
import HomeStack from './HomeStack';
import HistoryStack from './HistoryStack';
import ProfileStack from './ProfileStack';
import AdminStack from './AdminStack';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const { user } = useAuthStore();

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Admin') {
                        iconName = focused ? 'shield' : 'shield-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.darkGray,
                tabBarStyle: {
                    backgroundColor: colors.white,
                    borderTopColor: colors.gray,
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 75,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{ title: 'Главная' }}
            />
            <Tab.Screen
                name="History"
                component={HistoryStack}
                options={{ title: 'История' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileStack}
                options={{ title: 'Профиль' }}
            />
            {user?.is_admin && (
                <Tab.Screen
                    name="Admin"
                    component={AdminStack}
                    options={{ title: 'Админ' }}
                />
            )}
        </Tab.Navigator>
    );
}