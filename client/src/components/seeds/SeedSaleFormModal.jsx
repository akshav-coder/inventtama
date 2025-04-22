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
  quantitySold: "",
  pricePerKg: "",
  totalAmount: "",
  buyerName: "",
  notes: "",
};

const fieldConfig = [
  { name: "date", label: "Date", type: "date", grid: 6 },
  { name: "buyerName", label: "Buyer Name", grid: 6 },
  { name: "quantitySold", label: "Quantity (Kg)", type: "number", grid: 6 },
  { name: "pricePerKg", label: "Price per Kg", type: "number", grid: 6 },
  {
    name: "notes",
    label: "Notes",
    multiline: true,
    rows: 2,
    grid: 12,
  },
];

const SeedSaleFormModal = ({ open, onClose, onSubmit, initialValues }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(initialValues || initialForm);
  }, [initialValues, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const quantity = parseFloat(form.quantitySold) || 0;
    const pricePerKg = parseFloat(form.pricePerKg) || 0;
    const totalAmount = quantity * pricePerKg;

    onSubmit({ ...form, totalAmount });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Seed Sale</DialogTitle>
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

export default SeedSaleFormModal;
