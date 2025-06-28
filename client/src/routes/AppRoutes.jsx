import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Purchases from "../pages/Purchases";
import Processing from "../pages/Processing";
import Transfers from "../pages/Transfers";
import Sales from "../pages/Sales";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard";
import SupplierPage from "../pages/SupplierPage";
import CustomerPage from "../pages/CustomerPage";
import StorageAndLotPage from "../pages/StorageAndLotPage";
import SupplierPayments from "../pages/SupplierPayments";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/purchases",
            element: <Purchases />,
          },
          {
            path: "/processing",
            element: <Processing />,
          },
          {
            path: "/transfers",
            element: <Transfers />,
          },
          {
            path: "/sales",
            element: <Sales />,
          },
          {
            path: "/supplier-payments",
            element: <SupplierPayments />,
          },
          {
            path: "/supplier-management",
            element: <SupplierPage />,
          },
          {
            path: "/customer-management",
            element: <CustomerPage />,
          },
          {
            path: "/storage-management",
            element: <StorageAndLotPage />,
          },
        ],
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
