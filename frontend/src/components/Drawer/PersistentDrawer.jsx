import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
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
  }, [currentPage, searchQuery, sortOrder, refresh]);

  if (totalPages < currentPage) {
    setCurrentPage(1);
  }

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
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <DrawerList
          texts={texts}
          open={open}
          handleDrawerToggle={handleDrawerToggle}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          handleTextSelection={handleTextSelection}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          ...(open && !isMobile && { marginLeft: `${drawerWidth}px` }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default PersistentDrawer;
