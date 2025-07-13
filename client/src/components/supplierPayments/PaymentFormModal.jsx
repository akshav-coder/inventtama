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
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetSuppliersQuery } from "../../services/suppliersApi";

const validationSchema = Yup.object({
  supplier: Yup.string().required("Supplier is required"),
  amount: Yup.number().moreThan(0).required("Amount is required"),
  paymentDate: Yup.string().required("Date is required"),
  paymentMode: Yup.string().required("Mode is required"),
});

const PaymentFormModal = ({ open, onClose, onSubmit, initialValues }) => {
  const { data: suppliers = [] } = useGetSuppliersQuery();

  const formik = useFormik({
    initialValues: {
      supplier: "",
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMode: "cash",
      upiTransactionId: "",
      notes: "",
      ...initialValues,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Payment</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Supplier"
                name="supplier"
                value={formik.values.supplier}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.supplier)}
                helperText={formik.errors.supplier}
              >
                {suppliers.length > 0 ? (
                  suppliers.map((s) => (
                    <MenuItem key={s._id} value={s._id}>
                      {s.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No suppliers available</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Amount"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.amount)}
                helperText={formik.errors.amount}
              />
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
                <MenuItem value="bank">Bank Transfer</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="credit">Credit</MenuItem>
              </TextField>
            </Grid>
            {formik.values.paymentMode === "upi" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="UPI Txn ID"
                  name="upiTransactionId"
                  value={formik.values.upiTransactionId}
                  onChange={formik.handleChange}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notes"
                name="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
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

export default PaymentFormModal;
