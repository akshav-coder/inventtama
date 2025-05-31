import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  useAddSupplierMutation,
  useDeleteSupplierMutation,
  useGetSuppliersQuery,
  useUpdateSupplierMutation,
} from "../services/suppliersApi";

const SupplierPage = () => {
  const { data, isLoading } = useGetSuppliersQuery();
  const [addSupplier] = useAddSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const [formData, setFormData] = useState({ name: "", contactNumber: "" });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async () => {
    if (!formData.name || !formData.contactNumber) return;
    if (editingId) {
      await updateSupplier({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      await addSupplier(formData);
    }
    setFormData({ name: "", contactNumber: "" });
  };

  const handleEdit = (supplier) => {
    setEditingId(supplier._id);
    setFormData({ name: supplier.name, contactNumber: supplier.contactNumber });
  };

  const handleDelete = async (id) => {
    await deleteSupplier(id);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Supplier Management
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Number"
              value={formData.contactNumber}
              onChange={(e) =>
                setFormData({ ...formData, contactNumber: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSubmit}>
              {editingId ? "Update" : "Add"} Supplier
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box>
          {data?.map((supplier) => (
            <Paper key={supplier._id} sx={{ p: 2, mb: 1 }}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography>
                    {supplier.name} - {supplier.contactNumber}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => handleEdit(supplier)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(supplier._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SupplierPage;
