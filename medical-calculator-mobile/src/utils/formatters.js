// src/utils/formatters.js
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (dateString, formatStr = 'dd.MM.yyyy') => {
    if (!dateString) return '';

    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, formatStr, { locale: ru });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

export const formatDateTime = (dateString) => {
    return formatDate(dateString, 'dd.MM.yyyy HH:mm');
};

export const formatTimeAgo = (dateString) => {
    if (!dateString) return '';

    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'только что';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин назад`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч назад`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} дн назад`;

        return format(date, 'dd.MM.yyyy', { locale: ru });
    } catch (error) {
        return formatDate(dateString);
    }
};

export const formatScore = (score, maxScore = 27) => {
    return `${score}/${maxScore}`;
};

export const formatPhoneNumber = (phone) => {
    if (!phone) return '';

    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);

    if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }

    return phone;
};

export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str, length = 50) => {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
};