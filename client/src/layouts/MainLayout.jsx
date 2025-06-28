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
import { useMediaQuery, useTheme } from "@mui/material";

const drawerWidth = 280;

const MainLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const { mode, setMode } = useThemeMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

      {/* Mobile-only Header */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: 1201,
            background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
            boxShadow: "0 2px 20px rgba(0,0,0,0.15)",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #fff, #e3f2fd)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                InventTama
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="Toggle theme">
                <IconButton
                  color="inherit"
                  onClick={() =>
                    setMode((prev) => (prev === "light" ? "dark" : "light"))
                  }
                >
                  {mode === "light" ? <Brightness4 /> : <Brightness7 />}
                </IconButton>
              </Tooltip>

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
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem disabled sx={{ opacity: 0.7 }}>
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
            </Box>
          </Toolbar>
        </AppBar>
      )}

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
          mt: isMobile ? 8 : 0, // Only add top margin on mobile for the header
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
