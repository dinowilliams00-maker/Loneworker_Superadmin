import { BrowserRouter } from "react-router-dom";
import { baseDarkTheme } from "./constant/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastComponent from "src/Components/common/snackbar";
import { AuthProvider } from "src/Components/common/provider/authProvider";
import AppRoutes from "src/appRoute/AppRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={baseDarkTheme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
        <ToastComponent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
