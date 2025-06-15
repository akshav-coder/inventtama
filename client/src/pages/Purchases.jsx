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
  useGetAllPurchasesQuery,
  useCreatePurchaseMutation,
  useDeletePurchaseMutation,
} from "../services/purchaseApi";
import { useState } from "react";
import PurchaseFormModal from "../components/purchases/PurchaseFormModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUpdatePurchaseMutation } from "../services/purchaseApi";

const Purchases = () => {
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
                <TableCell>Payment Type</TableCell>
                <TableCell>Storage</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases?.map((purchase) =>
                purchase.tamarindItems?.map((item, idx) => (
                  <TableRow key={`${purchase._id}-${idx}`}>
                    <TableCell>
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{purchase.supplierId?.name || "-"}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.pricePerKg}</TableCell>
                    <TableCell>
                      {item.totalAmount || purchase.totalAmount}
                    </TableCell>
                    <TableCell>{purchase.paymentType}</TableCell>
                    <TableCell>
                      {item.allocation?.map((alloc, i) =>
                        alloc.storageId?.name || alloc.storageId ? (
                          <span key={i}>
                            {alloc.storageId?.name || alloc.storageId}
                            {i < item.allocation.length - 1 ? ", " : ""}
                          </span>
                        ) : null
                      )}
                    </TableCell>
                    <TableCell>{item.notes}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEdit(purchase)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(purchase._id)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Purchases;
