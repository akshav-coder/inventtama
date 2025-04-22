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
  useGetSeedSalesQuery,
  useCreateSeedSaleMutation,
  useUpdateSeedSaleMutation,
  useDeleteSeedSaleMutation,
} from "../services/seedSalesApi";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SeedSaleFormModal from "../components/seeds/SeedSaleFormModal";

const SeedSales = () => {
  const { data, isLoading } = useGetSeedSalesQuery();
  const [create] = useCreateSeedSaleMutation();
  const [update] = useUpdateSeedSaleMutation();
  const [remove] = useDeleteSeedSaleMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const handleSubmit = async (formData) => {
    if (editItem) await update({ id: editItem._id, ...formData });
    else await create(formData);
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
        <Typography variant="h5">Seed Sales</Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Add Seed Sale
        </Button>
      </Box>

      <SeedSaleFormModal
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
        <DialogTitle>Delete this seed sale?</DialogTitle>
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
                <TableCell>Date</TableCell>
                <TableCell>Buyer</TableCell>
                <TableCell>Qty (Kg)</TableCell>
                <TableCell>₹/Kg</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.date?.split("T")[0]}</TableCell>
                  <TableCell>{row.buyerName}</TableCell>
                  <TableCell>{row.quantitySold}</TableCell>
                  <TableCell>{row.pricePerKg}</TableCell>
                  <TableCell>{row.totalAmount}</TableCell>
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

export default SeedSales;
