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
  Typography,
  Divider,
} from "@mui/material";
import { RemoveCircle } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetSuppliersQuery } from "../../services/suppliersApi";
import { useSnackbar } from "../common/SnackbarProvider";
import { useState, useEffect } from "react";
import { useGetLotsQuery, useCreateLotMutation } from "../../services/lotapi";
import { Dialog as MuiDialog } from "@mui/material";
import { useGetStoragesQuery } from "../../services/storageApi";

const allocationSchema = Yup.object({
  storageId: Yup.string().required("Facility is required"),
  quantity: Yup.number().moreThan(0).required("Weight is required"),
  materialType: Yup.string().required("Material type is required"),
  lot_number: Yup.string().nullable(),
});

const tamarindItemSchema = Yup.object({
  type: Yup.string().required("Tamarind Type is required"),
  quantity: Yup.number().moreThan(0).required("Quantity is required"),
  rate: Yup.number().moreThan(0).required("Rate is required"),
  pricePerKg: Yup.number().moreThan(0).required("Price per Kg is required"),
  allocation: Yup.array()
    .of(allocationSchema)
    .min(1, "At least one allocation is required"),
  notes: Yup.string(),
});

const validationSchema = Yup.object({
  purchaseDate: Yup.string().required("Date is required"),
  invoiceNumber: Yup.string().required("Invoice No is required"),
  supplierId: Yup.string().required("Supplier is required"),
  paymentType: Yup.string().required("Payment type is required"),
  remarks: Yup.string(),
  tamarindItems: Yup.array()
    .of(tamarindItemSchema)
    .min(1, "At least one tamarind item is required"),
});

const defaultTamarindItem = {
  type: "",
  quantity: "",
  rate: "",
  pricePerKg: "",
  allocation: [
    {
      storageId: "",
      quantity: "",
      materialType: "puli_type_1",
      lot_number: "",
    },
  ],
  notes: "",
};

const PurchaseFormModal = ({ open, onClose, onSubmit, initialValues }) => {
  const { data: suppliers = [] } = useGetSuppliersQuery();
  const { data: facilities = [] } = useGetStoragesQuery("");
  const showSnackbar = useSnackbar();
  const [selectedFacilityType, setSelectedFacilityType] = useState({});
  const [lotDialogOpen, setLotDialogOpen] = useState(false);
  const [lotFacilityId, setLotFacilityId] = useState("");
  const [newLot, setNewLot] = useState({
    lotNumber: "",
    tamarindType: "",
    quantity: "",
    coldStorageId: "",
  });
  const [createLot] = useCreateLotMutation();
  const [lotsFacilityId, setLotsFacilityId] = useState("");
  const { data: lots = [] } = useGetLotsQuery(lotsFacilityId, {
    skip: !lotsFacilityId,
  });

  const defaultFormValues = {
    purchaseDate: "",
    invoiceNumber: "",
    supplierId: "",
    paymentType: "credit",
    remarks: "",
    tamarindItems: [JSON.parse(JSON.stringify(defaultTamarindItem))],
  };

  // Transform initial values to match form structure
  const transformInitialValues = (values) => {
    if (!values) return defaultFormValues;

    return {
      ...values,
      supplierId: values.supplierId?._id || values.supplierId,
      tamarindItems: values.tamarindItems.map((item) => ({
        ...item,
        allocation: item.allocation.map((alloc) => ({
          ...alloc,
          storageId: alloc.storageId?._id || alloc.storageId,
          lot_number: alloc.lotId?.lotNumber || "",
          materialType: alloc.materialType || "puli_type_1", // Default material type if not set
        })),
      })),
    };
  };

  // Reset form when modal is opened for a new purchase
  useEffect(() => {
    if (open) {
      formik.resetForm({ values: transformInitialValues(initialValues) });
    }
  }, [open, initialValues]);

  const formik = useFormik({
    initialValues: transformInitialValues(initialValues) || defaultFormValues,
    validationSchema,
    enableReinitialize: true,
    validateOnBlur: false,
    onSubmit: (values) => {
      // Validate allocations sum for each tamarind item
      for (const [idx, item] of values.tamarindItems.entries()) {
        const totalAlloc = item.allocation.reduce(
          (sum, a) => sum + (parseFloat(a.quantity) || 0),
          0
        );
        if (totalAlloc !== parseFloat(item.quantity)) {
          showSnackbar(
            `Total allocation for item #${idx + 1} must match its quantity.`,
            "error"
          );
          return;
        }
      }
      // Calculate totalAmount for each item
      const tamarindItems = values.tamarindItems.map((item) => ({
        ...item,
        totalAmount: parseFloat(item.quantity) * parseFloat(item.pricePerKg),
        allocation: item.allocation.map((a) => {
          const { lot_number, ...rest } = a;
          return lot_number ? { ...rest, lotNumber: lot_number } : rest;
        }),
      }));
      const payload = {
        ...values,
        tamarindItems,
      };
      onSubmit(payload);
      onClose();
    },
  });

  // Track facility type for each allocation
  useEffect(() => {
    const typeMap = {};
    formik.values.tamarindItems.forEach((item, idx) => {
      item.allocation.forEach((alloc, aIdx) => {
        const fac = facilities.find((f) => f._id === alloc.storageId);
        if (fac) typeMap[`${idx}-${aIdx}`] = fac.type;
      });
    });
    setSelectedFacilityType(typeMap);
  }, [formik.values.tamarindItems, facilities]);

  // Add effect to calculate rate when price per kg changes
  useEffect(() => {
    formik.values.tamarindItems.forEach((item, idx) => {
      if (item.pricePerKg) {
        const rate = parseFloat(item.pricePerKg) * 1000; // Convert to rate per ton
        formik.setFieldValue(`tamarindItems[${idx}].rate`, rate.toFixed(2));
      }
    });
  }, [formik.values.tamarindItems.map((item) => item.pricePerKg).join(",")]);

  const handleAddTamarindItem = () => {
    formik.setFieldValue("tamarindItems", [
      ...formik.values.tamarindItems,
      JSON.parse(JSON.stringify(defaultTamarindItem)),
    ]);
  };

  const handleRemoveTamarindItem = (idx) => {
    const arr = formik.values.tamarindItems.filter((_, i) => i !== idx);
    formik.setFieldValue("tamarindItems", arr);
  };

  const handleAddAllocation = (itemIdx) => {
    const arr = [...formik.values.tamarindItems];
    arr[itemIdx].allocation.push({
      storageId: "",
      quantity: "",
      materialType: "",
      lot_number: "",
    });
    formik.setFieldValue("tamarindItems", arr);
  };

  const handleRemoveAllocation = (itemIdx, allocIdx) => {
    const arr = [...formik.values.tamarindItems];
    arr[itemIdx].allocation = arr[itemIdx].allocation.filter(
      (_, i) => i !== allocIdx
    );
    formik.setFieldValue("tamarindItems", arr);
  };

  const handleLotDropdownOpen = (facilityId) => {
    setLotsFacilityId(facilityId);
  };

  const handleCreateLot = async () => {
    if (!newLot.lotNumber || !newLot.tamarindType || !newLot.quantity) return;
    try {
      const res = await createLot({ ...newLot, coldStorageId: lotFacilityId });
      if (res.data) {
        // Find the allocation that triggered this lot creation
        const itemIdx = formik.values.tamarindItems.findIndex((item) =>
          item.allocation.some((alloc) => alloc.storageId === lotFacilityId)
        );
        if (itemIdx !== -1) {
          const allocIdx = formik.values.tamarindItems[
            itemIdx
          ].allocation.findIndex((alloc) => alloc.storageId === lotFacilityId);
          if (allocIdx !== -1) {
            formik.setFieldValue(
              `tamarindItems[${itemIdx}].allocation[${allocIdx}].lot_number`,
              res.data.lotNumber
            );
          }
        }
      }
      setLotDialogOpen(false);
      setNewLot({
        lotNumber: "",
        tamarindType: "",
        quantity: "",
        coldStorageId: "",
      });
      setLotsFacilityId(lotFacilityId); // refetch lots
    } catch (error) {
      showSnackbar("Failed to create lot", "error");
    }
  };

  // Add effect to load lots when cold storage is selected
  useEffect(() => {
    formik.values.tamarindItems.forEach((item, idx) => {
      item.allocation.forEach((alloc, aIdx) => {
        const fac = facilities.find((f) => f._id === alloc.storageId);
        if (fac && fac.type === "cold") {
          handleLotDropdownOpen(alloc.storageId);
        }
      });
    });
  }, [formik.values.tamarindItems, facilities]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Purchase</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="purchaseDate"
                label="Date"
                type="date"
                value={formik.values.purchaseDate}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                error={Boolean(formik.errors.purchaseDate)}
                helperText={formik.errors.purchaseDate}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="invoiceNumber"
                label="Invoice No"
                value={formik.values.invoiceNumber}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.invoiceNumber)}
                helperText={formik.errors.invoiceNumber}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                name="supplierId"
                label="Supplier"
                value={formik.values.supplierId}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.supplierId)}
                helperText={formik.errors.supplierId}
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
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                name="remarks"
                label="Remarks"
                value={formik.values.remarks}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.remarks)}
                helperText={formik.errors.remarks}
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography fontWeight="bold">Tamarind Items</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleAddTamarindItem}
            >
              Add Item
            </Button>
          </Box>
          {formik.values.tamarindItems.map((item, idx) => (
            <Box
              key={idx}
              mb={3}
              p={2}
              border="1px solid #ccc"
              borderRadius={2}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight="bold">Item #{idx + 1}</Typography>
                {formik.values.tamarindItems.length > 1 && (
                  <IconButton onClick={() => handleRemoveTamarindItem(idx)}>
                    <RemoveCircle color="error" />
                  </IconButton>
                )}
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Tamarind Type"
                    name={`tamarindItems[${idx}].type`}
                    value={item.type}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.tamarindItems?.[idx]?.type)}
                    helperText={formik.errors.tamarindItems?.[idx]?.type}
                  >
                    {["Whole", "Raw Pod"].map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Quantity (Kg)"
                    name={`tamarindItems[${idx}].quantity`}
                    value={item.quantity}
                    onChange={formik.handleChange}
                    error={Boolean(
                      formik.errors.tamarindItems?.[idx]?.quantity
                    )}
                    helperText={formik.errors.tamarindItems?.[idx]?.quantity}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Rate"
                    name={`tamarindItems[${idx}].rate`}
                    value={item.rate}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.tamarindItems?.[idx]?.rate)}
                    helperText={formik.errors.tamarindItems?.[idx]?.rate}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Price per Kg"
                    name={`tamarindItems[${idx}].pricePerKg`}
                    value={item.pricePerKg}
                    onChange={formik.handleChange}
                    error={Boolean(
                      formik.errors.tamarindItems?.[idx]?.pricePerKg
                    )}
                    helperText={formik.errors.tamarindItems?.[idx]?.pricePerKg}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Notes"
                    name={`tamarindItems[${idx}].notes`}
                    value={item.notes}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.tamarindItems?.[idx]?.notes)}
                    helperText={formik.errors.tamarindItems?.[idx]?.notes}
                  />
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography fontWeight="bold">Allocations</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleAddAllocation(idx)}
                >
                  Add Allocation
                </Button>
              </Box>
              {item.allocation.map((alloc, aIdx) => {
                const fac = facilities.find((f) => f._id === alloc.storageId);
                const isCold = fac && fac.type === "cold";

                return (
                  <Grid
                    container
                    spacing={2}
                    key={aIdx}
                    alignItems="center"
                    mb={2}
                  >
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <TextField
                        select
                        fullWidth
                        label="Facility"
                        name={`tamarindItems[${idx}].allocation[${aIdx}].storageId`}
                        value={alloc.storageId}
                        onChange={(e) => {
                          formik.handleChange(e);
                          const facilityId = e.target.value;
                          const fac = facilities.find(
                            (f) => f._id === facilityId
                          );
                          if (fac && fac.type === "cold") {
                            handleLotDropdownOpen(facilityId);
                          }
                        }}
                      >
                        {facilities.map((f) => (
                          <MenuItem key={f._id} value={f._id}>
                            {f.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Weight (kg)"
                        name={`tamarindItems[${idx}].allocation[${aIdx}].quantity`}
                        value={alloc.quantity}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <TextField
                        select
                        fullWidth
                        label="Material Type"
                        name={`tamarindItems[${idx}].allocation[${aIdx}].materialType`}
                        value={alloc.materialType}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value="puli_type_1">Puli Type 1</MenuItem>
                        <MenuItem value="puli_type_2">Puli Type 2</MenuItem>
                      </TextField>
                    </Grid>
                    {/* Only show Lot dropdown if a cold storage is selected */}
                    {isCold && alloc.storageId ? (
                      <Grid size={{ xs: 12, sm: 2 }}>
                        <TextField
                          select
                          fullWidth
                          label="Lot Number"
                          name={`tamarindItems[${idx}].allocation[${aIdx}].lot_number`}
                          value={alloc.lot_number}
                          onChange={(e) => {
                            if (e.target.value === "__create_new__") {
                              setLotFacilityId(alloc.storageId);
                              setLotDialogOpen(true);
                            } else {
                              formik.handleChange(e);
                            }
                          }}
                          SelectProps={{
                            renderValue: (selected) => {
                              if (!selected) return "";
                              const lot = lots.find(
                                (l) => l.lotNumber === selected
                              );
                              return lot ? lot.lotNumber : selected;
                            },
                          }}
                        >
                          {lots.map((lot) => (
                            <MenuItem key={lot._id} value={lot.lotNumber}>
                              {lot.lotNumber}
                            </MenuItem>
                          ))}
                          <MenuItem value="__create_new__">
                            + Create New Lot
                          </MenuItem>
                        </TextField>
                      </Grid>
                    ) : null}
                    <Grid size={{ xs: 12, sm: 1 }}>
                      {item.allocation.length > 1 && (
                        <IconButton
                          onClick={() => handleRemoveAllocation(idx, aIdx)}
                        >
                          <RemoveCircle color="error" />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                );
              })}
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
      {/* Lot Creation Dialog */}
      <MuiDialog
        open={lotDialogOpen}
        onClose={() => setLotDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Create New Lot</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lot Number"
                value={newLot.lotNumber}
                onChange={(e) =>
                  setNewLot({ ...newLot, lotNumber: e.target.value })
                }
                helperText="Enter the lot number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tamarind Type"
                value={newLot.tamarindType}
                onChange={(e) =>
                  setNewLot({ ...newLot, tamarindType: e.target.value })
                }
                helperText="Type of tamarind in this lot"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantity (kg)"
                type="number"
                value={newLot.quantity}
                onChange={(e) =>
                  setNewLot({ ...newLot, quantity: e.target.value })
                }
                helperText="Enter quantity in kilograms"
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLotDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateLot} variant="contained" color="primary">
            Create Lot
          </Button>
        </DialogActions>
      </MuiDialog>
    </Dialog>
  );
};

export default PurchaseFormModal;
