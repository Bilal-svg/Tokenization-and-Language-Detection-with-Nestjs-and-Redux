import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
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

const TextProcessor = ({ isDrawerOpen, drawerWidth }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

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
    dispatch(setIsProcessing(true));
    dispatch(setError(null));
    try {
      const response = await axios.post("http://localhost:3000/token/process", {
        text,
      });
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

  return (
    <Box
      sx={{
        width: isMobile ? "90%" : "50%", // Smaller width on mobile
        maxWidth: "600px", // Limit the maximum size
        textAlign: "center",
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
        position: "absolute", // Absolute positioning to center the box
        top: "50%", // Center vertically
        left: isDrawerOpen && isMobile ? `${drawerWidth}px` : "50%", // Adjust position if drawer is open
        transform:
          isDrawerOpen && isMobile
            ? "translate(0, -50%)"
            : "translate(-50%, -50%)", // Translate accordingly
      }}
    >
      <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
        Text Processor
      </Typography>

      <TextField
        multiline
        rows={isMobile ? 4 : 6} // Fewer rows on mobile
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

      <Box
        sx={{
          marginBottom: 2,
          display: "flex",
          flexDirection: isMobile ? "column" : "row", // Stack buttons on mobile
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleProcessText}
          disabled={isProcessing}
          fullWidth={isMobile}
        >
          {isProcessing ? "Processing..." : "Process Text"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadPDF}
          disabled={!pdfFileName || isDownloading}
          fullWidth={isMobile}
        >
          {isDownloading ? "Downloading..." : "Download PDF"}
        </Button>
      </Box>

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
