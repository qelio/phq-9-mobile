// src/components/common/Button.js
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import colors from '../../constants/colors';

const Button = ({
                    title,
                    onPress,
                    variant = 'primary',
                    disabled = false,
                    loading = false,
                    style,
                    textStyle,
                    icon: Icon,
                    iconPosition = 'left',
                }) => {
    const getVariantStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.primary;
            case 'secondary':
                return styles.secondary;
            case 'outline':
                return styles.outline;
            case 'danger':
                return styles.danger;
            case 'success':
                return styles.success;
            default:
                return styles.primary;
        }
    };

    const getTextVariantStyle = () => {
        switch (variant) {
            case 'outline':
                return styles.textOutline;
            default:
                return styles.textPrimary;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getVariantStyle(),
                disabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' ? colors.primary : colors.white}
                    size="small"
                />
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon style={styles.iconLeft} />}
                    <Text style={[styles.text, getTextVariantStyle(), textStyle]}>
                        {title}
                    </Text>
                    {Icon && iconPosition === 'right' && <Icon style={styles.iconRight} />}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minHeight: 50,
    },
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.secondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    danger: {
        backgroundColor: colors.danger,
    },
    success: {
        backgroundColor: colors.success,
    },
    disabled: {
        backgroundColor: colors.gray,
        opacity: 0.6,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    textPrimary: {
        color: colors.white,
    },
    textOutline: {
        color: colors.primary,
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
});

export default Button;