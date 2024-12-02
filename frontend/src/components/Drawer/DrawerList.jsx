import React from "react";
import {
  Box,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Pagination,
  Select,
  TextField,
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const DrawerList = ({
  onTextSelect,
  texts,
  open,
  handleDrawerToggle,
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSortChange = (value) => {
    setSortOrder(value); // update the sort order
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        overflowX: "hidden", // Prevent horizontal scrolling
      }}
    >
      <Box sx={{ padding: 1 }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Search..."
          value={searchQuery}
          onChange={(event) => handleSearchChange(event.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <FormControl fullWidth size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOrder}
            onChange={(event) => handleSortChange(event.target.value)} // Corrected here
            label="Sort By"
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Divider />
      <List
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          paddingRight: 1, // Space for scrollbar
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        {texts.map((textObject) => (
          <ListItemButton
            key={textObject._id}
            onClick={() => onTextSelect(textObject)}
            sx={{
              paddingX: 2,
              flexDirection: "column",
              alignItems: "flex-start",
              overflowX: "hidden", // Prevent individual item overflow
            }}
          >
            <ListItemText
              primary={textObject.text}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "100%",
                fontSize: { xs: "0.8rem", sm: "1rem" },
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginTop: 1, // Add spacing between chips and text
              }}
            >
              <Chip
                variant="outlined"
                color="primary"
                size="small"
                label={textObject.languages || "Unknown"} // Ensure label shows even if undefined
                sx={{
                  maxWidth: "60%",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              />
              <Chip
                variant="outlined"
                color="secondary"
                size="small"
                label={formatDate(textObject.createdAt)}
                sx={{
                  fontSize: { xs: "0.6rem", sm: "0.8rem" },
                  padding: { xs: "0 2px", sm: "0 4px" },
                }}
              />
            </Box>
          </ListItemButton>
        ))}
      </List>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 1,
          background: "#f9f9f9", // Light background for pagination box
          borderTop: "1px solid #ddd",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 -1px 5px rgba(0, 0, 0, 0.1)", // Slight shadow effect
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={onPageChange}
          siblingCount={1} // Show 1 sibling on each side
          boundaryCount={1} // Show 1 boundary page at each end
          shape="rounded" // Rounded pagination
          color="primary"
          size="small" // Compact pagination
          sx={{
            "& .MuiPagination-ul": {
              flexWrap: "nowrap", // Prevent wrapping
            },
            "& .MuiPaginationItem-rounded": {
              borderRadius: "50%", // Make pagination fully round
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default DrawerList;
