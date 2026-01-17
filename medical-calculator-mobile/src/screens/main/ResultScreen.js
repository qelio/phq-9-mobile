// src/screens/profile/TelegramLinkScreen.js
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Linking,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import colors from '../../constants/colors';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';

const { width } = Dimensions.get('window');

export default function TelegramLinkScreen({ navigation }) {
    const { user, linkTelegram, isLoading } = useAuthStore();

    const [telegramUsername, setTelegramUsername] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});

    const usernameInputRef = useRef(null);
    const codeInputRef = useRef(null);

    const handleStartLinking = () => {
        const newErrors = {};

        if (!telegramUsername.trim()) {
            newErrors.telegramUsername = 'Введите username Telegram';
        } else if (!telegramUsername.startsWith('@')) {
            newErrors.telegramUsername = 'Username должен начинаться с @';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setStep(2);
        Alert.alert(
            'Код подтверждения',
            'Для завершения привязки введите код 123456 в поле ниже'
        );

        // Фокус на поле с кодом
        setTimeout(() => {
            codeInputRef.current?.focus();
        }, 100);
    };

    const handleCompleteLinking = async () => {
        if (!verificationCode.trim()) {
            Alert.alert('Ошибка', 'Введите код подтверждения');
            return;
        }

        try {
            await linkTelegram(telegramUsername, verificationCode);
            Alert.alert('Успех', 'Telegram успешно привязан');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Ошибка', error.message || 'Не удалось привязать Telegram');
        }
    };

    const handleOpenTelegram = () => {
        Linking.openURL('https://t.me/your_bot_username').catch(() => {
            Alert.alert('Ошибка', 'Не удалось открыть Telegram');
        });
    };

    const handleUnlink = () => {
        Alert.alert(
            'Отвязка Telegram',
            'Вы уверены, что хотите отвязать Telegram?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Отвязать',
                    style: 'destructive',
                    onPress: () => Alert.alert('В разработке', 'Функция в разработке'),
                },
            ]
        );
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Header
                    title="Привязка Telegram"
                    onBack={() => navigation.goBack()}
                />

                <KeyboardAvoidingView
                    style={styles.content}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {user?.telegram_username ? (
                            <Card title="Telegram уже привязан" style={styles.wideCard}>
                                <View style={styles.linkedContainer}>
                                    <Text style={styles.linkedText}>
                                        Привязан: {user.telegram_username}
                                    </Text>
                                    <Button
                                        title="Отвязать"
                                        variant="danger"
                                        onPress={handleUnlink}
                                        style={styles.unlinkButton}
                                    />
                                </View>
                            </Card>
                        ) : (
                            <>
                                <Card title="Инструкция" style={styles.wideCard}>
                                    <Text style={styles.instructionText}>
                                        1. Убедитесь, что у вас установлен Telegram{'\n'}
                                        2. Ваш username должен быть публичным{'\n'}
                                        3. Для получения уведомлений подпишитесь на нашего бота
                                    </Text>

                                    <Button
                                        title="Открыть Telegram"
                                        variant="outline"
                                        onPress={handleOpenTelegram}
                                        style={styles.telegramButton}
                                    />
                                </Card>

                                <Card title="Привязка аккаунта" style={styles.wideCard}>
                                    {step === 1 ? (
                                        <>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.inputLabel}>
                                                    Telegram Username
                                                </Text>
                                                <TextInput
                                                    ref={usernameInputRef}
                                                    style={[
                                                        styles.textInput,
                                                        errors.telegramUsername && styles.errorInput,
                                                    ]}
                                                    value={telegramUsername}
                                                    onChangeText={(text) => {
                                                        setTelegramUsername(text);
                                                        if (errors.telegramUsername) {
                                                            setErrors({});
                                                        }
                                                    }}
                                                    placeholder="@username"
                                                    autoCapitalize="none"
                                                />
                                                {errors.telegramUsername && (
                                                    <Text style={styles.errorText}>
                                                        {errors.telegramUsername}
                                                    </Text>
                                                )}
                                            </View>

                                            <Button
                                                title="Продолжить"
                                                onPress={handleStartLinking}
                                                loading={isLoading}
                                                disabled={isLoading}
                                                style={styles.nextButton}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Text style={styles.stepText}>
                                                Шаг 2: Подтверждение
                                            </Text>

                                            <View style={styles.inputContainer}>
                                                <Text style={styles.inputLabel}>
                                                    Код подтверждения
                                                </Text>
                                                <TextInput
                                                    ref={codeInputRef}
                                                    style={styles.textInput}
                                                    value={verificationCode}
                                                    onChangeText={setVerificationCode}
                                                    placeholder="123456"
                                                    keyboardType="number-pad"
                                                    maxLength={6}
                                                />
                                            </View>

                                            <Text style={styles.hintText}>
                                                Введите код 123456 для тестирования
                                            </Text>

                                            <View style={styles.buttonRow}>
                                                <Button
                                                    title="Назад"
                                                    variant="outline"
                                                    onPress={() => setStep(1)}
                                                    style={styles.backButton}
                                                />

                                                <Button
                                                    title="Завершить"
                                                    onPress={handleCompleteLinking}
                                                    loading={isLoading}
                                                    disabled={isLoading}
                                                    style={styles.completeButton}
                                                />
                                            </View>
                                        </>
                                    )}
                                </Card>
                            </>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    wideCard: {
        marginHorizontal: 8,
        marginVertical: 8,
        borderRadius: 12,
        padding: 16,
    },
    linkedContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    linkedText: {
        fontSize: 18,
        color: colors.primary,
        marginBottom: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    unlinkButton: {
        width: '100%',
        maxWidth: 200,
    },
    instructionText: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 24,
        marginBottom: 20,
    },
    telegramButton: {
        marginTop: 10,
    },
    stepText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border || colors.gray,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.textPrimary,
        minHeight: 44,
    },
    errorInput: {
        borderColor: colors.danger,
    },
    errorText: {
        fontSize: 14,
        color: colors.danger,
        marginTop: 4,
    },
    hintText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 20,
        fontStyle: 'italic',
    },
    nextButton: {
        marginTop: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    backButton: {
        flex: 1,
    },
    completeButton: {
        flex: 1,
    },
});