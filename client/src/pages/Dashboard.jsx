import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import InventoryChart from "../components/dashboard/InventoryChart";
import CreditChart from "../components/dashboard/CreditChart";
import { useGetPurchasesQuery } from "../services/purchaseApi";
import { useGetSalesQuery } from "../services/salesApi";
import { useGetWholesaleCreditsQuery } from "../services/wholesaleCreditApi";
import { useGetSupplierCreditsQuery } from "../services/supplierCreditApi";

const Dashboard = () => {
  const { data: purchases } = useGetPurchasesQuery();
  const { data: sales } = useGetSalesQuery();
  const { data: wholesaleCredits } = useGetWholesaleCreditsQuery();
  const { data: supplierCredits } = useGetSupplierCreditsQuery();

  const today = new Date().toISOString().split("T")[0];
  const purchasesToday =
    purchases?.filter((p) => p.date?.startsWith(today)) || [];
  const salesToday = sales?.filter((s) => s.date?.startsWith(today)) || [];

  const totalWholesaleBalance =
    wholesaleCredits?.reduce((sum, c) => sum + +c.currentBalance, 0) || 0;
  const totalSupplierBalance =
    supplierCredits?.reduce((sum, c) => sum + +c.remainingBalance, 0) || 0;

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Dashboard Summary
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Today’s Purchases</Typography>
            <Typography variant="h6">{purchasesToday.length}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Today’s Sales</Typography>
            <Typography variant="h6">{salesToday.length}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Wholesale Outstanding</Typography>
            <Typography variant="h6">₹{totalWholesaleBalance}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Supplier Outstanding</Typography>
            <Typography variant="h6">₹{totalSupplierBalance}</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" mb={1}>
              Inventory Overview
            </Typography>
            <InventoryChart />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" mb={1}>
              Credit Breakdown
            </Typography>
            <CreditChart />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
