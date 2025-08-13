"use client"
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/lib/theme";

export default function LinearIndeterminate() {
  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ width: '100%' }}>
      <LinearProgress  sx={{borderRadius: "100vh"}}/>
    </Box>
    </ThemeProvider>
  );
}
