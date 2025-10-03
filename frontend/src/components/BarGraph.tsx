import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";
import { themeColors } from "../theme";

interface SalesComparisonData {
    day: string;
    vendasReais: number;
    previsaoIA: number;
}

const salesComparisonData: SalesComparisonData[] = [
    { day: "Seg", vendasReais: 450, previsaoIA: 480 },
    { day: "Ter", vendasReais: 620, previsaoIA: 590 },
    { day: "Qua", vendasReais: 380, previsaoIA: 420 },
    { day: "Qui", vendasReais: 710, previsaoIA: 680 },
    { day: "Sex", vendasReais: 890, previsaoIA: 850 },
    { day: "Sáb", vendasReais: 950, previsaoIA: 920 },
    { day: "Dom", vendasReais: 520, previsaoIA: 550 },
];

const SalesChart: React.FC = () => {
    // Calcula a precisão da IA dinamicamente
    const calculateAccuracy = useMemo(() => {
        // Calcula o erro absoluto percentual médio (MAPE - Mean Absolute Percentage Error)
        const mapeValues = salesComparisonData.map((item) => {
            const error = Math.abs(item.vendasReais - item.previsaoIA);
            const percentageError = (error / item.vendasReais) * 100;
            return percentageError;
        });

        // Média dos erros percentuais
        const avgError = mapeValues.reduce((sum, val) => sum + val, 0) / mapeValues.length;
        
        // Precisão = 100% - erro médio
        const accuracy = 100 - avgError;

        return accuracy.toFixed(1); // Retorna com 1 casa decimal
    }, []);

    // Calcula estatísticas adicionais
    const statistics = useMemo(() => {
        const totalReal = salesComparisonData.reduce((sum, item) => sum + item.vendasReais, 0);
        const totalPrevisao = salesComparisonData.reduce((sum, item) => sum + item.previsaoIA, 0);
        const difference = totalReal - totalPrevisao;
        const differencePercentage = ((difference / totalReal) * 100).toFixed(1);

        return {
            totalReal,
            totalPrevisao,
            difference,
            differencePercentage,
        };
    }, []);

    return (
        <Paper
            elevation={1}
            sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                "&:hover": {
                    boxShadow: 3,
                },
                transition: "all 0.2s ease-in-out",
            }}
        >
            <Typography
                variant="h6"
                fontWeight="600"
                gutterBottom
                sx={{ color: themeColors.textPrimary }}
            >
                Vendas Diárias vs Previsão IA
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
            >
                Comparação dos últimos 7 dias
            </Typography>

            <Box
                sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    minHeight: "300px",
                }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={salesComparisonData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        barGap={8}
                        barCategoryGap="20%"
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e0e0e0"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: themeColors.textSecondary,
                                fontSize: 12,
                            }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: themeColors.textSecondary,
                                fontSize: 12,
                            }}
                            label={{
                                value: "Vendas",
                                angle: -90,
                                position: "insideLeft",
                                style: {
                                    fill: themeColors.textSecondary,
                                    fontSize: 12,
                                },
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                border: `1px solid ${themeColors.dodgerBlue}`,
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                            cursor={{ fill: "rgba(64, 133, 246, 0.05)" }}
                            formatter={(value: number, name: string, props: any) => {
                                const label =
                                    name === "vendasReais"
                                        ? "Vendas Reais"
                                        : "Previsão IA";
                                
                                // Calcula o erro para este dia específico
                                const item = props.payload;
                                const error = Math.abs(item.vendasReais - item.previsaoIA);
                                const errorPercent = ((error / item.vendasReais) * 100).toFixed(1);
                                
                                return [
                                    `${value} vendas${name === "previsaoIA" ? ` (erro: ${errorPercent}%)` : ""}`,
                                    label
                                ];
                            }}
                        />
                        <Legend
                            wrapperStyle={{
                                paddingTop: "20px",
                            }}
                            formatter={(value: string) => {
                                return value === "vendasReais"
                                    ? "Vendas Reais"
                                    : "Previsão IA";
                            }}
                        />
                        <Bar
                            dataKey="vendasReais"
                            fill={themeColors.dodgerBlue}
                            radius={[8, 8, 0, 0]}
                            maxBarSize={40}
                            name="Vendas Reais"
                        />
                        <Bar
                            dataKey="previsaoIA"
                            fill={themeColors.verde}
                            radius={[8, 8, 0, 0]}
                            maxBarSize={40}
                            name="Previsão IA"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            {/* Indicadores de precisão e estatísticas */}
            <Box
                sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid #e0e0e0",
                }}
            >
                {/* Primeira linha: Precisão */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Precisão média da IA (MAPE)
                    </Typography>
                    <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ 
                            color: parseFloat(calculateAccuracy) >= 90 
                                ? themeColors.verde 
                                : parseFloat(calculateAccuracy) >= 80 
                                ? themeColors.fuzzyBrown 
                                : themeColors.vermelhoDamasco 
                        }}
                    >
                        {calculateAccuracy}%
                    </Typography>
                </Box>

                {/* Segunda linha: Total de vendas */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Total: Real vs Previsto
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                        {statistics.totalReal} vs {statistics.totalPrevisao}
                        <Typography
                            component="span"
                            variant="caption"
                            sx={{
                                ml: 1,
                                color: parseFloat(statistics.differencePercentage) > 0
                                    ? themeColors.verde
                                    : themeColors.vermelhoDamasco,
                            }}
                        >
                            ({statistics.differencePercentage > 0 ? "+" : ""}{statistics.differencePercentage}%)
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default SalesChart;
