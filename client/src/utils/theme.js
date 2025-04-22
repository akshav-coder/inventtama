import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#ff6f00", // orange
      },
      background: {
        default: mode === "light" ? "#ffffff" : "#121212",
        paper: mode === "light" ? "#f9f9f9" : "#1e1e1e",
      },
      text: {
        primary: mode === "light" ? "#1a1a1a" : "#ffffff",
      },
    },
    typography: {
      fontFamily: "Manrope, sans-serif",
    },
  });
