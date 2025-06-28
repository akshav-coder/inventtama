import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Divider,
  Alert,
  Skeleton,
  alpha,
} from "@mui/material";
import React, { useState, useMemo } from "react";
import {
  useGetPurchaseReportQuery,
  useGetSalesReportQuery,
  useGetTransferReportQuery,
  useGetProcessingReportQuery,
  useGetStockReportQuery,
  useGetPaymentsReportQuery,
} from "../services/reportsApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Assessment,
  FilterList,
  Download,
  Refresh,
  TrendingUp,
  Inventory,
  Payment,
  LocalShipping,
  Settings,
  ShoppingCart,
} from "@mui/icons-material";

const REPORT_OPTIONS = [
  {
    value: "purchases",
    label: "Purchases",
    icon: ShoppingCart,
    color: "#1976d2",
  },
  { value: "sales", label: "Sales", icon: TrendingUp, color: "#2e7d32" },
  {
    value: "transfers",
    label: "Transfers",
    icon: LocalShipping,
    color: "#ed6c02",
  },
  {
    value: "processing",
    label: "Processing",
    icon: Settings,
    color: "#9c27b0",
  },
  { value: "stock", label: "Stock", icon: Inventory, color: "#d32f2f" },
  { value: "payments", label: "Payments", icon: Payment, color: "#7b1fa2" },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const Reports = () => {
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [type, setType] = useState("purchases");

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.startDate && filters.endDate) {
      p.append("startDate", filters.startDate);
      p.append("endDate", filters.endDate);
    }
    return p.toString();
  }, [filters]);

  const purchaseQuery = useGetPurchaseReportQuery(params, {
    skip: type !== "purchases",
  });
  const salesQuery = useGetSalesReportQuery(params, {
    skip: type !== "sales",
  });
  const transferQuery = useGetTransferReportQuery(params, {
    skip: type !== "transfers",
  });
  const processingQuery = useGetProcessingReportQuery(params, {
    skip: type !== "processing",
  });
  const stockQuery = useGetStockReportQuery(params, {
    skip: type !== "stock",
  });
  const paymentsQuery = useGetPaymentsReportQuery(params, {
    skip: type !== "payments",
  });

  const data =
    purchaseQuery.data ||
    salesQuery.data ||
    transferQuery.data ||
    processingQuery.data ||
    stockQuery.data?.storages ||
    paymentsQuery.data ||
    [];

  const isLoading =
    purchaseQuery.isLoading ||
    salesQuery.isLoading ||
    transferQuery.isLoading ||
    processingQuery.isLoading ||
    stockQuery.isLoading ||
    paymentsQuery.isLoading;

  const getColumns = () => {
    switch (type) {
      case "sales":
        return [
          { label: "Customer", field: "customerName" },
          { label: "Quantity", field: "quantity" },
          { label: "Value", field: "value" },
          { label: "Outstanding", field: "outstanding" },
        ];
      case "transfers":
        return [
          { label: "From", field: "fromStorage" },
          { label: "To", field: "toStorage" },
          { label: "Type", field: "tamarindType" },
          { label: "Qty", field: "quantity" },
        ];
      case "processing":
        return [
          { label: "Unit", field: "unitName" },
          { label: "Input", field: "totalInput" },
          { label: "Output", field: "totalOutput" },
          { label: "Loss", field: "totalWeightLoss" },
          { label: "Efficiency", field: "efficiency" },
        ];
      case "stock":
        return [
          { label: "Storage", field: "storageName" },
          { label: "Type", field: "type" },
          { label: "Quantity", field: "quantity" },
        ];
      case "payments":
        return [
          { label: "Name", field: "supplierName" },
          { label: "Total", field: "totalPaid" },
          { label: "Count", field: "payments" },
          { label: "Outstanding", field: "outstanding" },
        ];
      default:
        return [
          { label: "Supplier", field: "supplierName" },
          { label: "Total Qty", field: "totalQuantity" },
          { label: "Total Amount", field: "totalAmount" },
          { label: "Outstanding", field: "outstanding" },
        ];
    }
  };

  const columns = getColumns();

  const chartData = Array.isArray(data)
    ? data.map((row) => ({
        name:
          row.supplierName ||
          row.customerName ||
          row.unitName ||
          row.fromStorage ||
          row.storageName ||
          "",
        value:
          row.totalAmount ||
          row.value ||
          row.quantity ||
          row.totalOutput ||
          row.totalPaid ||
          row.totalReceived ||
          0,
      }))
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getCurrentReportIcon = () => {
    const option = REPORT_OPTIONS.find((opt) => opt.value === type);
    return option ? option.icon : Assessment;
  };

  const getCurrentReportColor = () => {
    const option = REPORT_OPTIONS.find((opt) => opt.value === type);
    return option ? option.color : "#1976d2";
  };

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

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
                {type.charAt(0).toUpperCase() + type.slice(1)} Reports
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                }}
              >
                Comprehensive analysis and insights
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.3)",
                    transform: "translateY(-2px)",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.3)",
                    transform: "translateY(-2px)",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
              >
                Export
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Filters Card */}
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
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <FilterList sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
          </Box>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="report-type">Report Type</InputLabel>
                <Select
                  labelId="report-type"
                  label="Report Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                >
                  {REPORT_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {React.createElement(opt.icon, { fontSize: "small" })}
                        {opt.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "14px",
                  borderColor: "#e0e0e0",
                  outline: "none",
                  "&:focus": {
                    borderColor: "#667eea",
                    boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.2)",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "14px",
                  borderColor: "#e0e0e0",
                  outline: "none",
                  "&:focus": {
                    borderColor: "#667eea",
                    boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.2)",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <Box display="flex" gap={1}>
                <Tooltip title="Refresh Data">
                  <IconButton
                    color="primary"
                    sx={{
                      backgroundColor: alpha("#667eea", 0.1),
                      "&:hover": {
                        backgroundColor: alpha("#667eea", 0.2),
                      },
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export Report">
                  <IconButton
                    color="primary"
                    sx={{
                      backgroundColor: alpha("#667eea", 0.1),
                      "&:hover": {
                        backgroundColor: alpha("#667eea", 0.2),
                      },
                    }}
                  >
                    <Download />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
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
                    {data?.length || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Records
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
                  <Assessment sx={{ color: "#667eea", fontSize: 24 }} />
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
                    ₹{totalValue.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Total Value
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
                  <TrendingUp sx={{ color: "#4caf50", fontSize: 24 }} />
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
                    ₹{data?.length ? (totalValue / data.length).toFixed(0) : 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Average Value
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
                  <Assessment sx={{ color: "#ff9800", fontSize: 24 }} />
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
                  <Chip
                    label={isLoading ? "Loading..." : "Ready"}
                    color={isLoading ? "warning" : "success"}
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                      mt: 1,
                    }}
                  >
                    Status
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: alpha(
                      isLoading ? "#ff9800" : "#4caf50",
                      0.1
                    ),
                    borderRadius: "50%",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Assessment
                    sx={{
                      color: isLoading ? "#ff9800" : "#4caf50",
                      fontSize: 24,
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Table */}
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
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Detailed Data
          </Typography>
          {isLoading ? (
            <Box>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={60} sx={{ mb: 1, borderRadius: 2 }} />
              ))}
            </Box>
          ) : data?.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 2, overflow: "hidden" }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha("#667eea", 0.05) }}>
                    {columns.map((c) => (
                      <TableCell
                        key={c.field}
                        sx={{
                          color: "primary.main",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                        }}
                      >
                        {c.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow
                      key={row._id || idx}
                      sx={{
                        "&:nth-of-type(odd)": {
                          bgcolor: alpha("#f8fafc", 0.5),
                        },
                        "&:hover": { bgcolor: alpha("#667eea", 0.02) },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      {columns.map((c) => (
                        <TableCell key={c.field}>
                          {c.field === "value" ||
                          c.field === "totalAmount" ||
                          c.field === "totalPaid" ||
                          c.field === "outstanding"
                            ? `₹${(row[c.field] || 0).toLocaleString()}`
                            : row[c.field] ?? "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              No data available for the selected filters. Please adjust your
              criteria.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      {chartData.length > 0 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Bar Chart Analysis
                </Typography>
                <Box height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis fontSize={12} />
                      <Tooltip
                        formatter={(value) => [
                          `₹${value.toLocaleString()}`,
                          "Value",
                        ]}
                        labelStyle={{ fontWeight: 600 }}
                      />
                      <Bar
                        dataKey="value"
                        fill={getCurrentReportColor()}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Distribution
                </Typography>
                <Box height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `₹${value.toLocaleString()}`,
                          "Value",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Reports;
