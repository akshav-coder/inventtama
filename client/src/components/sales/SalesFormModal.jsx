import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  IconButton,
  MenuItem,
} from "@mui/material";
import { RemoveCircle } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetCustomersQuery } from "../../services/customersApi";

const itemSchema = Yup.object({
  pasteType: Yup.string().required("Paste type is required"),
  quantity: Yup.number().moreThan(0).required("Quantity is required"),
  rate: Yup.number().moreThan(0).required("Rate is required"),
});

const validationSchema = Yup.object({
  invoiceDate: Yup.string().required("Date is required"),
  customer: Yup.string().required("Customer is required"),
  paymentType: Yup.string().required("Payment type is required"),
  dueDate: Yup.string().when("paymentType", {
    is: "credit",
    then: (schema) => schema.required("Due date is required"),
  }),
  items: Yup.array().of(itemSchema).min(1, "At least one item is required"),
});

const defaultItem = { pasteType: "", quantity: "", rate: "" };

const SalesFormModal = ({ open, onClose, onSubmit, initialValues }) => {
  const { data: customers = [] } = useGetCustomersQuery();

  const formik = useFormik({
    initialValues: {
      invoiceDate: "",
      customer: "",
      paymentType: "cash",
      dueDate: "",
      amountPaid: "",
      notes: "",
      items: [JSON.parse(JSON.stringify(defaultItem))],
      ...initialValues,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const items = values.items.map((it) => ({
        ...it,
        total: parseFloat(it.quantity) * parseFloat(it.rate),
      }));
      onSubmit({ ...values, items });
      onClose();
    },
  });

  const addItem = () => {
    formik.setFieldValue("items", [
      ...formik.values.items,
      JSON.parse(JSON.stringify(defaultItem)),
    ]);
  };

  const removeItem = (idx) => {
    const arr = formik.values.items.filter((_, i) => i !== idx);
    formik.setFieldValue("items", arr);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Sale</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} mb={1}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="invoiceDate"
                label="Date"
                type="date"
                value={formik.values.invoiceDate}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                error={Boolean(formik.errors.invoiceDate)}
                helperText={formik.errors.invoiceDate}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                name="customer"
                label="Customer"
                value={formik.values.customer}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.customer)}
                helperText={formik.errors.customer}
              >
                {customers.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                name="paymentType"
                label="Payment Type"
                value={formik.values.paymentType}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.paymentType)}
                helperText={formik.errors.paymentType}
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="credit">Credit</MenuItem>
              </TextField>
            </Grid>
            {formik.values.paymentType === "credit" && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="dueDate"
                  label="Due Date"
                  type="date"
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(formik.errors.dueDate)}
                  helperText={formik.errors.dueDate}
                />
              </Grid>
            )}
            <Grid size={12}>
              <TextField
                fullWidth
                name="amountPaid"
                label="Amount Paid"
                type="number"
                value={formik.values.amountPaid}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          {formik.values.items.map((item, idx) => (
            <Grid container spacing={2} key={idx} mb={1} alignItems="center">
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Paste Type"
                  name={`items[${idx}].pasteType`}
                  value={item.pasteType}
                  onChange={formik.handleChange}
                  error={formik.errors.items?.[idx]?.pasteType}
                  helperText={formik.errors.items?.[idx]?.pasteType}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Qty"
                  name={`items[${idx}].quantity`}
                  value={item.quantity}
                  onChange={formik.handleChange}
                  error={formik.errors.items?.[idx]?.quantity}
                  helperText={formik.errors.items?.[idx]?.quantity}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Rate"
                  name={`items[${idx}].rate`}
                  value={item.rate}
                  onChange={formik.handleChange}
                  error={formik.errors.items?.[idx]?.rate}
                  helperText={formik.errors.items?.[idx]?.rate}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 2 }}>
                <IconButton color="error" onClick={() => removeItem(idx)}>
                  <RemoveCircle />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button onClick={addItem}>Add Item</Button>
          <TextField
            fullWidth
            name="notes"
            label="Notes"
            multiline
            rows={2}
            value={formik.values.notes}
            onChange={formik.handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialValues ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SalesFormModal;
