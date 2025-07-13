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
  Avatar,
  Chip,
  Tooltip,
  Fade,
  Skeleton,
  Badge,
  alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CloseIcon from "@mui/icons-material/Close";
import StorageIcon from "@mui/icons-material/Storage";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import {
  useCreateStorageMutation,
  useGetStoragesQuery,
} from "../services/storageApi";
import { useCreateLotMutation, useGetLotsQuery } from "../services/lotapi";
import { useSnackbar } from "../components/common/SnackbarProvider";

const StorageAndLotPage = () => {
  const [type, setType] = useState("cold");
  const [newStorage, setNewStorage] = useState({ name: "", type: "cold" });
  const [addStorageOpen, setAddStorageOpen] = useState(false);
  const [lotDialogOpen, setLotDialogOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [newLot, setNewLot] = useState({
    lotNumber: "",
    tamarindType: "",
    quantity: 0,
    coldStorageId: "",
  });

  const { data: storages = [], isLoading } = useGetStoragesQuery(type, {
    refetchOnMountOrArgChange: true,
  });
  const [createStorage] = useCreateStorageMutation();
  const [createLot] = useCreateLotMutation();
  const { data: allLots = [] } = useGetLotsQuery("", {
    skip: false,
    refetchOnMountOrArgChange: true,
  });
  const { data: lots = [] } = useGetLotsQuery(selectedStorage?._id, {
    skip: !selectedStorage,
  });
  const showSnackbar = useSnackbar();

  const handleAddStorage = async () => {
    if (newStorage.name && newStorage.type) {
      try {
        await createStorage(newStorage).unwrap();
        showSnackbar("Storage created successfully", "success");
        setNewStorage({ name: "", type: "cold" });
        setAddStorageOpen(false);
      } catch (error) {
        showSnackbar("Error creating storage", "error");
      }
    }
  };

  const handleOpenLotDialog = (storage) => {
    setSelectedStorage(storage);
    setLotDialogOpen(true);
    setNewLot({
      lotNumber: "",
      tamarindType: "",
      quantity: 0,
      coldStorageId: storage._id,
    });
  };

  const handleAddLot = async () => {
    if (
      newLot.lotNumber &&
      newLot.tamarindType &&
      newLot.quantity > 0 &&
      selectedStorage
    ) {
      try {
        await createLot({
          ...newLot,
          coldStorageId: selectedStorage._id,
        }).unwrap();
        showSnackbar("Lot created successfully", "success");
        setNewLot({
          lotNumber: "",
          tamarindType: "",
          quantity: 0,
          coldStorageId: selectedStorage._id,
        });
      } catch (error) {
        showSnackbar("Error creating lot", "error");
      }
    }
  };

  const getStorageIcon = (storageType) => {
    return storageType === "cold" ? <AcUnitIcon /> : <BusinessIcon />;
  };

  const getStorageColor = (storageType) => {
    return storageType === "cold" ? "primary" : "secondary";
  };

  const getTotalQuantity = (storage) => {
    if (storage.type === "unit") return storage.quantity || 0;
    console.log(allLots);
    return allLots
      .filter((lot) => lot.coldStorageId._id === storage._id)
      .reduce((sum, lot) => sum + (lot.quantity || 0), 0);
  };

  // Calculate summary statistics
  const totalStorages = storages?.length || 0;
  const totalQuantity =
    storages?.reduce((sum, storage) => sum + getTotalQuantity(storage), 0) || 0;
  const coldStorages = storages?.filter((s) => s.type === "cold").length || 0;
  const unitStorages = storages?.filter((s) => s.type === "unit").length || 0;

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header Section */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Storage & Lot Management
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                }}
              >
                Manage cold storages, units, and tamarind lots
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddStorageOpen(true)}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                  transform: "translateY(-2px)",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            >
              Add Storage
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#667eea" }}
                  >
                    {totalStorages}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Storages
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: alpha("#667eea", 0.1),
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <StorageIcon sx={{ color: "#667eea", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#4caf50" }}
                  >
                    {totalQuantity.toFixed(1)} kg
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Quantity
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: alpha("#4caf50", 0.1),
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <InventoryIcon sx={{ color: "#4caf50", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#2196f3" }}
                  >
                    {coldStorages}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Cold Storages
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: alpha("#2196f3", 0.1),
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AcUnitIcon sx={{ color: "#2196f3", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#ff9800" }}
                  >
                    {unitStorages}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Unit Storages
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: alpha("#ff9800", 0.1),
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BusinessIcon sx={{ color: "#ff9800", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Storage Type Selector */}
      <Card
        elevation={2}
        sx={{
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <StorageIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Storage Type
            </Typography>
          </Box>
          <RadioGroup
            row
            value={type}
            onChange={(e) => setType(e.target.value)}
            name="storage-type-main-radio"
          >
            <FormControlLabel
              value="cold"
              control={<Radio color="primary" />}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <AcUnitIcon fontSize="small" color="primary" />
                  <Typography>Cold Storage</Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="unit"
              control={<Radio color="secondary" />}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <BusinessIcon fontSize="small" color="secondary" />
                  <Typography>Unit</Typography>
                </Box>
              }
            />
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Storages Grid */}
      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Card
                elevation={2}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent>
                  <Skeleton variant="rectangular" height={120} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : storages.length === 0 ? (
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent sx={{ p: 6, textAlign: "center" }}>
            <Alert severity="info" sx={{ fontSize: "1.1rem" }}>
              No {type === "cold" ? "cold storages" : "units"} found. Please add
              a storage first.
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {storages.map((storage) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={storage._id}>
              <Fade in timeout={300}>
                <Card
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    transition: "all 0.3s ease",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar
                        sx={{
                          bgcolor: `${getStorageColor(storage.type)}.main`,
                          width: 48,
                          height: 48,
                        }}
                      >
                        {getStorageIcon(storage.type)}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight={600} noWrap>
                          {storage.name}
                        </Typography>
                        <Chip
                          label={
                            storage.type === "cold" ? "Cold Storage" : "Unit"
                          }
                          color={getStorageColor(storage.type)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={3}>
                      <InventoryIcon fontSize="small" color="action" />
                      <Typography variant="body1" fontWeight={500}>
                        Quantity: {getTotalQuantity(storage)} kg
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Chip
                        label="Active"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                      {storage.type === "cold" && (
                        <Tooltip title="View/Add Lots">
                          <Button
                            variant="outlined"
                            startIcon={<ListAltIcon />}
                            onClick={() => handleOpenLotDialog(storage)}
                            size="small"
                            color="primary"
                            sx={{ borderRadius: 2 }}
                          >
                            Manage Lots
                          </Button>
                        </Tooltip>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Storage Dialog */}
      <Dialog
        open={addStorageOpen}
        onClose={() => setAddStorageOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Add New Storage
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setAddStorageOpen(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Storage Name"
                placeholder="Eg. Cold Storage 1"
                value={newStorage.name}
                onChange={(e) =>
                  setNewStorage({ ...newStorage, name: e.target.value })
                }
                helperText="Enter a unique storage name"
                InputProps={{
                  startAdornment: (
                    <StorageIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                select
                fullWidth
                label="Type"
                value={newStorage.type}
                onChange={(e) =>
                  setNewStorage({ ...newStorage, type: e.target.value })
                }
                helperText="Choose storage type"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem value="cold">
                  <Box display="flex" alignItems="center" gap={1}>
                    <AcUnitIcon fontSize="small" color="primary" />
                    Cold Storage
                  </Box>
                </MenuItem>
                <MenuItem value="unit">
                  <Box display="flex" alignItems="center" gap={1}>
                    <BusinessIcon fontSize="small" color="secondary" />
                    Unit
                  </Box>
                </MenuItem>
              </TextField>
            </Grid>
            {newStorage.type === "unit" && (
              <Grid size={12}>
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
                  InputProps={{
                    startAdornment: (
                      <InventoryIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => setAddStorageOpen(false)}
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddStorage}
            variant="contained"
            color="primary"
            sx={{ px: 3, borderRadius: 2 }}
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
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Lots in {selectedStorage?.name}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setLotDialogOpen(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {/* Add New Lot Section */}
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardHeader
              title="Add New Lot"
              titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
              sx={{ pb: 1 }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Lot Number"
                    placeholder="Eg. LOT-001"
                    value={newLot.lotNumber}
                    onChange={(e) =>
                      setNewLot({ ...newLot, lotNumber: e.target.value })
                    }
                    helperText="Enter the lot number"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Tamarind Type"
                    placeholder="Eg. Sweet, Sour"
                    value={newLot.tamarindType}
                    onChange={(e) =>
                      setNewLot({ ...newLot, tamarindType: e.target.value })
                    }
                    helperText="Type of tamarind in this lot"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Quantity (kg)"
                    type="number"
                    placeholder="Eg. 1000"
                    value={newLot.quantity}
                    onChange={(e) =>
                      setNewLot({
                        ...newLot,
                        quantity: Number(e.target.value) || 0,
                      })
                    }
                    helperText="Enter quantity in kilograms"
                    inputProps={{ min: 0 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleAddLot}
                    startIcon={<AddIcon />}
                    sx={{
                      mt: 1,
                      width: { xs: "100%", sm: "auto" },
                      borderRadius: 2,
                    }}
                  >
                    Create Lot
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Lots List Section */}
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardHeader
              title="Lots List"
              titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
              action={
                <Badge badgeContent={lots.length} color="primary">
                  <InventoryIcon color="action" />
                </Badge>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              {lots.length > 0 ? (
                <TableContainer
                  component={Paper}
                  sx={{ borderRadius: 2, overflow: "hidden" }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: alpha("#667eea", 0.05) }}
                      >
                        <TableCell
                          sx={{ color: "primary.main", fontWeight: 600 }}
                        >
                          Lot Number
                        </TableCell>
                        <TableCell
                          sx={{ color: "primary.main", fontWeight: 600 }}
                        >
                          Tamarind Type
                        </TableCell>
                        <TableCell
                          sx={{ color: "primary.main", fontWeight: 600 }}
                        >
                          Quantity (kg)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lots.map((lot) => (
                        <TableRow
                          key={lot._id}
                          sx={{
                            "&:nth-of-type(odd)": {
                              bgcolor: alpha("#f8fafc", 0.5),
                            },
                            "&:hover": { bgcolor: alpha("#667eea", 0.02) },
                            transition: "background-color 0.2s ease",
                          }}
                        >
                          <TableCell>
                            <Chip
                              label={lot.lotNumber}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ borderRadius: 1 }}
                            />
                          </TableCell>
                          <TableCell>{lot.tamarindType}</TableCell>
                          <TableCell>
                            <Typography fontWeight={600} color="success.main">
                              {lot.quantity} kg
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  No lots found for this storage. Add a new lot above.
                </Alert>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StorageAndLotPage;
