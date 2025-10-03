"use client";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" p={2} textAlign="center" color="text.light">
      <Typography variant="body2">
        © {new Date().getFullYear()} Stooorage. Todos os direitos reservados.
      </Typography>
    </Box>
  );
}
