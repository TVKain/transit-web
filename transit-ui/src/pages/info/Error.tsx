import { ErrorOutline } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const Error = ({ errorMessage }: { errorMessage?: string }) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            height="100vh"
            gap={1}
        >
            <ErrorOutline color="error" fontSize="large" />
            <Typography variant="h5" gutterBottom>
                Oops! Something went wrong.
            </Typography>
            {errorMessage && <Typography variant="body1" gutterBottom>
                {errorMessage}
            </Typography>}

        </Box>
    );
};

export default Error;
