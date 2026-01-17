// src/screens/main/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useQuestionnaireStore } from '../../store/questionnaireStore';
import colors from '../../constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
    const { user } = useAuthStore();
    const {
        availableTests,
        fetchAvailableTests,
        isLoading,
        loadQuestionnaire
    } = useQuestionnaireStore();

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadAvailableTests();
    }, []);

    const loadAvailableTests = async () => {
        try {
            await fetchAvailableTests();
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось загрузить тесты');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadAvailableTests();
        setRefreshing(false);
    };

    const handleTestPress = async (test) => {
        try {
            await loadQuestionnaire(test.code);
            navigation.navigate('Questionnaire', {
                questionnaireName: test.name,
            });
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось загрузить тест');
        }
    };

    const handleViewHistory = () => {
        navigation.navigate('History', { screen: 'HistoryList' });
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.header}>
                <Text style={styles.greeting}>Здравствуйте,</Text>
                <Text style={styles.userName}>{user?.full_name || user?.email}</Text>

                {user?.is_admin && (
                    <TouchableOpacity
                        style={styles.adminButton}
                    >
                        <Ionicons name="shield" size={20} color={colors.white} />
                        <Text style={styles.adminButtonText}>Администратор</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Card
                title="Доступные тесты"
                subtitle="Пройти психологическое тестирование"
                style={styles.testsCard}
            >
                {availableTests.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text" size={48} color={colors.gray} />
                        <Text style={styles.emptyText}>Нет доступных тестов</Text>
                    </View>
                ) : (
                    availableTests.map((test) => (
                        <TouchableOpacity
                            key={test.id}
                            style={styles.testItem}
                            onPress={() => handleTestPress(test)}
                            disabled={isLoading}
                        >
                            <View style={styles.testInfo}>
                                <Text style={styles.testName}>{test.name}</Text>
                                <Text style={styles.testDescription}>{test.description}</Text>
                                <Text style={styles.testQuestionCount}>
                                    {test.question_count} вопросов
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={24}
                                color={colors.primary}
                            />
                        </TouchableOpacity>
                    ))
                )}
            </Card>

            <Card
                title="Быстрые действия"
                style={styles.actionsCard}
            >
                <View style={styles.actionsContainer}>
                    <Button
                        title="История тестов"
                        variant="outline"
                        onPress={handleViewHistory}
                        icon={() => <Ionicons name="time" size={20} color={colors.primary} />}
                        style={styles.actionButton}
                    />


                </View>
            </Card>

            <Card title="Информация">
                <Text style={styles.infoText}>
                    • Тесты предназначены для самодиагностики
                    {'\n'}• Результаты требуют профессиональной интерпретации
                    {'\n'}• При высоких баллах обратитесь к специалисту
                    {'\n'}• Все данные конфиденциальны
                </Text>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: 20,
        backgroundColor: colors.white,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    greeting: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    adminButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    adminButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    testsCard: {
        marginTop: 0,
    },
    testItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    testInfo: {
        flex: 1,
        marginRight: 12,
    },
    testName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    testDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    testQuestionCount: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 16,
    },
    actionsCard: {
        marginTop: 16,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 4,
    },
    infoText: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 22,
    },
});