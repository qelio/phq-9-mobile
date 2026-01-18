// src/components/admin/ResultCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import SeverityBadge from '../questionnaire/SeverityBadge';

const ResultCard = ({ result, onInterpret, showActions = true }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Ionicons name="person-circle" size={24} color={colors.primary} />
                    <View style={styles.userText}>
                        <Text style={styles.userName}>{result.user.full_name}</Text>
                        <Text style={styles.userEmail}>{result.user.email}</Text>
                    </View>
                </View>

                <Text style={styles.date}>
                    {new Date(result.created_at).toLocaleDateString('ru-RU')}
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.questionnaireName}>{result.questionnaire_name}</Text>

                <View style={styles.scoreContainer}>
                    <SeverityBadge
                        severity={result.severity}
                        score={result.total_score}
                    />

                    {result.has_suicidal_risk && (
                        <View style={styles.warningContainer}>
                            <Ionicons name="warning" size={20} color={colors.danger} />
                            <Text style={styles.warningText}>Риск</Text>
                        </View>
                    )}
                </View>
            </View>

            {showActions && onInterpret && (
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onInterpret(result)}
                >
                    <Ionicons name="create" size={20} color={colors.white} />
                    <Text style={styles.actionButtonText}>Интерпретировать</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 12,
        marginVertical: 8,
        marginHorizontal: 0,
        padding: 16,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        paddingBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userText: {
        marginLeft: 8,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    userEmail: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    date: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    content: {
        marginBottom: 16,
    },
    questionnaireName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${colors.danger}15`,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 10
    },
    warningText: {
        fontSize: 14,
        color: colors.danger,
        fontWeight: '600',
        marginLeft: 6
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 12,
        borderRadius: 8,
    },
    actionButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default ResultCard;