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
import { useSnackbar } from "../common/SnackbarProvider";

const initialForm = {
  date: "",
  invoice_no: "",
  supplierName: "",
  tamarindType: "",
  quantity: "",
  pricePerKg: "",
  amountPaid: "",
  storageDecision: "",
  notes: "",
};

const fieldConfig = [
  { name: "date", label: "Date", type: "date", grid: 4 },
  { name: "invoice_no", label: "Invoice No", grid: 4 },
  { name: "supplierName", label: "Supplier Name", grid: 4 },
  {
    name: "tamarindType",
    label: "Tamarind Type",
    select: true,
    options: ["Whole", "Raw Pod"],
    grid: 4,
  },
  { name: "quantity", label: "Quantity (Kg)", type: "number", grid: 4 },
  { name: "pricePerKg", label: "Price per Kg", type: "number", grid: 4 },
  {
    name: "storageDecision",
    label: "Storage Decision",
    select: true,
    options: ["Cold", "Direct Use"],
    grid: 4,
  },
  {
    name: "notes",
    label: "Notes",
    multiline: true,
    rows: 2,
    grid: 8,
  },
];

const PurchaseFormModal = ({ open, onClose, onSubmit, initialValues }) => {
  const [form, setForm] = useState(initialForm);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    setForm(initialValues || initialForm);
  }, [initialValues, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative numbers for numeric fields
    if (
      ["quantity", "pricePerKg", "amountPaid"].includes(name) &&
      parseFloat(value) < 0
    ) {
      showSnackbar(`${name} cannot be negative.`, "error");
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const quantity = parseFloat(form.quantity) || 0;
    const pricePerKg = parseFloat(form.pricePerKg) || 0;
    const amountPaid = parseFloat(form.amountPaid) || 0;

    const totalAmount = quantity * pricePerKg;
    const remainingBalance = totalAmount - amountPaid;

    onSubmit({ ...form, totalAmount, remainingBalance });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Purchase</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          {fieldConfig.map((field) => (
            <Grid size={{ xs: 12, sm: 6, md: field.grid }} key={field.name}>
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

export default PurchaseFormModal;
