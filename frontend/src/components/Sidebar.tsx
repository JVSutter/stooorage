"use client";
import Link from "next/link";
import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PreviewIcon from "@mui/icons-material/Preview";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { Dashboard } from "@mui/icons-material";
import { themeColors } from "@/theme";

const menu = [
    { label: "Dashboard", icon: <Dashboard />, href: "/dashboard" },
    { label: "Ações", icon: <PendingActionsIcon />, href: "/actions" },
    { label: "Previsões", icon: <PreviewIcon />, href: "/predictions" },
    { label: "Estoque", icon: <Inventory2Icon />, href: "/stock" },
];

export default function Sidebar() {
    return (
        <Box
            sx={{
                backgroundColor: themeColors.palette.background.paper,
                color: themeColors.palette.text.primary,
                height: "100%",
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "center",
                    p: "10px",
                }}
            >
                Stooorage
            </Typography>

            <Divider />

            <List>
                {menu.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <ListItemButton
                            key={item.label}
                            sx={{
                              margin: "5px",
                                borderRadius: "8px", // arredondamento padrão (opcional)
                                "&:hover": {
                                    backgroundColor: "#e0e0e0", // cor de fundo ao passar o mouse
                                    borderRadius: "12px", // borda arredondada ao hover
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: themeColors.palette.text.primary,
                                    minWidth: "30px",
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontSize: ".8rem", // tamanho da fonte
                                    fontWeight: 500, // opcional, peso da fonte
                                    color: themeColors.palette.text.primary,
                                }}
                            />
                        </ListItemButton>
                    </Link>
                ))}
            </List>
        </Box>
    );
}
