// src/components/questionnaire/ProgressBar.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default function ProgressBar({
                                        progress,
                                        total,
                                        showText = true,
                                        height = 8
                                    }) {
    const percentage = (progress / total) * 100;

    return (
        <View style={styles.container}>
            {showText && (
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        {progress} из {total}
                    </Text>
                    <Text style={styles.percentage}>
                        {Math.round(percentage)}%
                    </Text>
                </View>
            )}

            <View style={[styles.bar, { height }]}>
                <View
                    style={[
                        styles.fill,
                        { width: `${percentage}%` }
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    percentage: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    bar: {
        backgroundColor: colors.gray,
        borderRadius: 4,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
});