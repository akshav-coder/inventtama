import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  useTheme,
  Stack,
  Avatar,
  alpha,
} from "@mui/material";
import {
  useGetAllPurchasesQuery,
  useCreatePurchaseMutation,
  useDeletePurchaseMutation,
} from "../services/purchaseApi";
import { useState } from "react";
import PurchaseFormModal from "../components/purchases/PurchaseFormModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useUpdatePurchaseMutation } from "../services/purchaseApi";
import { useSnackbar } from "../components/common/SnackbarProvider";

const Purchases = () => {
  const theme = useTheme();
  const { data: purchases, isLoading } = useGetAllPurchasesQuery();
  const [createPurchase] = useCreatePurchaseMutation();
  const [deletePurchase] = useDeletePurchaseMutation();
  const [updatePurchase] = useUpdatePurchaseMutation();
  const showSnackbar = useSnackbar();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const handleSubmit = async (formData) => {
    try {
      if (editItem) {
        await updatePurchase({ id: editItem._id, ...formData }).unwrap();
        showSnackbar("Purchase updated successfully", "success");
      } else {
        await createPurchase(formData).unwrap();
        showSnackbar("Purchase created successfully", "success");
      }
      setEditItem(null);
    } catch (error) {
      showSnackbar("Error saving purchase", "error");
    }
  };

  const handleEdit = (purchase) => {
    setEditItem(purchase);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const confirmDelete = async () => {
    try {
      await deletePurchase(deleteConfirm.id).unwrap();
      showSnackbar("Purchase deleted successfully", "success");
      setDeleteConfirm({ open: false, id: null });
    } catch (error) {
      showSnackbar("Failed to delete purchase", "error");
    }
  };

  // Calculate summary statistics
  const totalPurchases = purchases?.length || 0;
  const totalItems =
    purchases?.reduce(
      (sum, purchase) => sum + (purchase.tamarindItems?.length || 0),
      0
    ) || 0;
  const totalAmount =
    purchases?.reduce(
      (sum, purchase) => sum + (purchase.totalAmount || 0),
      0
    ) || 0;

  const getPaymentTypeColor = (paymentType) => {
    switch (paymentType?.toLowerCase()) {
      case "cash":
        return "success";
      case "credit":
        return "warning";
      case "bank transfer":
        return "info";
      default:
        return "default";
    }
  };

  const getPaymentTypeIcon = (paymentType) => {
    switch (paymentType?.toLowerCase()) {
      case "cash":
        return "💵";
      case "credit":
        return "💳";
      case "bank transfer":
        return "🏦";
      default:
        return "💰";
    }
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
                Purchase Entries
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                }}
              >
                Manage and track tamarind purchase records from suppliers
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
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
              Add Purchase
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
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
                    {totalPurchases}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Purchases
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
                  <ShoppingCartIcon sx={{ color: "#667eea", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
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
                    {totalItems}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Items
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
                  <ShoppingCartIcon sx={{ color: "#4caf50", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
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
                    sx={{ fontWeight: 700, color: "#2196f3" }}
                  >
                    ₹{totalAmount.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Amount
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: alpha("#2196f3", 0.1),
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShoppingCartIcon sx={{ color: "#2196f3", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <PurchaseFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editItem}
      />

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Delete Purchase
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this purchase? This action cannot be
            undone.
          </Typography>
        </DialogTitle>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteConfirm({ open: false, id: null })}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            onClick={confirmDelete}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table Section */}
      {isLoading ? (
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
              Loading purchases...
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha("#667eea", 0.05) }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Supplier
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Qty (Kg)
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    ₹/Kg
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Total Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Payment Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Storage
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Notes
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases?.map((purchase) =>
                  purchase.tamarindItems?.map((item, idx) => (
                    <TableRow
                      key={`${purchase._id}-${idx}`}
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha("#667eea", 0.02),
                          transition: "background-color 0.2s ease",
                        },
                        "&:nth-of-type(even)": {
                          backgroundColor: alpha("#f8fafc", 0.5),
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              mr: 1,
                              backgroundColor: alpha("#667eea", 0.1),
                              color: "#667eea",
                              fontSize: "0.75rem",
                            }}
                          >
                            {purchase.supplierId?.name?.charAt(0) || "S"}
                          </Avatar>
                          <Typography variant="body2">
                            {purchase.supplierId?.name || "-"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.type}
                          size="small"
                          sx={{
                            backgroundColor: alpha("#667eea", 0.1),
                            color: "#667eea",
                            fontWeight: 500,
                            borderRadius: 1,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "#4caf50",
                          }}
                        >
                          ₹{item.pricePerKg}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: "#667eea",
                          }}
                        >
                          ₹{item.totalAmount || purchase.totalAmount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={purchase.paymentType}
                          size="small"
                          color={getPaymentTypeColor(purchase.paymentType)}
                          icon={
                            <span>
                              {getPaymentTypeIcon(purchase.paymentType)}
                            </span>
                          }
                          sx={{
                            fontWeight: 600,
                            borderRadius: 1,
                            textTransform: "capitalize",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {item.allocation?.map((alloc, i) =>
                            alloc.storageId?.name || alloc.storageId ? (
                              <Chip
                                key={i}
                                label={alloc.storageId?.name || alloc.storageId}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: "0.7rem",
                                  borderColor: alpha("#667eea", 0.3),
                                  color: "#667eea",
                                }}
                              />
                            ) : null
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            maxWidth: 150,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.notes || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Tooltip title="Edit Purchase">
                            <IconButton
                              onClick={() => handleEdit(purchase)}
                              sx={{
                                backgroundColor: alpha("#667eea", 0.1),
                                color: "#667eea",
                                "&:hover": {
                                  backgroundColor: alpha("#667eea", 0.2),
                                  transform: "scale(1.1)",
                                  transition: "all 0.2s ease",
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Purchase">
                            <IconButton
                              onClick={() => handleDelete(purchase._id)}
                              sx={{
                                backgroundColor: alpha("#f44336", 0.1),
                                color: "#f44336",
                                "&:hover": {
                                  backgroundColor: alpha("#f44336", 0.2),
                                  transform: "scale(1.1)",
                                  transition: "all 0.2s ease",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {(!purchases || purchases.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={10} sx={{ textAlign: "center", py: 6 }}>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        No purchases found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create your first purchase to get started
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
};

export default Purchases;
