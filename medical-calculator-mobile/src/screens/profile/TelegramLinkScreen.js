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

    const [errors, setErrors] = useState({});

    // Используем ref для получения значения
    const telegramUsernameRef = useRef('');
    const usernameInputRef = useRef(null);

    const handleLinkTelegram = async () => {
        const newErrors = {};

        if (!telegramUsernameRef.current.trim()) {
            newErrors.telegramUsername = 'Введите username Telegram';
        } else if (!telegramUsernameRef.current.startsWith('@')) {
            newErrors.telegramUsername = 'Username должен начинаться с @';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // Отправляем только username, код подтверждения не нужен
            // Передаем фиктивный код для совместимости с API
            await linkTelegram(telegramUsernameRef.current, '000000');
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
                                        3. Укажите ваш Telegram username ниже
                                    </Text>

                                    <Button
                                        title="Открыть Telegram"
                                        variant="outline"
                                        onPress={handleOpenTelegram}
                                        style={styles.telegramButton}
                                    />
                                </Card>

                                <Card title="Привязка аккаунта" style={styles.wideCard}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>
                                            Telegram Username *
                                        </Text>
                                        <TextInput
                                            ref={usernameInputRef}
                                            style={[
                                                styles.textInput,
                                                errors.telegramUsername && styles.errorInput,
                                            ]}
                                            defaultValue={telegramUsernameRef.current}
                                            placeholder="@username"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            returnKeyType="done"
                                            onSubmitEditing={handleLinkTelegram}
                                            onChangeText={(text) => {
                                                telegramUsernameRef.current = text;
                                                if (errors.telegramUsername) {
                                                    setErrors({});
                                                }
                                            }}
                                        />
                                        {errors.telegramUsername && (
                                            <Text style={styles.errorText}>
                                                {errors.telegramUsername}
                                            </Text>
                                        )}
                                    </View>

                                    <Text style={styles.hintText}>
                                        Введите ваш публичный Telegram username
                                    </Text>

                                    <Button
                                        title="Привязать Telegram"
                                        onPress={handleLinkTelegram}
                                        loading={isLoading}
                                        disabled={isLoading}
                                        style={styles.linkButton}
                                    />
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
    inputContainer: {
        marginBottom: 20,
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
    linkButton: {
        marginTop: 10,
    },
});