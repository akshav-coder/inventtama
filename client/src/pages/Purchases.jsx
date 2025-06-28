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

const Purchases = () => {
  const theme = useTheme();
  const { data: purchases, isLoading } = useGetAllPurchasesQuery();
  const [createPurchase] = useCreatePurchaseMutation();
  const [deletePurchase] = useDeletePurchaseMutation();
  const [updatePurchase] = useUpdatePurchaseMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const handleSubmit = async (formData) => {
    if (editItem) {
      await updatePurchase({ id: editItem._id, ...formData });
    } else {
      await createPurchase(formData);
    }
    setEditItem(null);
  };

  const handleEdit = (purchase) => {
    setEditItem(purchase);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const confirmDelete = async () => {
    await deletePurchase(deleteConfirm.id);
    setDeleteConfirm({ open: false, id: null });
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

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              borderRadius: "50%",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <ShoppingCartIcon sx={{ color: "white", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              Purchase Entries
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              Manage your tamarind purchase records
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Add Purchase
        </Button>
      </Box>

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
                    sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                  >
                    {totalPurchases}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                    }}
                  >
                    Total Purchases
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShoppingCartIcon
                    sx={{ color: theme.palette.primary.main, fontSize: 24 }}
                  />
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
                    sx={{ fontWeight: 700, color: theme.palette.success.main }}
                  >
                    {totalItems}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                    }}
                  >
                    Total Items
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: theme.palette.success.light,
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShoppingCartIcon
                    sx={{ color: theme.palette.success.main, fontSize: 24 }}
                  />
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
                    sx={{ fontWeight: 700, color: theme.palette.info.main }}
                  >
                    ₹{totalAmount.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                    }}
                  >
                    Total Amount
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: theme.palette.info.light,
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShoppingCartIcon
                    sx={{ color: theme.palette.info.main, fontSize: 24 }}
                  />
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
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Confirm Deletion
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, mt: 1 }}
          >
            Are you sure you want to delete this purchase? This action cannot be
            undone.
          </Typography>
        </DialogTitle>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteConfirm({ open: false, id: null })}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table Section */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
          }}
        >
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                  <TableCell
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    Supplier
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    Qty (Kg)
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    ₹/Kg
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    Total Amount
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    Payment Type
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    Storage
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    Notes
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
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
                          backgroundColor: theme.palette.action.hover,
                          "& .action-buttons": {
                            opacity: 1,
                          },
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {purchase.supplierId?.name || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.type}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            backgroundColor: theme.palette.primary.light,
                            color: theme.palette.primary.main,
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
                            color: theme.palette.success.main,
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
                            color: theme.palette.primary.main,
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
                          sx={{ fontWeight: 600 }}
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
                                sx={{ fontSize: "0.7rem" }}
                              />
                            ) : null
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
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
                        <Box
                          className="action-buttons"
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                            opacity: 0.7,
                            transition: "opacity 0.2s ease",
                          }}
                        >
                          <Tooltip title="Edit Purchase">
                            <IconButton
                              onClick={() => handleEdit(purchase)}
                              size="small"
                              sx={{
                                backgroundColor: theme.palette.primary.light,
                                color: theme.palette.primary.main,
                                "&:hover": {
                                  backgroundColor: theme.palette.primary.main,
                                  color: "white",
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Purchase">
                            <IconButton
                              onClick={() => handleDelete(purchase._id)}
                              size="small"
                              sx={{
                                backgroundColor: theme.palette.error.light,
                                color: theme.palette.error.main,
                                "&:hover": {
                                  backgroundColor: theme.palette.error.main,
                                  color: "white",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
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
