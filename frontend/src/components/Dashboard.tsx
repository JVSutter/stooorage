import React from "react";
import { Box, Grid, Typography, CircularProgress, Alert } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import Card from "./Card";
import SalesChart from "./BarGraph";
import MonthlyTrendChart from "./TendencyGraph";
import { useCardData } from "./useCardData";

const Dashboard: React.FC = () => {
    const { totalInStock, monthRevenue, growth, alerts, loading, error } = useCardData();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 4 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box>
            <Typography
                variant="h5"
                sx={{
                    display: "flex",
                    justifyContent: "left",
                    fontWeight: 800,
                }}
            >
                Painel
            </Typography>
            <Typography
                variant="subtitle1"
                sx={{
                    display: "flex",
                    justifyContent: "left",
                    fontWeight: "normal",
                    color: "#65758b",
                    marginBottom: "2%",
                }}
            >
                Visão geral das métricas do seu estoque
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        title="Vendas do mês"
                        value={`R$ ${monthRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        description={growth >= 0 ? `+${growth}%` : `${growth}%`}
                        icon={<TrendingUpIcon />}
                        iconColor="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        title="Crescimento"
                        value={`${growth >= 0 ? '+' : ''}${growth}%`}
                        description={growth >= 0 ? "Em relação ao mês anterior" : "Em relação ao mês anterior"}
                        icon={<ShowChartIcon />}
                        iconColor="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        title="Produtos em estoque"
                        value={totalInStock.toLocaleString('pt-BR')}
                        description="Total de produtos"
                        icon={<Inventory2Icon />}
                        iconColor="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        title="Alertas ativos"
                        value={alerts}
                        description="Itens com estoque baixo ou crítico"
                        icon={<WarningIcon />}
                        iconColor="primary"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} lg={8}>
                    <SalesChart />
                </Grid>

            </Grid>
        </Box>
    );
};

export default Dashboard;
