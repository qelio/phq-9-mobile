// src/screens/profile/ProfileEditScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import colors from '../../constants/colors';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';

export default function ProfileEditScreen({ navigation }) {
    const { user, updateProfile, isLoading } = useAuthStore();

    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        phone: user?.phone || '',
        date_of_birth: user?.date_of_birth || '',
        gender: user?.gender || '',
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Имя обязательно';
        }

        if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Неверный формат телефона';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            await updateProfile(formData);
            Alert.alert('Успех', 'Профиль успешно обновлен');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Ошибка', error.message || 'Не удалось обновить профиль');
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >

            <ScrollView style={styles.content}>
                <View style={styles.form}>
                    <Input
                        label="ФИО"
                        value={formData.full_name}
                        onChangeText={(value) => handleChange('full_name', value)}
                        placeholder="Введите ваше ФИО"
                        error={errors.full_name}
                    />

                    <Input
                        label="Телефон"
                        value={formData.phone}
                        onChangeText={(value) => handleChange('phone', value)}
                        placeholder="+7 (999) 999-99-99"
                        keyboardType="phone-pad"
                        error={errors.phone}
                    />

                    <Input
                        label="Дата рождения"
                        value={formData.date_of_birth}
                        onChangeText={(value) => handleChange('date_of_birth', value)}
                        placeholder="ГГГГ-ММ-ДД"
                        error={errors.date_of_birth}
                    />

                    <Input
                        label="Пол"
                        value={formData.gender}
                        onChangeText={(value) => handleChange('gender', value)}
                        placeholder="Мужской/Женский"
                        error={errors.gender}
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Сохранить"
                            onPress={handleSave}
                            loading={isLoading}
                            disabled={isLoading}
                            style={styles.saveButton}
                        />

                        <Button
                            title="Отмена"
                            variant="outline"
                            onPress={() => navigation.goBack()}
                            style={styles.cancelButton}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    form: {
        padding: 20,
    },
    buttonContainer: {
        marginTop: 20,
    },
    saveButton: {
        marginBottom: 12,
    },
    cancelButton: {
        marginBottom: 8,
    },
});