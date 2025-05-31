import React, { useState } from "react";
import { TextField, Button, Typography, Box, Stack, Grid } from "@mui/material";
import { useSnackbar } from "../components/common/SnackbarProvider";
import { useAddSupplierMutation } from "../services/suppliersApi";
// import { useAddStorageOptionMutation } from "../services/storageApi";

const AdminControl = () => {
  const [supplierName, setSupplierName] = useState("");
  const [storageOption, setStorageOption] = useState("");
  const [addSupplier] = useAddSupplierMutation();
  // const [addStorageOption] = useAddStorageOptionMutation();
  const showSnackbar = useSnackbar();

  const handleAddSupplier = async () => {
    if (!supplierName.trim()) {
      showSnackbar("Supplier name cannot be empty.", "error");
      return;
    }
    try {
      await addSupplier({ name: supplierName }).unwrap();
      showSnackbar("Supplier added successfully!", "success");
      setSupplierName("");
    } catch (error) {
      showSnackbar(error.data?.message || "Error adding supplier.", "error");
    }
  };

  const handleAddStorageOption = async () => {
    if (!storageOption.trim()) {
      showSnackbar("Storage option cannot be empty.", "error");
      return;
    }
    try {
      // await addStorageOption({ option: storageOption }).unwrap();
      showSnackbar("Storage option added successfully!", "success");
      setStorageOption("");
    } catch (error) {
      showSnackbar(
        error.data?.message || "Error adding storage option.",
        "error"
      );
    }
  };

  return (
    <Box sx={{ p: 3, mx: "auto" }}>
      <Typography variant="h5" gutterBottom align="center">
        Admin Control
      </Typography>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={6}>
          <TextField
            label="Supplier Name"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleAddSupplier}>
            Add Supplier
          </Button>
        </Grid>
        <Grid size={6}>
          <TextField
            label="Storage Option"
            value={storageOption}
            onChange={(e) => setStorageOption(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleAddStorageOption}>
            Add Storage
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminControl;
