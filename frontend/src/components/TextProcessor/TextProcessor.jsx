import { Box, Button, TextField, Typography } from "@mui/material";
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
} from "../../redux/slice/drawerSlice";

const TextProcessor = () => {
  const dispatch = useDispatch();

  const text = useSelector(selectText);
  const isProcessing = useSelector(selectIsProcessing);
  const isDownloading = useSelector(selectIsDownloading);
  const pdfFileName = useSelector(selectPdfFileName);
  const count = useSelector(selectCount);
  const error = useSelector(selectError);

  const selectedText = useSelector(getSelectedText);
  const selectedCount = useSelector(getSelectedCount);

  // Update textarea whenever a new text is selected from the sidebar
  useEffect(() => {
    if (selectedText) {
      dispatch(setText(selectedText));
      dispatch(setCount(selectedCount));
    }
  }, [selectedText, selectedCount, dispatch]);

  const handleProcessText = async () => {
    dispatch(setIsProcessing(true));
    dispatch(setError(null));
    try {
      const response = await axios.post("http://localhost:3000/token/process", {
        text,
      });
      const { filePath, count } = response.data;
      dispatch(setPdfFileName(filePath.split("\\").pop()));
      // setCount(count);
      dispatch(setCount(count));
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

      const contentType = response.headers["content-type"];
      if (contentType !== "application/pdf") {
        dispatch(setError("Error: File is not a valid PDF"));
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
        width: "100%",
        maxWidth: 800, // Max width for the component
        textAlign: "center", // Center text alignment
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Text Processor
      </Typography>

      <TextField
        multiline
        rows={8}
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
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ marginBottom: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleProcessText}
          disabled={isProcessing}
          sx={{ marginRight: 2 }}
        >
          {isProcessing ? "Processing..." : "Process Text"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadPDF}
          disabled={!pdfFileName || isDownloading}
        >
          {isDownloading ? "Downloading..." : "Download PDF"}
        </Button>
      </Box>

      {count !== null && (
        <Typography variant="body1">
          <strong>Word Count:</strong> {count}
        </Typography>
      )}
    </Box>
  );
};

export default TextProcessor;
