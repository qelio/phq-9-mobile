// src/screens/history/HistoryScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    Alert,
    Dimensions,
} from 'react-native';
import { useQuestionnaireStore } from '../../store/questionnaireStore';
import colors from '../../constants/colors';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Header from '../../components/common/Header';
import { formatDate } from '../../utils/formatters';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HistoryScreen({ navigation }) {
    const { results, fetchHistory, isLoading } = useQuestionnaireStore();
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async (pageNum = 1) => {
        try {
            await fetchHistory(pageNum);
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось загрузить историю');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHistory(1);
        setRefreshing(false);
    };

    const loadMore = async () => {
        if (!isLoading && results.length >= page * 10) {
            const nextPage = page + 1;
            setPage(nextPage);
            await loadHistory(nextPage);
        }
    };

    const renderResultItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('ResultDetail', { resultId: item.id })}
            activeOpacity={0.7}
        >
            <Card style={styles.resultCard}>
                <View style={styles.resultHeader}>
                    <Text style={styles.questionnaireName}>{item.questionnaire_name}</Text>
                    <View style={[
                        styles.statusBadge,
                        item.is_interpreted ? styles.interpreted : styles.pending
                    ]}>
                        <Text style={[
                            styles.statusText,
                            item.is_interpreted ? styles.statusTextInterpreted : styles.statusTextPending
                        ]}>
                            {item.is_interpreted ? 'Интерпретировано' : 'Ожидает'}
                        </Text>
                    </View>
                </View>

                <View style={styles.resultDetails}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="calendar" size={16} color={colors.textSecondary} />
                            <Text style={styles.detailText}>
                                {formatDate(item.created_at, 'dd.MM.yyyy HH:mm')}
                            </Text>
                        </View>

                        <View style={styles.detailItem}>
                            <Ionicons name="stats-chart" size={16} color={colors.textSecondary} />
                            <Text style={styles.detailText}>
                                Балл: <Text style={styles.scoreText}>{item.total_score}</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="alert" size={16} color={colors.textSecondary} />
                            <Text style={[
                                styles.detailText,
                                getSeverityColor(item.severity)
                            ]}>
                                {item.severity}
                            </Text>
                        </View>

                        {item.has_suicidal_risk && (
                            <View style={[styles.detailItem, styles.warningItem]}>
                                <Ionicons name="warning" size={16} color={colors.danger} />
                                <Text style={[styles.detailText, styles.warningText]}>
                                    Риск
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {item.interpretation_comment && (
                    <View style={styles.commentContainer}>
                        <Text style={styles.commentLabel}>Комментарий:</Text>
                        <Text style={styles.comment} numberOfLines={2}>
                            {item.interpretation_comment}
                        </Text>
                    </View>
                )}
            </Card>
        </TouchableOpacity>
    );

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Severe':
            case 'Moderately severe':
                return { color: colors.danger };
            case 'Moderate':
                return { color: colors.warning };
            default:
                return { color: colors.success };
        }
    };

    if (isLoading && results.length === 0) {
        return (
            <View style={styles.container}>

                <Loader />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {results.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="document-text" size={64} color={colors.gray} />
                    <Text style={styles.emptyText}>Нет пройденных тестов</Text>
                    <Text style={styles.emptySubtext}>
                        Пройдите первый тест на главной странице
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={results}
                    renderItem={renderResultItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={
                        isLoading && results.length > 0 ? (
                            <View style={styles.footerLoader}>
                                <Loader size="small" />
                            </View>
                        ) : null
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    list: {
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    resultCard: {
        marginHorizontal: 8,
        marginVertical: 6,
        borderRadius: 12,
        padding: 16,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    questionnaireName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        flex: 1,
        marginRight: 12,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        minWidth: 100,
        alignItems: 'center',
    },
    interpreted: {
        backgroundColor: `${colors.success}15`,
        borderWidth: 1,
        borderColor: colors.success,
    },
    pending: {
        backgroundColor: `${colors.warning}15`,
        borderWidth: 1,
        borderColor: colors.warning,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusTextInterpreted: {
        color: colors.success,
    },
    statusTextPending: {
        color: colors.warning,
    },
    resultDetails: {
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    detailText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 8,
    },
    scoreText: {
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    warningItem: {
        flex: 0,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: `${colors.danger}15`,
        borderRadius: 12,
        marginLeft: 8,
    },
    warningText: {
        color: colors.danger,
        fontWeight: '600',
    },
    commentContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border || colors.gray,
    },
    commentLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
        fontWeight: '500',
    },
    comment: {
        fontSize: 14,
        color: colors.textSecondary,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        color: colors.textSecondary,
        marginTop: 20,
        marginBottom: 8,
        fontWeight: '600',
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        opacity: 0.7,
    },
    footerLoader: {
        paddingVertical: 20,
    },
});