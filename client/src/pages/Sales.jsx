import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Avatar,
  alpha,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useState } from "react";
import SalesFormModal from "../components/sales/SalesFormModal";
import {
  useGetSalesQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
} from "../services/salesApi";
import { useSnackbar } from "../components/common/SnackbarProvider";

const Sales = () => {
  const { data: sales, isLoading } = useGetSalesQuery();
  const [createSale] = useCreateSaleMutation();
  const [updateSale] = useUpdateSaleMutation();
  const [deleteSale] = useDeleteSaleMutation();
  const showSnackbar = useSnackbar();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const handleOpen = (sale = null) => {
    setEditData(sale);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (editData) {
        await updateSale({ id: editData._id, ...data }).unwrap();
        showSnackbar("Sale updated successfully", "success");
      } else {
        await createSale(data).unwrap();
        showSnackbar("Sale created successfully", "success");
      }
      handleClose();
    } catch (error) {
      showSnackbar("Error saving sale", "error");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteSale(deleteDialog.id).unwrap();
      showSnackbar("Sale deleted successfully", "success");
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      showSnackbar("Failed to delete sale", "error");
    }
  };

  // Calculate summary statistics
  const totalSales = sales?.length || 0;
  const totalAmount =
    sales?.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0) || 0;
  const totalPaid =
    sales?.reduce((sum, sale) => sum + (sale.amountPaid || 0), 0) || 0;

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
                Sales
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                }}
              >
                Manage and track tamarind sales to customers
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
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
              Add Sale
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
                    {totalSales}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Sales
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
                    ₹{totalPaid.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Paid
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

      <SalesFormModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialValues={editData}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Delete Sale
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this sale? This action cannot be
            undone.
          </Typography>
        </DialogTitle>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, id: null })}
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
              Loading sales...
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
                    Customer
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Total Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Paid
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Payment Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Due Date
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
                {sales?.map((sale) => (
                  <TableRow
                    key={sale._id}
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
                        {new Date(sale.invoiceDate).toLocaleDateString()}
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
                          {sale.customer?.name?.charAt(0) ||
                            sale.customer?.charAt(0) ||
                            "C"}
                        </Avatar>
                        <Typography variant="body2">
                          {sale.customer?.name || sale.customer}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#667eea" }}
                      >
                        ₹{sale.totalAmount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#4caf50" }}
                      >
                        ₹{sale.amountPaid}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={sale.paymentType}
                        size="small"
                        color={getPaymentTypeColor(sale.paymentType)}
                        icon={
                          <span>{getPaymentTypeIcon(sale.paymentType)}</span>
                        }
                        sx={{
                          fontWeight: 600,
                          borderRadius: 1,
                          textTransform: "capitalize",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {sale.paymentType === "credit" && sale.dueDate
                          ? new Date(sale.dueDate).toLocaleDateString()
                          : "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Edit Sale">
                          <IconButton
                            onClick={() => handleOpen(sale)}
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
                        <Tooltip title="Delete Sale">
                          <IconButton
                            onClick={() =>
                              setDeleteDialog({ open: true, id: sale._id })
                            }
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
                ))}
                {(!sales || sales.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 6 }}>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        No sales found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create your first sale to get started
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

export default Sales;
