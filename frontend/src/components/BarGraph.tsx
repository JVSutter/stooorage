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
import { Paper, Typography, Box, CircularProgress, Alert } from "@mui/material";
import { themeColors } from "../theme";
import { useMonthlySales } from "./MonthlySales";

interface MonthlyChartData {
    month: string;
    vendasReais: number;
    previsaoIA: number;
}

const MonthlyBarChart: React.FC = () => {
    const { data: apiData, loading, error } = useMonthlySales(5);

    // Transforma os dados da API para o formato do gráfico
    const chartData: MonthlyChartData[] = useMemo(() => {
        return apiData.map((item) => {
            const monthDate = new Date(item.month_start);
            const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'short' });
            const monthFormatted = monthName.charAt(0).toUpperCase() + monthName.slice(1);

            // Vendas reais vêm da API
            const vendasReais = item.quantity_sold;
            
            // Simulação da previsão IA (você pode substituir por dados reais da sua IA)
            // Por enquanto, vou adicionar uma variação de ±5% nas vendas reais
            const variacao = (Math.random() - 0.5) * 0.1; // -5% a +5%
            const previsaoIA = Math.round(vendasReais * (1 + variacao));

            return {
                month: monthFormatted,
                vendasReais,
                previsaoIA,
            };
        }).reverse(); // Reverse para mostrar do mais antigo para o mais recente
    }, [apiData]);

    // Calcula a precisão da IA dinamicamente
    const calculateAccuracy = useMemo(() => {
        if (chartData.length === 0) return "0.0";

        const mapeValues = chartData.map((item) => {
            const error = Math.abs(item.vendasReais - item.previsaoIA);
            const percentageError = (error / item.vendasReais) * 100;
            return percentageError;
        });

        const avgError = mapeValues.reduce((sum, val) => sum + val, 0) / mapeValues.length;
        const accuracy = 100 - avgError;

        return accuracy.toFixed(1);
    }, [chartData]);

    // Calcula estatísticas adicionais
    const statistics = useMemo(() => {
        const totalReal = chartData.reduce((sum, item) => sum + item.vendasReais, 0);
        const totalPrevisao = chartData.reduce((sum, item) => sum + item.previsaoIA, 0);
        const difference = totalReal - totalPrevisao;
        const differencePercentage = totalReal > 0 
            ? ((difference / totalReal) * 100).toFixed(1)
            : "0.0";

        return {
            totalReal,
            totalPrevisao,
            difference,
            differencePercentage,
        };
    }, [chartData]);

    if (loading) {
        return (
            <Paper
                elevation={1}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                }}
            >
                <CircularProgress />
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper
                elevation={1}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                }}
            >
                <Alert severity="error">
                    Erro ao carregar dados: {error}
                </Alert>
            </Paper>
        );
    }

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
                Vendas Mensais vs Previsão IA
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
            >
                Últimos 6 meses
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
                        data={chartData}
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
                                value: "Quantidade Vendida",
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
                                // Agora 'name' será 'vendasReais' ou 'previsaoIA'
                                const label = name === "vendasReais" ? "Vendas Reais" : "Previsão IA";
                                
                                const item = props.payload;
                                const error = Math.abs(item.vendasReais - item.previsaoIA);
                                const errorPercent = ((error / item.vendasReais) * 100).toFixed(1);
                                
                                return [
                                    `${value.toLocaleString()} unidades${name === "previsaoIA" ? ` (erro: ${errorPercent}%)` : ""}`,
                                    label
                                ];
                            }}
                        />
                        <Legend
                            formatter={(value: string) => {
                                return value === "vendasReais" ? "Vendas Reais" : "Previsão IA";
                            }}
                        />
                        <Bar
                            dataKey="vendasReais"
                            fill={themeColors.dodgerBlue}
                            radius={[8, 8, 0, 0]}
                            maxBarSize={40}
                        />
                        <Bar
                            dataKey="previsaoIA"
                            fill={themeColors.verde}
                            radius={[8, 8, 0, 0]}
                            maxBarSize={40}
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
                        {statistics.totalReal.toLocaleString()} vs {statistics.totalPrevisao.toLocaleString()}
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
                            ({parseFloat(statistics.differencePercentage) > 0 ? "+" : ""}{statistics.differencePercentage}%)
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default MonthlyBarChart;