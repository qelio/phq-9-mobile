// src/components/common/Card.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const Card = ({
                  children,
                  title,
                  subtitle,
                  onPress,
                  style,
                  titleStyle,
                  subtitleStyle,
                  showChevron = false,
                  padding = 16,
              }) => {
    const CardContent = () => (
        <View style={[styles.card, { padding }, style]}>
            {(title || subtitle) && (
                <View style={styles.header}>
                    {title && (
                        <Text style={[styles.title, titleStyle]}>{title}</Text>
                    )}
                    {subtitle && (
                        <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
                    )}
                </View>
            )}

            <View style={styles.content}>
                {children}
            </View>

            {showChevron && (
                <View style={styles.chevron}>
                    <Ionicons name="chevron-forward" size={20} color={colors.darkGray} />
                </View>
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <CardContent />
            </TouchableOpacity>
        );
    }

    return <CardContent />;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        position: 'relative',
    },
    header: {
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    content: {
        flex: 1,
    },
    chevron: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
});

export default Card;