"use client";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" p={2} textAlign="center" bgcolor="grey.200">
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Stooorage. Todos os direitos reservados.
      </Typography>
    </Box>
  );
}
