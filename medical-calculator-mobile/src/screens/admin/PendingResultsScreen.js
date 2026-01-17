// src/screens/admin/PendingResultsScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    Alert,
} from 'react-native';
import { useAdminStore } from '../../store/adminStore';
import colors from '../../constants/colors';
import Header from '../../components/common/Header';
import Loader from '../../components/common/Loader';
import ResultCard from '../../components/admin/ResultCard';
import { Ionicons } from '@expo/vector-icons';

export default function PendingResultsScreen({ navigation }) {
    const { pendingResults, fetchPendingResults, isLoading } = useAdminStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        try {
            await fetchPendingResults();
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось загрузить результаты');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadResults();
        setRefreshing(false);
    };

    const handleInterpret = (result) => {
        navigation.navigate('Interpretation', { result });
    };

    if (isLoading && pendingResults.length === 0) {
        return (
            <View style={styles.container}>
                <Header title="Ожидают интерпретации" />
                <Loader />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {pendingResults.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="checkmark-circle" size={64} color={colors.gray} />
                    <Text style={styles.emptyText}>Нет результатов для интерпретации</Text>
                    <Text style={styles.emptySubtext}>
                        Все результаты обработаны
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={pendingResults}
                    renderItem={({ item }) => (
                        <ResultCard
                            result={item}
                            onInterpret={handleInterpret}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                        />
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
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: colors.textSecondary,
        marginTop: 20,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.darkGray,
        textAlign: 'center',
    },
});