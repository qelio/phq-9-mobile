// src/screens/main/InterpretationRequestScreen.js
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
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function InterpretationRequestScreen({ navigation, route }) {
    const { resultId } = route.params;
    const { requestInterpretation, isLoading } = useQuestionnaireStore();

    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async () => {
        if (!comment.trim()) {
            setErrors({ comment: 'Комментарий обязателен' });
            return;
        }

        Alert.alert(
            'Подтверждение',
            'Отправить запрос на интерпретацию?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Отправить',
                    onPress: async () => {
                        try {
                            await requestInterpretation(resultId);
                            Alert.alert(
                                'Успех',
                                'Запрос отправлен администратору',
                                [{ text: 'OK', onPress: () => navigation.goBack() }]
                            );
                        } catch (error) {
                            Alert.alert('Ошибка', 'Не удалось отправить запрос');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>

            <ScrollView style={styles.content}>
                <Card>
                    <Text style={styles.title}>Добавьте комментарий</Text>
                    <Text style={styles.subtitle}>
                        Опишите, что именно вас беспокоит или какие дополнительные
                        сведения нужно учесть при интерпретации результата.
                    </Text>

                    <Input
                        value={comment}
                        onChangeText={(text) => {
                            setComment(text);
                            if (errors.comment) setErrors({});
                        }}
                        placeholder="Введите ваш комментарий..."
                        multiline
                        numberOfLines={6}
                        error={errors.comment}
                        style={styles.commentInput}
                    />

                    <Text style={styles.hint}>
                        Администратор получит ваш запрос и в ближайшее время предоставит
                        профессиональную интерпретацию результатов.
                    </Text>
                </Card>

                <View style={styles.actions}>
                    <Button
                        title="Отправить запрос"
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
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 22,
        marginBottom: 20,
    },
    commentInput: {
        marginBottom: 16,
    },
    hint: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
        fontStyle: 'italic',
        marginTop: 12,
    },
    actions: {
        marginTop: 20,
        gap: 12,
    },
    submitButton: {
        marginBottom: 8,
    },
});