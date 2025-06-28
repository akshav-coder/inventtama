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
} from "@mui/material";
import { useState, useMemo } from "react";
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
} from "recharts";

const REPORT_OPTIONS = [
  { value: "purchases", label: "Purchases" },
  { value: "sales", label: "Sales" },
  { value: "transfers", label: "Transfers" },
  { value: "processing", label: "Processing" },
  { value: "stock", label: "Stock" },
  { value: "payments", label: "Payments" },
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

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" textTransform="capitalize">
          {type} Report
        </Typography>
      </Box>
      <Box mb={2} display="flex" gap={2} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="report-type">Report</InputLabel>
          <Select
            labelId="report-type"
            label="Report"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {REPORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />
      </Box>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c.field}>{c.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(data) &&
              data.map((row, idx) => (
                <TableRow key={row._id || idx}>
                  {columns.map((c) => (
                    <TableCell key={c.field}>{row[c.field] ?? "-"}</TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {chartData.length > 0 && (
        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default Reports;
