import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useSnackbar } from "../components/common/SnackbarProvider";
import { useAddSupplierMutation } from "../services/suppliersApi";

const AdminControl = () => {
  const [supplierName, setSupplierName] = useState("");
  const [addSupplier] = useAddSupplierMutation();
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Control
      </Typography>
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
    </Box>
  );
};

export default AdminControl;
