"use client";
import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" fontWeight="600">
          MarketPulse
        </Typography>
      </Toolbar>
    </AppBar>
  );
}