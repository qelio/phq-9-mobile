// src/screens/profile/SettingsScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    Alert,
    Dimensions,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import colors from '../../constants/colors';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';

const { width } = Dimensions.get('window');

export default function SettingsScreen({ navigation }) {
    const { logout } = useAuthStore();

    const [settings, setSettings] = useState({
        notifications: true,
        darkMode: false,
        biometricLogin: false,
        autoSync: true,
    });

    const handleToggle = (setting) => {
        setSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const handleLogout = () => {
        Alert.alert(
            'Выход',
            'Вы уверены, что хотите выйти?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Выйти',
                    style: 'destructive',
                    onPress: logout,
                },
            ]
        );
    };

    const handleClearCache = () => {
        Alert.alert(
            'Очистка кэша',
            'Кэш приложения будет очищен. Продолжить?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Очистить',
                    onPress: () => Alert.alert('Успех', 'Кэш очищен'),
                },
            ]
        );
    };

    return (
        <View style={styles.container}>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Card title="Уведомления" style={styles.wideCard}>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Push-уведомления</Text>
                        <Switch
                            value={settings.notifications}
                            onValueChange={() => handleToggle('notifications')}
                            trackColor={{ false: colors.gray, true: colors.primary }}
                            thumbColor={colors.white}
                        />
                    </View>

                    <View style={[styles.settingItem, styles.lastSettingItem]}>
                        <Text style={styles.settingText}>Email-уведомления</Text>
                        <Switch
                            value={settings.autoSync}
                            onValueChange={() => handleToggle('autoSync')}
                            trackColor={{ false: colors.gray, true: colors.primary }}
                            thumbColor={colors.white}
                        />
                    </View>
                </Card>

                <Card title="Безопасность" style={styles.wideCard}>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Биометрический вход</Text>
                        <Switch
                            value={settings.biometricLogin}
                            onValueChange={() => handleToggle('biometricLogin')}
                            trackColor={{ false: colors.gray, true: colors.primary }}
                            thumbColor={colors.white}
                        />
                    </View>

                    <Button
                        title="Сменить пароль"
                        variant="outline"
                        onPress={() => Alert.alert('В разработке', 'Функция в разработке')}
                        style={styles.securityButton}
                    />
                </Card>

                <Card title="Внешний вид" style={styles.wideCard}>
                    <View style={[styles.settingItem, styles.lastSettingItem]}>
                        <Text style={styles.settingText}>Темная тема</Text>
                        <Switch
                            value={settings.darkMode}
                            onValueChange={() => handleToggle('darkMode')}
                            trackColor={{ false: colors.gray, true: colors.primary }}
                            thumbColor={colors.white}
                        />
                    </View>
                </Card>

                <Card title="Данные" style={styles.wideCard}>
                    <Button
                        title="Очистить кэш"
                        variant="outline"
                        onPress={handleClearCache}
                        style={styles.dataButton}
                    />

                    <Button
                        title="Экспорт данных"
                        variant="outline"
                        onPress={() => Alert.alert('В разработке', 'Функция в разработке')}
                        style={[styles.dataButton, styles.lastDataButton]}
                    />
                </Card>

                <Card title="О приложении" style={styles.wideCard}>
                    <Text style={styles.versionText}>Версия 1.0.0</Text>
                    <Text style={styles.infoText}>
                        Медицинский калькулятор для психологического тестирования
                    </Text>
                </Card>

                <View style={styles.logoutContainer}>
                    <Button
                        title="Выйти из системы"
                        variant="danger"
                        onPress={handleLogout}
                        style={styles.logoutButton}
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
    },
    wideCard: {
        marginHorizontal: 8,
        marginVertical: 8,
        borderRadius: 12,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border || colors.gray,
    },
    lastSettingItem: {
        borderBottomWidth: 0,
    },
    settingText: {
        fontSize: 16,
        color: colors.textPrimary,
        flex: 1,
        marginRight: 12,
    },
    securityButton: {
        marginTop: 12,
        marginHorizontal: 4,
    },
    dataButton: {
        marginBottom: 12,
        marginHorizontal: 4,
    },
    lastDataButton: {
        marginBottom: 4,
    },
    versionText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    logoutContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        marginBottom: 20,
    },
    logoutButton: {
        marginTop: 8,
    },
});