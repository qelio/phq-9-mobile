// src/components/questionnaire/QuestionCard.js
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native'; // Добавьте View и другие компоненты
import colors from '../../constants/colors';
import AnswerButton from './AnswerButton';
import ProgressBar from './ProgressBar';

const QuestionCard = ({
                          question,
                          questionNumber,
                          totalQuestions,
                          selectedAnswer,
                          onAnswerSelect,
                      }) => {
    const options = Object.entries(question.options).map(([key, value]) => ({
        key,
        label: value,
        value: parseInt(key, 10),
    }));

    const progress = ((questionNumber - 1) / totalQuestions) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.questionNumber}>
                    Вопрос {questionNumber} из {totalQuestions}
                </Text>
                <ProgressBar
                    progress={questionNumber - 1}
                    total={totalQuestions}
                    showText={false}
                />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.questionText}>{question.question_text}</Text>

                <View style={styles.optionsContainer}>
                    {options.map((option) => (
                        <AnswerButton
                            key={option.key}
                            label={option.label}
                            value={option.value}
                            selected={selectedAnswer === option.value}
                            onPress={() => onAnswerSelect(option.value)}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        margin: 16,
        padding: 20,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        marginBottom: 20,
    },
    questionNumber: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    content: {
        flex: 1,
    },
    questionText: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 30,
        lineHeight: 28,
    },
    optionsContainer: {
        marginTop: 10,
    },
});

export default QuestionCard;