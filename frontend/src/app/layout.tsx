import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Box } from "@mui/material";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import "./globals.css";

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

    return (
        <html lang="pt-BR">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}
            >
                <Header />
                <Box display="flex" flexGrow={1} minHeight={0}>
                    <Box width="15%">
                        <Sidebar />
                    </Box>
                    <Box width="85%" overflow="auto">
                        {children}
                    </Box>
                </Box>
                <Footer />
            </body>
        </html>
    );
}
