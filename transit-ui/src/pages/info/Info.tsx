import { InfoOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const Info = ({ infoMessage }: { infoMessage: string }) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            height="100%"
            gap={1}
        >
            <InfoOutlined color="primary" fontSize="large" />
            <Typography variant="h5" gutterBottom>
                {infoMessage}
            </Typography>
        </Box>
    );
};

export default Info;
