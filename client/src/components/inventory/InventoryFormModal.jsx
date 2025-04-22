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
  item: "",
  openingStock: "",
  stockIn: "",
  stockOut: "",
  closingStock: "",
  location: "",
};

const fieldConfig = [
  { name: "date", label: "Date", type: "date", grid: 12 },
  {
    name: "item",
    label: "Item",
    select: true,
    options: ["Raw Tamarind", "Paste", "Salt", "Oil"],
    grid: 12,
  },
  { name: "openingStock", label: "Opening Stock", type: "number", grid: 6 },
  { name: "stockIn", label: "Stock In", type: "number", grid: 6 },
  { name: "stockOut", label: "Stock Out", type: "number", grid: 6 },
  { name: "closingStock", label: "Closing Stock", type: "number", grid: 6 },
  { name: "location", label: "Location", grid: 12 },
];

const InventoryFormModal = ({ open, onClose, onSubmit, initialValues }) => {
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialValues ? "Edit" : "Add"} Inventory Entry
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          {fieldConfig.map((field) => (
            <Grid size={{ xs: 12, sm: 6, md: 6 }} key={field.name}>
              <TextField
                fullWidth
                name={field.name}
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
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialValues ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryFormModal;
