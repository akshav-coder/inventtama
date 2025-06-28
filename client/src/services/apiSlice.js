import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5001/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.user?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Purchase",
    "Storage",
    "Processing",
    "Transfer",
    "Sales",
    "Supplier",
    "WholesaleCredit",
    "SupplierCredit",
    "SeedSales",
    "Inventory",
    "SupplierPayment",
    "User",
  ],
  endpoints: () => ({}),
});
