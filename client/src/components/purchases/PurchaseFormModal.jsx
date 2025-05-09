// components/purchases/PurchaseFormModal.jsx
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
  IconButton,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetSuppliersQuery } from "../../services/suppliersApi";
import { useGetFacilitiesQuery } from "../../services/facilityApi";
import { useSnackbar } from "../common/SnackbarProvider";
import { useState, useEffect } from "react";

const validationSchema = Yup.object({
  date: Yup.string().required("Date is required"),
  invoice_no: Yup.string().required("Invoice No is required"),
  supplier: Yup.string().required("Supplier is required"),
  tamarindType: Yup.string().required("Tamarind Type is required"),
  quantity: Yup.number().moreThan(0).required("Quantity is required"),
  pricePerKg: Yup.number().moreThan(0).required("Price is required"),
  storageEntries: Yup.array()
    .of(
      Yup.object({
        facility_id: Yup.string().required("Facility is required"),
        weight: Yup.number().moreThan(0).required("Weight is required"),
        materialType: Yup.string().required("Material type is required"),
        lot_number: Yup.string().nullable(),
      })
    )
    .min(1, "At least one storage entry is required"),
});

const PurchaseFormModal = ({ open, onClose, onSubmit, initialValues }) => {
  const { data: suppliers = [] } = useGetSuppliersQuery();
  const { data: facilities = [] } = useGetFacilitiesQuery();
  const showSnackbar = useSnackbar();

  const formik = useFormik({
    initialValues: initialValues || {
      date: "",
      invoice_no: "",
      supplier: "",
      tamarindType: "",
      quantity: "",
      pricePerKg: "",
      storageEntries: [
        { facility_id: "", weight: "", materialType: "", lot_number: "" },
      ],
    },
    validationSchema,
    enableReinitialize: true,
    validateOnBlur: false,
    onSubmit: (values) => {
      const totalAmount = values.quantity * values.pricePerKg;
      const remainingBalance = totalAmount;
      onSubmit({ ...values, totalAmount, remainingBalance });
      onClose();
    },
  });

  const handleAddEntry = () => {
    const newEntries = [...formik.values.storageEntries];
    newEntries.push({
      facility_id: "",
      weight: "",
      materialType: "",
      lot_number: "",
    });
    formik.setFieldValue("storageEntries", newEntries);
  };

  const handleRemoveEntry = (index) => {
    const newEntries = formik.values.storageEntries.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("storageEntries", newEntries);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Purchase</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid size={{ xs: 4, sm: 4, md: 6 }}>
              <TextField
                fullWidth
                name="date"
                label="Date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                error={Boolean(formik.errors.date)}
                helperText={formik.errors.date}
              />
            </Grid>

            <Grid size={{ xs: 4, sm: 4, md: 6 }}>
              <TextField
                fullWidth
                name="invoice_no"
                label="Invoice No"
                value={formik.values.invoice_no}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.invoice_no)}
                helperText={formik.errors.invoice_no}
              />
            </Grid>

            <Grid size={{ xs: 4, sm: 4, md: 6 }}>
              <TextField
                select
                fullWidth
                name="supplier"
                label="Supplier"
                value={formik.values.supplier}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.supplier)}
                helperText={formik.errors.supplier}
              >
                {suppliers.map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 4, sm: 4, md: 6 }}>
              <TextField
                select
                fullWidth
                name="tamarindType"
                label="Tamarind Type"
                value={formik.values.tamarindType}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.tamarindType)}
                helperText={formik.errors.tamarindType}
              >
                {["Whole", "Raw Pod"].map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 4, sm: 4, md: 6 }}>
              <TextField
                fullWidth
                name="quantity"
                label="Total Quantity (Kg)"
                type="number"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.quantity)}
                helperText={formik.errors.quantity}
              />
            </Grid>

            <Grid size={{ xs: 4, sm: 4, md: 6 }}>
              <TextField
                fullWidth
                name="pricePerKg"
                label="Price per Kg"
                type="number"
                value={formik.values.pricePerKg}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.pricePerKg)}
                helperText={formik.errors.pricePerKg}
              />
            </Grid>

            <Grid size={{ xs: 4, sm: 8, md: 12 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Box fontWeight="bold">Storage Entries</Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleAddEntry}
                >
                  Add Entry
                </Button>
              </Box>
            </Grid>

            {formik.values.storageEntries.map((entry, index) => (
              <Grid key={index} size={{ xs: 4, sm: 8, md: 12 }}>
                <Box mt={2} p={2} border="1px solid #ccc" borderRadius={2}>
                  <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                  >
                    <Grid size={{ xs: 4, sm: 4, md: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Facility"
                        name={`storageEntries[${index}].facility_id`}
                        value={entry.facility_id}
                        onChange={formik.handleChange}
                      >
                        {facilities.map((f) => (
                          <MenuItem key={f._id} value={f._id}>
                            {f.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid size={{ xs: 4, sm: 4, md: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Weight (kg)"
                        name={`storageEntries[${index}].weight`}
                        value={entry.weight}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid size={{ xs: 4, sm: 4, md: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Material Type"
                        name={`storageEntries[${index}].materialType`}
                        value={entry.materialType}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value="puli_type_1">Puli Type 1</MenuItem>
                        <MenuItem value="puli_type_2">Puli Type 2</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid size={{ xs: 4, sm: 4, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Lot Number (cold only)"
                        name={`storageEntries[${index}].lot_number`}
                        value={entry.lot_number}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid size={{ xs: 4, sm: 8, md: 12 }}>
                      <Box display="flex" justifyContent="flex-end">
                        <IconButton onClick={() => handleRemoveEntry(index)}>
                          <RemoveCircle color="error" />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            ))}
          </Grid>
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
