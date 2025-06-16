import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import InventoryChart from "../components/dashboard/InventoryChart";
import CreditChart from "../components/dashboard/CreditChart";
import { useGetAllPurchasesQuery } from "../services/purchaseApi";
import { useGetSalesQuery } from "../services/salesApi";

const Dashboard = () => {
  const { data: purchases } = useGetAllPurchasesQuery();
  const { data: sales } = useGetSalesQuery();

  const today = new Date().toISOString().split("T")[0];
  const purchasesToday =
    purchases?.filter((p) => p.date?.startsWith(today)) || [];
  const salesToday = sales?.filter((s) => s.date?.startsWith(today)) || [];

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
