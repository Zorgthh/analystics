import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

function Login() {
  const { login, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setIsLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setIsLoading(true);
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  // Update button disabled states
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center">
          Login
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Typography align="center">
            Don't have an account? <Link to="/register">Register</Link>
          </Typography>
          <Button
            fullWidth
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            sx={{ mt: 2, mb: 2 }}
          >
            Sign In with Google
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;