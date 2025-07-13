import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { RemoveCircle } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetCustomersQuery } from "../../services/customersApi";
import { useGetSalesQuery } from "../../services/salesApi";

const invoiceSchema = Yup.object({
  sale: Yup.string().required("Invoice is required"),
  amount: Yup.number().moreThan(0).required("Amount is required"),
});

const validationSchema = Yup.object({
  customer: Yup.string().required("Customer is required"),
  paymentMode: Yup.string().required("Payment mode is required"),
  paymentDate: Yup.string().required("Date is required"),
  invoices: Yup.array().of(invoiceSchema).min(1, "At least one invoice"),
});

const defaultInvoice = { sale: "", amount: "" };

const ReceiptFormModal = ({ open, onClose, onSubmit, initialValues }) => {
  const { data: customers = [] } = useGetCustomersQuery();
  const { data: sales = [] } = useGetSalesQuery();

  const formik = useFormik({
    initialValues: {
      customer: "",
      paymentMode: "cash",
      paymentDate: new Date().toISOString().split("T")[0],
      referenceNo: "",
      invoices: [JSON.parse(JSON.stringify(defaultInvoice))],
      ...initialValues,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  const addInvoice = () => {
    formik.setFieldValue("invoices", [
      ...formik.values.invoices,
      JSON.parse(JSON.stringify(defaultInvoice)),
    ]);
  };

  const removeInvoice = (idx) => {
    const arr = formik.values.invoices.filter((_, i) => i !== idx);
    formik.setFieldValue("invoices", arr);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Receipt</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Customer"
                name="customer"
                value={formik.values.customer}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.customer)}
                helperText={formik.errors.customer}
              >
                {customers.length > 0 ? (
                  customers.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No customers available</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                fullWidth
                label="Payment Date"
                name="paymentDate"
                value={formik.values.paymentDate}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                error={Boolean(formik.errors.paymentDate)}
                helperText={formik.errors.paymentDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Payment Mode"
                name="paymentMode"
                value={formik.values.paymentMode}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.paymentMode)}
                helperText={formik.errors.paymentMode}
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="bank">Bank Transfer</MenuItem>
                <MenuItem value="cheque">Cheque</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reference No"
                name="referenceNo"
                value={formik.values.referenceNo}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          {formik.values.invoices.map((inv, idx) => (
            <Grid container spacing={2} key={idx} alignItems="center" mb={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Sale Invoice"
                  name={`invoices[${idx}].sale`}
                  value={inv.sale}
                  onChange={formik.handleChange}
                  error={formik.errors.invoices?.[idx]?.sale}
                  helperText={formik.errors.invoices?.[idx]?.sale}
                >
                  {sales.length > 0 ? (
                    sales.map((s) => (
                      <MenuItem key={s._id} value={s._id}>
                        {s._id}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No sales available</MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  name={`invoices[${idx}].amount`}
                  value={inv.amount}
                  onChange={formik.handleChange}
                  error={formik.errors.invoices?.[idx]?.amount}
                  helperText={formik.errors.invoices?.[idx]?.amount}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <IconButton color="error" onClick={() => removeInvoice(idx)}>
                  <RemoveCircle />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button onClick={addInvoice}>Add Invoice</Button>
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

export default ReceiptFormModal;
