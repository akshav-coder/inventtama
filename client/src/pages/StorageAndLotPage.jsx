// src/pages/StorageAndLotPage.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CloseIcon from "@mui/icons-material/Close";
import {
  useCreateStorageMutation,
  useGetStoragesQuery,
} from "../services/storageApi";
import { useCreateLotMutation, useGetLotsQuery } from "../services/lotapi";

const StorageAndLotPage = () => {
  const [type, setType] = useState("cold");
  const [newStorage, setNewStorage] = useState({ name: "", type: "cold" });
  const [addStorageOpen, setAddStorageOpen] = useState(false);
  const [lotDialogOpen, setLotDialogOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [newLot, setNewLot] = useState({
    lotNumber: "",
    tamarindType: "",
    quantity: "",
    coldStorageId: "",
  });

  const { data: storages = [] } = useGetStoragesQuery(type);
  const [createStorage] = useCreateStorageMutation();
  const [createLot] = useCreateLotMutation();
  const { data: lots = [] } = useGetLotsQuery(selectedStorage?._id, {
    skip: !selectedStorage,
  });

  const handleAddStorage = async () => {
    if (newStorage.name && newStorage.type) {
      await createStorage(newStorage);
      setNewStorage({ name: "", type: "cold" });
      setAddStorageOpen(false);
    }
  };

  const handleOpenLotDialog = (storage) => {
    setSelectedStorage(storage);
    setLotDialogOpen(true);
    setNewLot({
      lotNumber: "",
      tamarindType: "",
      quantity: "",
      coldStorageId: storage._id,
    });
  };

  const handleAddLot = async () => {
    if (
      newLot.lotNumber &&
      newLot.tamarindType &&
      newLot.quantity &&
      selectedStorage
    ) {
      await createLot({ ...newLot, coldStorageId: selectedStorage._id });
      setNewLot({
        lotNumber: "",
        tamarindType: "",
        quantity: "",
        coldStorageId: selectedStorage._id,
      });
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} gutterBottom align="center">
        Storage & Lot Management
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {/* Storage Type Selector */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mr: 2 }}>
          Storage Type:
        </Typography>
        <RadioGroup
          row
          value={type}
          onChange={(e) => setType(e.target.value)}
          name="storage-type-main-radio"
        >
          <FormControlLabel
            value="cold"
            control={<Radio />}
            label="Cold Storage"
          />
          <FormControlLabel value="unit" control={<Radio />} label="Unit" />
        </RadioGroup>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddStorageOpen(true)}
        >
          Add Storage
        </Button>
      </Box>
      <Card sx={{ boxShadow: 3 }}>
        <CardHeader title="Storages" sx={{ bgcolor: "#f5f5f5", pb: 0 }} />
        <CardContent>
          {storages.length === 0 ? (
            <Alert severity="info">
              No storages found. Please add a storage first.
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="center">Lots</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {storages.map((storage) => (
                    <TableRow key={storage._id}>
                      <TableCell>{storage.name}</TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {storage.type}
                      </TableCell>
                      <TableCell align="center">
                        {storage.type === "cold" ? (
                          <Button
                            variant="outlined"
                            startIcon={<ListAltIcon />}
                            onClick={() => handleOpenLotDialog(storage)}
                          >
                            View/Add Lots
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {storage.type === "unit" ? storage.quantity || 0 : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add Storage Dialog */}
      <Dialog
        open={addStorageOpen}
        onClose={() => setAddStorageOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Add New Storage
          <IconButton
            aria-label="close"
            onClick={() => setAddStorageOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Storage Name"
                placeholder="Eg. Cold Storage 1"
                value={newStorage.name}
                onChange={(e) =>
                  setNewStorage({ ...newStorage, name: e.target.value })
                }
                helperText="Enter a unique storage name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Type"
                value={newStorage.type}
                onChange={(e) =>
                  setNewStorage({ ...newStorage, type: e.target.value })
                }
                helperText="Choose storage type"
              >
                <MenuItem value="cold">Cold Storage</MenuItem>
                <MenuItem value="unit">Unit</MenuItem>
              </TextField>
            </Grid>
            {newStorage.type === "unit" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quantity (kg)"
                  type="number"
                  value={newStorage.quantity || 0}
                  onChange={(e) =>
                    setNewStorage({
                      ...newStorage,
                      quantity: Number(e.target.value),
                    })
                  }
                  helperText="Enter quantity for this unit storage"
                  inputProps={{ min: 0 }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddStorageOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddStorage}
            variant="contained"
            color="primary"
          >
            Add Storage
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lots Dialog */}
      <Dialog
        open={lotDialogOpen}
        onClose={() => setLotDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Lots in {selectedStorage?.name}
          <IconButton
            aria-label="close"
            onClick={() => setLotDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Add New Lot
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Lot Number"
                placeholder="Eg. LOT-001"
                value={newLot.lotNumber}
                onChange={(e) =>
                  setNewLot({ ...newLot, lotNumber: e.target.value })
                }
                helperText="Enter the lot number"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Tamarind Type"
                placeholder="Eg. Sweet, Sour"
                value={newLot.tamarindType}
                onChange={(e) =>
                  setNewLot({ ...newLot, tamarindType: e.target.value })
                }
                helperText="Type of tamarind in this lot"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Quantity (kg)"
                type="number"
                placeholder="Eg. 1000"
                value={newLot.quantity}
                onChange={(e) =>
                  setNewLot({ ...newLot, quantity: e.target.value })
                }
                helperText="Enter quantity in kilograms"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleAddLot}
                sx={{ mt: 1, width: { xs: "100%", sm: "auto" } }}
              >
                Create Lot
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Lots List
          </Typography>
          {lots.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Lot Number</TableCell>
                    <TableCell>Tamarind Type</TableCell>
                    <TableCell>Quantity (kg)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lots.map((lot) => (
                    <TableRow key={lot._id}>
                      <TableCell>{lot.lotNumber}</TableCell>
                      <TableCell>{lot.tamarindType}</TableCell>
                      <TableCell>{lot.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">No lots found for this storage.</Alert>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StorageAndLotPage;
