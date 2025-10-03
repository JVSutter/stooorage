"use client";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { themeColors } from "@/theme";

export default function Header() {
    return (
        <AppBar position="static" sx={{ boxShadow: "none" }}>
            <Toolbar
                sx={{
                    backgroundColor: themeColors.palette.background.default,
                    color: "text.light",
                    minHeight: "0px",
                }}
            >
                <Typography variant="h6" fontWeight="600">
                    Stooorage
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
