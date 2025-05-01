import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  Box,
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
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <Store />, path: "/" },
  { text: "Purchases", icon: <ShoppingCart />, path: "/purchases" },
  { text: "Transfers", icon: <LocalOffer />, path: "/transfers" },
  { text: "Processing", icon: <Factory />, path: "/processing" },
  { text: "Sales", icon: <AccountBalance />, path: "/sales" },
  { text: "Reciept", icon: <People />, path: "/wholesale-credit" },
  { text: "Payment", icon: <People />, path: "/supplier-credit" },
  { text: "Inventory", icon: <Inventory />, path: "/inventory" },
  { text: "Byproduct Sales", icon: <EmojiNature />, path: "/seed-sales" },
];

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const drawerContent = (
    <Box
      onClick={isMobile ? handleDrawerToggle : undefined}
      sx={{
        height: "100%",
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 3,
        px: 2,
      }}
    >
      <Toolbar />
      {menuItems.map(({ text, icon, path }) => (
        <Box
          key={text}
          component={Link}
          to={path}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 2,
            py: 1.5,
            textDecoration: "none",
            borderRadius: 2,
            transition: "background 0.3s",
            color: "#333",
            "&:hover": {
              bgcolor: "#e0e0e0",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>{icon}</Box>
          <Box sx={{ fontWeight: 500, fontSize: "15px" }}>{text}</Box>
        </Box>
      ))}
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
