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
import SalesFormModal from "../components/sales/SalesFormModal";
import {
  useGetSalesQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
} from "../services/salesApi";

const Sales = () => {
  const { data: sales, isLoading } = useGetSalesQuery();
  const [createSale] = useCreateSaleMutation();
  const [updateSale] = useUpdateSaleMutation();
  const [deleteSale] = useDeleteSaleMutation();

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
    if (editData) {
      await updateSale({ id: editData._id, ...data });
    } else {
      await createSale(data);
    }
    handleClose();
  };

  const confirmDelete = async () => {
    await deleteSale(deleteDialog.id);
    setDeleteDialog({ open: false, id: null });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Sales</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>Add Sale</Button>
      </Box>

      <SalesFormModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialValues={editData}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Are you sure you want to delete this sale?</DialogTitle>
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
                <TableCell>Paid</TableCell>
                <TableCell>Payment Type</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales?.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell>{new Date(sale.invoiceDate).toLocaleDateString()}</TableCell>
                  <TableCell>{sale.customer?.name || sale.customer}</TableCell>
                  <TableCell>{sale.totalAmount}</TableCell>
                  <TableCell>{sale.amountPaid}</TableCell>
                  <TableCell>{sale.paymentType}</TableCell>
                  <TableCell>
                    {sale.paymentType === "credit" && sale.dueDate
                      ? new Date(sale.dueDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleOpen(sale)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteDialog({ open: true, id: sale._id })}
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

export default Sales;
