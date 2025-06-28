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
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetAllPurchasesQuery } from "../services/purchaseApi";
import { useGetSalesQuery } from "../services/salesApi";
import { useGetSuppliersQuery } from "../services/suppliersApi";
import { useGetCustomersQuery } from "../services/customersApi";
import { useGetProcessingLogsQuery } from "../services/processingApi";
import { useGetPaymentsQuery } from "../services/supplierPaymentApi";
import { useGetStockReportQuery } from "../services/reportsApi";

const Dashboard = () => {
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
    monthly[m] = monthly[m] || { purchases: 0, sales: 0, production: 0, payments: 0 };
    const total = p.totalAmount ||
      p.tamarindItems.reduce((s, i) => s + (i.totalAmount || 0), 0);
    monthly[m].purchases += total;
  });
  sales.forEach((s) => {
    const m = s.invoiceDate?.slice(0, 7);
    if (!m) return;
    monthly[m] = monthly[m] || { purchases: 0, sales: 0, production: 0, payments: 0 };
    monthly[m].sales += s.totalAmount || 0;
  });
  processing.forEach((p) => {
    const m = p.date?.slice(0, 7);
    if (!m) return;
    monthly[m] = monthly[m] || { purchases: 0, sales: 0, production: 0, payments: 0 };
    monthly[m].production += p.output.quantity || 0;
  });
  payments.forEach((p) => {
    const m = p.paymentDate?.slice(0, 7);
    if (!m) return;
    monthly[m] = monthly[m] || { purchases: 0, sales: 0, production: 0, payments: 0 };
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
    const amt = p.totalAmount || p.tamarindItems.reduce((x, i) => x + (i.totalAmount || 0), 0);
    return s + amt;
  }, 0);
  const totalPayments = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const netProfit = totalSales - totalPurchases - totalPayments;

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Dashboard Summary
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Today's Purchases</Typography>
            <Typography variant="h6">{purchasesToday.length}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Today's Sales</Typography>
            <Typography variant="h6">{salesToday.length}</Typography>
          </Paper>
        </Grid>

        {/* Stock Overview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" mb={1}>
              Stock Overview
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
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
                  <TableRow key={t}>
                    <TableCell>{t}</TableCell>
                    <TableCell>{stockTotals[t] || 0}</TableCell>
                    {Object.keys(unitQuantities).map((u) => (
                      <TableCell key={u}>-</TableCell>
                    ))}
                    <TableCell>{stockTotals[t] || 0}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
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
          </Paper>
        </Grid>

        {/* Financial Summary */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" mb={1}>
              Financial Summary
            </Typography>
            <Typography variant="body2">
              Outstanding Payables: ₹{outstandingPayables.toFixed(2)}
            </Typography>
            <Typography variant="body2" mb={1}>
              Outstanding Receivables: ₹{outstandingReceivables.toFixed(2)}
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2">Top Suppliers</Typography>
                <List dense>
                  {topSupplierBalances.map((s) => (
                    <ListItem key={s._id} disablePadding>
                      <ListItemText
                        primary={s.name}
                        secondary={`₹${(s.outstandingBalance || 0).toFixed(2)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2">Top Customers</Typography>
                <List dense>
                  {customerTotals.map((c) => (
                    <ListItem key={c._id} disablePadding>
                      <ListItemText
                        primary={c.name}
                        secondary={`₹${(c.outstandingBalance || 0).toFixed(2)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Production Overview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" mb={1}>
              Today's Production
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Unit</TableCell>
                  <TableCell>Paste Type</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(todayOutputs).map(([unit, types]) =>
                  Object.entries(types).map(([ptype, qty]) => (
                    <TableRow key={`${unit}-${ptype}`}>
                      <TableCell>{unit}</TableCell>
                      <TableCell>{ptype}</TableCell>
                      <TableCell>{qty}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Trends & Analytics */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" mb={1}>
              Trends &amp; Analytics
            </Typography>
            <Typography variant="body2" mb={1}>
              Net Profit: ₹{netProfit.toFixed(2)}
            </Typography>
            <Box height={240}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Purchases" stroke="#8884d8" />
                  <Line type="monotone" dataKey="Sales" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="Production" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            <Box height={240} mt={2}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incomeExpenseData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Income" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="Expenses" stroke="#f44336" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
