import { createTheme } from '@mui/material/styles';

// FoodRide brand: warm "appetite" orange paired with a fresh green accent
// (delivery / "on the move"), on a clean neutral base.
const theme = createTheme({
  palette: {
    primary: { main: '#FF5722', dark: '#D84315', light: '#FF8A65', contrastText: '#fff' },
    secondary: { main: '#00B074', dark: '#00875A', light: '#4FD3A0', contrastText: '#fff' },
    background: { default: '#FAF7F5', paper: '#FFFFFF' },
    text: { primary: '#26221F', secondary: '#6B615C' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingLeft: 20, paddingRight: 20 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 16px rgba(38, 34, 31, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: '0 1px 8px rgba(38, 34, 31, 0.08)' },
      },
    },
  },
});

export default theme;
