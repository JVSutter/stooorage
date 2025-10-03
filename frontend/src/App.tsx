import React from "react";
import { useState } from "react";
import {
    Box,
    CssBaseline,
    Typography,
    Paper,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningIcon from "@mui/icons-material/Warning";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    AreaChart,
    Area,
    CartesianGrid,
} from "recharts";

const sidebarItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Ações", icon: <BarChartIcon /> },
    { text: "Previsões", icon: <ShowChartIcon /> },
    { text: "Estoque", icon: <Inventory2Icon /> },
];

const vendasSemana = [
    { dia: "Seg", real: 60, previsao: 65 },
    { dia: "Ter", real: 45, previsao: 50 },
    { dia: "Qua", real: 70, previsao: 68 },
    { dia: "Qui", real: 85, previsao: 80 },
    { dia: "Sex", real: 90, previsao: 95 },
    { dia: "Sáb", real: 100, previsao: 95 },
    { dia: "Dom", real: 50, previsao: 55 },
];

const tendenciaMensal = [
    { mes: "Jan", real: 800, previsao: 820 },
    { mes: "Fev", real: 900, previsao: 950 },
    { mes: "Mar", real: 1050, previsao: 1100 },
    { mes: "Abr", real: 1020, previsao: 1040 },
    { mes: "Mai", real: 1200, previsao: 1250 },
    { mes: "Jun", real: 1350, previsao: 1400 },
];

const produtosMaisVendidos = [
    { produto: "Produto A", vendas: 250 },
    { produto: "Produto B", vendas: 210 },
    { produto: "Produto C", vendas: 167 },
    { produto: "Produto D", vendas: 145 },
    { produto: "Produto E", vendas: 130 },
];

export default function App() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    return (
        <>
            <Typography variant="h6" sx={{ m: 2 }}>
                Stooorage
            </Typography>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />

                <Box
                    sx={{ width: 200, bgcolor: "#f5f5f5", minHeight: "100vh" }}
                >
                    <List>
                        {sidebarItems.map((item, index) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    selected={selectedIndex === index} // <-- selecionado
                                    onClick={() => setSelectedIndex(index)} // <-- muda ao clicar
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Dashboard
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Visão geral do seu negócio em tempo real
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={3}>
                            <Paper sx={{ p: 2 }}>
                                Vendas do Mês: R$ 45.231
                            </Paper>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper sx={{ p: 2 }}>Crescimento: +23%</Paper>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper sx={{ p: 2 }}>
                                Produtos em Estoque: 1.847
                            </Paper>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper sx={{ p: 2 }}>Alertas Ativos: 7</Paper>
                        </Grid>
                    </Grid>

                    {/* Gráficos */}
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <Typography variant="h6">
                                Vendas por Dia da Semana
                            </Typography>
                            <BarChart
                                width={500}
                                height={300}
                                data={vendasSemana}
                            >
                                <XAxis dataKey="dia" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="real" fill="#1976d2" />
                                <Bar dataKey="previsao" fill="#2e7d32" />
                            </BarChart>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="h6">
                                Tendência Mensal
                            </Typography>
                            <AreaChart
                                width={500}
                                height={300}
                                data={tendenciaMensal}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="real"
                                    stroke="#1976d2"
                                    fill="#1976d2"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="previsao"
                                    stroke="#2e7d32"
                                    fill="#2e7d32"
                                />
                            </AreaChart>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Produtos Mais Vendidos
                        </Typography>
                        {produtosMaisVendidos.map((p) => (
                            <Paper key={p.produto} sx={{ p: 1, mb: 1 }}>
                                {p.produto}: {p.vendas}
                            </Paper>
                        ))}
                    </Box>
                </Box>
            </Box>
        </>
    );
}
