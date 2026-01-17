// src/components/common/Alert.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

export default function Alert({
                                  type = 'info',
                                  message,
                                  title,
                                  style
                              }) {
    const getConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: 'checkmark-circle',
                    backgroundColor: `${colors.success}20`,
                    borderColor: colors.success,
                    iconColor: colors.success,
                };
            case 'warning':
                return {
                    icon: 'warning',
                    backgroundColor: `${colors.warning}20`,
                    borderColor: colors.warning,
                    iconColor: colors.warning,
                };
            case 'error':
                return {
                    icon: 'alert-circle',
                    backgroundColor: `${colors.danger}20`,
                    borderColor: colors.danger,
                    iconColor: colors.danger,
                };
            default:
                return {
                    icon: 'information-circle',
                    backgroundColor: `${colors.primary}20`,
                    borderColor: colors.primary,
                    iconColor: colors.primary,
                };
        }
    };

    const config = getConfig();

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: config.backgroundColor,
                borderColor: config.borderColor,
            },
            style
        ]}>
            <Ionicons name={config.icon} size={24} color={config.iconColor} />
            <View style={styles.content}>
                {title && <Text style={styles.title}>{title}</Text>}
                <Text style={styles.message}>{message}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginVertical: 8,
    },
    content: {
        flex: 1,
        marginLeft: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    message: {
        fontSize: 14,
        lineHeight: 20,
    },
});