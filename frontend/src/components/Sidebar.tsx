"use client";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Dashboard, ShowChart, Public, AccountBalance, Settings } from "@mui/icons-material";

const menu = [
  { label: "Dashboard", icon: <Dashboard /> },
  { label: "Stocks", icon: <ShowChart /> },
  { label: "Markets", icon: <Public /> },
  { label: "Portfolio", icon: <AccountBalance /> },
  { label: "Settings", icon: <Settings /> },
];

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 220,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 220,
          boxSizing: "border-box",
        },
      }}
    >
      <Typography variant="h6" p={2} fontWeight="bold">
        MarketPulse
      </Typography>
      <List>
        {menu.map((item) => (
          <ListItemButton key={item.label}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}