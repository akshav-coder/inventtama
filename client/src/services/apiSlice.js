import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5004/api",
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
    "WholesaleCredit",
    "SupplierCredit",
    "SeedSales",
    "Inventory",
    "User",
  ],
  endpoints: () => ({}),
});
