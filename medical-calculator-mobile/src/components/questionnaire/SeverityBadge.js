// src/components/questionnaire/SeverityBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const SeverityBadge = ({ severity, score }) => {
    const getSeverityConfig = () => {
        switch (severity) {
            case 'Minimal or none':
                return { color: colors.success, label: 'Минимальная' };
            case 'Mild':
                return { color: colors.accent, label: 'Лёгкая' };
            case 'Moderate':
                return { color: colors.warning, label: 'Умеренная' };
            case 'Moderately severe':
                return { color: colors.danger, label: 'Умеренно тяжёлая' };
            case 'Severe':
                return { color: colors.danger, label: 'Тяжёлая' };
            default:
                return { color: colors.gray, label: severity };
        }
    };

    const { color, label } = getSeverityConfig();

    return (
        <View style={styles.container}>
            <View style={[styles.badge, { backgroundColor: color }]}>
                <Text style={styles.badgeText}>{label}</Text>
            </View>
            {score !== undefined && (
                <Text style={styles.scoreText}>Балл: {score}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 16
    },
    badgeText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    scoreText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
});

export default SeverityBadge;