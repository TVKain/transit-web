
import { CircularProgress, Box, Typography } from '@mui/material';

const Loading = ({ text = "Loading..." }: { text?: string }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: "100%",
                height: '100%',
                gap: 4
            }}
        >
            <img src="/assets/icon.svg" width={64} />
            <Typography variant="h4">{text}</Typography>
            <CircularProgress />

        </Box>
    );
};

export default Loading;