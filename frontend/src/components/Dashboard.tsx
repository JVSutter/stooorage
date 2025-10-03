"use client";
import { Box, Typography } from "@mui/material";
import { themeColors } from "@/theme";

export default function Dashboard() {
  return (
    <Box sx={{ p: 3, backgroundColor: themeColors.palette.background.paper2 }}>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Market Dashboard
      </Typography>
      <Typography variant="body1">
        Bem-vindo ao painel! Aqui você poderá visualizar estatísticas de mercado.
      </Typography>
    </Box>
  );
}
