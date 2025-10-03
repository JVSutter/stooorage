"use client";
import Link from "next/link";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PreviewIcon from '@mui/icons-material/Preview';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
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
    <Box sx={{ p: 2, backgroundColor: themeColors.palette.background.paper, color: themeColors.palette.text.primary, height: "100%" }}>
      <Typography variant="h6" mb={2} fontWeight="bold">
        Stooorage
      </Typography>
      <List>
        {menu.map((item) => (
          <Link key={item.label} href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemButton key={item.label}>
              <ListItemIcon sx={{ color: themeColors.palette.text.primary }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Box>
  );
}