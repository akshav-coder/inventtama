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
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  useGetTransfersQuery,
  useCreateTransferMutation,
  useUpdateTransferMutation,
  useDeleteTransferMutation,
} from "../services/unitTransferApi";
import { useGetStoragesQuery } from "../services/storageApi";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TransferFormModal from "../components/transfer/TransferFormModal";
import { useSnackbar } from "../components/common/SnackbarProvider";

const Transfers = () => {
  const { data: storages = [], isLoading: storagesLoading } =
    useGetStoragesQuery("");

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    fromStorage: "",
    toStorage: "",
    status: "",
    tamarindType: "",
  });

  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });

  const { data, isLoading } = useGetTransfersQuery(queryParams.toString());
  const [create] = useCreateTransferMutation();
  const [update] = useUpdateTransferMutation();
  const [remove] = useDeleteTransferMutation();
  const showSnackbar = useSnackbar();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const handleSubmit = async (formData) => {
    try {
      if (editItem) {
        const result = await update({ id: editItem._id, ...formData }).unwrap();
        showSnackbar("Transfer updated successfully", "success");
      } else {
        const result = await create(formData).unwrap();
        showSnackbar("Transfer created successfully", "success");
      }
      setEditItem(null);
    } catch (error) {
      showSnackbar("Error saving transfer", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await remove(deleteConfirm.id).unwrap();
      showSnackbar("Transfer deleted successfully", "success");
      setDeleteConfirm({ open: false, id: null });
    } catch (error) {
      showSnackbar(error.data?.error || "Failed to delete transfer", "error");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Unit Transfers</Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Add Transfer
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid size={{ xs: 4, sm: 4, md: 4 }}>
            <TextField
              fullWidth
              type="date"
              name="startDate"
              label="Start Date"
              value={filters.startDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
              size="medium"
            />
          </Grid>
          <Grid size={{ xs: 4, sm: 4, md: 4 }}>
            <TextField
              fullWidth
              type="date"
              name="endDate"
              label="End Date"
              value={filters.endDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
              size="medium"
            />
          </Grid>
          <Grid size={{ xs: 4, sm: 4, md: 4 }}>
            <FormControl fullWidth size="medium">
              <InputLabel>From Storage</InputLabel>
              <Select
                name="fromStorage"
                value={filters.fromStorage}
                onChange={handleFilterChange}
                label="From Storage"
              >
                <MenuItem value="">All</MenuItem>
                {storagesLoading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : (
                  storages.map((storage) => (
                    <MenuItem key={storage._id} value={storage._id}>
                      {storage.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 4, sm: 4, md: 4 }}>
            <FormControl fullWidth size="medium">
              <InputLabel>To Storage</InputLabel>
              <Select
                name="toStorage"
                value={filters.toStorage}
                onChange={handleFilterChange}
                label="To Storage"
              >
                <MenuItem value="">All</MenuItem>
                {storagesLoading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : (
                  storages.map((storage) => (
                    <MenuItem key={storage._id} value={storage._id}>
                      {storage.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 4, sm: 4, md: 4 }}>
            <FormControl fullWidth size="medium">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 4, sm: 4, md: 4 }}>
            <FormControl fullWidth size="medium">
              <InputLabel>Tamarind Type</InputLabel>
              <Select
                name="tamarindType"
                value={filters.tamarindType}
                onChange={handleFilterChange}
                label="Tamarind Type"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Whole">Whole</MenuItem>
                <MenuItem value="Raw Pod">Raw Pod</MenuItem>
                <MenuItem value="Paste">Paste</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <TransferFormModal
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
        <DialogTitle>Delete this transfer?</DialogTitle>
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
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Lot</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>
                    {new Date(row.transferDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{row.fromStorageId?.name}</TableCell>
                  <TableCell>{row.toStorageId?.name}</TableCell>
                  <TableCell>{row.tamarindType}</TableCell>
                  <TableCell>{row.quantity} kg</TableCell>
                  <TableCell>{row.lotId?.lotNumber || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={getStatusColor(row.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{row.remarks || "-"}</TableCell>
                  <TableCell align="center">
                    {row.status === "pending" && (
                      <>
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
                      </>
                    )}
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

export default Transfers;
