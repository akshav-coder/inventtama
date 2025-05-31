// src/pages/CustomerPage.jsx
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
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  useAddCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomersQuery,
  useUpdateCustomerMutation,
} from "../services/customersApi";

const customerTypes = ["retailer", "wholesaler", "end_user", "business"];

const CustomerPage = () => {
  const { data, isLoading } = useGetCustomersQuery();
  const [addCustomer] = useAddCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const [formData, setFormData] = useState({ name: "", mobile: "", type: "" });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async () => {
    if (!formData.name || !formData.mobile || !formData.type) return;
    if (editingId) {
      await updateCustomer({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      await addCustomer(formData);
    }
    setFormData({ name: "", mobile: "", type: "" });
  };

  const handleEdit = (customer) => {
    setEditingId(customer._id);
    setFormData({
      name: customer.name,
      mobile: customer.mobile,
      type: customer.type,
    });
  };

  const handleDelete = async (id) => {
    await deleteCustomer(id);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Customer Management
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Mobile"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              {customerTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSubmit}>
              {editingId ? "Update" : "Add"} Customer
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box>
          {data?.map((customer) => (
            <Paper key={customer._id} sx={{ p: 2, mb: 1 }}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography>
                    {customer.name} ({customer.type}) - {customer.mobile}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => handleEdit(customer)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(customer._id)}>
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

export default CustomerPage;
