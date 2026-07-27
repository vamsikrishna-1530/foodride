import { Box, Typography } from '@mui/material';

// FoodRide logo: a fork+road icon (food + delivery route) followed by the wordmark.
// size controls the icon's pixel height; the wordmark scales with it.
const Logo = ({ size = 36, showText = true, textColor = 'text.primary' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" fill="#FF5722" />
      <path
        d="M18 20c0-2 2-4 4-4s4 2 4 4v10a4 4 0 0 1-3 4v14a1.5 1.5 0 0 1-3 0V34a4 4 0 0 1-3-4z"
        fill="#FFFFFF"
      />
      <path
        d="M40 16c-3.5 0-6 3.5-6 9 0 4 2 7 5 8v15.2a1.5 1.5 0 0 0 3 0V17c0-.6-.4-1-1-1z"
        fill="#FFFFFF"
      />
      <path d="M14 46h28a2 2 0 0 1 0 4H14a2 2 0 0 1 0-4z" fill="#00B074" />
    </svg>
    {showText && (
      <Typography
        variant="h5"
        sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, letterSpacing: -0.5, color: textColor }}
      >
        Food<Box component="span" sx={{ color: '#00B074' }}>Ride</Box>
      </Typography>
    )}
  </Box>
);

export default Logo;
