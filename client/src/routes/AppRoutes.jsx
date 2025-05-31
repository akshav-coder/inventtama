import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Purchases from "../pages/Purchases";
import Processing from "../pages/Processing";
import Transfers from "../pages/Transfers";
import Sales from "../pages/Sales";
import WholesaleCredit from "../pages/WholesaleCredit";
import SupplierCredit from "../pages/SupplierCredit";
import SeedSales from "../pages/SeedSales";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard";
import AdminControl from "../pages/AdminControl";
import SupplierPage from "../pages/SupplierPage";
import CustomerPage from "../pages/CustomerPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Private */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/wholesale-credit" element={<WholesaleCredit />} />
          <Route path="/supplier-credit" element={<SupplierCredit />} />
          <Route path="/seed-sales" element={<SeedSales />} />
          <Route path="/admin-control" element={<AdminControl />} />
          <Route path="/supplier-management" element={<SupplierPage />} />
          <Route path="/customer-management" element={<CustomerPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
