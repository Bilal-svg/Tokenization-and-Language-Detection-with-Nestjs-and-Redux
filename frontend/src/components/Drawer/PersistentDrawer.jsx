import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onSelect, getRefreshState } from "../../redux/slice/drawerSlice";
import { setPdfFileName } from "../../redux/slice/textSlice";
import { logout } from "../../redux/slice/authSlice";
import DrawerList from "./DrawerList";

const drawerWidth = 240;

const PersistentDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [texts, setTexts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const refresh = useSelector(getRefreshState);
  const dispatch = useDispatch();
  const itemsPerPage = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Handle logout
  const handleLogout = () => {
    // Clear localStorage to reset the state
    localStorage.removeItem("token");
    localStorage.removeItem("guest");
    dispatch(logout()); // Dispatch logout to clear state in Redux

    // Reset the drawer state (optional but good for consistent app behavior)
    setTexts([]);
    setSearchQuery("");
    setSortOrder("newest");
    setCurrentPage(1);
    setTotalPages(1);
    setOpen(false); // Close the drawer on logout
  };

  const handleTextSelection = (textObject) => {
    dispatch(
      onSelect({
        text: textObject.text,
        count: textObject.count,
      })
    );
    dispatch(setPdfFileName(textObject.filePath?.split("\\").pop()));
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token
        console.log("Token from localStorage:", token);

        if (!token) {
          console.error("No token found, user might be logged out");
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/token/saved-texts",
          {
            params: {
              page: currentPage,
              limit: itemsPerPage,
              search: searchQuery,
              sortOrder,
            },
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            },
          }
        );
        setTexts(response.data.texts);
        setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
        if (totalPages < currentPage) {
          setCurrentPage(1);
        }
      } catch (error) {
        console.error("Error fetching texts:", error);
      }
    };
    fetchTexts();
  }, [currentPage, searchQuery, sortOrder, refresh]);

  // Check if user is authenticated
  const isAuthenticated =
    !!localStorage.getItem("token") || !!localStorage.getItem("guest");

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          ...(open &&
            !isMobile && {
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
              ...(open && !isMobile && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant={isMobile ? "h6" : "h5"}>Text Manager</Typography>
          {/* Always visible Logout button */}
          {isAuthenticated && (
            <IconButton
              color="inherit"
              aria-label="logout"
              onClick={handleLogout}
              sx={{ marginLeft: "auto" }}
            >
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Menu
          </Typography>
        </Box>

        {/* Render DrawerList only if user is authenticated */}
        {isAuthenticated && (
          <DrawerList
            texts={texts}
            onTextSelect={handleTextSelection}
            onPageChange={handlePageChange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalPages={totalPages}
            currentPage={currentPage}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        )}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          marginLeft: open && !isMobile ? `${drawerWidth}px` : 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PersistentDrawer;
