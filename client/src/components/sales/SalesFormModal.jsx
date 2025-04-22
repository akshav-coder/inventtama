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
  customerName: "",
  customerType: "",
  productSold: "Paste",
  quantity: "",
  pricePerKg: "",
  amountPaid: "",
  paymentMode: "",
  notes: "",
};

const fieldConfig = [
  { name: "date", label: "Date", type: "date", grid: 6 },
  { name: "customerName", label: "Customer Name", grid: 6 },
  {
    name: "customerType",
    label: "Customer Type",
    select: true,
    options: ["Wholesale", "Retail"],
    grid: 6,
  },
  {
    name: "quantity",
    label: "Quantity (Kg)",
    type: "number",
    grid: 6,
  },
  {
    name: "pricePerKg",
    label: "Price per Kg",
    type: "number",
    grid: 6,
  },
  {
    name: "amountPaid",
    label: "Amount Paid",
    type: "number",
    grid: 6,
  },
  {
    name: "paymentMode",
    label: "Payment Mode",
    select: true,
    options: ["Cash", "Credit"],
    grid: 6,
  },
  {
    name: "notes",
    label: "Notes",
    multiline: true,
    rows: 2,
    grid: 12,
  },
];

const SalesFormModal = ({ open, onClose, onSubmit, initialValues }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(initialValues || initialForm);
  }, [initialValues, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const quantity = parseFloat(form.quantity) || 0;
    const pricePerKg = parseFloat(form.pricePerKg) || 0;
    const amountPaid = parseFloat(form.amountPaid) || 0;

    const totalAmount = quantity * pricePerKg;
    const remainingBalance =
      form.customerType === "Wholesale" ? totalAmount - amountPaid : 0;

    onSubmit({ ...form, totalAmount, remainingBalance });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Sale</DialogTitle>
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

export default SalesFormModal;
