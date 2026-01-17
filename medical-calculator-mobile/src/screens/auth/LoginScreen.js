// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import colors from '../../constants/colors';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function LoginScreen({ navigation }) {
    const { login, isLoading } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Некорректный email';
        }

        if (!password.trim()) {
            newErrors.password = 'Пароль обязателен';
        } else if (password.length < 6) {
            newErrors.password = 'Минимум 6 символов';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            await login(email, password);
        } catch (error) {
            setErrors({ general: error.message || 'Ошибка входа' });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Медицинский калькулятор</Text>
                    <Text style={styles.subtitle}>Войдите в свой аккаунт</Text>
                </View>

                <View style={styles.formContainer}>
                    {errors.general && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errors.general}</Text>
                        </View>
                    )}

                    <Input
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Введите ваш email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email}
                        icon="mail-outline"
                    />

                    <Input
                        label="Пароль"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Введите пароль"
                        secureTextEntry
                        error={errors.password}
                        icon="lock-closed-outline"
                    />

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
                    </TouchableOpacity>

                    <Button
                        title="Войти"
                        onPress={handleLogin}
                        loading={isLoading}
                        disabled={isLoading}
                        style={styles.loginButton}
                    />

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Нет аккаунта? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.registerLink}>Зарегистрироваться</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    formContainer: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 24,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    errorContainer: {
        backgroundColor: `${colors.danger}15`,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.danger,
    },
    errorText: {
        color: colors.danger,
        fontSize: 14,
        textAlign: 'center',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        marginBottom: 24,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    registerLink: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});