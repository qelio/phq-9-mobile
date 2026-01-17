// src/components/questionnaire/AnswerButton.js
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const AnswerButton = ({ label, value, selected, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.container, selected && styles.selected]}
            onPress={() => onPress(value)}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                {selected && (
                    <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={colors.primary}
                        style={styles.icon}
                    />
                )}
                <Text style={[styles.label, selected && styles.selectedLabel]}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        marginBottom: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selected: {
        backgroundColor: colors.white,
        borderColor: colors.primary,
        borderWidth: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 12,
    },
    label: {
        fontSize: 16,
        color: colors.textPrimary,
        flex: 1,
    },
    selectedLabel: {
        fontWeight: '600',
        color: colors.primary,
    },
});

export default AnswerButton;