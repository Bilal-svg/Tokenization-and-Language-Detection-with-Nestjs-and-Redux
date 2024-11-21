import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  IconButton,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Pagination,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import axios from "axios";

const drawerWidth = 240;

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const PersistentDrawer = ({ children, onTextSelect }) => {
  const [open, setOpen] = useState(false);
  const [texts, setTexts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleTextSelection = (textObject) => {
    onTextSelect(textObject.text, textObject.count);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/token/saved-texts",
          {
            params: {
              page: currentPage,
              limit: itemsPerPage,
              search: searchQuery,
              sortOrder,
            },
          }
        );
        setTexts(response.data.texts);
        setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
      } catch (error) {
        console.error("Error fetching texts:", error);
      }
    };
    fetchTexts();
  }, [currentPage, searchQuery, sortOrder]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          ...(open && {
            marginLeft: `${drawerWidth}px`,
            width: `calc(100% - ${drawerWidth}px)`,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              marginRight: 2,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Text Manager</Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex", // Flex container
            flexDirection: "column", // Stack vertically
            overflowY: "auto", // Enable scrolling
            // Custom Scrollbar Styles
            "&::-webkit-scrollbar": {
              width: "6px", // Thin scrollbar width
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1", // Light track color
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888", // Thumb color
              borderRadius: "4px", // Rounded thumb
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555", // Darker on hover
            },
          },
        }}
      >
        {/* Search and Sort Section */}
        <Box sx={{ padding: 2 }}>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOrder}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider />

        {/* List of Items */}
        <Box
          sx={{
            flexGrow: 1, // Make the list take up available space
            overflowY: "auto", // Enable scrolling for the list
            // Custom Scrollbar for the List
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
          }}
        >
          <List>
            {texts.map((textObject) => (
              <ListItemButton
                key={textObject._id}
                onClick={() => handleTextSelection(textObject)}
                sx={{
                  paddingX: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <ListItemText
                  primary={textObject.text}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%",
                  }}
                />
                <Chip
                  variant="outlined"
                  color="primary"
                  size="small"
                  label={formatDate(textObject.createdAt)}
                  sx={{
                    alignSelf: "flex-end",
                    fontSize: "0.7rem",
                    height: 18,
                    padding: "0 4px",
                    marginTop: "4px",
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Pagination Section */}
        <Box
          sx={{
            padding: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderTop: "1px solid #ddd",
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            size="small"
            siblingCount={0}
            boundaryCount={1}
          />
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          transition: "margin 0.3s",
          ...(open && {
            marginLeft: `${drawerWidth}px`,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default PersistentDrawer;
