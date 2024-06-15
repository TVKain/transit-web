import { Box, Button, CircularProgress } from "@mui/material"

export default function LoadingButton(
    { children, size = "small", variant = "contained",
        disabled = false, loading = false, loadingSize = 24, type, color = "primary", iconColor = "primary" }: {
            children: any,
            size: "medium" | "small" | "large",
            variant: "text" | "contained" | "outlined",
            disabled?: boolean,
            loading?: boolean,
            loadingSize?: number,
            type: "submit" | "button" | "reset",
            color?: "primary" | "inherit" | "info" | "success" | "warning" | "error" | "secondary";
            iconColor?: "primary" | "inherit" | "info" | "success" | "warning" | "error" | "secondary";
        }) {
    return <Box sx={{ height: "100%", position: 'relative' }}>
        <Button
            size={size}
            variant={variant}
            disabled={disabled}
            type={type}
            color={color}
        >
            {children}
        </Button>
        {loading && (
            <CircularProgress
                color={iconColor}
                size={loadingSize}
                sx={{

                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                }}
            />
        )}
    </Box>
}