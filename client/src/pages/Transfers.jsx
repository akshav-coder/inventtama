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
  Card,
  CardContent,
  Divider,
  Stack,
  Avatar,
  alpha,
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
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
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

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header Section */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Unit Transfers
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                }}
              >
                Manage and track tamarind transfers between storage units
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                  transform: "translateY(-2px)",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            >
              Add Transfer
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Filters Section */}
      <Card
        elevation={2}
        sx={{
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <FilterListIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
          </Box>
          <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
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
                  sx={{
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  }}
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
                  sx={{
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  }}
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
                <InputLabel>Tamarind Type</InputLabel>
                <Select
                  name="tamarindType"
                  value={filters.tamarindType}
                  onChange={handleFilterChange}
                  label="Tamarind Type"
                  sx={{
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Whole">Whole</MenuItem>
                  <MenuItem value="Raw Pod">Raw Pod</MenuItem>
                  <MenuItem value="Paste">Paste</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {modalOpen && (
        <TransferFormModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditItem(null);
          }}
          onSubmit={handleSubmit}
          initialValues={editItem}
        />
      )}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Delete Transfer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this transfer? This action cannot be
            undone.
          </Typography>
        </DialogTitle>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteConfirm({ open: false, id: null })}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            onClick={handleDelete}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table Section */}
      {isLoading ? (
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
              Loading transfers...
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha("#667eea", 0.05) }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    From
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    To
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Quantity
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Lot
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Remarks
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((row, index) => (
                  <TableRow
                    key={row._id}
                    sx={{
                      "&:hover": {
                        backgroundColor: alpha("#667eea", 0.02),
                        transition: "background-color 0.2s ease",
                      },
                      "&:nth-of-type(even)": {
                        backgroundColor: alpha("#f8fafc", 0.5),
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {new Date(row.transferDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            mr: 1,
                            backgroundColor: alpha("#667eea", 0.1),
                            color: "#667eea",
                            fontSize: "0.75rem",
                          }}
                        >
                          {row.fromStorageId?.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {row.fromStorageId?.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            mr: 1,
                            backgroundColor: alpha("#764ba2", 0.1),
                            color: "#764ba2",
                            fontSize: "0.75rem",
                          }}
                        >
                          {row.toStorageId?.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {row.toStorageId?.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.tamarindType}
                        size="small"
                        sx={{
                          backgroundColor: alpha("#667eea", 0.1),
                          color: "#667eea",
                          fontWeight: 500,
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {row.quantity} kg
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.lotId?.lotNumber || "-"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 150,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.remarks || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Edit Transfer">
                          <IconButton
                            onClick={() => {
                              setEditItem(row);
                              setModalOpen(true);
                            }}
                            sx={{
                              backgroundColor: alpha("#667eea", 0.1),
                              color: "#667eea",
                              "&:hover": {
                                backgroundColor: alpha("#667eea", 0.2),
                                transform: "scale(1.1)",
                                transition: "all 0.2s ease",
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Transfer">
                          <IconButton
                            color="error"
                            onClick={() =>
                              setDeleteConfirm({ open: true, id: row._id })
                            }
                            sx={{
                              backgroundColor: alpha("#f44336", 0.1),
                              "&:hover": {
                                backgroundColor: alpha("#f44336", 0.2),
                                transform: "scale(1.1)",
                                transition: "all 0.2s ease",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {(!data || data.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: "center", py: 6 }}>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        No transfers found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Object.values(filters).some((f) => f)
                          ? "Try adjusting your filters"
                          : "Create your first transfer to get started"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
};

export default Transfers;
