"use client";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

type HeaderProps = {
    mode: "light" | "dark";
    toggleMode: () => void;
};

export default function Header({ mode, toggleMode }: HeaderProps) {
    return (
        <AppBar position="static" >
            <Toolbar sx={{
                backgroundColor: "background.default",
                color: "text.light"
            }}>
                <Typography variant="h6" fontWeight="600">
                    Stooorage
                </Typography>

                <IconButton onClick={toggleMode} sx={{ color: "text.light" }}>
                    {mode === "light" ? <Brightness4 /> : <Brightness7 />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
