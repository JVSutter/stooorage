import React from "react";

import { Link, useLocation } from "react-router-dom";
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";

import { themeColors } from "./theme";

// Tipagem do item do menu
export interface MenuItem {
    label: string;
    path: string;
    icon: SvgIconComponent;
}

interface SidebarProps {
    menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
    const location = useLocation();

    return (
        <Box
            sx={{
                borderRight: `1px solid hsl(212.3, 31.7%, 92%)`,
                bgcolor: "#fff",
                padding: "10px",
                color: "#65758b"
            }}
        >
            <List>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 1, width: "220px" }}>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={isActive}
                                sx={{
                                    borderRadius: 2,
                                    background: isActive ? "linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 70%));" : "none",
                                    color: isActive
                                        ? "#fff"
                                        : themeColors.textSecondary,
                                    bgcolor: isActive
                                        ? "hsl(217 91% 60%) !important"
                                        : "transparent",
                                    boxShadow: isActive
                                        ? "0 4px 8px rgba(0,0,0,0.15)"
                                        : "none",
                                    "&:hover": {
                                        bgcolor: isActive
                                            ? themeColors.dodgerBlue
                                            : themeColors.azulClarinho + "cc",
                                        color: isActive
                                            ? "#fff"
                                            : themeColors.textPrimary,
                                    },
                                    transition: "all 0.2s",
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive
                                            ? "#fff"
                                            : "#65758b",
                                        minWidth: 40,
                                    }}
                                >
                                    <Icon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{ fontWeight: 500, fontSize: ".8rem" }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};

export default Sidebar;
