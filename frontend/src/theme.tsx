import { createTheme } from "@mui/material/styles";

const themeColors = {
  fuzzyBrown: "#c5604d",
  vermelhoDamasco: "#d75b4c",
  dodgerBlue: "#4085f6",
  verde: "#19a24b",
  azulClarinho: "#97ccca",
  backgroundLight: "#f5f5f5",
  backgroundDark: "#262626",
  textPrimary: "#141414",
  textSecondary: "#555",
};

const theme = createTheme({
  palette: {
    primary: {
      main: themeColors.dodgerBlue,
    },
    secondary: {
      main: themeColors.verde,
    },
    error: {
      main: themeColors.vermelhoDamasco,
    },
    warning: {
      main: themeColors.fuzzyBrown,
    },
    info: {
      main: themeColors.azulClarinho,
    },
    background: {
      default: themeColors.backgroundLight,
      paper: "#fff",
    },
    text: {
      primary: themeColors.textPrimary,
      secondary: themeColors.textSecondary,
    },
  },
});

export { theme, themeColors };
