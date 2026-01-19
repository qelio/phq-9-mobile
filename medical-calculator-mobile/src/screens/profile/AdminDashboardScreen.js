// src/screens/profile/AdminDashboardScreen.js
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Alert,
    Dimensions,
} from 'react-native';
import { useAdminStore } from '../../store/adminStore';
import colors from '../../constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen({ navigation }) {
    const {
        statistics,
        fetchStatistics,
        fetchPendingResults,
        isLoading
    } = useAdminStore();

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            await Promise.all([
                fetchStatistics(),
                fetchPendingResults(1, 5), // Только 5 последних
            ]);
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось загрузить данные');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleViewPendingResults = () => {
        navigation.navigate('PendingResults');
    };

    const handleViewUsers = () => {
        navigation.navigate('UserManagement');
    };

    const handleViewStatistics = () => {
        navigation.navigate('Statistics');
    };

    const handleQuickAction = async (action) => {
        switch (action) {
            case 'refresh':
                await loadData();
                break;
            case 'export':
                Alert.alert('Экспорт', 'Функция экспорта в разработке');
                break;
        }
    };

    // Функция для перевода тяжести на русский
    const getSeverityRussian = (severity) => {
        switch (severity) {
            case 'Minimal or none':
                return 'Минимальная или отсутствует';
            case 'Mild':
                return 'Легкая';
            case 'Moderate':
                return 'Умеренная';
            case 'Moderately severe':
                return 'Умеренно тяжелая';
            case 'Severe':
                return 'Тяжелая';
            default:
                return severity;
        }
    };

    if (!statistics) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text>Загрузка...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
            >

                <Card title="Общая статистика" style={styles.wideCard}>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: `${colors.primary}20` }]}>
                                <Ionicons name="people" size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.statValue}>
                                {statistics.total_users || 0}
                            </Text>
                            <Text style={styles.statLabel}>Пользователи</Text>
                        </View>

                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: `${colors.success}20` }]}>
                                <Ionicons name="document-text" size={24} color={colors.success} />
                            </View>
                            <Text style={styles.statValue}>
                                {statistics.total_results || 0}
                            </Text>
                            <Text style={styles.statLabel}>Тестов пройдено</Text>
                        </View>

                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: `${colors.warning}20` }]}>
                                <Ionicons name="time" size={24} color={colors.warning} />
                            </View>
                            <Text style={styles.statValue}>
                                {statistics.total_pending_interpretations || 0}
                            </Text>
                            <Text style={styles.statLabel}>Ожидают интерпретации</Text>
                        </View>

                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: `${colors.danger}20` }]}>
                                <Ionicons name="alert-circle" size={24} color={colors.danger} />
                            </View>
                            <Text style={styles.statValue}>
                                {statistics.phq9_statistics?.severity_distribution?.Severe || 0}
                            </Text>
                            <Text style={styles.statLabel}>Тяжёлые случаи</Text>
                        </View>
                    </View>
                </Card>


                <Card title="Распределение PHQ-9" style={styles.wideCard}>
                    <View style={styles.severityChart}>
                        {Object.entries(statistics.phq9_statistics?.severity_distribution || {}).map(([severity, count]) => {
                            const totalTests = statistics.phq9_statistics?.total_tests || 1;
                            const percentage = (count / totalTests) * 100;

                            return (
                                <View key={severity} style={styles.severityItem}>
                                    <View style={styles.severityHeader}>
                                        <Text style={styles.severityName}>
                                            {getSeverityRussian(severity)}
                                        </Text>
                                        <Text style={styles.severityCount}>
                                            {count} ({percentage.toFixed(1)}%)
                                        </Text>
                                    </View>
                                    <View style={styles.severityBar}>
                                        <View
                                            style={[
                                                styles.severityBarFill,
                                                { width: `${percentage}%` },
                                                getSeverityColor(severity)
                                            ]}
                                        />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </Card>

                <Card title="Быстрые действия" style={styles.wideCard}>
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={styles.quickAction}
                            onPress={handleViewPendingResults}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.warning}15` }]}>
                                <Ionicons name="create" size={24} color={colors.warning} />
                            </View>
                            <Text style={styles.quickActionText}>Интерпретация</Text>
                            <Text style={styles.quickActionSubtext}>
                                {statistics.total_pending_interpretations || 0} ожидают
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickAction}
                            onPress={handleViewUsers}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.primary}15` }]}>
                                <Ionicons name="people" size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.quickActionText}>Пользователи</Text>
                            <Text style={styles.quickActionSubtext}>
                                {statistics.total_users || 0} всего
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickAction}
                            onPress={handleViewStatistics}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.success}15` }]}>
                                <Ionicons name="stats-chart" size={24} color={colors.success} />
                            </View>
                            <Text style={styles.quickActionText}>Статистика</Text>
                            <Text style={styles.quickActionSubtext}>Детальный анализ</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickAction}
                            onPress={() => handleQuickAction('export')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.secondary}15` }]}>
                                <Ionicons name="download" size={24} color={colors.secondary} />
                            </View>
                            <Text style={styles.quickActionText}>Экспорт</Text>
                            <Text style={styles.quickActionSubtext}>Выгрузить данные</Text>
                        </TouchableOpacity>
                    </View>
                </Card>


                <Card title="Дополнительные функции" style={styles.wideCard}>
                    <Button
                        title="Обновить данные"
                        variant="outline"
                        onPress={() => handleQuickAction('refresh')}
                        loading={isLoading}
                        icon={() => <Ionicons name="refresh" size={20} color={colors.primary} />}
                        style={styles.refreshButton}
                    />

                    <Button
                        title="Настройки системы"
                        variant="outline"
                        onPress={() => Alert.alert('В разработке', 'Функция в разработке')}
                        icon={() => <Ionicons name="settings" size={20} color={colors.primary} />}
                        style={styles.settingsButton}
                    />
                </Card>
            </ScrollView>
        </View>
    );
}

const getSeverityColor = (severity) => {
    switch (severity) {
        case 'Minimal or none':
            return { backgroundColor: colors.success };
        case 'Mild':
            return { backgroundColor: colors.accent };
        case 'Moderate':
            return { backgroundColor: colors.warning };
        case 'Moderately severe':
            return { backgroundColor: colors.danger + '90' };
        case 'Severe':
            return { backgroundColor: colors.danger };
        default:
            return { backgroundColor: colors.gray };
    }
};

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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statItem: {
        width: '48%',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border || colors.gray,
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickAction: {
        width: '48%',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border || colors.gray,
    },
    quickActionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    quickActionText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
        textAlign: 'center',
    },
    quickActionSubtext: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    severityChart: {
        marginTop: 8,
    },
    severityItem: {
        marginBottom: 16,
    },
    severityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    severityName: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '600',
        flex: 1,
    },
    severityCount: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 8,
    },
    severityBar: {
        height: 8,
        backgroundColor: colors.border || colors.gray,
        borderRadius: 4,
        overflow: 'hidden',
    },
    severityBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    refreshButton: {
        marginBottom: 12,
    },
    settingsButton: {
        marginBottom: 8,
    },
});