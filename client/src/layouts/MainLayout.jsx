import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AccountCircle, Brightness4, Brightness7 } from "@mui/icons-material";
import { logout } from "../features/auth/authSlice";
import { useThemeMode } from "../utils/ThemeContext";

const drawerWidth = 240;

const MainLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const { mode, setMode } = useThemeMode();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            InventTama
          </Typography>
          {user && (
            <Box>
              <IconButton
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem disabled>
                  {user.name} ({user.role})
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/admin-control"
                  onClick={() => setAnchorEl(null)}
                >
                  Admin Control
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
          <Tooltip title="Toggle theme">
            <IconButton
              onClick={() =>
                setMode((prev) => (prev === "light" ? "dark" : "light"))
              }
            >
              {mode === "light" ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
