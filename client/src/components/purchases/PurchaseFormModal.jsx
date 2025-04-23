import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetSuppliersQuery } from "../../services/suppliersApi";
import { useSnackbar } from "../common/SnackbarProvider";

const fieldConfig = [
  { name: "date", label: "", type: "date", grid: 4 },
  { name: "invoice_no", label: "Invoice No", grid: 4 },
  {
    name: "supplier",
    label: "Supplier",
    select: true,
    options: [], // Options will be dynamically populated
    grid: 4,
  },
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

const validationSchema = Yup.object({
  date: Yup.string().required("Date is required"),
  invoice_no: Yup.string().required("Invoice No is required"),
  supplier: Yup.string().required("Supplier is required"),
  tamarindType: Yup.string().required("Tamarind Type is required"),
  quantity: Yup.number()
    .required("Quantity is required")
    .min(0, "Quantity cannot be negative"),
  pricePerKg: Yup.number()
    .required("Price per Kg is required")
    .min(0, "Price per Kg cannot be negative"),
  storageDecision: Yup.string().required("Storage Decision is required"),
  notes: Yup.string(),
});

const PurchaseFormModal = ({ open, onClose, onSubmit, initialValues }) => {
  console.log(initialValues);
  const { data: suppliers = [], isLoading } = useGetSuppliersQuery();
  const showSnackbar = useSnackbar();

  const formik = useFormik({
    initialValues: initialValues
      ? {
          ...initialValues,
          date: new Date(initialValues.date).toISOString().split("T")[0], // Format date as YYYY-MM-DD
          supplier: initialValues.supplier?._id || "", // Extract supplier ID
        }
      : {
          date: "",
          invoice_no: "",
          supplier: "",
          tamarindType: "",
          quantity: "",
          pricePerKg: "",
          storageDecision: "",
          notes: "",
        },
    validationSchema,
    enableReinitialize: true,
    validateOnBlur: false,
    onSubmit: (values) => {
      console.log(values);
      const quantity = parseFloat(values.quantity) || 0;
      const pricePerKg = parseFloat(values.pricePerKg) || 0;

      const totalAmount = quantity * pricePerKg;
      const remainingBalance = totalAmount;

      onSubmit({ ...values, totalAmount, remainingBalance });
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Purchase</DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          {fieldConfig.map((field) => (
            <Box key={field.name} mb={2}>
              <TextField
                fullWidth
                name={field.name}
                label={field.label}
                type={field.type || "text"}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                multiline={field.multiline || false}
                rows={field.rows || 1}
                select={field.select || false}
                disabled={field.name === "supplier" && isLoading}
                error={
                  formik.touched[field.name] &&
                  Boolean(formik.errors[field.name])
                }
                helperText={
                  formik.touched[field.name] && formik.errors[field.name]
                }
              >
                {field.select &&
                  (field.name === "supplier"
                    ? suppliers.map((supplier) => (
                        <MenuItem key={supplier._id} value={supplier._id}>
                          {supplier.name}
                        </MenuItem>
                      ))
                    : field.options.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      )))}
              </TextField>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            {initialValues ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PurchaseFormModal;
