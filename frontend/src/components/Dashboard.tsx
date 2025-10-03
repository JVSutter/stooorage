import React from "react";
import { Box, Grid, Typography } from "@mui/material";

import WarningIcon from "@mui/icons-material/Warning";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import Card from "./Card";
import SalesChart from "./BarGraph";
import MonthlyTrendChart from "./TendencyGraph";

const Dashboard: React.FC = () => {
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
                Dashboard
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
                Real-time overview of your business
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        title="Vendas do mês"
                        value="R$ 250000"
                        description="+12.5%"
                        icon={<TrendingUpIcon />}
                        iconColor="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        title="Crescimento"
                        value="+ 23%"
                        description="+8.2%"
                        icon={<ShowChartIcon />}
                        iconColor="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        title="Produtos em estoque"
                        value="1847"
                        description="-3.7%"
                        icon={<Inventory2Icon />}
                        iconColor="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        title="Alertas ativos"
                        value="7"
                        description=""
                        icon={<WarningIcon />}
                        iconColor="primary"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} lg={8}>
                    <SalesChart />
                </Grid>

                <Grid item xs={12} lg={6}>
                    <MonthlyTrendChart />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
