import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  InputLabel,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Factory as FactoryIcon,
} from "@mui/icons-material";
import {
  useGetProcessingLogsQuery,
  useCreateProcessingLogMutation,
  useUpdateProcessingLogMutation,
  useDeleteProcessingLogMutation,
} from "../services/processingApi";
import { useGetStoragesQuery } from "../services/storageApi";
import { useSnackbar } from "./common/SnackbarProvider";

const Processing = () => {
  const [manufacturingUnits, setManufacturingUnits] = useState([]);
  const tamarindTypes = ["Whole", "Raw Pod", "Seedless", "Sour"];
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    manufacturingUnit: "",
    inputs: [{ tamarindType: "", quantity: 0 }],
    output: {
      pasteType: "",
      quantity: 0,
    },
    team: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const { data: processingRecords = [], isLoading: isLoadingProcessing } =
    useGetProcessingLogsQuery();
  const { data: storageData = [] } = useGetStoragesQuery("unit");
  const [createProcessingLog] = useCreateProcessingLogMutation();
  const [updateProcessingLog] = useUpdateProcessingLogMutation();
  const [deleteProcessingLog] = useDeleteProcessingLogMutation();
  const showSnackbar = useSnackbar();

  useEffect(() => {
    if (storageData) {
      setManufacturingUnits(storageData);
    }
  }, [storageData]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith("input")) {
      const [field, idx] = name.split("-");
      const newInputs = [...formData.inputs];
      newInputs[idx][field === "inputType" ? "tamarindType" : "quantity"] =
        field === "inputQuantity" ? Number(value) || 0 : value;
      setFormData({ ...formData, inputs: newInputs });
    } else if (name.startsWith("output")) {
      const field = name.split("-")[1];
      setFormData({
        ...formData,
        output: {
          ...formData.output,
          [field]: field === "quantity" ? Number(value) || 0 : value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addInput = () => {
    setFormData({
      ...formData,
      inputs: [...formData.inputs, { tamarindType: "", quantity: 0 }],
    });
  };

  const removeInput = (index) => {
    const newInputs = formData.inputs.filter((_, i) => i !== index);
    setFormData({ ...formData, inputs: newInputs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProcessingLog({ id: editingId, ...formData }).unwrap();
        showSnackbar("Processing record updated successfully", "success");
      } else {
        await createProcessingLog(formData).unwrap();
        showSnackbar("Processing record created successfully", "success");
      }
      resetForm();
      handleClose();
    } catch (error) {
      showSnackbar("Error saving processing record", "error");
    }
  };

  const handleEdit = (record) => {
    setFormData({
      date: new Date(record.date).toISOString().split("T")[0],
      manufacturingUnit: record.manufacturingUnit._id,
      inputs: record.inputs.map((input) => ({
        tamarindType: input.tamarindType,
        quantity: input.quantity,
      })),
      output: {
        pasteType: record.output.pasteType,
        quantity: record.output.quantity,
      },
      team: record.team || "",
      notes: record.notes || "",
    });
    setEditingId(record._id);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProcessingLog(deleteDialog.id).unwrap();
      showSnackbar("Processing record deleted successfully", "success");
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      showSnackbar("Error deleting processing record", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      manufacturingUnit: "",
      inputs: [{ tamarindType: "", quantity: 0 }],
      output: {
        pasteType: "",
        quantity: 0,
      },
      team: "",
      notes: "",
    });
    setEditingId(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Calculate summary statistics
  const totalRecords = processingRecords?.length || 0;
  const totalInputQuantity =
    processingRecords?.reduce(
      (sum, record) => sum + (record.totalInputQuantity || 0),
      0
    ) || 0;
  const totalOutputQuantity =
    processingRecords?.reduce(
      (sum, record) => sum + (record.output?.quantity || 0),
      0
    ) || 0;

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
                Processing Records
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                }}
              >
                Manage and track tamarind processing operations
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
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
              New Processing Record
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#667eea" }}
                  >
                    {totalRecords}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Records
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: alpha("#667eea", 0.1),
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FactoryIcon sx={{ color: "#667eea", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#4caf50" }}
                  >
                    {totalInputQuantity.toFixed(1)} kg
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Input
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: alpha("#4caf50", 0.1),
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FactoryIcon sx={{ color: "#4caf50", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#2196f3" }}
                  >
                    {totalOutputQuantity.toFixed(1)} kg
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Output
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: alpha("#2196f3", 0.1),
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FactoryIcon sx={{ color: "#2196f3", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Delete Processing Record
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this processing record? This action
            cannot be undone.
          </Typography>
        </DialogTitle>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, id: null })}
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
      {isLoadingProcessing ? (
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 6, textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    border: "4px solid #f3f3f3",
                    borderTop: "4px solid #667eea",
                    animation: "spin 1s linear infinite",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                />
              </Box>
            </Box>
            <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
              Loading processing records...
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
                    Unit
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Input Types
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Total Input
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Output Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Output Qty
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Weight Loss
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Team
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
                {processingRecords.map((record) => (
                  <TableRow
                    key={record._id}
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
                        {new Date(record.date).toLocaleDateString()}
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
                          {record.manufacturingUnit.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {record.manufacturingUnit.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {record.inputs.map((input, index) => (
                          <Chip
                            key={index}
                            label={`${input.tamarindType} (${input.quantity}kg)`}
                            size="small"
                            sx={{
                              backgroundColor: alpha("#667eea", 0.1),
                              color: "#667eea",
                              fontWeight: 500,
                              borderRadius: 1,
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {record.totalInputQuantity}kg
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.output.pasteType}
                        size="small"
                        sx={{
                          backgroundColor: alpha("#4caf50", 0.1),
                          color: "#4caf50",
                          fontWeight: 500,
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#4caf50" }}
                      >
                        {record.output.quantity}kg
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {record.weightLoss.quantity}kg (
                        {record.weightLoss.percentage.toFixed(1)}%)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {record.team || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Edit Record">
                          <IconButton
                            onClick={() => handleEdit(record)}
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
                        <Tooltip title="Delete Record">
                          <IconButton
                            onClick={() =>
                              setDeleteDialog({ open: true, id: record._id })
                            }
                            sx={{
                              backgroundColor: alpha("#f44336", 0.1),
                              color: "#f44336",
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
                {(!processingRecords || processingRecords.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: "center", py: 6 }}>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        No processing records found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create your first processing record to get started
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {editingId ? "Edit Processing Record" : "New Processing Record"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <FormControl fullWidth required>
                <InputLabel>Manufacturing Unit</InputLabel>
                <Select
                  name="manufacturingUnit"
                  value={formData.manufacturingUnit}
                  onChange={handleInputChange}
                  label="Manufacturing Unit"
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  {manufacturingUnits.length > 0 ? (
                    manufacturingUnits.map((unit) => (
                      <MenuItem key={unit._id} value={unit._id}>
                        {unit.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      No manufacturing units available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

              <Box>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Input Materials
                </Typography>
                {formData.inputs.map((input, index) => (
                  <Stack key={index} direction="row" spacing={2} sx={{ mb: 2 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Tamarind Type</InputLabel>
                      <Select
                        name={`inputType-${index}`}
                        value={input.tamarindType}
                        onChange={(e) => handleInputChange(e, index)}
                        label="Tamarind Type"
                        sx={{
                          borderRadius: 2,
                        }}
                      >
                        {tamarindTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      type="number"
                      name={`inputQuantity-${index}`}
                      value={input.quantity}
                      onChange={(e) => handleInputChange(e, index)}
                      label="Quantity (kg)"
                      required
                      sx={{
                        width: "200px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                    {index > 0 && (
                      <IconButton
                        color="error"
                        onClick={() => removeInput(index)}
                        sx={{
                          backgroundColor: alpha("#f44336", 0.1),
                          "&:hover": {
                            backgroundColor: alpha("#f44336", 0.2),
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={addInput}
                  sx={{
                    mt: 1,
                    borderRadius: 2,
                    backgroundColor: alpha("#667eea", 0.1),
                    color: "#667eea",
                    "&:hover": {
                      backgroundColor: alpha("#667eea", 0.2),
                    },
                  }}
                >
                  Add Input Material
                </Button>
              </Box>

              <TextField
                label="Output Paste Type"
                name="output-pasteType"
                value={formData.output.pasteType}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Output Quantity (kg)"
                type="number"
                name="output-quantity"
                value={formData.output.quantity}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Team"
                name="team"
                value={formData.team}
                onChange={handleInputChange}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Processing;
