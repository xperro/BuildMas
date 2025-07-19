import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./styles/login.style.css";

const MOCK_EMAIL = "admin@buildmas.pro";
const MOCK_PASSWORD = "admin";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState(MOCK_EMAIL);
  const [password, setPassword] = useState(MOCK_PASSWORD);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      localStorage.setItem("loggedIn", "true");
      navigate("/clients");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box className="login-container">
        <Typography variant="h5" className="login-title">
          BuildMas Login
        </Typography>
        <form onSubmit={handleLogin}>
          <Box className="login-input">
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </Box>
          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}
          <Box mt={2}>
            <Button
              type="submit"
              fullWidth
              className="login-button"
              variant="contained"
            >
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
