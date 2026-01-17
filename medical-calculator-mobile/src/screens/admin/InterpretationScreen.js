// src/screens/admin/InterpretationScreen.js
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
} from 'react-native';
import { useAdminStore } from '../../store/adminStore';
import colors from '../../constants/colors';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SeverityBadge from '../../components/questionnaire/SeverityBadge';
import { formatDateTime } from '../../utils/formatters';

export default function InterpretationScreen({ navigation, route }) {
    const { result } = route.params;
    const { interpretResult, isLoading } = useAdminStore();

    const [errors, setErrors] = useState({});

    // Используем ref для получения значений
    const commentRef = useRef('');
    const recommendationsRef = useRef('');

    const validateForm = () => {
        const newErrors = {};

        if (!commentRef.current.trim()) {
            newErrors.comment = 'Комментарий обязателен';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const formData = {
            comment: commentRef.current,
            recommendations: recommendationsRef.current,
            status: 'completed',
        };

        Alert.alert(
            'Подтверждение',
            'Добавить интерпретацию к результату?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Добавить',
                    onPress: async () => {
                        try {
                            await interpretResult(result.id, formData);
                            Alert.alert(
                                'Успех',
                                'Интерпретация успешно добавлена',
                                [{ text: 'OK', onPress: () => navigation.goBack() }]
                            );
                        } catch (error) {
                            Alert.alert('Ошибка', 'Не удалось добавить интерпретацию');
                        }
                    },
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
                        <Card title="Информация о результате" style={styles.wideCard}>
                            <View style={styles.resultInfo}>
                                <Text style={styles.userName}>{result.user.full_name}</Text>
                                <Text style={styles.userEmail}>{result.user.email}</Text>
                                <Text style={styles.date}>
                                    {formatDateTime(result.created_at)}
                                </Text>
                            </View>

                            <View style={styles.resultDetails}>
                                <Text style={styles.questionnaireName}>
                                    {result.questionnaire_name}
                                </Text>

                                <SeverityBadge
                                    severity={result.severity}
                                    score={result.total_score}
                                />

                                {result.has_suicidal_risk && (
                                    <View style={styles.warning}>
                                        <Text style={styles.warningText}>
                                            ⚠️ Суицидальный риск обнаружен
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </Card>

                        <Card title="Интерпретация" style={styles.wideCard}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Комментарий *</Text>
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        errors.comment && styles.errorInput,
                                        styles.commentInput,
                                    ]}
                                    placeholder="Введите вашу интерпретацию результата..."
                                    multiline
                                    numberOfLines={6}
                                    textAlignVertical="top"
                                    onChangeText={(text) => {
                                        commentRef.current = text;
                                        if (errors.comment) setErrors({});
                                    }}
                                />
                                {errors.comment && (
                                    <Text style={styles.errorText}>{errors.comment}</Text>
                                )}
                            </View>

                            {/*<View style={styles.inputContainer}>*/}
                            {/*    <Text style={styles.inputLabel}>Рекомендации</Text>*/}
                            {/*    <TextInput*/}
                            {/*        style={[*/}
                            {/*            styles.textInput,*/}
                            {/*            styles.recommendationsInput,*/}
                            {/*        ]}*/}
                            {/*        placeholder="Дополнительные рекомендации для пользователя..."*/}
                            {/*        multiline*/}
                            {/*        numberOfLines={4}*/}
                            {/*        textAlignVertical="top"*/}
                            {/*        onChangeText={(text) => {*/}
                            {/*            recommendationsRef.current = text;*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*</View>*/}
                        </Card>

                        <View style={styles.actions}>
                            <Button
                                title="Сохранить интерпретацию"
                                onPress={handleSubmit}
                                loading={isLoading}
                                disabled={isLoading}
                                style={styles.submitButton}
                            />

                            <Button
                                title="Отмена"
                                variant="outline"
                                onPress={() => navigation.goBack()}
                            />
                        </View>
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
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
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
    commentInput: {
        minHeight: 120,
    },
    recommendationsInput: {
        minHeight: 80,
    },
    resultInfo: {
        marginBottom: 16,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    date: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    resultDetails: {
        marginTop: 12,
    },
    questionnaireName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    warning: {
        backgroundColor: `${colors.danger}15`,
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    warningText: {
        fontSize: 16,
        color: colors.danger,
        fontWeight: '600',
    },
    actions: {
        marginTop: 20,
        gap: 12,
        marginHorizontal: 8,
        marginBottom: 20,
    },
    submitButton: {
        marginBottom: 8,
    },
});