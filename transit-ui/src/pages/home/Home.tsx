

import { Button, Box, Typography } from "@mui/material";

import WavingHandIcon from '@mui/icons-material/WavingHand';


const Home = () => {
    return <Box height="100%" display="flex" justifyContent="center" alignItems="center">

        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" padding={2} gap={2}>

            <Box display="flex" gap={2} justifyContent="center" alignItems="center">
                <WavingHandIcon fontSize="large" color="primary" />
                <Typography variant="h4">Welcome to MINI CLOUD</Typography>
            </Box>


            <Button size="large" variant="outlined">Let's start</Button>
        </Box>

    </Box>
}

export default Home 