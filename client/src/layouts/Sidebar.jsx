import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  Box,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";

import {
  Store,
  ShoppingCart,
  Warehouse,
  Factory,
  LocalOffer,
  AccountBalance,
  Inventory,
  People,
  EmojiNature,
  PeopleOutlineOutlined,
  Diversity3Outlined,
  Business,
  PeopleAlt,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 280;

const menuItems = [
  { text: "Dashboard", icon: <Store />, path: "/" },
  { text: "Purchases", icon: <ShoppingCart />, path: "/purchases" },
  { text: "Transfers", icon: <LocalOffer />, path: "/transfers" },
  { text: "Processing", icon: <Factory />, path: "/processing" },
  { text: "Sales", icon: <AccountBalance />, path: "/sales" },
  {
    text: "Supplier Payments",
    icon: <Inventory />,
    path: "/supplier-payments",
  },
  {
    text: "Customer Receipts",
    icon: <PeopleOutlineOutlined />,
    path: "/customer-receipts",
  },
  { text: "Reports", icon: <Diversity3Outlined />, path: "/reports" },
  {
    text: "Supplier Management",
    icon: <Business />,
    path: "/supplier-management",
  },
  {
    text: "Customer Management",
    icon: <PeopleAlt />,
    path: "/customer-management",
  },
  {
    text: "Storage Management",
    icon: <Warehouse />,
    path: "/storage-management",
  },
];

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const drawerContent = (
    <Box
      onClick={isMobile ? handleDrawerToggle : undefined}
      sx={{
        height: "100%",
        background:
          "linear-gradient(180deg, #1a237e 0%, #283593 50%, #303f9f 100%)",
        display: "flex",
        flexDirection: "column",
        color: "white",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.03)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.03)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.02)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.02)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.02)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
          opacity: 0.3,
        },
      }}
    >
      {/* Header - Only show on desktop */}
      {!isMobile ? (
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #fff, #e3f2fd)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
            }}
          >
            InventTama
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Inventory Management
          </Typography>
        </Box>
      ) : (
        <Box sx={{ p: 2, mt: 8 }} />
      )}

      {/* Navigation Items */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          py: isMobile ? 1 : 2, // Reduce top padding on mobile since no header
          px: 1.5,
          position: "relative",
          zIndex: 1,
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255,255,255,0.1)",
            borderRadius: "2px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.3)",
            borderRadius: "2px",
          },
        }}
      >
        {menuItems.map(({ text, icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <Box
              key={text}
              component={Link}
              to={path}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2.5,
                py: 1.8,
                textDecoration: "none",
                borderRadius: 3,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                color: isActive ? "#1a237e" : "rgba(255,255,255,0.9)",
                background: isActive
                  ? "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)"
                  : "transparent",
                boxShadow: isActive
                  ? "0 4px 20px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)"
                  : "none",
                transform: isActive ? "translateX(8px)" : "translateX(0)",
                mb: 0.5,
                position: "relative",
                "&:hover": {
                  background: isActive
                    ? "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 100%)"
                    : "rgba(255,255,255,0.1)",
                  transform: "translateX(8px)",
                  boxShadow: isActive
                    ? "0 6px 25px rgba(0,0,0,0.2), 0 3px 12px rgba(0,0,0,0.15)"
                    : "0 2px 12px rgba(0,0,0,0.1)",
                },
                "&::before": isActive
                  ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "4px",
                      height: "60%",
                      background: "linear-gradient(180deg, #ff6b6b, #ff8e53)",
                      borderRadius: "0 2px 2px 0",
                    }
                  : {},
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  color: isActive ? "#1a237e" : "rgba(255,255,255,0.8)",
                  transition: "all 0.3s ease",
                  "& svg": {
                    fontSize: "1.3rem",
                  },
                }}
              >
                {icon}
              </Box>
              <Typography
                sx={{
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.9rem",
                  letterSpacing: "0.3px",
                  color: "inherit",
                  transition: "all 0.3s ease",
                }}
              >
                {text}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "0.7rem",
            fontWeight: 400,
          }}
        >
          © 2024 InventTama
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        // Desktop Drawer
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              border: "none",
              boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
