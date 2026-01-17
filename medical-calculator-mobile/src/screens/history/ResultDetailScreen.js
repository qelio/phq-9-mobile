// src/screens/history/ResultDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Share,
    Dimensions,
} from 'react-native';
import { useQuestionnaireStore } from '../../store/questionnaireStore';
import colors from '../../constants/colors';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SeverityBadge from '../../components/questionnaire/SeverityBadge';
import Loader from '../../components/common/Loader';
import { formatDateTime } from '../../utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { questionnaireAPI } from '../../api/endpoints';

const { width } = Dimensions.get('window');

export default function ResultDetailScreen({ navigation, route }) {
    const { resultId } = route.params;
    const { requestInterpretation, isLoading } = useQuestionnaireStore();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadResult();
    }, [resultId]);

    const loadResult = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching result with ID:', resultId);
            const response = await questionnaireAPI.getResult(resultId);
            console.log('API Response data:', response.data);

            if (response) {
                // В axios данные уже в response.data
                const resultData = response;

                console.log('Result data:', resultData);

                // Проверяем, есть ли ошибка в ответе
                if (resultData.error) {
                    throw new Error(resultData.error);
                }

                // Если данные содержат нужные поля
                if (resultData.id) {
                    setResult(resultData);
                } else {
                    console.log('Missing required fields in result data:', resultData);
                    throw new Error('Некорректная структура данных результата');
                }
            } else {
                console.log('Empty or invalid response:', response);
                throw new Error('Не удалось получить данные от сервера');
            }
        } catch (error) {
            console.error('Error loading result details:', error);

            // Пытаемся получить понятное сообщение об ошибке
            let errorMessage = 'Не удалось загрузить результат';

            if (error.response) {
                // Ошибка от сервера
                console.log('Error response data:', error.response.data);
                console.log('Error response status:', error.response.status);

                if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.status === 404) {
                    errorMessage = 'Результат не найден';
                } else if (error.response.status === 403) {
                    errorMessage = 'Доступ запрещен';
                } else if (error.response.status === 401) {
                    errorMessage = 'Требуется авторизация';
                } else if (error.response.data) {
                    // Пробуем получить любую строку ошибки из данных
                    errorMessage = typeof error.response.data === 'string'
                        ? error.response.data
                        : JSON.stringify(error.response.data);
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            console.log('Setting error message:', errorMessage);
            setError(errorMessage);

            // Показываем алерт только для критических ошибок
            if (errorMessage.includes('Требуется авторизация') ||
                errorMessage.includes('Доступ запрещен') ||
                errorMessage.includes('Результат не найден')) {
                Alert.alert('Ошибка', errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRequestInterpretation = async () => {
        Alert.alert(
            'Запрос интерпретации',
            'Отправить результат на интерпретацию администратору?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Отправить',
                    onPress: async () => {
                        try {
                            await requestInterpretation(resultId);
                            Alert.alert('Успех', 'Запрос отправлен администратору');
                            // Обновляем данные результата после запроса
                            loadResult();
                        } catch (error) {
                            Alert.alert('Ошибка', 'Не удалось отправить запрос');
                        }
                    },
                },
            ]
        );
    };

    const handleShare = async () => {
        if (!result) return;

        try {
            const message = `Результат теста ${result.questionnaire?.name || 'Неизвестный тест'}
Балл: ${result.total_score || 0}
Тяжесть: ${result.severity || 'Не определено'}
Дата: ${formatDateTime(result.created_at)}`;

            await Share.share({
                message,
                title: 'Результат теста',
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleRefresh = () => {
        setError(null);
        loadResult();
    };

    // Функция для преобразования ответов из формата ответов API
    const getAnswersFromResponse = (answers) => {
        if (!answers || typeof answers !== 'object') return {};

        // Возвращаем ответы как есть, так как они уже в правильном формате
        // { "1": 2, "2": 1, ... }
        return answers;
    };

    const getAnswerText = (value) => {
        if (value === undefined || value === null) return 'Не отвечено';

        const answers = {
            0: 'Ни разу',
            1: 'Несколько дней',
            2: 'Более половины дней',
            3: 'Почти каждый день'
        };
        return answers[value] || `Значение: ${value}`;
    };

    // Проверяем суицидальный риск
    const hasSuicidalRisk = (answers) => {
        if (!answers) return false;

        // Проверяем разные возможные ключи для 9-го вопроса
        if (answers['9'] !== undefined && answers['9'] > 0) {
            return true;
        }

        if (answers['question_9'] !== undefined && answers['question_9'] > 0) {
            return true;
        }

        if (answers['q9'] !== undefined && answers['q9'] > 0) {
            return true;
        }

        return false;
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Header title="Детали результата" onBack={() => navigation.goBack()} />
                <Loader />
            </View>
        );
    }

    if (error || !result) {
        return (
            <View style={styles.container}>
                <Header title="Детали результата" onBack={() => navigation.goBack()} />
                <View style={styles.errorContainer}>
                    <Ionicons name="warning-outline" size={64} color={colors.danger} />
                    <Text style={styles.errorText}>
                        {error || 'Не удалось загрузить результат'}
                    </Text>
                    <Button
                        title="Повторить"
                        onPress={handleRefresh}
                        style={styles.retryButton}
                    />
                    <Button
                        title="Вернуться назад"
                        variant="outline"
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    />
                </View>
            </View>
        );
    }

    const answers = getAnswersFromResponse(result.answers);
    const suicidalRisk = hasSuicidalRisk(answers);

    return (
        <View style={styles.container}>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Card style={styles.wideCard}>
                    <View style={styles.header}>
                        <Text style={styles.questionnaireName}>
                            {result.questionnaire?.name || 'Тест'}
                        </Text>
                        <Text style={styles.date}>
                            {formatDateTime(result.created_at)}
                        </Text>
                    </View>

                    <SeverityBadge
                        severity={result.severity}
                        score={result.total_score}
                        style={styles.severityBadge}
                    />

                    {suicidalRisk && (
                        <View style={styles.warningContainer}>
                            <Ionicons name="warning" size={20} color={colors.danger} />
                            <Text style={styles.warningText}>
                                Обнаружен суицидальный риск
                            </Text>
                        </View>
                    )}
                </Card>

                {Object.keys(answers).length > 0 && (
                    <Card title="Ответы на вопросы" style={styles.wideCard}>
                        {Object.entries(answers).map(([questionNumber, answer]) => (
                            <View key={questionNumber} style={styles.answerItem}>
                                <Text style={styles.questionNumber}>
                                    Вопрос {questionNumber}:
                                </Text>
                                <Text style={styles.answerValue}>
                                    {getAnswerText(answer)}
                                </Text>
                            </View>
                        ))}
                    </Card>
                )}

                <Card title="Интерпретация" style={styles.wideCard}>
                    <Text style={styles.interpretationText}>
                        {result.interpretation || 'Интерпретация отсутствует'}
                    </Text>


                    {result.is_interpreted && result.interpretation_comment && (
                        <View style={styles.adminComment}>
                            <Text style={styles.commentTitle}>
                                Комментарий администратора:
                            </Text>
                            <Text style={styles.commentText}>
                                {result.interpretation_comment}
                            </Text>
                            {result.interpretation_date && (
                                <Text style={styles.commentDate}>
                                    {formatDateTime(result.interpretation_date)}
                                </Text>
                            )}
                        </View>
                    )}
                </Card>

                <View style={styles.actions}>
                    <Button
                        title="Поделиться"
                        variant="outline"
                        onPress={handleShare}
                        icon={() => <Ionicons name="share" size={20} color={colors.primary} />}
                        style={styles.actionButton}
                    />

                    <Button
                        title="Назад к истории"
                        onPress={() => navigation.goBack()}
                        style={styles.actionButton}
                    />
                </View>
            </ScrollView>
        </View>
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
    wideCard: {
        marginHorizontal: 8,
        marginVertical: 8,
        borderRadius: 12,
    },
    header: {
        marginBottom: 16,
    },
    questionnaireName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    severityBadge: {
        marginVertical: 12,
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${colors.danger}15`,
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    warningText: {
        fontSize: 16,
        color: colors.danger,
        fontWeight: '600',
        marginLeft: 8,
    },
    answerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border || colors.gray,
    },
    questionNumber: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '600',
        flex: 1,
    },
    answerValue: {
        fontSize: 16,
        color: colors.textSecondary,
        flex: 1,
        textAlign: 'right',
        marginLeft: 10,
    },
    interpretationText: {
        fontSize: 16,
        color: colors.textPrimary,
        lineHeight: 24,
        marginBottom: 20,
    },
    requestButton: {
        marginTop: 12,
    },
    adminComment: {
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border || colors.gray,
    },
    commentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    commentText: {
        fontSize: 16,
        color: colors.textPrimary,
        lineHeight: 24,
        fontStyle: 'italic',
        marginBottom: 8,
    },
    commentDate: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'right',
    },
    actions: {
        gap: 12,
        marginVertical: 16,
        marginHorizontal: 8,
        marginBottom: 30,
    },
    actionButton: {
        marginBottom: 8,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginVertical: 16,
    },
    retryButton: {
        marginTop: 20,
        minWidth: 150,
    },
    backButton: {
        marginTop: 12,
        minWidth: 150,
    },
    refreshIcon: {
        marginRight: 16,
    },
});