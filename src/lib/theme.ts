import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: {
    nativeColor: true,
  },
  palette: {
    primary: {
      main: 'var(--primary)',
    },
  },
});