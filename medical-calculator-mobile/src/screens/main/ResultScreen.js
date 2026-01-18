// src/screens/main/ResultScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Share,
    TouchableOpacity,
} from 'react-native';
import { useQuestionnaireStore } from '../../store/questionnaireStore';
import colors from '../../constants/colors';
import Button from '../../components/common/Button';
import SeverityBadge from '../../components/questionnaire/SeverityBadge';
import Card from '../../components/common/Card';
import { Ionicons } from '@expo/vector-icons';

export default function ResultScreen({ navigation, route }) {
    const { resultId, resultData } = route.params;
    const { requestInterpretation, isLoading } = useQuestionnaireStore();

    const [requestedInterpretation, setRequestedInterpretation] = useState(false);

    if (!resultData) {
        return (
            <View style={styles.container}>
                <Text>Результаты не загружены</Text>
            </View>
        );
    }

    const {
        total_score,
        severity,
        interpretation,
        recommendations,
        has_suicidal_risk,
        requires_interpretation,
        created_at,
    } = resultData;

    const handleRequestInterpretation = async () => {
        try {
            Alert.alert(
                'Запрос интерпретации',
                'Отправить результат на интерпретацию администратору?',
                [
                    { text: 'Отмена', style: 'cancel' },
                    {
                        text: 'Отправить',
                        onPress: async () => {
                            await requestInterpretation(resultId);
                            setRequestedInterpretation(true);
                            Alert.alert(
                                'Успешно',
                                'Запрос отправлен администратору. Вы получите уведомление, когда интерпретация будет готова.'
                            );
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось отправить запрос');
        }
    };

    const handleShare = async () => {
        try {
            const message = `Результат теста PHQ-9:
Балл: ${total_score}
Тяжесть: ${severity}
${has_suicidal_risk ? '⚠️ Имеется суицидальный риск' : ''}

${interpretation}

Дата: ${new Date(created_at).toLocaleDateString('ru-RU')}`;

            await Share.share({
                message,
                title: 'Результаты теста PHQ-9',
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleViewHistory = () => {
        navigation.navigate('History', { screen: 'HistoryList' });
    };

    const handleNewTest = () => {
        navigation.navigate('Home');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Результаты теста</Text>
                <Text style={styles.headerDate}>
                    {new Date(created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            </View>

            <Card style={styles.resultCard}>
                <View style={styles.resultHeader}>
                    <SeverityBadge severity={severity} score={total_score} />

                    {has_suicidal_risk && (
                        <View style={styles.suicideRiskWarning}>
                            <Ionicons name="warning" size={24} color={colors.danger} />
                            <Text style={styles.suicideRiskText}>
                                ⚠️ Обнаружен суицидальный риск
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.interpretationContainer}>
                    <Text style={styles.sectionTitle}>Интерпретация</Text>
                    <Text style={styles.interpretationText}>{interpretation}</Text>
                </View>

                {recommendations && (
                    <View style={styles.recommendationsContainer}>
                        <Text style={styles.sectionTitle}>Рекомендации</Text>
                        <Text style={styles.recommendationsText}>
                            {typeof recommendations === 'string'
                                ? recommendations
                                : recommendations.recommendation}
                        </Text>
                    </View>
                )}
            </Card>

            <Card title="Действия">
                <View style={styles.actionsContainer}>
                    <Button
                        title="Поделиться результатом"
                        variant="outline"
                        onPress={handleShare}
                        icon={() => <Ionicons name="share-social" size={20} color={colors.primary} />}
                        style={styles.actionButton}
                    />


                    {requestedInterpretation && (
                        <View style={styles.requestedContainer}>
                            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                            <Text style={styles.requestedText}>
                                Запрос на интерпретацию отправлен
                            </Text>
                        </View>
                    )}
                </View>
            </Card>

            <View style={styles.bottomButtons}>
                <Button
                    title="История тестов"
                    variant="outline"
                    onPress={handleViewHistory}
                    style={styles.bottomButton}
                />
                <Button
                    title="Новый тест"
                    onPress={handleNewTest}
                    style={styles.bottomButton}
                />
            </View>

            {has_suicidal_risk && (
                <Card style={styles.emergencyCard}>
                    <View style={styles.emergencyHeader}>
                        <Ionicons name="alert-circle" size={24} color={colors.danger} />
                        <Text style={styles.emergencyTitle}>Экстренная помощь</Text>
                    </View>
                    <Text style={styles.emergencyText}>
                        Если у вас есть мысли о самоубийстве, немедленно обратитесь за помощью:
                        {'\n\n'}• Телефон доверия: 8-800-2000-122
                        {'\n'}• Экстренная психологическая помощь: 112
                        {'\n'}• Обратитесь к психиатру или психотерапевту
                    </Text>
                </Card>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.white,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    headerDate: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    resultCard: {
        marginTop: 16,
    },
    resultHeader: {
        marginBottom: 20,
    },
    suicideRiskWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${colors.danger}15`,
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    suicideRiskText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.danger,
        marginLeft: 8,
    },
    interpretationContainer: {
        marginBottom: 20,
    },
    recommendationsContainer: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    interpretationText: {
        fontSize: 16,
        color: colors.textPrimary,
        lineHeight: 24,
    },
    recommendationsText: {
        fontSize: 16,
        color: colors.textPrimary,
        lineHeight: 24,
        fontStyle: 'italic',
    },
    actionsContainer: {
        gap: 12,
    },
    actionButton: {
        marginBottom: 8,
    },
    requestedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: `${colors.success}15`,
        borderRadius: 8,
        marginTop: 8,
    },
    requestedText: {
        fontSize: 16,
        color: colors.success,
        fontWeight: '600',
        marginLeft: 8,
    },
    bottomButtons: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    bottomButton: {
        flex: 1,
    },
    emergencyCard: {
        margin: 16,
        borderColor: colors.danger,
        borderWidth: 2,
    },
    emergencyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    emergencyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.danger,
        marginLeft: 8,
    },
    emergencyText: {
        fontSize: 14,
        color: colors.textPrimary,
        lineHeight: 20,
    },
});
