"use client";
import { Box, Typography } from "@mui/material";
import { themeColors } from "@/theme";

export default function Estoque() {
  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Estoque!!!!
      </Typography>
      <Typography variant="body1" color={themeColors.palette.text.secondary}>
        Bem-vindo ao painel! Aqui você poderá visualizar estatísticas de mercado.
      </Typography>
    </Box>
  );
}