import { Button, TextField, Typography, Paper, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

const LoginPage = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const validationSchema = yup.object({
        username: yup.string().required('Username is required'),
        password: yup.string().required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setFieldError }) => {
            try {
                await auth.login(values.username, values.password);
                navigate("/region");
            } catch (error) {
                setFieldError("username", "Username or password is incorrect")
                setFieldError("password", "Username or password is incorrect")
            }
        },
    });

    return (
        <Box display='flex' justifyContent='center' alignItems='center' sx={{
            minHeight: '100vh'
        }}>

            <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '65vh', paddingY: 4, paddingX: 4, gap: 1 }}>
                <img src="/assets/icon.svg" width="50" />
                <Typography variant="h5">Cloud Sign In</Typography>
                <Box component="form" noValidate>
                    <TextField
                        size='small'
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                    />
                    <TextField
                        size='small'
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => {
                            formik.handleSubmit()
                        }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Paper>

        </Box>
    );
};

export default LoginPage;
