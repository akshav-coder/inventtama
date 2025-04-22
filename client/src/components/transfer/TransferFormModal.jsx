import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

const initialForm = {
  date: "",
  fromUnit: "",
  toUnit: "",
  item: "",
  quantity: "",
  notes: "",
};

const fieldConfig = [
  { name: "date", label: "Date", type: "date", grid: 6 },
  { name: "fromUnit", label: "From Unit", grid: 6 },
  { name: "toUnit", label: "To Unit", grid: 6 },
  { name: "item", label: "Item", grid: 6 },
  { name: "quantity", label: "Quantity", type: "number", grid: 6 },
  { name: "notes", label: "Notes", multiline: true, rows: 2, grid: 12 },
];

const TransferFormModal = ({ open, onClose, onSubmit, initialValues }) => {
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
      <DialogTitle>{initialValues ? "Edit" : "Add"} Unit Transfer</DialogTitle>
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
               
              />
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

export default TransferFormModal;
