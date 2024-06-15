import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

export default function EmptyPlaceholder({ Icon, message, subMessage }: { Icon: ReactNode, message: string, subMessage?: string }) {
    return <Box display="flex" flexDirection="column" gap={2} width="100%" height="100%" alignItems="center" justifyContent="center">
        {Icon}
        <Box display="flex" alignItems="center" flexDirection="column">
            <Typography variant="body1" >{message}</Typography>
            {subMessage && <Typography variant="body2" >{subMessage}</Typography>}
        </Box>
    </Box>
}