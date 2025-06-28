import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Inventory,
  AttachMoney,
  People,
  ShoppingCart,
  LocalShipping,
  Assessment,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useGetAllPurchasesQuery } from "../services/purchaseApi";
import { useGetSalesQuery } from "../services/salesApi";
import { useGetSuppliersQuery } from "../services/suppliersApi";
import { useGetCustomersQuery } from "../services/customersApi";
import { useGetProcessingLogsQuery } from "../services/processingApi";
import { useGetPaymentsQuery } from "../services/supplierPaymentApi";
import { useGetStockReportQuery } from "../services/reportsApi";
import { useState } from "react";

const Dashboard = () => {
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  const { data: purchases = [] } = useGetAllPurchasesQuery();
  const { data: sales = [] } = useGetSalesQuery();
  const { data: suppliers = [] } = useGetSuppliersQuery();
  const { data: customers = [] } = useGetCustomersQuery();
  const { data: processing = [] } = useGetProcessingLogsQuery();
  const { data: payments = [] } = useGetPaymentsQuery();
  const { data: stock } = useGetStockReportQuery("");

  const today = new Date().toISOString().split("T")[0];

  const purchasesToday = purchases.filter((p) =>
    p.purchaseDate?.startsWith(today)
  );
  const salesToday = sales.filter((s) => s.invoiceDate?.startsWith(today));

  // Stock Overview
  const stockTotals = {};
  const unitQuantities = {};
  if (stock?.storages) {
    stock.storages.forEach((s) => {
      if (s.type === "cold") {
        Object.entries(s.lots).forEach(([t, q]) => {
          stockTotals[t] = (stockTotals[t] || 0) + q;
        });
      } else if (s.type === "unit") {
        unitQuantities[s.name] = s.quantity;
      }
    });
  }
  const tamarindTypes = Object.keys(stockTotals);

  // Financial Summary
  const outstandingPayables = suppliers.reduce(
    (sum, s) => sum + (s.outstandingBalance || 0),
    0
  );
  const outstandingReceivables = customers.reduce(
    (sum, c) => sum + (c.outstandingBalance || 0),
    0
  );

  const topSupplierBalances = [...suppliers]
    .sort((a, b) => (b.outstandingBalance || 0) - (a.outstandingBalance || 0))
    .slice(0, 5);
  const customerTotals = [...customers]
    .sort((a, b) => (b.outstandingBalance || 0) - (a.outstandingBalance || 0))
    .slice(0, 5);

  // Production Overview - today's output
  const todayOutputs = {};
  processing
    .filter((p) => p.date?.startsWith(today))
    .forEach((p) => {
      const unit = p.manufacturingUnit.name;
      if (!todayOutputs[unit]) todayOutputs[unit] = {};
      todayOutputs[unit][p.output.pasteType] =
        (todayOutputs[unit][p.output.pasteType] || 0) + p.output.quantity;
    });

  // Trends & Analytics
  const monthly = {};
  purchases.forEach((p) => {
    const m = p.purchaseDate?.slice(0, 7);
    if (!m) return;
    monthly[m] = monthly[m] || {
      purchases: 0,
      sales: 0,
      production: 0,
      payments: 0,
    };
    const total =
      p.totalAmount ||
      p.tamarindItems.reduce((s, i) => s + (i.totalAmount || 0), 0);
    monthly[m].purchases += total;
  });
  sales.forEach((s) => {
    const m = s.invoiceDate?.slice(0, 7);
    if (!m) return;
    monthly[m] = monthly[m] || {
      purchases: 0,
      sales: 0,
      production: 0,
      payments: 0,
    };
    monthly[m].sales += s.totalAmount || 0;
  });
  processing.forEach((p) => {
    const m = p.date?.slice(0, 7);
    if (!m) return;
    monthly[m] = monthly[m] || {
      purchases: 0,
      sales: 0,
      production: 0,
      payments: 0,
    };
    monthly[m].production += p.output.quantity || 0;
  });
  payments.forEach((p) => {
    const m = p.paymentDate?.slice(0, 7);
    if (!m) return;
    monthly[m] = monthly[m] || {
      purchases: 0,
      sales: 0,
      production: 0,
      payments: 0,
    };
    monthly[m].payments += p.amount || 0;
  });

  const months = Object.keys(monthly).sort();
  const trendData = months.map((m) => ({
    month: m,
    Purchases: monthly[m].purchases,
    Sales: monthly[m].sales,
    Production: monthly[m].production,
  }));

  const incomeExpenseData = months.map((m) => ({
    month: m,
    Income: monthly[m].sales,
    Expenses: monthly[m].purchases + monthly[m].payments,
  }));

  const totalSales = sales.reduce((s, v) => s + (v.totalAmount || 0), 0);
  const totalPurchases = purchases.reduce((s, p) => {
    const amt =
      p.totalAmount ||
      p.tamarindItems.reduce((x, i) => x + (i.totalAmount || 0), 0);
    return s + amt;
  }, 0);
  const totalPayments = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const netProfit = totalSales - totalPurchases - totalPayments;

  // Chart colors
  const chartColors = {
    purchases: "#6366f1",
    sales: "#10b981",
    production: "#f59e0b",
    income: "#10b981",
    expenses: "#ef4444",
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 8px 25px ${color}20`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Avatar
            sx={{
              bgcolor: color,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
          <Chip
            label={subtitle || "Today"}
            size="small"
            sx={{ bgcolor: color, color: "white" }}
          />
        </Box>
        <Typography variant="h4" fontWeight="bold" color="text.primary" mb={1}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening with your business today.
          </Typography>
        </Box>
        <Tooltip
          title={
            showSensitiveData ? "Hide sensitive data" : "Show sensitive data"
          }
        >
          <IconButton
            onClick={() => setShowSensitiveData(!showSensitiveData)}
            sx={{
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            {showSensitiveData ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Today's Purchases"
            value={purchasesToday.length}
            icon={<ShoppingCart />}
            color="#6366f1"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Today's Sales"
            value={salesToday.length}
            icon={<AttachMoney />}
            color="#10b981"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Outstanding Payables"
            value={
              showSensitiveData ? `₹${outstandingPayables.toFixed(2)}` : "₹****"
            }
            icon={<TrendingDown />}
            color="#ef4444"
            subtitle="Total"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Outstanding Receivables"
            value={
              showSensitiveData
                ? `₹${outstandingReceivables.toFixed(2)}`
                : "₹****"
            }
            icon={<TrendingUp />}
            color="#f59e0b"
            subtitle="Total"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Stock Overview */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Inventory sx={{ color: "#6366f1", mr: 2 }} />
                <Typography variant="h6" fontWeight="bold">
                  Stock Overview
                </Typography>
              </Box>
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow
                      sx={{
                        "& th": { fontWeight: "bold", bgcolor: "#f8fafc" },
                      }}
                    >
                      <TableCell>Type</TableCell>
                      <TableCell>Cold Storage</TableCell>
                      {Object.keys(unitQuantities).map((u) => (
                        <TableCell key={u}>{u}</TableCell>
                      ))}
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tamarindTypes.map((t) => (
                      <TableRow
                        key={t}
                        sx={{ "&:hover": { bgcolor: "#f8fafc" } }}
                      >
                        <TableCell>
                          <Chip label={t} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{stockTotals[t] || 0}</TableCell>
                        {Object.keys(unitQuantities).map((u) => (
                          <TableCell key={u}>-</TableCell>
                        ))}
                        <TableCell>
                          <Typography fontWeight="bold">
                            {stockTotals[t] || 0}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow
                      sx={{
                        bgcolor: "#f8fafc",
                        "& td": { fontWeight: "bold" },
                      }}
                    >
                      <TableCell>Total</TableCell>
                      <TableCell>
                        {Object.values(stockTotals).reduce((a, b) => a + b, 0)}
                      </TableCell>
                      {Object.keys(unitQuantities).map((u) => (
                        <TableCell key={u}>{unitQuantities[u]}</TableCell>
                      ))}
                      <TableCell>{stock?.total || 0}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Summary */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Assessment sx={{ color: "#10b981", mr: 2 }} />
                <Typography variant="h6" fontWeight="bold">
                  Financial Summary
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mb={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Net Profit
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color={netProfit >= 0 ? "#10b981" : "#ef4444"}
                  >
                    {showSensitiveData ? `₹${netProfit.toFixed(2)}` : "₹****"}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" color="text.secondary">
                    Total Sales
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {showSensitiveData ? `₹${totalSales.toFixed(2)}` : "₹****"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                    Top Suppliers
                  </Typography>
                  <List dense>
                    {topSupplierBalances.map((s, index) => (
                      <ListItem key={s._id} disablePadding sx={{ mb: 1 }}>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center">
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  mr: 1,
                                  bgcolor: "#ef4444",
                                }}
                              >
                                {index + 1}
                              </Avatar>
                              <Typography variant="body2" fontWeight="medium">
                                {s.name}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {showSensitiveData
                                ? `₹${(s.outstandingBalance || 0).toFixed(2)}`
                                : "₹****"}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                    Top Customers
                  </Typography>
                  <List dense>
                    {customerTotals.map((c, index) => (
                      <ListItem key={c._id} disablePadding sx={{ mb: 1 }}>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center">
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  mr: 1,
                                  bgcolor: "#f59e0b",
                                }}
                              >
                                {index + 1}
                              </Avatar>
                              <Typography variant="body2" fontWeight="medium">
                                {c.name}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {showSensitiveData
                                ? `₹${(c.outstandingBalance || 0).toFixed(2)}`
                                : "₹****"}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Production Overview */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <LocalShipping sx={{ color: "#f59e0b", mr: 2 }} />
                <Typography variant="h6" fontWeight="bold">
                  Today's Production
                </Typography>
              </Box>
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow
                      sx={{
                        "& th": { fontWeight: "bold", bgcolor: "#f8fafc" },
                      }}
                    >
                      <TableCell>Unit</TableCell>
                      <TableCell>Paste Type</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(todayOutputs).map(([unit, types]) =>
                      Object.entries(types).map(([ptype, qty]) => (
                        <TableRow
                          key={`${unit}-${ptype}`}
                          sx={{ "&:hover": { bgcolor: "#f8fafc" } }}
                        >
                          <TableCell>
                            <Chip
                              label={unit}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{ptype}</TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="bold">{qty}</Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {Object.keys(todayOutputs).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No production data for today
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Trends & Analytics */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <TrendingUp sx={{ color: "#6366f1", mr: 2 }} />
                <Typography variant="h6" fontWeight="bold">
                  Trends & Analytics
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={2}>
                Monthly performance overview
              </Typography>

              <Box height={300} mb={3}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Purchases"
                      stroke={chartColors.purchases}
                      strokeWidth={2}
                      dot={{
                        fill: chartColors.purchases,
                        strokeWidth: 2,
                        r: 4,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Sales"
                      stroke={chartColors.sales}
                      strokeWidth={2}
                      dot={{ fill: chartColors.sales, strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Production"
                      stroke={chartColors.production}
                      strokeWidth={2}
                      dot={{
                        fill: chartColors.production,
                        strokeWidth: 2,
                        r: 4,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary" mb={2}>
                Income vs Expenses
              </Typography>

              <Box height={200}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={incomeExpenseData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="Income"
                      fill={chartColors.income}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Expenses"
                      fill={chartColors.expenses}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
