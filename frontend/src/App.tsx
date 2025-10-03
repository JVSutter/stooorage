import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./components/Dashboard";

const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
    { label: "Ações", path: "/acoes", icon: BarChartIcon },
    { label: "Previsões", path: "/previsoes", icon: ShowChartIcon },
    { label: "Estoque", path: "/estoque", icon: Inventory2Icon },
];

export default function App() {
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <Header />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        height: "calc(100vh - 65px)",
                    }}
                >
                    <Sidebar menuItems={menuItems} />
                    <div style={{ flex: 1, padding: 24 }}>
                        <Routes>
                            <Route
                                path="/dashboard"
                                element={<Dashboard />}
                            />
                            <Route path="/acoes" element={<div>Ações</div>} />
                            <Route
                                path="/previsoes"
                                element={<div>Previsões</div>}
                            />
                            <Route
                                path="/estoque"
                                element={<div>Estoque</div>}
                            />
                            <Route path="*" element={<div>Padrão</div>} />{" "}
                        </Routes>
                    </div>
                </Box>
                {/* <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={3}>
                        <Card title="Vendas do mês" value="R$ 250000"  description="+12.5%" icon={<TrendingUpIcon />} iconColor="primary" />
                    </Grid>
                    <Grid item xs={3}>
                        <Card title="Crescimento" value="+ 23%" description="+8.2%" icon={<ShowChartIcon />} iconColor="primary" />
                    </Grid>
                    <Grid item xs={3}>
                        <Card title="Produtos em estoque" value="1847" description="-3.7%" icon={<Inventory2Icon />} iconColor="primary" />
                    </Grid>
                    <Grid item xs={3}>
                        <Card title="Alertas ativos" value="7" description="" icon={<WarningIcon />} iconColor="primary" />
                    </Grid>
                </Grid> */}
            </div>
        </>
    );
}
