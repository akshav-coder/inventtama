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
  Typography,
  Box,
} from "@mui/material";
import { RemoveCircle, AddCircle } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useGetCustomersQuery } from "../../services/customersApi";

const defaultItem = { pasteType: "", quantity: "", rate: "" };

const pasteTypes = [
  { value: "puli_1kg", label: "Puli 1kg" },
  { value: "puli_3kg", label: "Puli 3kg" },
  { value: "puli_5kg", label: "Puli 5kg" },
];

const SalesFormModal = ({ open, onClose, onSubmit, initialValues }) => {
  const { data: customers = [] } = useGetCustomersQuery();

  const [formData, setFormData] = useState({
    invoiceDate: "",
    customer: "",
    paymentType: "cash",
    dueDate: "",
    notes: "",
    items: [JSON.parse(JSON.stringify(defaultItem))],
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData({
        invoiceDate: initialValues.invoiceDate || "",
        customer: initialValues.customer || "",
        paymentType: initialValues.paymentType || "cash",
        dueDate: initialValues.dueDate || "",
        notes: initialValues.notes || "",
        items: initialValues.items || [JSON.parse(JSON.stringify(defaultItem))],
      });
    } else {
      setFormData({
        invoiceDate: "",
        customer: "",
        paymentType: "cash",
        dueDate: "",
        notes: "",
        items: [JSON.parse(JSON.stringify(defaultItem))],
      });
    }
    setErrors({});
  }, [initialValues, open]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));

    // Clear item error when user starts typing
    if (errors.items?.[index]?.[field]) {
      setErrors((prev) => ({
        ...prev,
        items:
          prev.items?.map((item, i) =>
            i === index ? { ...item, [field]: "" } : item
          ) || [],
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.invoiceDate) {
      newErrors.invoiceDate = "Date is required";
    }
    if (!formData.customer) {
      newErrors.customer = "Customer is required";
    }
    if (!formData.paymentType) {
      newErrors.paymentType = "Payment type is required";
    }
    if (formData.paymentType === "credit" && !formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    // Validate items
    const itemErrors = [];
    let hasValidItem = false;

    formData.items.forEach((item, index) => {
      const itemError = {};
      if (!item.pasteType) {
        itemError.pasteType = "Paste type is required";
      }
      if (!item.quantity || parseFloat(item.quantity) <= 0) {
        itemError.quantity = "Quantity must be greater than 0";
      }
      if (!item.rate || parseFloat(item.rate) <= 0) {
        itemError.rate = "Rate must be greater than 0";
      }

      if (Object.keys(itemError).length === 0) {
        hasValidItem = true;
      }
      itemErrors.push(itemError);
    });

    if (!hasValidItem) {
      newErrors.items = itemErrors;
      newErrors.general = "At least one valid item is required";
    } else if (itemErrors.some((error) => Object.keys(error).length > 0)) {
      newErrors.items = itemErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const items = formData.items.map((it) => ({
        ...it,
        total: parseFloat(it.quantity) * parseFloat(it.rate),
      }));

      // Calculate total amount
      const totalAmount = items.reduce(
        (sum, item) => sum + (item.total || 0),
        0
      );

      onSubmit({ ...formData, items, totalAmount });
      onClose();
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, JSON.parse(JSON.stringify(defaultItem))],
    }));
  };

  const removeItem = (idx) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== idx);
      setFormData((prev) => ({
        ...prev,
        items: newItems,
      }));
    }
  };

  // Calculate total amount
  const totalAmount = formData.items.reduce((sum, item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    return sum + quantity * rate;
  }, 0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Sale</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Header Fields */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="invoiceDate"
                label="Date"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) =>
                  handleInputChange("invoiceDate", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.invoiceDate)}
                helperText={errors.invoiceDate}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                name="customer"
                label="Customer"
                value={formData.customer}
                onChange={(e) => handleInputChange("customer", e.target.value)}
                error={Boolean(errors.customer)}
                helperText={errors.customer}
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                name="paymentType"
                label="Payment Type"
                value={formData.paymentType}
                onChange={(e) =>
                  handleInputChange("paymentType", e.target.value)
                }
                error={Boolean(errors.paymentType)}
                helperText={errors.paymentType}
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="credit">Credit</MenuItem>
              </TextField>
            </Grid>
            {formData.paymentType === "credit" && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="dueDate"
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.dueDate)}
                  helperText={errors.dueDate}
                />
              </Grid>
            )}

            {/* Total Amount Display */}
            <Grid size={12}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "grey.300",
                }}
              >
                <Typography variant="h6" color="primary">
                  Total Amount: ₹{totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Grid>

            {/* Items Section */}
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>
                Items
              </Typography>
              {errors.general && (
                <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                  {errors.general}
                </Typography>
              )}
              {formData.items.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: "1px solid",
                    borderColor: "grey.300",
                    borderRadius: 1,
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        select
                        fullWidth
                        label="Paste Type"
                        name={`items[${idx}].pasteType`}
                        value={item.pasteType}
                        onChange={(e) =>
                          handleItemChange(idx, "pasteType", e.target.value)
                        }
                        error={Boolean(errors.items?.[idx]?.pasteType)}
                        helperText={errors.items?.[idx]?.pasteType}
                      >
                        {pasteTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        name={`items[${idx}].quantity`}
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(idx, "quantity", e.target.value)
                        }
                        error={Boolean(errors.items?.[idx]?.quantity)}
                        helperText={errors.items?.[idx]?.quantity}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Rate"
                        name={`items[${idx}].rate`}
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(idx, "rate", e.target.value)
                        }
                        error={Boolean(errors.items?.[idx]?.rate)}
                        helperText={errors.items?.[idx]?.rate}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        ₹
                        {(
                          (parseFloat(item.quantity) || 0) *
                          (parseFloat(item.rate) || 0)
                        ).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 1 }}>
                      <IconButton
                        color="error"
                        onClick={() => removeItem(idx)}
                        disabled={formData.items.length === 1}
                      >
                        <RemoveCircle />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddCircle />}
                onClick={addItem}
                sx={{ mt: 1 }}
              >
                Add Item
              </Button>
            </Grid>

            {/* Notes Section */}
            <Grid size={12}>
              <TextField
                fullWidth
                name="notes"
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialValues ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SalesFormModal;
