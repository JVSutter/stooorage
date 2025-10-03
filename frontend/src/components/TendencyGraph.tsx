import React, { useMemo, useEffect, useState } from "react";
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
    vendasReais: number;   // pode vir 0 se o backend não retornar histórico
    previsaoIA: number;
}

const MonthlyTrendChart: React.FC = () => {
    const [monthlyTrendData, setMonthlyTrendData] = useState<MonthlyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                const res = await fetch("/forecast/total/12"); // 12 meses de previsão
                if (!res.ok) throw new Error("Erro na requisição");
                const forecastData = await res.json();

                const monthNames = [
                    "Jan","Fev","Mar","Abr","Mai","Jun",
                    "Jul","Ago","Set","Out","Nov","Dez"
                ];

                const parsed: MonthlyData[] = forecastData.map((item: any) => {
                    const date = new Date(item.ds);
                    return {
                        month: monthNames[date.getMonth()],
                        vendasReais: 0, // por enquanto só previsão
                        previsaoIA: item.yhat,
                    };
                });

                setMonthlyTrendData(parsed);
            } catch (err) {
                console.error("Erro ao buscar previsões:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, []);

    const trendStatistics = useMemo(() => {
        if (monthlyTrendData.length === 0) return null;

        const firstMonth = monthlyTrendData[0].previsaoIA;
        const lastMonth = monthlyTrendData[monthlyTrendData.length - 1].previsaoIA;
        const growth = ((lastMonth - firstMonth) / firstMonth) * 100;

        const totalPrevisao = monthlyTrendData.reduce((sum, item) => sum + item.previsaoIA, 0);
        const avgMonthlyPrevisao = totalPrevisao / monthlyTrendData.length;

        return {
            growth: growth.toFixed(1),
            avgMonthlyPrevisao: Math.round(avgMonthlyPrevisao),
            isGrowthPositive: growth > 0,
        };
    }, [monthlyTrendData]);

    if (loading) {
        return <Typography>Carregando previsões...</Typography>;
    }

    if (!trendStatistics) {
        return <Typography>Nenhum dado disponível</Typography>;
    }

    return (
        <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0" }}>
            {/* Cabeçalho */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box>
                    <Typography variant="h6" fontWeight="600">
                        Tendência Mensal de Vendas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Evolução anual da previsão IA
                    </Typography>
                </Box>

                <Chip
                    icon={trendStatistics.isGrowthPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
                    label={`${trendStatistics.growth}%`}
                    color={trendStatistics.isGrowthPositive ? "success" : "error"}
                    sx={{ fontWeight: 600 }}
                />
            </Box>

            {/* Gráfico */}
            <Box sx={{ width: "100%", aspectRatio: "16/9", minHeight: "350px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="previsaoIA"
                            stroke={themeColors.verde}
                            strokeWidth={3}
                            name="Previsão IA"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>

            {/* Estatísticas resumidas */}
            <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #e0e0e0", display: "flex", gap: 4 }}>
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Média Mensal (Prevista)
                    </Typography>
                    <Typography variant="h6" fontWeight="600" sx={{ color: themeColors.verde }}>
                        {trendStatistics.avgMonthlyPrevisao.toLocaleString()}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default MonthlyTrendChart;