import { useState } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider, CssBaseline, Box } from "@mui/material";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import "./globals.css";

import { getTheme } from "@/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stooorage",
  description: "Sistema de gerenciamento de estoque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [mode, setMode] = useState<"light" | "dark">("dark");

  const theme = getTheme(mode);

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
            <ThemeProvider theme={theme}>
                <CssBaseline />

                {/* Header full width */}
                <Header
                    mode={mode}
                    toggleMode={() => {
                        setMode(mode === "dark" ? "light" : "dark");
                    }}
                />

                {/* Conteúdo dividido em Sidebar (20%) e Dashboard (80%) */}
                <Box display="flex" flexGrow={1} minHeight={0}>
                    {/* Sidebar (20%) */}
                    <Box
                        width="15%"
                    >
                        <Sidebar />
                    </Box>

                    {/* Dashboard (80%) */}
                    <Box width="85%" overflow="auto">
                        {children} 
                    </Box>
                </Box>

                {/* Footer full width */}
                <Footer />
            </ThemeProvider>
      </body>
    </html>
  );
}