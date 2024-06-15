import { createTheme, PaletteMode } from '@mui/material';

const themeOptions = {
    palette: {
        mode: 'light' as PaletteMode,
        primary: {
            main: '#25805e',

        },
        secondary: {

            main: '#f6f6f7',
        },
        error: {
            main: '#d65c66',
        },
    },
};

const theme = createTheme(themeOptions);

export default theme;