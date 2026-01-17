// src/screens/main/QuestionnaireScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { useQuestionnaireStore } from '../../store/questionnaireStore';
import colors from '../../constants/colors';
import Button from '../../components/common/Button';
import QuestionCard from '../../components/questionnaire/QuestionCard';

export default function QuestionnaireScreen({ navigation, route }) {
    const {
        currentTest,
        answers,
        currentQuestionIndex,
        answerQuestion,
        goToPreviousQuestion,
        submitQuestionnaire,
        isLoading
    } = useQuestionnaireStore();

    const [localAnswers, setLocalAnswers] = useState({});

    if (!currentTest || !currentTest.questions) {
        return (
            <View style={styles.container}>
                <Text>Тест не загружен</Text>
            </View>
        );
    }

    const questions = currentTest.questions;
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    // Объединяем ответы из store и локальные
    const allAnswers = { ...answers, ...localAnswers };
    const currentAnswer = allAnswers[currentQuestion?.id];

    const handleAnswerSelect = (value) => {
        // Сохраняем ответ локально
        setLocalAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value
        }));

        // Если это не последний вопрос, переходим к следующему
        if (currentQuestionIndex < totalQuestions - 1) {
            answerQuestion(currentQuestion.id, value);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            goToPreviousQuestion();
        }
    };

    const handleSubmit = async () => {
        // Собираем все ответы
        const finalAnswers = { ...answers, ...localAnswers };

        // Проверяем, что все вопросы отвечены
        const unansweredQuestions = questions.filter(
            q => finalAnswers[q.id] === undefined
        );

        if (unansweredQuestions.length > 0) {
            Alert.alert(
                'Не все вопросы отвечены',
                'Пожалуйста, ответьте на все вопросы перед отправкой.',
                [{ text: 'OK' }]
            );
            return;
        }

        try {
            const result = await submitQuestionnaire('mobile');

            // Переходим на экран результатов
            navigation.navigate('Result', {
                resultId: result.result_id,
                resultData: result
            });
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось отправить результаты');
        }
    };

    const handleSkip = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            answerQuestion(currentQuestion.id, 0); // По умолчанию 0
        } else {
            Alert.alert(
                'Пропустить вопрос?',
                'Вы не ответили на последний вопрос. Хотите пропустить его?',
                [
                    { text: 'Отмена', style: 'cancel' },
                    {
                        text: 'Пропустить',
                        onPress: () => handleAnswerSelect(0)
                    },
                ]
            );
        }
    };

    return (
        <View style={styles.container}>
            <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={totalQuestions}
                selectedAnswer={currentAnswer}
                onAnswerSelect={handleAnswerSelect}
            />

            <View style={styles.buttonsContainer}>
                <View style={styles.buttonRow}>
                    {currentQuestionIndex > 0 && (
                        <Button
                            title="Назад"
                            variant="outline"
                            onPress={handlePrevious}
                            style={[styles.button, styles.backButton]}
                        />
                    )}

                    {/*<Button*/}
                    {/*    title="Пропустить"*/}
                    {/*    variant="outline"*/}
                    {/*    onPress={handleSkip}*/}
                    {/*    style={[styles.button, styles.skipButton]}*/}
                    {/*/>*/}
                </View>

                {currentQuestionIndex === totalQuestions - 1 ? (
                    <Button
                        title="Завершить тест"
                        onPress={handleSubmit}
                        loading={isLoading}
                        disabled={isLoading}
                        style={styles.submitButton}
                    />
                ) : (
                    <Button
                        title="Далее"
                        onPress={() => {
                            if (currentAnswer !== undefined) {
                                answerQuestion(currentQuestion.id, currentAnswer);
                            } else {
                                Alert.alert(
                                    'Не выбран ответ',
                                    'Пожалуйста, выберите вариант ответа перед продолжением.'
                                );
                            }
                        }}
                        disabled={currentAnswer === undefined}
                        style={styles.nextButton}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    buttonsContainer: {
        padding: 16,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.gray,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
    },
    backButton: {
        flex: 1,
    },
    skipButton: {
        flex: 0.5,
    },
    nextButton: {
        marginTop: 8,
    },
    submitButton: {
        marginTop: 8,
    },
});