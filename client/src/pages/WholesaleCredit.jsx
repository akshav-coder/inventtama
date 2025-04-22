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
  useGetWholesaleCreditsQuery,
  useCreateOrUpdateCreditMutation,
  useDeleteCreditEntryMutation,
} from "../services/wholesaleCreditApi";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WholesaleCreditFormModal from "../components/wholesale/WholesaleCreditFormModal";

const WholesaleCredit = () => {
  const { data, isLoading } = useGetWholesaleCreditsQuery();
  const [createOrUpdate] = useCreateOrUpdateCreditMutation();
  const [remove] = useDeleteCreditEntryMutation();

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
        <Typography variant="h5">Wholesale Credit Ledger</Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Add Entry
        </Button>
      </Box>

      <WholesaleCreditFormModal
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
        <DialogTitle>Delete this entry?</DialogTitle>
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
                <TableCell>Buyer</TableCell>
                <TableCell>Last Purchase</TableCell>
                <TableCell>Total Credit</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.buyerName}</TableCell>
                  <TableCell>{row.lastPurchaseDate?.split("T")[0]}</TableCell>
                  <TableCell>{row.totalCreditGiven}</TableCell>
                  <TableCell>{row.totalAmountPaid}</TableCell>
                  <TableCell>{row.currentBalance}</TableCell>
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

export default WholesaleCredit;
