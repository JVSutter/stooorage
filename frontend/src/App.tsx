import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./components/Dashboard";
import Actions from "./components/Actions";
import Inventory from "./components/Inventory";
import Forecast from "./components/Forecast";

const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
    { label: "Actions", path: "/actions", icon: BarChartIcon },
    { label: "Forecast", path: "/forecast", icon: ShowChartIcon },
    { label: "Inventory", path: "/inventory", icon: Inventory2Icon },
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
                            <Route path="/actions" element={<Actions />} />
                            <Route
                                path="/forecast"
                                element={<Forecast />}
                            />
                            <Route
                                path="/inventory"
                                element={<Inventory />}
                            />
                            <Route path="*" element={<div>Padrão</div>} />{" "}
                        </Routes>
                    </div>
                </Box>
            </div>
        </>
    );
}
