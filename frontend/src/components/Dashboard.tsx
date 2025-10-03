"use client";
import { Box, Typography, Grid } from "@mui/material";
import { themeColors } from "@/theme";

import ColumnsGraph from "./ColumnsGraph";

const salesData = [
  { day: "Seg", quantity: 45 },
  { day: "Ter", quantity: 62 },
  { day: "Qua", quantity: 38 },
  { day: "Qui", quantity: 71 },
  { day: "Sex", quantity: 89 },
  { day: "Sáb", quantity: 95 },
  { day: "Dom", quantity: 52 },
];

export default function Dashboard() {
  return (
    <Box sx={{ p: 3, backgroundColor: themeColors.palette.background.paper2 }}>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Market Dashboard
      </Typography>
      <Typography variant="body1">
        Bem-vindo ao painel! Aqui você poderá visualizar estatísticas de mercado.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ColumnsGraph data={salesData} title="Vendas por Dia da Semana" />
        </Grid>
      </Grid>
    </Box>
  );
}
