// src/screens/admin/UserManagementScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    Alert,
    TextInput,
} from 'react-native';
import { useAdminStore } from '../../store/adminStore';
import colors from '../../constants/colors';
import Header from '../../components/common/Header';
import Loader from '../../components/common/Loader';
import UserCard from '../../components/admin/UserCard';
import { Ionicons } from '@expo/vector-icons';

export default function UserManagementScreen({ navigation }) {
    const { users, fetchUsers, toggleUserStatus, isLoading } = useAdminStore();
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async (search = '') => {
        try {
            await fetchUsers(1, 20, search);
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось загрузить пользователей');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadUsers(searchQuery);
        setRefreshing(false);
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        loadUsers(text);
    };

    const handleToggleStatus = async (userId, isActive) => {
        Alert.alert(
            isActive ? 'Деактивация' : 'Активация',
            `Вы уверены, что хотите ${isActive ? 'деактивировать' : 'активировать'} пользователя?`,
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Подтвердить',
                    onPress: async () => {
                        try {
                            await toggleUserStatus(userId, !isActive);
                        } catch (error) {
                            Alert.alert('Ошибка', 'Не удалось изменить статус пользователя');
                        }
                    },
                },
            ]
        );
    };

    const filteredUsers = users.filter(user => {
        if (filter === 'active') return user.is_active;
        if (filter === 'inactive') return !user.is_active;
        return true;
    });

    return (
        <View style={styles.container}>

            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color={colors.darkGray} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Поиск по email или имени..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>

                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'all' && styles.filterActive]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                            Все
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'active' && styles.filterActive]}
                        onPress={() => setFilter('active')}
                    >
                        <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
                            Активные
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'inactive' && styles.filterActive]}
                        onPress={() => setFilter('inactive')}
                    >
                        <Text style={[styles.filterText, filter === 'inactive' && styles.filterTextActive]}>
                            Неактивные
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {isLoading && users.length === 0 ? (
                <Loader />
            ) : filteredUsers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="people" size={64} color={colors.gray} />
                    <Text style={styles.emptyText}>Пользователи не найдены</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    renderItem={({ item }) => (
                        <UserCard
                            user={item}
                            onToggleStatus={handleToggleStatus}
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
    searchContainer: {
        backgroundColor: colors.white,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: colors.textPrimary,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
    },
    filterActive: {
        backgroundColor: colors.primary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    filterTextActive: {
        color: colors.white,
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
    },
});