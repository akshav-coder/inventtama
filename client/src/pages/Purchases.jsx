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
} from "@mui/material";
import {
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
  useDeletePurchaseMutation,
} from "../services/purchaseApi";
import { useState } from "react";
import PurchaseFormModal from "../components/purchases/PurchaseFormModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUpdatePurchaseMutation } from "../services/purchaseApi";

const Purchases = () => {
  const { data: purchases, isLoading } = useGetPurchasesQuery();
  const [createPurchase] = useCreatePurchaseMutation();
  const [deletePurchase] = useDeletePurchaseMutation();
  const [updatePurchase] = useUpdatePurchaseMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const handleSubmit = async (formData) => {
    console.log(formData);
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

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Purchase Entries</Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Add Purchase
        </Button>
      </Box>

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
      >
        <DialogTitle>
          Are you sure you want to delete this purchase?
        </DialogTitle>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setDeleteConfirm({ open: false, id: null })}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Qty (Kg)</TableCell>
                <TableCell>₹/Kg</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Balance Amount</TableCell>
                <TableCell>Storage</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases?.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.date?.split("T")[0]}</TableCell>
                  <TableCell>{row?.supplier?.name}</TableCell>
                  <TableCell>{row.tamarindType}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.pricePerKg}</TableCell>
                  <TableCell>{row.totalAmount}</TableCell>
                  <TableCell>{row.remainingBalance}</TableCell>
                  <TableCell>{row.storageDecision}</TableCell>
                  <TableCell>{row.notes}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(row)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDelete(row._id)}
                        size="small"
                        color="error"
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

export default Purchases;
