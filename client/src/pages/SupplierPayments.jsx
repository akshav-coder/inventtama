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
import PaymentIcon from "@mui/icons-material/Payment";
import { useState } from "react";
import PaymentFormModal from "../components/supplierPayments/PaymentFormModal";
import {
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} from "../services/supplierPaymentApi";
import { useGetSuppliersQuery } from "../services/suppliersApi";
import { useSnackbar } from "../components/common/SnackbarProvider";

const SupplierPayments = () => {
  const { data: payments, isLoading } = useGetPaymentsQuery();
  const { data: suppliers } = useGetSuppliersQuery();
  const [createPayment] = useCreatePaymentMutation();
  const [updatePayment] = useUpdatePaymentMutation();
  const [deletePayment] = useDeletePaymentMutation();
  const showSnackbar = useSnackbar();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const openModal = (payment = null) => {
    setEditData(payment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (editData) {
        await updatePayment({ id: editData._id, ...data }).unwrap();
        showSnackbar("Payment updated successfully", "success");
      } else {
        await createPayment(data).unwrap();
        showSnackbar("Payment created successfully", "success");
      }
      closeModal();
    } catch (error) {
      showSnackbar("Error saving payment", "error");
    }
  };

  const confirmDelete = async () => {
    try {
      await deletePayment(deleteDialog.id).unwrap();
      showSnackbar("Payment deleted successfully", "success");
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      showSnackbar("Failed to delete payment", "error");
    }
  };

  const getSupplierName = (id) => {
    const s = suppliers?.find((sup) => sup._id === id);
    return s?.name || id;
  };

  // Calculate summary statistics
  const totalPayments = payments?.length || 0;
  const totalAmount =
    payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

  const getPaymentModeColor = (mode) => {
    switch (mode?.toLowerCase()) {
      case "cash":
        return "success";
      case "bank":
      case "bank transfer":
        return "info";
      case "cheque":
        return "warning";
      case "credit":
        return "warning";
      default:
        return "default";
    }
  };

  const getPaymentModeIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case "cash":
        return "💵";
      case "bank":
      case "bank transfer":
        return "🏦";
      case "cheque":
        return "📄";
      case "credit":
        return "💳";
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
                Supplier Payments
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                }}
              >
                Manage and track payments to suppliers
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openModal()}
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
              Add Payment
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
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
                    {totalPayments}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Payments
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
                  <PaymentIcon sx={{ color: "#667eea", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
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
                    sx={{ fontWeight: 700, color: "#f44336" }}
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
                    backgroundColor: alpha("#f44336", 0.1),
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PaymentIcon sx={{ color: "#f44336", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <PaymentFormModal
        open={modalOpen}
        onClose={closeModal}
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
            Delete Payment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this payment? This action cannot be
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
              Loading payments...
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
                    Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Mode
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
                {payments?.map((p) => (
                  <TableRow
                    key={p._id}
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
                        {new Date(p.paymentDate).toLocaleDateString()}
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
                          {(
                            p.supplier?.name || getSupplierName(p.supplier)
                          )?.charAt(0) || "S"}
                        </Avatar>
                        <Typography variant="body2">
                          {p.supplier?.name || getSupplierName(p.supplier)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#f44336" }}
                      >
                        ₹{p.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.paymentMode}
                        size="small"
                        color={getPaymentModeColor(p.paymentMode)}
                        icon={<span>{getPaymentModeIcon(p.paymentMode)}</span>}
                        sx={{
                          fontWeight: 600,
                          borderRadius: 1,
                          textTransform: "capitalize",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 150,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.notes || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Edit Payment">
                          <IconButton
                            onClick={() => openModal(p)}
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
                        <Tooltip title="Delete Payment">
                          <IconButton
                            onClick={() =>
                              setDeleteDialog({ open: true, id: p._id })
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
                {(!payments || payments.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 6 }}>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        No payments found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create your first payment to get started
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

export default SupplierPayments;
