import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";

const TextProcessor = ({ selectedText, selectedCount }) => {
  console.log("🚀 ~ TextProcessor ~ selectedText:", selectedText);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfFileName, setPdfFileName] = useState("");
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);

  // Update textarea whenever a new text is selected from the sidebar
  useEffect(() => {
    if (selectedText) {
      setText(selectedText);
      setCount(selectedCount);
    }
  }, [selectedText, selectedCount]);

  const handleProcessText = async () => {
    setIsProcessing(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.post("http://localhost:3000/token/process", {
        text,
      });
      const { filePath, count } = response.data;
      setPdfFileName(filePath.split("\\").pop());
      setCount(count);
    } catch (err) {
      setError("Error processing text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfFileName) {
      setError("No file to download");
      return;
    }

    setIsDownloading(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(
        `http://localhost:3000/token/download/${pdfFileName}`,
        {
          responseType: "blob",
        }
      );

      if (!response.data || response.data.size === 0) {
        setError("File download failed: Received empty response");
        return;
      }

      const contentType = response.headers["content-type"];
      if (contentType !== "application/pdf") {
        setError("Error: File is not a valid PDF");
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
      setError("Error downloading the file.");
    } finally {
      setIsDownloading(false);
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
        onChange={(e) => setText(e.target.value)}
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
