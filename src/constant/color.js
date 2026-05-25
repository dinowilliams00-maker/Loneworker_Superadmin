import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      light: "#FE605D",
      main: "#FF9300",
    },
    secondary: {
      light: "#FF9500",
      main: "#3C4346",
      dark: "#707070",
      contrastText: "#FFF",
    },
    success: {
      light: "#34C759",
      main: "#3FB00F",
      dark: "#4CB200",
      contrastText: "#FFF",
    },
    info: {
      light: "#32BAFF",
      main: "#8B8B8B",
      dark: "#8B8B8B",
      contrastText: "#FFF",
    },
    error: {
      light: "#FF3B30",
      main: "#FF0000",
      dark: "#E04347",
      contrastText: "#FFF",
    },
    warning: {
      light: "#FFCA64",
      main: "#FFB400",
      dark: "#E09E00",
      contrastText: "#FFF",
    },
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      A100: "#D5D5D5",
      A200: "#AAAAAA",
      A400: "#616161",
      A700: "#303030",
    },
  },
});

export default theme;
