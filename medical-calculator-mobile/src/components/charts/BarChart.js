// src/components/charts/BarChart.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import colors from '../../constants/colors';

const screenWidth = Dimensions.get('window').width;

export default function ChartBar({ data, title, height = 220 }) {
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
        propsForLabels: {
            fontSize: 12,
        },
    };

    return (
        <View style={styles.container}>
            {title && (
                <Text style={styles.title}>{title}</Text>
            )}

            <BarChart
                data={data}
                width={screenWidth - 32}
                height={height}
                chartConfig={chartConfig}
                yAxisLabel=""
                yAxisSuffix=""
                fromZero
                showBarTops={false}
                withInnerLines={false}
                style={styles.chart}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
        textAlign: 'center',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});