"use client";
import { Box, Typography } from "@mui/material";
import { themeColors } from "@/theme";

export default function Footer() {
  return (
    <Box component="footer" p={2} textAlign="center" bgcolor={themeColors.palette.background.default} color={themeColors.palette.text.light}>
      <Typography variant="body2">
        © {new Date().getFullYear()} Stooorage. Todos os direitos reservados.
      </Typography>
    </Box>
  );
}
