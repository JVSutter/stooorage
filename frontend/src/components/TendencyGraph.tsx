import React, { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Paper, Typography, Box, Chip } from "@mui/material";
import { themeColors } from "../theme";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

interface MonthlyData {
    month: string;
    vendasReais: number;
    previsaoIA: number;
}

const monthlyTrendData: MonthlyData[] = [
    { month: "Jan", vendasReais: 2450, previsaoIA: 2520 },
    { month: "Fev", vendasReais: 2680, previsaoIA: 2620 },
    { month: "Mar", vendasReais: 2850, previsaoIA: 2900 },
    { month: "Abr", vendasReais: 2720, previsaoIA: 2680 },
    { month: "Mai", vendasReais: 3100, previsaoIA: 3050 },
    { month: "Jun", vendasReais: 3350, previsaoIA: 3280 },
    { month: "Jul", vendasReais: 3200, previsaoIA: 3250 },
    { month: "Ago", vendasReais: 3450, previsaoIA: 3380 },
    { month: "Set", vendasReais: 3280, previsaoIA: 3320 },
    { month: "Out", vendasReais: 3650, previsaoIA: 3600 },
    { month: "Nov", vendasReais: 3850, previsaoIA: 3820 },
    { month: "Dez", vendasReais: 4200, previsaoIA: 4150 },
];

const MonthlyTrendChart: React.FC = () => {
    // Calcula estatísticas de tendência
    const trendStatistics = useMemo(() => {
        const firstMonth = monthlyTrendData[0].vendasReais;
        const lastMonth = monthlyTrendData[monthlyTrendData.length - 1].vendasReais;
        const growth = ((lastMonth - firstMonth) / firstMonth) * 100;
        
        const totalReal = monthlyTrendData.reduce((sum, item) => sum + item.vendasReais, 0);
        const totalPrevisao = monthlyTrendData.reduce((sum, item) => sum + item.previsaoIA, 0);
        const avgMonthlyReal = totalReal / monthlyTrendData.length;
        const avgMonthlyPrevisao = totalPrevisao / monthlyTrendData.length;

        // Calcula precisão MAPE
        const mapeValues = monthlyTrendData.map((item) => {
            const error = Math.abs(item.vendasReais - item.previsaoIA);
            const percentageError = (error / item.vendasReais) * 100;
            return percentageError;
        });
        const avgError = mapeValues.reduce((sum, val) => sum + val, 0) / mapeValues.length;
        const accuracy = 100 - avgError;

        return {
            growth: growth.toFixed(1),
            avgMonthlyReal: Math.round(avgMonthlyReal),
            avgMonthlyPrevisao: Math.round(avgMonthlyPrevisao),
            accuracy: accuracy.toFixed(1),
            isGrowthPositive: growth > 0,
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
            {/* Cabeçalho */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight="600"
                        gutterBottom
                        sx={{ color: themeColors.textPrimary }}
                    >
                        Tendência Mensal de Vendas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Evolução anual de vendas reais vs previsão IA
                    </Typography>
                </Box>
                
                {/* Chip de crescimento */}
                <Chip
                    icon={
                        trendStatistics.isGrowthPositive ? (
                            <TrendingUpIcon />
                        ) : (
                            <TrendingDownIcon />
                        )
                    }
                    label={`${trendStatistics.growth}%`}
                    color={trendStatistics.isGrowthPositive ? "success" : "error"}
                    sx={{ fontWeight: 600 }}
                />
            </Box>

            {/* Gráfico */}
            <Box
                sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    minHeight: "350px",
                }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={monthlyTrendData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e0e0e0"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="month"
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
                            formatter={(value: number, name: string, props: any) => {
                                const label =
                                    name === "vendasReais"
                                        ? "Vendas Reais"
                                        : "Previsão IA";
                                
                                // Calcula o erro para este mês específico
                                const item = props.payload;
                                const error = Math.abs(item.vendasReais - item.previsaoIA);
                                const errorPercent = ((error / item.vendasReais) * 100).toFixed(1);
                                
                                return [
                                    `${value.toLocaleString()} vendas${
                                        name === "previsaoIA" ? ` (erro: ${errorPercent}%)` : ""
                                    }`,
                                    label,
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
                        
                        {/* Linha de vendas reais */}
                        <Line
                            type="monotone"
                            dataKey="vendasReais"
                            stroke={themeColors.dodgerBlue}
                            strokeWidth={3}
                            dot={{
                                fill: themeColors.dodgerBlue,
                                strokeWidth: 2,
                                r: 4,
                            }}
                            activeDot={{
                                r: 6,
                                fill: themeColors.dodgerBlue,
                            }}
                            name="Vendas Reais"
                        />
                        
                        {/* Linha de previsão IA */}
                        <Line
                            type="monotone"
                            dataKey="previsaoIA"
                            stroke={themeColors.verde}
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            dot={{
                                fill: themeColors.verde,
                                strokeWidth: 2,
                                r: 4,
                            }}
                            activeDot={{
                                r: 6,
                                fill: themeColors.verde,
                            }}
                            name="Previsão IA"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>

            {/* Estatísticas resumidas */}
            <Box
                sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: "1px solid #e0e0e0",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 2,
                }}
            >
                {/* Média mensal real */}
                <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Média Mensal (Real)
                    </Typography>
                    <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{ color: themeColors.dodgerBlue }}
                    >
                        {trendStatistics.avgMonthlyReal.toLocaleString()}
                    </Typography>
                </Box>

                {/* Média mensal prevista */}
                <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Média Mensal (Prevista)
                    </Typography>
                    <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{ color: themeColors.verde }}
                    >
                        {trendStatistics.avgMonthlyPrevisao.toLocaleString()}
                    </Typography>
                </Box>

                {/* Precisão anual */}
                <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Precisão Anual (MAPE)
                    </Typography>
                    <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{
                            color:
                                parseFloat(trendStatistics.accuracy) >= 95
                                    ? themeColors.verde
                                    : parseFloat(trendStatistics.accuracy) >= 90
                                    ? themeColors.fuzzyBrown
                                    : themeColors.vermelhoDamasco,
                        }}
                    >
                        {trendStatistics.accuracy}%
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default MonthlyTrendChart;