// src/components/charts/LineChart.js
import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import colors from '../../constants/colors';

const screenWidth = Dimensions.get('window').width;

const ChartLine = ({ data, title, height = 220 }) => {
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
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: colors.primary,
        },
        propsForLabels: {
            fontSize: 12,
        },
    };

    return (
        <View style={{ marginVertical: 8 }}>
            {title && (
                <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.textPrimary,
                    marginBottom: 12,
                    textAlign: 'center',
                }}>
                    {title}
                </Text>
            )}

            <LineChart
                data={data}
                width={screenWidth - 32}
                height={height}
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLines={false}
                withHorizontalLines={true}
                withHorizontalLabels={true}
                withVerticalLabels={true}
                fromZero={true}
            />
        </View>
    );
};

export default ChartLine;