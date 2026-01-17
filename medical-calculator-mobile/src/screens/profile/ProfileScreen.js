// src/screens/profile/ProfileScreen.js
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import colors from '../../constants/colors';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        Alert.alert(
            'Выход',
            'Вы уверены, что хотите выйти?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Выйти',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error) {
                            Alert.alert('Ошибка', 'Не удалось выйти из системы');
                        }
                    },
                },
            ]
        );
    };

    const handleEditProfile = () => {
        navigation.navigate('ProfileEdit');
    };

    const handleLinkTelegram = () => {
        navigation.navigate('TelegramLink');
    };

    const handleSettings = () => {
        navigation.navigate('Settings');
    };

    const handleAdminDashboard = () => {
        navigation.navigate('AdminDashboard');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </Text>
                    </View>
                    {user?.is_admin && (
                        <View style={styles.adminBadge}>
                            <Ionicons name="shield" size={16} color={colors.white} />
                        </View>
                    )}
                </View>

                <View style={styles.userInfoContainer}>
                    <Text style={styles.userName}>
                        {user?.full_name || 'Пользователь'}
                    </Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>

                    {user?.telegram_username && (
                        <View style={styles.telegramContainer}>
                            <Ionicons name="paper-plane" size={16} color={colors.primary} />
                            <Text style={styles.telegramText}>{user.telegram_username}</Text>
                        </View>
                    )}
                </View>
            </View>

            <Card title="Профиль">
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleEditProfile}
                >
                    <Ionicons name="person-outline" size={24} color={colors.primary} />
                    <View style={styles.menuItemContent}>
                        <Text style={styles.menuItemTitle}>Редактировать профиль</Text>
                        <Text style={styles.menuItemSubtitle}>
                            Изменить личные данные
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.darkGray} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleLinkTelegram}
                >
                    <Ionicons name="paper-plane" size={24} color={colors.primary} />
                    <View style={styles.menuItemContent}>
                        <Text style={styles.menuItemTitle}>
                            {user?.telegram_username ? 'Telegram привязан' : 'Привязать Telegram'}
                        </Text>
                        <Text style={styles.menuItemSubtitle}>
                            {user?.telegram_username
                                ? `Привязан: ${user.telegram_username}`
                                : 'Подключить уведомления'
                            }
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.darkGray} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleSettings}
                >
                    <Ionicons name="settings-outline" size={24} color={colors.primary} />
                    <View style={styles.menuItemContent}>
                        <Text style={styles.menuItemTitle}>Настройки</Text>
                        <Text style={styles.menuItemSubtitle}>
                            Уведомления, безопасность
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.darkGray} />
                </TouchableOpacity>
            </Card>

            {/*{user?.is_admin && (*/}
            {/*    <Card title="Администрирование">*/}
            {/*        <TouchableOpacity*/}
            {/*            style={styles.menuItem}*/}
            {/*            onPress={handleAdminDashboard}*/}
            {/*        >*/}
            {/*            <Ionicons name="shield" size={24} color={colors.primary} />*/}
            {/*            <View style={styles.menuItemContent}>*/}
            {/*                <Text style={styles.menuItemTitle}>Панель администратора</Text>*/}
            {/*                <Text style={styles.menuItemSubtitle}>*/}
            {/*                    Управление системой*/}
            {/*                </Text>*/}
            {/*            </View>*/}
            {/*            <Ionicons name="chevron-forward" size={20} color={colors.darkGray} />*/}
            {/*        </TouchableOpacity>*/}
            {/*    </Card>*/}
            {/*)}*/}

            <Card title="Информация">
                {/*<View style={styles.infoItem}>*/}
                {/*    <Text style={styles.infoLabel}>Дата регистрации:</Text>*/}
                {/*    <Text style={styles.infoValue}>*/}
                {/*        {user?.created_at*/}
                {/*            ? new Date(user.created_at).toLocaleDateString('ru-RU')*/}
                {/*            : 'Неизвестно'*/}
                {/*        }*/}
                {/*    </Text>*/}
                {/*</View>*/}

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Роль:</Text>
                    <Text style={[
                        styles.infoValue,
                        user?.is_admin && styles.adminValue
                    ]}>
                        {user?.is_admin ? 'Администратор' : 'Пользователь'}
                    </Text>
                </View>

                {user?.phone && (
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Телефон:</Text>
                        <Text style={styles.infoValue}>{user.phone}</Text>
                    </View>
                )}
            </Card>

            <View style={styles.logoutContainer}>
                <Button
                    title="Выйти из системы"
                    variant="danger"
                    onPress={handleLogout}
                    icon={() => <Ionicons name="log-out-outline" size={20} color={colors.white} />}
                    style={styles.logoutButton}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.white,
        paddingVertical: 30,
        paddingHorizontal: 20,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    userInfoContainer: {
        width: '100%',
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: colors.white,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 10,
        textAlign: 'center',
        width: '100%',
    },
    userEmail: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 6,
        textAlign: 'center',
        width: '100%',
    },
    adminBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.secondary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.white,
    },
    telegramContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${colors.primary}15`,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 20,
        marginTop: 10,
        alignSelf: 'center',
    },
    telegramText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
        marginLeft: 6,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    menuItemContent: {
        flex: 1,
        marginLeft: 16,
        marginRight: 8,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    menuItemSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    infoLabel: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    adminValue: {
        color: colors.primary,
    },
    logoutContainer: {
        padding: 16,
        marginBottom: 20,
    },
    logoutButton: {
        marginTop: 8,
    },
});