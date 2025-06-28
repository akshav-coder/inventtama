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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import ReceiptFormModal from "../components/customerReceipts/ReceiptFormModal";
import {
  useGetReceiptsQuery,
  useCreateReceiptMutation,
  useUpdateReceiptMutation,
  useDeleteReceiptMutation,
} from "../services/customerReceiptApi";

const CustomerReceipts = () => {
  const { data: receipts, isLoading } = useGetReceiptsQuery();
  const [createReceipt] = useCreateReceiptMutation();
  const [updateReceipt] = useUpdateReceiptMutation();
  const [deleteReceipt] = useDeleteReceiptMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const openModal = (data = null) => {
    setEditData(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const handleSubmit = async (data) => {
    if (editData) {
      await updateReceipt({ id: editData._id, ...data });
    } else {
      await createReceipt(data);
    }
  };

  const confirmDelete = async () => {
    await deleteReceipt(deleteDialog.id);
    setDeleteDialog({ open: false, id: null });
  };

  const getCustomerName = (receipt) => receipt.customer?.name || receipt.customer;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Customer Receipts</Typography>
        <Button variant="contained" onClick={() => openModal()}>Add Receipt</Button>
      </Box>

      <ReceiptFormModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialValues={editData}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Delete this receipt?</DialogTitle>
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
                <TableCell>Customer</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receipts?.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{new Date(r.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getCustomerName(r)}</TableCell>
                  <TableCell>{r.totalAmount}</TableCell>
                  <TableCell>{r.paymentMode}</TableCell>
                  <TableCell>{r.referenceNo}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openModal(r)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteDialog({ open: true, id: r._id })}
                      >
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

export default CustomerReceipts;
