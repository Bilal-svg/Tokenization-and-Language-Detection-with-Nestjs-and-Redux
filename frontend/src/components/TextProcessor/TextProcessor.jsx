import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Grid,
  Stack,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCount,
  selectError,
  selectIsDownloading,
  selectIsProcessing,
  selectPdfFileName,
  selectText,
  setCount,
  setError,
  setIsDownloading,
  setIsProcessing,
  setPdfFileName,
  setText,
} from "../../redux/slice/textSlice";
import {
  getSelectedCount,
  getSelectedText,
  triggerRefresh,
} from "../../redux/slice/drawerSlice";
import { useNavigate } from "react-router-dom";

const TextProcessor = ({ isDrawerOpen, drawerWidth }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [guestName, setGuestName] = useState("");

  const text = useSelector(selectText);
  const isProcessing = useSelector(selectIsProcessing);
  const isDownloading = useSelector(selectIsDownloading);
  const pdfFileName = useSelector(selectPdfFileName);
  const count = useSelector(selectCount);
  const error = useSelector(selectError);
  const selectedText = useSelector(getSelectedText);
  const selectedCount = useSelector(getSelectedCount);

  useEffect(() => {
    if (selectedText) {
      dispatch(setText(selectedText));
      dispatch(setCount(selectedCount));
    }
  }, [selectedText, selectedCount]);

  const handleProcessText = async () => {
    // Check if token or guest exists
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth/signup"); // Redirect to signup if not logged in
      return;
    }

    dispatch(setIsProcessing(true));
    dispatch(setError(null));

    // Prepare headers
    const headers = {};

    console.log("🚀 ~ handleProcessText ~ token:", token);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`; // Add the token to the Authorization header
    } else if (guest) {
      // If it's a guest login, use the guest token or some other identifier for guest
      headers["Authorization"] = `Bearer ${guest}`;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/token/process",
        { text },
        { headers } // Pass the headers with the token
      );

      const { filePath, count } = response.data;
      dispatch(setPdfFileName(filePath.split("\\").pop()));
      dispatch(setCount(count));
      dispatch(triggerRefresh());
    } catch (err) {
      dispatch(setError("Error processing text. Please try again."));
    } finally {
      dispatch(setIsProcessing(false));
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfFileName) {
      dispatch(setError("No file to download"));
      return;
    }

    dispatch(setIsDownloading(true));
    dispatch(setError(null));
    try {
      const response = await axios.get(
        `http://localhost:3000/token/download/${pdfFileName}`,
        {
          responseType: "blob",
        }
      );

      if (!response.data || response.data.size === 0) {
        dispatch(setError("File download failed: Received empty response"));
        return;
      }

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", pdfFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      dispatch(setError("Error downloading the file."));
    } finally {
      dispatch(setIsDownloading(false));
    }
  };

  const handleGuestAuthentication = async () => {
    const name = guestName;
    const response = await axios.post("http://localhost:3000/auth/guest", {
      name,
    });
    const token = response.data.token;
    const role = response.data.role;
    if (guestName.trim()) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      navigate("/app");
    } else {
      alert("Please enter your name to continue as a guest.");
    }
  };

  return (
    <Box
      sx={{
        width: isMobile ? "90%" : "50%",
        maxWidth: "600px",
        textAlign: "center",
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
        position: "absolute",
        top: "50%",
        left: isDrawerOpen && isMobile ? `${drawerWidth}px` : "50%",
        transform:
          isDrawerOpen && isMobile
            ? "translate(0, -50%)"
            : "translate(-50%, -50%)",
      }}
    >
      <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
        Text Processor
      </Typography>

      <TextField
        multiline
        rows={isMobile ? 4 : 6}
        fullWidth
        variant="outlined"
        placeholder="Enter text to process..."
        value={text}
        onChange={(e) => dispatch(setText(e.target.value))}
        sx={{
          marginBottom: 2,
          backgroundColor: "#f9f9f9",
          borderRadius: 1,
        }}
      />

      {error && (
        <Typography
          color="error"
          sx={{ marginBottom: 2, fontSize: { xs: "0.8rem", sm: "1rem" } }}
        >
          {error}
        </Typography>
      )}

      <Box sx={{ marginBottom: 3 }}>
        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleProcessText}
            disabled={isProcessing || !text || !localStorage.getItem("token")}
            fullWidth
          >
            {isProcessing ? "Processing..." : "Process Text"}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleDownloadPDF}
            disabled={!pdfFileName || isDownloading}
            fullWidth
          >
            {isDownloading ? "Downloading..." : "Download PDF"}
          </Button>
        </Stack>
      </Box>

      {/* Show these buttons if the user is not logged in or a guest */}
      {!localStorage.getItem("token") && (
        <Box>
          <Stack spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/auth/signup")}
              fullWidth
            >
              Create Account
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/auth/login")}
              fullWidth
            >
              Login
            </Button>

            <TextField
              fullWidth
              label="Enter Name (Guest)"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: 1,
              }}
            />

            <Button
              variant="contained"
              color="default"
              onClick={handleGuestAuthentication}
              fullWidth
            >
              Continue as Guest
            </Button>
          </Stack>
        </Box>
      )}

      {count !== null && (
        <Typography
          variant="body1"
          sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
        >
          <strong>Word Count:</strong> {count}
        </Typography>
      )}
    </Box>
  );
};

export default TextProcessor;
