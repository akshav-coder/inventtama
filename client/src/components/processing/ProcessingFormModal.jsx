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
import { useEffect, useState } from "react";

const initialForm = {
  date: "",
  unitName: "",
  tamarindTypeUsed: "",
  quantityUsed: "",
  saltQty: "",
  oilQty: "",
  pasteProduced: "",
  seedsCollected: "",
  operatorName: "",
  notes: "",
};

const fieldConfig = [
  { name: "date", label: "Date", type: "date", grid: 3 },
  {
    name: "unitName",
    label: "Unit",
    select: true,
    options: ["Unit 1", "Unit 2"],
    grid: 3,
  },
  {
    name: "tamarindTypeUsed",
    label: "Tamarind Type",
    select: true,
    options: ["Whole", "Raw Pod"],
    grid: 3,
  },
  { name: "quantityUsed", label: "Used (Kg)", grid: 3 },
  { name: "saltQty", label: "Salt Qty", grid: 3 },
  { name: "oilQty", label: "Oil Qty", grid: 3 },
  { name: "pasteProduced", label: "Paste (Kg)", grid: 3 },
  { name: "seedsCollected", label: "Seeds (Kg)", grid: 3 },
  { name: "operatorName", label: "Operator", grid: 6 },
  {
    name: "notes",
    label: "Notes",
    multiline: true,
    rows: 2,
    grid: 12,
  },
];

const ProcessingFormModal = ({ open, onClose, onSubmit, initialValues }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(initialValues || initialForm);
  }, [initialValues, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Processing Log</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          {fieldConfig.map((field) => (
            <Grid
              size={{ xs: 12, sm: field.grid === 12 ? 12 : 6 }}
              md={field.grid}
              key={field.name}
            >
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
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSubmit(form);
            onClose();
          }}
          variant="contained"
        >
          {initialValues ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProcessingFormModal;
