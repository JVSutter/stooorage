"use client";

import { createTheme } from "@mui/material/styles";

// color: #141414; Titulo
// color: #262626; paragrafo
// color: #fff; paragrafo em fundo escuro
// background-color: #121313; Fundo mais escuro
// background-color: #f4f4f4; fundo mais claro

export const getTheme = (mode: "light" | "dark") =>
    createTheme({
        palette: {
            mode,
            ...(mode === "light"
                ? {
                      // 🌞 Modo Claro
                      text: {
                          primary: "#262626",
                          secondary: "#fff",
                          light: "#fff",
                      },
                      background: {
                          default: "#121313",
                          paper: "#f4f4f4",
                          paper2: "#fff",
                      },
                  }
                : {
                      // 🌙 Modo Escuro
                      text: {
                          primary: "#262626",
                          secondary: "#fff",
                          light: "#fff",
                      },
                      background: {
                          default: "#121313",
                          paper: "#f4f4f4",
                          paper2: "#fff",
                      },
                  }),
        },
    });
