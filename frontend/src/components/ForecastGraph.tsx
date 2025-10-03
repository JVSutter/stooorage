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

interface WeeklyData {
    week: string;
    forecast: number;
    upperBound: number;
    lowerBound: number;
}

const ForecastGraph: React.FC = () => {
    const [weeklyTrendData, setWeeklyTrendData] = useState<WeeklyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/ai/forecast/total/12?frequency=week`
                );
                if (!res.ok) throw new Error("Request error");
                const forecastData = await res.json();

                const parsed: WeeklyData[] = forecastData.map((item: any) => {
                    const date = new Date(item.ds);
                    // format as week starting date (short format)
                    const weekLabel = `${date.getDate()}/${
                        date.getMonth() + 1
                    }`;

                    return {
                        week: weekLabel,
                        forecast: item.yhat,
                        upperBound: item.yhat_upper,
                        lowerBound: item.yhat_lower,
                    };
                });

                setWeeklyTrendData(parsed);
            } catch (err) {
                console.error("Error fetching forecast:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, []);

    const trendStatistics = useMemo(() => {
        if (weeklyTrendData.length === 0) return null;

        const firstWeek = weeklyTrendData[0].forecast;
        const lastWeek = weeklyTrendData[weeklyTrendData.length - 1].forecast;
        const growth = ((lastWeek - firstWeek) / firstWeek) * 100;

        const totalForecast = weeklyTrendData.reduce(
            (sum, item) => sum + item.forecast,
            0
        );
        const avgWeeklyForecast = totalForecast / weeklyTrendData.length;

        return {
            growth: growth.toFixed(1),
            avgWeeklyForecast: Math.round(avgWeeklyForecast),
            isGrowthPositive: growth > 0,
        };
    }, [weeklyTrendData]);

    if (loading) {
        return <Typography>Loading forecasts...</Typography>;
    }

    if (!trendStatistics) {
        return <Typography>No data available</Typography>;
    }

    return (
        <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0", width: '1000px'
         }}>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Box>
                    <Typography variant="h6" fontWeight="600">
                        Weekly Sales Trend
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Weekly AI forecast evolution
                    </Typography>
                </Box>

                <Chip
                    icon={
                        trendStatistics.isGrowthPositive ? (
                            <TrendingUpIcon />
                        ) : (
                            <TrendingDownIcon />
                        )
                    }
                    label={`${trendStatistics.growth}%`}
                    color={
                        trendStatistics.isGrowthPositive ? "success" : "error"
                    }
                    sx={{ fontWeight: 600 }}
                />
            </Box>

            {/* Chart */}
            <Box
                sx={{ width: "100%", aspectRatio: "16/9", minHeight: "350px" }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyTrendData}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e0e0e0"
                            vertical={false}
                        />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Legend />

                        {/* Forecast line (solid) */}
                        <Line
                            type="monotone"
                            dataKey="forecast"
                            stroke={themeColors.verde}
                            strokeWidth={3}
                            name="Forecast (AI)"
                        />

                        {/* Upper bound (dashed, no dots) */}
                        <Line
                            type="monotone"
                            dataKey="upperBound"
                            stroke={themeColors.verde}
                            strokeDasharray="5 5"
                            dot={false}
                            activeDot={false}
                            name="Upper Bound"
                        />

                        {/* Lower bound (dashed, no dots) */}
                        <Line
                            type="monotone"
                            dataKey="lowerBound"
                            stroke={themeColors.verde}
                            strokeDasharray="5 5"
                            dot={false}
                            activeDot={false}
                            name="Lower Bound"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>

            {/* Summary stats */}
            <Box
                sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: "1px solid #e0e0e0",
                    display: "flex",
                    gap: 4,
                }}
            >
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Avg Weekly Forecast
                    </Typography>
                    <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{ color: themeColors.verde }}
                    >
                        {trendStatistics.avgWeeklyForecast.toLocaleString()}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default ForecastGraph;