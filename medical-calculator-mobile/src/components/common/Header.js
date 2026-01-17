// src/components/common/Header.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

export default function Header({
                                   title,
                                   onBack,
                                   rightComponent,
                                   showBack = true
                               }) {
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                {showBack && onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.white} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.center}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
            </View>

            <View style={styles.right}>
                {rightComponent}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        height: 60,
        paddingHorizontal: 16,
    },
    left: {
        width: 40,
    },
    center: {
        flex: 1,
        alignItems: 'center',
    },
    right: {
        width: 40,
        alignItems: 'flex-end',
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.white,
    },
});