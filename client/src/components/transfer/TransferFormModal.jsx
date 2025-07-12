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

  const [formData, setFormData] = useState({
    transferDate: new Date().toISOString().split("T")[0],
    fromStorageId: "",
    toStorageId: "",
    tamarindType: "",
    quantity: "",
    remarks: "",
    lotId: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get unit storages for "to" storage dropdown
  const unitStorages = storages.filter((storage) => storage.type === "unit");

  // Get selected lot details for quantity validation
  const selectedLot = lots.find((lot) => lot._id === formData.lotId);

  // Get selected fromStorage details for unit max quantity
  const fromStorage = storages.find((s) => s._id === formData.fromStorageId);
  const fromUnitMaxQuantity =
    fromStorage && fromStorage.type === "unit" ? fromStorage.quantity : null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.transferDate) {
      newErrors.transferDate = "Date is required";
    }

    if (!formData.fromStorageId) {
      newErrors.fromStorageId = "From storage is required";
    }

    if (!formData.toStorageId) {
      newErrors.toStorageId = "To storage is required";
    } else if (formData.toStorageId === formData.fromStorageId) {
      newErrors.toStorageId = "Cannot transfer to same storage";
    }

    if (!formData.tamarindType) {
      newErrors.tamarindType = "Tamarind type is required";
    }

    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    } else if (selectedLot && formData.quantity > selectedLot.quantity) {
      newErrors.quantity = `Quantity cannot exceed available lot quantity (${selectedLot.quantity}kg)`;
    } else if (
      fromUnitMaxQuantity !== null &&
      formData.quantity > fromUnitMaxQuantity
    ) {
      newErrors.quantity = `Quantity cannot exceed available unit quantity (${fromUnitMaxQuantity}kg)`;
    }

    const fromStorage = storages.find((s) => s._id === formData.fromStorageId);
    if (fromStorage?.type === "cold" && !formData.lotId) {
      newErrors.lotId = "Lot is required for cold storage";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // If lot changes, reset toStorageId if from storage is cold
    if (name === "lotId" && selectedStorage) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        toStorageId: "", // Reset to storage when lot changes
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Remove lotId if not needed or empty
      const payload = { ...formData };
      if (!payload.lotId) delete payload.lotId;
      const result = await createTransfer(payload).unwrap();
      showSnackbar("Transfer created successfully", "success");
      onClose();
    } catch (error) {
      showSnackbar(error.data?.error || "Failed to create transfer", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStorageChange = (e) => {
    const storageId = e.target.value;
    const storage = storages.find((s) => s._id === storageId);
    setSelectedStorage(storage?.type === "cold" ? storageId : null);

    // Reset form data when from storage changes
    setFormData((prev) => ({
      ...prev,
      fromStorageId: storageId,
      lotId: "",
      toStorageId: "",
    }));

    handleInputChange(e);
  };

  useEffect(() => {
    if (open) {
      const defaultValues = {
        transferDate: new Date().toISOString().split("T")[0],
        fromStorageId: "",
        toStorageId: "",
        tamarindType: "",
        quantity: 0,
        remarks: "",
        lotId: "",
      };

      setFormData(initialValues || defaultValues);
      setErrors({});
      setIsSubmitting(false);

      if (initialValues?.fromStorageId) {
        const storage = storages.find(
          (s) => s._id === initialValues.fromStorageId
        );
        setSelectedStorage(
          storage?.type === "cold" ? initialValues.fromStorageId : null
        );
      }
    }
  }, [open, initialValues, storages]);

  // Check if "to" storage should be disabled
  const isToStorageDisabled = selectedStorage && !formData.lotId;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Transfer</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                name="transferDate"
                label="Transfer Date"
                value={formData.transferDate}
                onChange={handleInputChange}
                error={Boolean(errors.transferDate)}
                helperText={errors.transferDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth error={Boolean(errors.fromStorageId)}>
                <InputLabel>From Storage</InputLabel>
                <Select
                  name="fromStorageId"
                  value={formData.fromStorageId}
                  onChange={handleStorageChange}
                  label="From Storage"
                >
                  {storages.map((storage) => (
                    <MenuItem key={storage._id} value={storage._id}>
                      {storage.name} ({storage.type})
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.fromStorageId}</FormHelperText>
              </FormControl>
            </Grid>
            {selectedStorage && (
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth error={Boolean(errors.lotId)}>
                  <InputLabel>Lot Number</InputLabel>
                  <Select
                    name="lotId"
                    value={formData.lotId}
                    onChange={handleInputChange}
                    label="Lot Number"
                  >
                    {lots.map((lot) => (
                      <MenuItem key={lot._id} value={lot._id}>
                        {lot.lotNumber} (Available: {lot.quantity}kg)
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.lotId}</FormHelperText>
                </FormControl>
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth error={Boolean(errors.toStorageId)}>
                <InputLabel>To Storage</InputLabel>
                <Select
                  name="toStorageId"
                  value={formData.toStorageId}
                  onChange={handleInputChange}
                  label="To Storage"
                  disabled={isToStorageDisabled}
                >
                  {unitStorages.map((storage) => (
                    <MenuItem key={storage._id} value={storage._id}>
                      {storage.name} ({storage.type})
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {errors.toStorageId ||
                    (isToStorageDisabled ? "Please select a lot first" : "")}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth error={Boolean(errors.tamarindType)}>
                <InputLabel>Tamarind Type</InputLabel>
                <Select
                  name="tamarindType"
                  value={formData.tamarindType}
                  onChange={handleInputChange}
                  label="Tamarind Type"
                >
                  <MenuItem value="Whole">Whole</MenuItem>
                  <MenuItem value="Raw Pod">Raw Pod</MenuItem>
                  <MenuItem value="Paste">Paste</MenuItem>
                </Select>
                <FormHelperText>{errors.tamarindType}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                name="quantity"
                label={`Quantity (kg)${
                  selectedLot
                    ? ` - Max: ${selectedLot.quantity}kg`
                    : fromUnitMaxQuantity !== null
                    ? ` - Max: ${fromUnitMaxQuantity}kg`
                    : ""
                }`}
                value={formData.quantity}
                onChange={handleInputChange}
                error={Boolean(errors.quantity)}
                helperText={errors.quantity}
                inputProps={{
                  max: selectedLot
                    ? selectedLot.quantity
                    : fromUnitMaxQuantity !== null
                    ? fromUnitMaxQuantity
                    : undefined,
                  step: "0.01",
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="remarks"
                label="Remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                error={Boolean(errors.remarks)}
                helperText={errors.remarks}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {initialValues ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransferFormModal;
