"use client";
import Link from "next/link";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PreviewIcon from '@mui/icons-material/Preview';
import { Dashboard, ShowChart } from "@mui/icons-material";

const menu = [
  { label: "Dashboard", icon: <Dashboard />, href: "/dashboard" },
  { label: "Ações", icon: <ShowChart />, href: "/acoes" },
  { label: "Previsões", icon: <PreviewIcon />, href: "/previsoes" },
  { label: "Estoque", icon: <Inventory2Icon />, href: "/estoque" },
];

export default function Sidebar() {
  return (
    <Box p={2} sx={{ color: "black" }}>
      <Typography variant="h6" mb={2} fontWeight="bold">
        Stooorage
      </Typography>
      <List>
        {menu.map((item) => (
          <Link key={item.label} href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Box>
  );
}