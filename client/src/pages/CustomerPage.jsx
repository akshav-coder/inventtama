// src/pages/CustomerPage.jsx
import React, { useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Tooltip,
  Fade,
  alpha,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import CloseIcon from "@mui/icons-material/Close";
import {
  useAddCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomersQuery,
  useUpdateCustomerMutation,
} from "../services/customersApi";
import { useSnackbar } from "../components/common/SnackbarProvider";

const customerTypes = [
  { value: "retailer", label: "Retailer", color: "primary" },
  { value: "wholesaler", label: "Wholesaler", color: "secondary" },
  { value: "end_user", label: "End User", color: "success" },
  { value: "business", label: "Business", color: "warning" },
];

const CustomerPage = () => {
  const { data, isLoading } = useGetCustomersQuery();
  const [addCustomer] = useAddCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const [formData, setFormData] = useState({ name: "", mobile: "", type: "" });
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const showSnackbar = useSnackbar();

  const handleSubmit = async () => {
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
      newErrors.mobile = "Please enter a valid 10-digit number";
    }
    if (!formData.type) newErrors.type = "Customer type is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editingId) {
        await updateCustomer({ id: editingId, ...formData }).unwrap();
        showSnackbar("Customer updated successfully", "success");
        setEditingId(null);
      } else {
        await addCustomer(formData).unwrap();
        showSnackbar("Customer added successfully", "success");
      }
      setFormData({ name: "", mobile: "", type: "" });
      setDialogOpen(false);
      setErrors({});
    } catch (error) {
      showSnackbar("Error saving customer", "error");
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer._id);
    setFormData({
      name: customer.name,
      mobile: customer.mobile,
      type: customer.type,
    });
    setDialogOpen(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id).unwrap();
        showSnackbar("Customer deleted successfully", "success");
      } catch (error) {
        showSnackbar("Error deleting customer", "error");
      }
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: "", mobile: "", type: "" });
    setDialogOpen(true);
    setErrors({});
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setFormData({ name: "", mobile: "", type: "" });
    setErrors({});
  };

  const getCustomerTypeColor = (type) => {
    const customerType = customerTypes.find((ct) => ct.value === type);
    return customerType ? customerType.color : "default";
  };

  const getCustomerTypeLabel = (type) => {
    const customerType = customerTypes.find((ct) => ct.value === type);
    return customerType ? customerType.label : type;
  };

  const getCustomerStats = () => {
    if (!data) return { total: 0, byType: {} };

    const byType = data.reduce((acc, customer) => {
      acc[customer.type] = (acc[customer.type] || 0) + 1;
      return acc;
    }, {});

    return { total: data.length, byType };
  };

  const stats = getCustomerStats();

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header Section */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Customer Management
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                }}
              >
                Manage your customer database and relationships
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                  transform: "translateY(-2px)",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            >
              Add New Customer
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#667eea" }}
                  >
                    {stats.total}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Customers
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: alpha("#667eea", 0.1),
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PersonIcon sx={{ color: "#667eea", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#4caf50" }}
                  >
                    {data?.filter((c) => c.mobile)?.length || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    With Mobile Info
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: alpha("#4caf50", 0.1),
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PhoneIcon sx={{ color: "#4caf50", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#9c27b0" }}
                  >
                    {stats.byType.wholesaler || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Wholesalers
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: alpha("#9c27b0", 0.1),
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BusinessIcon sx={{ color: "#9c27b0", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#ff9800" }}
                  >
                    {stats.byType.retailer || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Retailers
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: alpha("#ff9800", 0.1),
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PersonIcon sx={{ color: "#ff9800", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Customers List */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={60} />
        </Box>
      ) : data?.length > 0 ? (
        <Grid container spacing={3}>
          {data.map((customer) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={customer._id}>
              <Fade in timeout={300}>
                <Card
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    transition: "all 0.3s ease",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar
                        sx={{ bgcolor: "primary.main", width: 48, height: 48 }}
                      >
                        <PersonIcon />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight={600} noWrap>
                          {customer.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Customer ID: {customer._id.slice(-6)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body1" fontWeight={500}>
                        {customer.mobile || "No mobile info"}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={3}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Chip
                        label={getCustomerTypeLabel(customer.type)}
                        color={getCustomerTypeColor(customer.type)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Chip
                        label="Active"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                      <Box>
                        <Tooltip title="Edit Customer">
                          <IconButton
                            onClick={() => handleEdit(customer)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Customer">
                          <IconButton
                            onClick={() => handleDelete(customer._id)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent sx={{ p: 6, textAlign: "center" }}>
            <Alert severity="info" sx={{ fontSize: "1.1rem" }}>
              No customers found. Click "Add New Customer" to get started.
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {editingId ? "Edit Customer" : "Add New Customer"}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="Enter customer name"
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Mobile Number"
                value={formData.mobile}
                onChange={(e) => {
                  setFormData({ ...formData, mobile: e.target.value });
                  if (errors.mobile) setErrors({ ...errors, mobile: "" });
                }}
                error={!!errors.mobile}
                helperText={errors.mobile}
                placeholder="Enter 10-digit mobile number"
                InputProps={{
                  startAdornment: (
                    <PhoneIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                select
                fullWidth
                label="Customer Type"
                value={formData.type}
                onChange={(e) => {
                  setFormData({ ...formData, type: e.target.value });
                  if (errors.type) setErrors({ ...errors, type: "" });
                }}
                error={!!errors.type}
                helperText={errors.type}
                InputProps={{
                  startAdornment: (
                    <BusinessIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              >
                {customerTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={type.label}
                        color={type.color}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseDialog}
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ px: 3, borderRadius: 2 }}
          >
            {editingId ? "Update" : "Add"} Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerPage;
