import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useGetStoragesQuery } from "../../services/storageApi";
import { useGetLotsQuery } from "../../services/lotapi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateTransferMutation } from "../../services/unitTransferApi";
import { useSnackbar } from "../common/SnackbarProvider";

const TransferFormModal = ({ open, onClose, initialValues }) => {
  const { data: storages = [] } = useGetStoragesQuery("");
  const [createTransfer] = useCreateTransferMutation();
  const showSnackbar = useSnackbar();
  const [selectedStorage, setSelectedStorage] = useState(null);
  const { data: lots = [] } = useGetLotsQuery(selectedStorage, {
    skip: !selectedStorage,
  });

  const formik = useFormik({
    initialValues: initialValues || {
      transferDate: new Date().toISOString().split("T")[0],
      fromStorageId: "",
      toStorageId: "",
      tamarindType: "",
      quantity: "",
      remarks: "",
      lotId: "",
    },
    validationSchema: Yup.object({
      transferDate: Yup.date().required("Date is required"),
      fromStorageId: Yup.string().required("From storage is required"),
      toStorageId: Yup.string()
        .required("To storage is required")
        .test(
          "different-storage",
          "Cannot transfer to same storage",
          function (value) {
            return value !== this.parent.fromStorageId;
          }
        ),
      tamarindType: Yup.string().required("Tamarind type is required"),
      quantity: Yup.number()
        .required("Quantity is required")
        .min(0.01, "Quantity must be greater than 0"),
      remarks: Yup.string(),
      lotId: Yup.string().when("fromStorageId", {
        is: (val) => Boolean(val && val.toLowerCase().includes("cold")),
        then: () => Yup.string().required("Lot is required for cold storage"),
        otherwise: () => Yup.string().nullable(),
      }),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await createTransfer(values).unwrap();
        showSnackbar("Transfer created successfully", "success");
        onClose();
      } catch (error) {
        showSnackbar(error.data?.error || "Failed to create transfer", "error");
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (open) {
      formik.resetForm();
      if (initialValues) {
        formik.setValues(initialValues);
      }
    }
  }, [open, initialValues]);

  const handleStorageChange = (e) => {
    const storageId = e.target.value;
    const storage = storages.find((s) => s._id === storageId);
    setSelectedStorage(storage?.type === "cold" ? storageId : null);
    formik.handleChange(e);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Transfer</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                name="transferDate"
                label="Transfer Date"
                value={formik.values.transferDate}
                onChange={formik.handleChange}
                error={
                  formik.touched.transferDate &&
                  Boolean(formik.errors.transferDate)
                }
                helperText={
                  formik.touched.transferDate && formik.errors.transferDate
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl
                fullWidth
                error={
                  formik.touched.fromStorageId &&
                  Boolean(formik.errors.fromStorageId)
                }
              >
                <InputLabel>From Storage</InputLabel>
                <Select
                  name="fromStorageId"
                  value={formik.values.fromStorageId}
                  onChange={handleStorageChange}
                  label="From Storage"
                >
                  {storages.map((storage) => (
                    <MenuItem key={storage._id} value={storage._id}>
                      {storage.name} ({storage.type})
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formik.errors.fromStorageId}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl
                fullWidth
                error={
                  formik.touched.toStorageId &&
                  Boolean(formik.errors.toStorageId)
                }
              >
                <InputLabel>To Storage</InputLabel>
                <Select
                  name="toStorageId"
                  value={formik.values.toStorageId}
                  onChange={formik.handleChange}
                  label="To Storage"
                >
                  {storages.map((storage) => (
                    <MenuItem key={storage._id} value={storage._id}>
                      {storage.name} ({storage.type})
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formik.errors.toStorageId}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl
                fullWidth
                error={
                  formik.touched.tamarindType &&
                  Boolean(formik.errors.tamarindType)
                }
              >
                <InputLabel>Tamarind Type</InputLabel>
                <Select
                  name="tamarindType"
                  value={formik.values.tamarindType}
                  onChange={formik.handleChange}
                  label="Tamarind Type"
                >
                  <MenuItem value="Whole">Whole</MenuItem>
                  <MenuItem value="Raw Pod">Raw Pod</MenuItem>
                  <MenuItem value="Paste">Paste</MenuItem>
                </Select>
                <FormHelperText>{formik.errors.tamarindType}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                name="quantity"
                label="Quantity (kg)"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                error={
                  formik.touched.quantity && Boolean(formik.errors.quantity)
                }
                helperText={formik.touched.quantity && formik.errors.quantity}
              />
            </Grid>
            {selectedStorage && (
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl
                  fullWidth
                  error={formik.touched.lotId && Boolean(formik.errors.lotId)}
                >
                  <InputLabel>Lot Number</InputLabel>
                  <Select
                    name="lotId"
                    value={formik.values.lotId}
                    onChange={formik.handleChange}
                    label="Lot Number"
                  >
                    {lots.map((lot) => (
                      <MenuItem key={lot._id} value={lot._id}>
                        {lot.lotNumber} (Available: {lot.quantity}kg)
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{formik.errors.lotId}</FormHelperText>
                </FormControl>
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="remarks"
                label="Remarks"
                value={formik.values.remarks}
                onChange={formik.handleChange}
                error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                helperText={formik.touched.remarks && formik.errors.remarks}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
          >
            {initialValues ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransferFormModal;
