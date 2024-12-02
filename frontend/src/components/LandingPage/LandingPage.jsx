import React, { useState } from "react";
import { Button, Box, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {
  const navigate = useNavigate();
  const [guestName, setGuestName] = useState("");

  const handleGuestLogin = async () => {
    try {
      // Send guest name to the server to generate a guest token
      const response = await axios.post("http://localhost:3000/auth/guest", {
        name: guestName,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Store the token
        localStorage.setItem("guest", "true"); // Mark the user as a guest
        navigate("/app"); // Redirect to the app
      } else {
        console.error("Guest login failed");
      }
    } catch (error) {
      console.error("Error during guest login:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to Text Manager
      </Typography>
      <TextField
        label="Enter Name"
        variant="outlined"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGuestLogin}
        sx={{ marginBottom: 2 }}
      >
        Continue as Guest
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/auth/signup")}
        sx={{ marginBottom: 2 }}
      >
        Sign Up
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={() => navigate("/auth/login")}
      >
        Login
      </Button>
    </Box>
  );
};

export default LandingPage;
