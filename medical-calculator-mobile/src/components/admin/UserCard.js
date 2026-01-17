// src/components/admin/UserCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { formatDate } from '../../utils/formatters';

export default function UserCard({ user, onToggleStatus }) {
    const handleToggleStatus = () => {
        if (onToggleStatus) {
            onToggleStatus(user.id, user.is_active);
        }
    };

    const handleMoreInfo = () => {
        Alert.alert(
            'Информация о пользователе',
            `Email: ${user.email}\n` +
            `Имя: ${user.full_name || 'Не указано'}\n` +
            `Telegram: ${user.telegram_username || 'Не привязан'}\n` +
            `Тестов пройдено: ${user.results_count}\n` +
            `Дата регистрации: ${formatDate(user.created_at)}`,
            [{ text: 'OK' }]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </Text>
                    </View>

                    <View style={styles.userDetails}>
                        <Text style={styles.userName} numberOfLines={1}>
                            {user.full_name || 'Без имени'}
                        </Text>
                        <Text style={styles.userEmail} numberOfLines={1}>
                            {user.email}
                        </Text>
                    </View>
                </View>

                <View style={styles.statusContainer}>
                    <View style={[
                        styles.statusBadge,
                        user.is_active ? styles.active : styles.inactive
                    ]}>
                        <Text style={styles.statusText}>
                            {user.is_active ? 'Активен' : 'Неактивен'}
                        </Text>
                    </View>

                    {user.is_admin && (
                        <View style={styles.adminBadge}>
                            <Ionicons name="shield" size={12} color={colors.white} />
                            <Text style={styles.adminText}>Админ</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.stats}>
                <View style={styles.statItem}>
                    <Ionicons name="document-text" size={16} color={colors.textSecondary} />
                    <Text style={styles.statText}>
                        Тестов: {user.results_count}
                    </Text>
                </View>

                <View style={styles.statItem}>
                    <Ionicons name="calendar" size={16} color={colors.textSecondary} />
                    <Text style={styles.statText}>
                        {formatDate(user.created_at, 'dd.MM.yyyy')}
                    </Text>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleToggleStatus}
                >
                    <Ionicons
                        name={user.is_active ? 'pause-circle' : 'play-circle'}
                        size={20}
                        color={user.is_active ? colors.warning : colors.success}
                    />
                    <Text style={[
                        styles.actionText,
                        user.is_active ? styles.deactivateText : styles.activateText
                    ]}>
                        {user.is_active ? 'Деактивировать' : 'Активировать'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleMoreInfo}
                >
                    <Ionicons name="information-circle" size={20} color={colors.primary} />
                    <Text style={[styles.actionText, styles.infoText]}>
                        Подробнее
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 6,
    },
    active: {
        backgroundColor: `${colors.success}20`,
    },
    inactive: {
        backgroundColor: `${colors.danger}20`,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    adminBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    adminText: {
        fontSize: 10,
        color: colors.white,
        fontWeight: '600',
        marginLeft: 4,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: colors.gray,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        marginBottom: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 6,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: colors.lightGray,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    deactivateText: {
        color: colors.warning,
    },
    activateText: {
        color: colors.success,
    },
    infoText: {
        color: colors.primary,
    },
});