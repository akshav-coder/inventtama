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
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  useGetProcessingLogsQuery,
  useCreateProcessingLogMutation,
  useUpdateProcessingLogMutation,
  useDeleteProcessingLogMutation,
} from "../services/processingApi";
import { useGetStoragesQuery } from "../services/storageApi";

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: processingRecords = [], isLoading: isLoadingProcessing } =
    useGetProcessingLogsQuery();
  const { data: storageData = [] } = useGetStoragesQuery("unit");
  const [createProcessingLog] = useCreateProcessingLogMutation();
  const [updateProcessingLog] = useUpdateProcessingLogMutation();
  const [deleteProcessingLog] = useDeleteProcessingLogMutation();

  useEffect(() => {
    if (storageData) {
      setManufacturingUnits(storageData);
    }
  }, [storageData]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith("input")) {
      const [field, idx] = name.split("-");
      const newInputs = [...formData.inputs];
      newInputs[idx][field === "inputType" ? "tamarindType" : "quantity"] =
        value;
      setFormData({ ...formData, inputs: newInputs });
    } else if (name.startsWith("output")) {
      const field = name.split("-")[1];
      setFormData({
        ...formData,
        output: { ...formData.output, [field]: value },
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
        showSnackbar("Processing record updated");
      } else {
        await createProcessingLog(formData).unwrap();
        showSnackbar("Processing record created");
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteProcessingLog(id).unwrap();
        showSnackbar("Processing record deleted");
      } catch (error) {
        showSnackbar("Error deleting processing record", "error");
      }
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1">
            Processing Records
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            New Processing Record
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Input Types</TableCell>
                <TableCell>Total Input</TableCell>
                <TableCell>Output Type</TableCell>
                <TableCell>Output Qty</TableCell>
                <TableCell>Weight Loss</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processingRecords.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>
                    {new Date(record.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{record.manufacturingUnit.name}</TableCell>
                  <TableCell>
                    {record.inputs
                      .map(
                        (input) => `${input.tamarindType} (${input.quantity}kg)`
                      )
                      .join(", ")}
                  </TableCell>
                  <TableCell>{record.totalInputQuantity}kg</TableCell>
                  <TableCell>{record.output.pasteType}</TableCell>
                  <TableCell>{record.output.quantity}kg</TableCell>
                  <TableCell>
                    {record.weightLoss.quantity}kg (
                    {record.weightLoss.percentage.toFixed(1)}%)
                  </TableCell>
                  <TableCell>{record.team}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(record)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(record._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingId ? "Edit Processing Record" : "New Processing Record"}
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
                />

                <FormControl fullWidth required>
                  <InputLabel>Manufacturing Unit</InputLabel>
                  <Select
                    name="manufacturingUnit"
                    value={formData.manufacturingUnit}
                    onChange={handleInputChange}
                    label="Manufacturing Unit"
                  >
                    {manufacturingUnits.map((unit) => (
                      <MenuItem key={unit._id} value={unit._id}>
                        {unit.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Input Materials
                  </Typography>
                  {formData.inputs.map((input, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      spacing={2}
                      sx={{ mb: 2 }}
                    >
                      <FormControl fullWidth required>
                        <InputLabel>Tamarind Type</InputLabel>
                        <Select
                          name={`inputType-${index}`}
                          value={input.tamarindType}
                          onChange={(e) => handleInputChange(e, index)}
                          label="Tamarind Type"
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
                        sx={{ width: "200px" }}
                      />
                      {index > 0 && (
                        <IconButton
                          color="error"
                          onClick={() => removeInput(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addInput}
                    sx={{ mt: 1 }}
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
                />

                <TextField
                  label="Output Quantity (kg)"
                  type="number"
                  name="output-quantity"
                  value={formData.output.quantity}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />

                <TextField
                  label="Team"
                  name="team"
                  value={formData.team}
                  onChange={handleInputChange}
                  fullWidth
                />

                <TextField
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingId ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  );
};

export default Processing;
