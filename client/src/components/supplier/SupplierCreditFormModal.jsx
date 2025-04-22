import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";

const initialForm = {
  supplierName: "",
  totalPurchases: "",
  amountPaid: "",
  remainingBalance: "",
  lastPaymentDate: "",
  notes: "",
};

const fieldConfig = [
  { name: "supplierName", label: "Supplier Name", grid: 12 },
  { name: "totalPurchases", label: "Total Purchases", type: "number", grid: 6 },
  { name: "amountPaid", label: "Amount Paid", type: "number", grid: 6 },
  {
    name: "remainingBalance",
    label: "Remaining Balance",
    type: "number",
    grid: 6,
  },
  {
    name: "lastPaymentDate",
    label: "Last Payment Date",
    type: "date",
    grid: 6,
  },
  { name: "notes", label: "Notes", multiline: true, rows: 2, grid: 12 },
];

const SupplierCreditFormModal = ({
  open,
  onClose,
  onSubmit,
  initialValues,
}) => {
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
      <DialogTitle>{initialValues ? "Edit" : "Add"} Supplier Entry</DialogTitle>
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
                InputLabelProps={
                  field.type === "date" ? { shrink: true } : undefined
                }
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

export default SupplierCreditFormModal;
