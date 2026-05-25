import { createTheme } from "@mui/material/styles";
import theme from "./color";

const baseDarkTheme = createTheme({
  palette: {
    primary: {
      light: "#C3F631",
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
    text: {
      primary: "#3C4346",
      secondary: "#4C4C4C",
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.02,
      hover: "#f6f9fc",
    },
    divider: "#e5eaef",
    background: {
      default: "#eef5f9",
      paper: "#F2F7FC",
    },
  },
  typography: {
    fontFamily: "Poppins, Helvetica, Arial, sans-serif",
    h1: {
      fontWeight: 500,
      fontSize: "2.25rem",
      lineHeight: "2.75rem",
    },
    h2: {
      fontWeight: 500,
      fontSize: "1.875rem",
      lineHeight: "2.25rem",
    },
    h3: {
      fontWeight: 500,
      fontSize: "1.5rem",
      lineHeight: "1.75rem",
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.3125rem",
      lineHeight: "1.6rem",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.125rem",
      lineHeight: "1.6rem",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
      lineHeight: "1.2rem",
    },
    button: {
      textTransform: "capitalize",
      fontWeight: 400,
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "1.334rem",
    },
    body2: {
      fontSize: "0.75rem",
      letterSpacing: "0rem",
      fontWeight: 400,
      lineHeight: "1rem",
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ".MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation": {
          boxShadow:
            "rgba(145 158 171 / 30%) 0px 0px 2px 0px, rgba(145 158 171 / 12%) 0px 12px 24px -4px !important",
        },
        a: {
          textDecoration: "none",
        },
        ".MuiTimelineConnector-root": {
          width: "1px !important",
          backgroundColor: "rgba(0, 0, 0, 0.12) !important",
        },
        body: {
          fontFamily: "Poppins, Helvetica, Arial, sans-serif",
        },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          border: `1px solid ${theme.palette.grey[300]}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: "none",
          padding: "4px 12px",
          fontSize: "1.25rem",
          fontWeight: 700,
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          fontSize: "1.25rem",
          fontWeight: 700,
          borderRadius: "24px",
          padding: "0px",
        },
        // expandIcon: {
        //   color: theme.palette.primary.contrastText,
        // },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: "0px 12px",
          fontWeight: 400,
          fontSize: "0.875rem",
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#3C4346",
          color: "#fff",
          boxShadow: "none",
          borderRadius: "0px",
          padding: "0px",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: "260px",
          backgroundColor: "#3C4346 !important",
          color: "#fff !important",
          borderRadius: "0px !important",
          padding: "0px !important",
          boxShadow: "4px 0px 10px 0px rgba(0, 0, 0, 0.6) !important",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          // border: "1px solid #ddd",
          color: "#000",
          padding: "13px",
          boxShadow: "none",
          borderRadius: "24px",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          border: "1px solid #ddd",
          padding: "0",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: "0px",
          paddingBottom: "0px",
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "20px",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          margin: 0,
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          color: theme.palette.grey[500],
          "&.Mui-active": {
            color: theme.palette.primary.main,
          },
          "&.Mui-completed": {
            color: theme.palette.primary.main,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
          //   boxShadow: "none",
          borderRadius: "24px",
          color: theme.palette.secondary.main,
        },
        outlined: {
          borderColor: theme.palette?.primary.main,
          color: theme.palette.primary.main,
          "&:hover": {
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
          },
          // "& .MuiTouchRipple-root .MuiTouchRipple-child": {
          //   backgroundColor: theme.palette.primary.main,
          // },
        },
        contained: {
          color: "#FFFFFF",
          "&:hover": {
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "#8B8B8B",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: theme.palette.primary.main,
            fontSize: "0.85rem",
            transform: "translate(12px, 12px) scale(1)",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: theme.palette.primary.main,
            fontSize: "1.1rem",
            transform: "translate(12px, -9px) scale(0.75)",
          },
          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
            transform: "translate(12px, -9px) scale(0.75)",
            fontSize: "1rem",
          },
          "& .MuiInputBase-input": {
            fontSize: "0.95rem",
          },
          "& .MuiInputBase-input::placeholder": {
            fontSize: "0.85rem",
            color: theme.palette.text.secondary,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: "32px" },
        // indicator: {
        //   display: "none",
        // },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: "50px",
          // color: "#000",
          padding: "4px 12px",
          fontSize: "14px",
          minHeight: "36px",
          marginRight: "15px",
          backgroundColor: theme.palette.background.paper,
          borderRadius: "30px",
          "&:hover": {
            color: theme.palette.primary.main,
          },
          "&.Mui-selected": {
            fontWeight: 600,
            fontSize: "14px",
            color: theme.palette.secondary.main,
            backgroundColor: theme.palette.primary.main,
          },
        },
      },
    },
    // ------------------Card-------------------------
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
        },
        title: {
          fontSize: "1.125rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "24px",
          padding: "0",
          boxShadow: "0px 4px 12px rgba(167, 167, 167, 0.4)",
          backgroundColor: "#fFffff",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {},
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#000",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: 0,
          borderRadius: "24px",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          position: "sticky",
          top: 0,
          zIndex: 10,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          position: "sticky",
          bottom: 0,
          backgroundColor: "#fff",
          zIndex: 10,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid #e5eaef`,
          fontSize: "11px",
          color: "#000",
        },
      },
    },
    MuiTableFooter: {
      styleOverrides: {
        root: {
          padding: "5px 8px",
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: "#000",
          backgroundColor: "#F4F5F7",
          padding: "0px 8px !important",
          justifyContent: "space-between",
          "& .MuiTablePagination-displayedRows": {
            order: -1,
            color: "#000",
          },
          "& .MuiTablePagination-selectLabel": {
            color: "#000",
          },
          "& .MuiInputBase-root": {
            color: "#000",
          },
          "& .MuiTablePagination-actions": {
            pointerEvents: "auto",
            opacity: 1,
          },
        },
      },
      defaultProps: {
        slotProps: {
          select: {
            MenuProps: {
              PaperProps: {
                sx: {
                  "& .MuiMenuItem-root": {
                    color: "#000 !important",
                    padding: "6px 16px",
                    "&.Mui-selected": {
                      backgroundColor: "#e5eaef !important",
                      color: "#000 !important",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#F4F5F7",
          borderRadius: "24px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": {
            borderBottom: 0,
          },
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[200],
          borderRadius: "24px",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.divider,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.paper,
          borderRadius: "24px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderRadius: "24px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderRadius: "24px",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
        },
        input: {
          padding: "10px 12px",
          color: theme.palette.text.primary,
        },
        inputSizeSmall: {
          padding: "8px 14px",
        },
      },
    },

    //---------------------------------------------------------------
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          color: "white",
        },
        filledInfo: {
          color: "white",
        },
        filledError: {
          color: "white",
        },
        filledWarning: {
          color: "white",
        },
        standardSuccess: {
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.main,
        },
        standardError: {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.main,
        },
        standardWarning: {
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.main,
        },
        standardInfo: {
          backgroundColor: theme.palette.info.light,
          color: theme.palette.info.main,
        },
        outlinedSuccess: {
          borderColor: theme.palette.success.main,
          color: theme.palette.success.main,
        },
        outlinedWarning: {
          borderColor: theme.palette.warning.main,
          color: theme.palette.warning.main,
        },
        outlinedError: {
          borderColor: theme.palette.error.main,
          color: theme.palette.error.main,
        },
        outlinedInfo: {
          borderColor: theme.palette.info.main,
          color: theme.palette.info.main,
        },
      },
    },
  },
});

export { baseDarkTheme };
