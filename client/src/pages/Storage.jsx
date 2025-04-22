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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import {
  useGetStorageEntriesQuery,
  useCreateStorageEntryMutation,
  useUpdateStorageEntryMutation,
  useDeleteStorageEntryMutation,
} from "../services/storageApi";
import { useState } from "react";
import StorageFormModal from "../components/storage/StorageFormModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Storage = () => {
  const { data, isLoading } = useGetStorageEntriesQuery();
  const [create] = useCreateStorageEntryMutation();
  const [update] = useUpdateStorageEntryMutation();
  const [remove] = useDeleteStorageEntryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const handleSubmit = async (formData) => {
    if (editItem) {
      await update({ id: editItem._id, ...formData });
    } else {
      await create(formData);
    }
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
        <Typography variant="h5">Cold Storage Tracker</Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Add Entry
        </Button>
      </Box>

      <StorageFormModal
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
        <DialogTitle>Delete this storage entry?</DialogTitle>
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
                <TableCell>Type</TableCell>
                <TableCell>In (Kg)</TableCell>
                <TableCell>Out (Kg)</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Remaining</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.date?.split("T")[0]}</TableCell>
                  <TableCell>{row.tamarindType}</TableCell>
                  <TableCell>{row.quantityIn}</TableCell>
                  <TableCell>{row.quantityOut}</TableCell>
                  <TableCell>{row.reasonForMovement}</TableCell>
                  <TableCell>{row.storageLocation}</TableCell>
                  <TableCell>{row.remainingStock}</TableCell>
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

export default Storage;
