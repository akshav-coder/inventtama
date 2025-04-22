import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  useGetSupplierCreditsQuery,
  useCreateOrUpdateSupplierCreditMutation,
  useDeleteSupplierCreditMutation,
} from "../services/supplierCreditApi";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SupplierCreditFormModal from "../components/supplier/SupplierCreditFormModal";

const SupplierCredit = () => {
  const { data, isLoading } = useGetSupplierCreditsQuery();
  const [createOrUpdate] = useCreateOrUpdateSupplierCreditMutation();
  const [remove] = useDeleteSupplierCreditMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const handleSubmit = async (formData) => {
    await createOrUpdate(formData);
    setEditItem(null);
  };

  const handleDelete = async () => {
    await remove(deleteConfirm.id);
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
        <Typography variant="h5">Supplier Credit Ledger</Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Add Supplier
        </Button>
      </Box>

      <SupplierCreditFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editItem}
      />

      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
      >
        <DialogTitle>Delete this supplier entry?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, id: null })}>
            Cancel
          </Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Supplier</TableCell>
                <TableCell>Total Purchases</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Last Payment</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.supplierName}</TableCell>
                  <TableCell>{row.totalPurchases}</TableCell>
                  <TableCell>{row.amountPaid}</TableCell>
                  <TableCell>{row.remainingBalance}</TableCell>
                  <TableCell>{row.lastPaymentDate?.split("T")[0]}</TableCell>
                  <TableCell>{row.notes}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => {
                          setEditItem(row);
                          setModalOpen(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() =>
                          setDeleteConfirm({ open: true, id: row._id })
                        }
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

export default SupplierCredit;
