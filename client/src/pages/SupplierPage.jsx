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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Fade,
  alpha,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from "@mui/icons-material/Close";
import {
  useAddSupplierMutation,
  useDeleteSupplierMutation,
  useGetSuppliersQuery,
  useUpdateSupplierMutation,
} from "../services/suppliersApi";
import { useSnackbar } from "../components/common/SnackbarProvider";

const SupplierPage = () => {
  const { data, isLoading } = useGetSuppliersQuery();
  const [addSupplier] = useAddSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const [formData, setFormData] = useState({ name: "", contactNumber: "" });
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const showSnackbar = useSnackbar();

  const handleSubmit = async () => {
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ""))) {
      newErrors.contactNumber = "Please enter a valid 10-digit number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editingId) {
        await updateSupplier({ id: editingId, ...formData }).unwrap();
        showSnackbar("Supplier updated successfully", "success");
        setEditingId(null);
      } else {
        await addSupplier(formData).unwrap();
        showSnackbar("Supplier added successfully", "success");
      }
      setFormData({ name: "", contactNumber: "" });
      setDialogOpen(false);
      setErrors({});
    } catch (error) {
      showSnackbar("Error saving supplier", "error");
    }
  };

  const handleEdit = (supplier) => {
    setEditingId(supplier._id);
    setFormData({ name: supplier.name, contactNumber: supplier.contactNumber });
    setDialogOpen(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await deleteSupplier(id).unwrap();
        showSnackbar("Supplier deleted successfully", "success");
      } catch (error) {
        showSnackbar("Error deleting supplier", "error");
      }
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: "", contactNumber: "" });
    setDialogOpen(true);
    setErrors({});
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setFormData({ name: "", contactNumber: "" });
    setErrors({});
  };

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
                Supplier Management
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                }}
              >
                Manage your supplier database and contact information
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
              Add New Supplier
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
                    {data?.length || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Suppliers
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
                  <BusinessIcon sx={{ color: "#667eea", fontSize: 24 }} />
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
                    {data?.filter((s) => s.contactNumber)?.length || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    With Contact Info
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
      </Grid>

      {/* Suppliers List */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={60} />
        </Box>
      ) : data?.length > 0 ? (
        <Grid container spacing={3}>
          {data.map((supplier) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={supplier._id}>
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
                        <BusinessIcon />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight={600} noWrap>
                          {supplier.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Supplier ID: {supplier._id.slice(-6)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={3}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body1" fontWeight={500}>
                        {supplier.contactNumber || "No contact info"}
                      </Typography>
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
                        <Tooltip title="Edit Supplier">
                          <IconButton
                            onClick={() => handleEdit(supplier)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Supplier">
                          <IconButton
                            onClick={() => handleDelete(supplier._id)}
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
              No suppliers found. Click "Add New Supplier" to get started.
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
              {editingId ? "Edit Supplier" : "Add New Supplier"}
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
                label="Supplier Name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="Enter supplier name"
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
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Contact Number"
                value={formData.contactNumber}
                onChange={(e) => {
                  setFormData({ ...formData, contactNumber: e.target.value });
                  if (errors.contactNumber)
                    setErrors({ ...errors, contactNumber: "" });
                }}
                error={!!errors.contactNumber}
                helperText={errors.contactNumber}
                placeholder="Enter 10-digit contact number"
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
            {editingId ? "Update" : "Add"} Supplier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupplierPage;
