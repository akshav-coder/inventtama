import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Tooltip, Dialog, DialogTitle, DialogActions } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import PaymentFormModal from "../components/supplierPayments/PaymentFormModal";
import { useGetPaymentsQuery, useCreatePaymentMutation, useUpdatePaymentMutation, useDeletePaymentMutation } from "../services/supplierPaymentApi";
import { useGetSuppliersQuery } from "../services/suppliersApi";

const SupplierPayments = () => {
  const { data: payments, isLoading } = useGetPaymentsQuery();
  const { data: suppliers } = useGetSuppliersQuery();
  const [createPayment] = useCreatePaymentMutation();
  const [updatePayment] = useUpdatePaymentMutation();
  const [deletePayment] = useDeletePaymentMutation();

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
    if (editData) {
      await updatePayment({ id: editData._id, ...data });
    } else {
      await createPayment(data);
    }
  };

  const confirmDelete = async () => {
    await deletePayment(deleteDialog.id);
    setDeleteDialog({ open: false, id: null });
  };

  const getSupplierName = (id) => {
    const s = suppliers?.find((sup) => sup._id === id);
    return s?.name || id;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Supplier Payments</Typography>
        <Button variant="contained" onClick={() => openModal()}>Add Payment</Button>
      </Box>

      <PaymentFormModal open={modalOpen} onClose={closeModal} onSubmit={handleSubmit} initialValues={editData} />

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Delete this payment?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments?.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{new Date(p.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell>{p.supplier?.name || getSupplierName(p.supplier)}</TableCell>
                  <TableCell>{p.amount}</TableCell>
                  <TableCell>{p.paymentMode}</TableCell>
                  <TableCell>{p.notes}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openModal(p)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, id: p._id })}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SupplierPayments;
