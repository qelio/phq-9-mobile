// src/screens/admin/StatisticsScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { useAdminStore } from '../../store/adminStore';
import colors from '../../constants/colors';
import Header from '../../components/common/Header';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import StatCard from '../../components/admin/StatCard';
import { LineChart } from 'react-native-chart-kit';
import { formatDate } from '../../utils/formatters';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen({ navigation }) {
    const { statistics, fetchStatistics, isLoading } = useAdminStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            await fetchStatistics();
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadStatistics();
        setRefreshing(false);
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

    if (isLoading && !statistics) {
        return (
            <View style={styles.container}>
                <Header title="Статистика" />
                <Loader />
            </View>
        );
    }

    if (!statistics) {
        return (
            <View style={styles.container}>
                <Header title="Статистика" />
                <View style={styles.emptyContainer}>
                    <Text>Статистика недоступна</Text>
                </View>
            </View>
        );
    }

    // Моковые данные для графика (в реальном приложении брались бы из API)
    const chartData = {
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        datasets: [{
            data: [12, 19, 8, 15, 22, 14, 18],
            color: (opacity = 1) => `rgba(42, 157, 143, ${opacity})`,
            strokeWidth: 2,
        }],
    };

    const chartConfig = {
        backgroundColor: colors.white,
        backgroundGradientFrom: colors.white,
        backgroundGradientTo: colors.white,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(42, 157, 143, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: colors.primary,
        },
    };

    // Ширина графика с учетом отступов карточки
    const chartWidth = screenWidth - 32; // 16 отступ с каждой стороны

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
                <View style={styles.statsGrid}>
                    <StatCard
                        title="Пользователи"
                        value={statistics.total_users}
                        icon="people"
                        color={colors.primary}
                        style={styles.statCard}
                    />

                    <StatCard
                        title="Всего тестов"
                        value={statistics.total_results}
                        icon="document-text"
                        color={colors.success}
                        style={styles.statCard}
                    />

                    <StatCard
                        title="Ожидают"
                        value={statistics.total_pending_interpretations}
                        icon="time"
                        color={colors.warning}
                        style={styles.statCard}
                    />

                    <StatCard
                        title="Тяжёлые"
                        value={statistics.phq9_statistics?.severity_distribution?.Severe || 0}
                        icon="alert-circle"
                        color={colors.danger}
                        style={styles.statCard}
                    />
                </View>

                <Card title="Активность по дням" style={styles.wideCard}>
                    <View style={styles.chartContainer}>
                        <LineChart
                            data={chartData}
                            width={chartWidth}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chart}
                        />
                    </View>
                </Card>

                <Card title="Статистика PHQ-9" style={styles.wideCard}>
                    <View style={styles.phq9Stats}>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Всего тестов PHQ-9:</Text>
                            <Text style={styles.statValue}>
                                {statistics.phq9_statistics?.total_tests || 0}
                            </Text>
                        </View>

                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Средний балл:</Text>
                            <Text style={styles.statValue}>
                                {statistics.phq9_statistics?.average_score?.toFixed(1) || '0.0'}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.distributionTitle}>Распределение по тяжести:</Text>

                    {statistics.phq9_statistics?.severity_distribution &&
                        Object.entries(statistics.phq9_statistics.severity_distribution).map(([severity, count]) => (
                            <View key={severity} style={styles.distributionItem}>
                                <View style={styles.distributionHeader}>
                                    <Text style={styles.distributionLabel}>
                                        {getSeverityRussian(severity)}
                                    </Text>
                                    <Text style={styles.distributionCount}>{count}</Text>
                                </View>

                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${(count / statistics.phq9_statistics.total_tests) * 100 || 0}%`,
                                                backgroundColor: getSeverityColor(severity),
                                            }
                                        ]}
                                    />
                                </View>
                            </View>
                        ))
                    }
                </Card>

                <Card title="Дополнительная информация" style={styles.wideCard}>
                    <Text style={styles.infoText}>
                        • Данные обновляются в реальном времени{'\n'}
                        • Статистика включает все пройденные тесты{'\n'}
                        • Для более детальной статистики используйте веб-версию
                    </Text>
                </Card>
            </ScrollView>
        </View>
    );
}

const getSeverityColor = (severity) => {
    switch (severity) {
        case 'Minimal or none':
            return colors.success;
        case 'Mild':
            return colors.accent;
        case 'Moderate':
            return colors.warning;
        case 'Moderately severe':
            return colors.danger + '90';
        case 'Severe':
            return colors.danger;
        default:
            return colors.gray;
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: 4,
        marginVertical: 12,
    },
    statCard: {
        width: '48%', // Две карточки в ряд
        marginBottom: 12,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 12,
    },
    phq9Stats: {
        marginBottom: 20,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border || colors.gray,
    },
    statLabel: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    distributionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginTop: 16,
        marginBottom: 16,
    },
    distributionItem: {
        marginBottom: 16,
    },
    distributionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    distributionLabel: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '600',
        flex: 1,
    },
    distributionCount: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: colors.border || colors.gray,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    infoText: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 22,
    },
});