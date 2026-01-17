// src/components/common/Loader.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default function Loader({ size = 'large', color = colors.primary, style }) {
    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});