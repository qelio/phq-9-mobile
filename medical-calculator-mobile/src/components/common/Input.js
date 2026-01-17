// src/components/common/Input.js
import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const Input = ({
                   label,
                   value,
                   onChangeText,
                   placeholder,
                   secureTextEntry = false,
                   error,
                   keyboardType = 'default',
                   autoCapitalize = 'none',
                   multiline = false,
                   numberOfLines = 1,
                   icon,
                   onIconPress,
                   editable = true,
                   style,
                   inputStyle,
               }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={[
                styles.inputContainer,
                isFocused && styles.inputContainerFocused,
                error && styles.inputContainerError,
                !editable && styles.inputContainerDisabled,
            ]}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={colors.darkGray}
                        style={styles.leftIcon}
                    />
                )}

                <TextInput
                    style={[
                        styles.input,
                        multiline && styles.multilineInput,
                        inputStyle,
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.darkGray}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    editable={editable}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={togglePasswordVisibility}
                        style={styles.rightIcon}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={20}
                            color={colors.darkGray}
                        />
                    </TouchableOpacity>
                )}

                {onIconPress && (
                    <TouchableOpacity
                        onPress={onIconPress}
                        style={styles.rightIcon}
                    >
                        <Ionicons name="search" size={20} color={colors.darkGray} />
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        color: colors.textPrimary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    inputContainerFocused: {
        borderColor: colors.primary,
    },
    inputContainerError: {
        borderColor: colors.danger,
    },
    inputContainerDisabled: {
        backgroundColor: colors.lightGray,
        opacity: 0.7,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
        paddingVertical: 12,
        minHeight: 48,
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    leftIcon: {
        marginRight: 10,
    },
    rightIcon: {
        marginLeft: 10,
        padding: 4,
    },
    errorText: {
        fontSize: 12,
        color: colors.danger,
        marginTop: 4,
        marginLeft: 4,
    },
});

export default Input;