import { ThemeProvider, CssBaseline } from "@mui/material";
import AppRoutes from "./routes/AppRoutes";
import { getTheme } from "./utils/theme";
import { ThemeModeProvider, useThemeMode } from "./utils/ThemeContext";
import { SnackbarProvider } from "./components/common/SnackbarProvider";

const ThemedApp = () => {
  const { mode } = useThemeMode();
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <CssBaseline />
        <AppRoutes />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

const App = () => (
  <ThemeModeProvider>
    <ThemedApp />
  </ThemeModeProvider>
);

export default App;
