// src/pages/StorageAndLotPage.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import {
  useCreateStorageMutation,
  useGetStoragesQuery,
} from "../services/storageApi";
import { useCreateLotMutation, useGetLotsQuery } from "../services/lotapi";

const StorageAndLotPage = () => {
  const [type, setType] = useState("cold");
  const [newStorage, setNewStorage] = useState({ name: "", type: "cold" });
  const [selectedStorageId, setSelectedStorageId] = useState("");
  const [newLot, setNewLot] = useState({
    lotNumber: "",
    tamarindType: "",
    quantity: "",
    coldStorageId: "",
  });

  const { data: storages } = useGetStoragesQuery(type);
  const { data: lots } = useGetLotsQuery(selectedStorageId, {
    skip: !selectedStorageId,
  });

  const [createStorage] = useCreateStorageMutation();
  const [createLot] = useCreateLotMutation();

  const handleAddStorage = async () => {
    if (newStorage.name && newStorage.type) {
      await createStorage(newStorage);
      setNewStorage({ name: "", type });
    }
  };

  const handleAddLot = async () => {
    if (
      newLot.lotNumber &&
      newLot.tamarindType &&
      newLot.quantity &&
      selectedStorageId
    ) {
      await createLot({ ...newLot, coldStorageId: selectedStorageId });
      setNewLot({
        lotNumber: "",
        tamarindType: "",
        quantity: "",
        coldStorageId: "",
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Storage and Lot Management
      </Typography>

      {/* Create Storage */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Add Storage</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Name"
              value={newStorage.name}
              onChange={(e) =>
                setNewStorage({ ...newStorage, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              select
              fullWidth
              label="Type"
              value={newStorage.type}
              onChange={(e) =>
                setNewStorage({ ...newStorage, type: e.target.value })
              }
            >
              <MenuItem value="cold">Cold Storage</MenuItem>
              <MenuItem value="unit">Unit</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" onClick={handleAddStorage}>
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Select Cold Storage */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">
          Select Cold Storage to View/Add Lots
        </Typography>
        <TextField
          select
          fullWidth
          label="Cold Storage"
          value={selectedStorageId}
          onChange={(e) => setSelectedStorageId(e.target.value)}
        >
          {storages?.map((s) => (
            <MenuItem key={s._id} value={s._id}>
              {s.name}
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {/* Add Lot */}
      {selectedStorageId && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">Add New Lot</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Lot Number"
                value={newLot.lotNumber}
                onChange={(e) =>
                  setNewLot({ ...newLot, lotNumber: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Tamarind Type"
                value={newLot.tamarindType}
                onChange={(e) =>
                  setNewLot({ ...newLot, tamarindType: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Quantity (kg)"
                type="number"
                value={newLot.quantity}
                onChange={(e) =>
                  setNewLot({ ...newLot, quantity: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleAddLot}>
                Create Lot
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Lot List */}
      {lots?.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Lots in Selected Cold Storage</Typography>
          {lots.map((lot) => (
            <Box key={lot._id} sx={{ mt: 1 }}>
              <Divider />
              <Typography>
                {lot.lotNumber} — {lot.tamarindType} — {lot.quantity}kg
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default StorageAndLotPage;
