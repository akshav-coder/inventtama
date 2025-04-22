import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";

const initialForm = {
  date: "",
  tamarindType: "",
  quantityIn: "",
  quantityOut: "",
  reasonForMovement: "",
  storageLocation: "",
  remainingStock: "",
  notes: "",
};

const fieldConfig = [
  { name: "date", label: "Date", type: "date", grid: 3 },
  {
    name: "tamarindType",
    label: "Tamarind Type",
    select: true,
    options: ["Whole", "Raw Pod"],
    grid: 3,
  },
  { name: "quantityIn", label: "Quantity In (Kg)", grid: 2 },
  { name: "quantityOut", label: "Quantity Out (Kg)", grid: 2 },
  {
    name: "reasonForMovement",
    label: "Reason",
    select: true,
    options: ["To Unit 1", "To Unit 2", "Store"],
    grid: 4,
  },
  { name: "storageLocation", label: "Storage Location", grid: 4 },
  { name: "remainingStock", label: "Remaining Stock", grid: 4 },
  {
    name: "notes",
    label: "Notes",
    multiline: true,
    rows: 2,
    grid: 12,
  },
];

const StorageFormModal = ({ open, onClose, onSubmit, initialValues }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(initialValues || initialForm);
  }, [initialValues, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Storage Entry</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          {fieldConfig.map((field) => (
            <Grid size={{ xs: 12, sm: 6, md: 6 }} key={field.name}>
              <TextField
                fullWidth
                name={field.name}s
                label={field.label}
                type={field.type || "text"}
                value={form[field.name]}
                onChange={handleChange}
                multiline={field.multiline || false}
                rows={field.rows || 1}
                select={field.select || false}
                InputLabelProps={
                  field.type === "date" ? { shrink: true } : undefined
                }
              >
                {field.select &&
                  field.options.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialValues ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StorageFormModal;
