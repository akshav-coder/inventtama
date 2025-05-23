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
  buyerName: "",
  lastPurchaseDate: "",
  totalCreditGiven: "",
  totalAmountPaid: "",
  currentBalance: "",
  notes: "",
};

const fieldConfig = [
  { name: "buyerName", label: "Buyer Name", grid: 6 },
  { name: "lastPurchaseDate", label: "Last Purchase", type: "date", grid: 6 },
  { name: "totalCreditGiven", label: "Credit Given", type: "number", grid: 6 },
  { name: "totalAmountPaid", label: "Amount Paid", type: "number", grid: 6 },
  { name: "currentBalance", label: "Balance", type: "number", grid: 6 },
  { name: "notes", label: "Notes", multiline: true, rows: 2, grid: 12 },
];

const WholesaleCreditFormModal = ({
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
      <DialogTitle>{initialValues ? "Edit" : "Add"} Credit Entry</DialogTitle>
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

export default WholesaleCreditFormModal;
