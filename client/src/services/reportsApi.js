import { apiSlice } from "./apiSlice";

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPurchaseReport: builder.query({
      query: (params) => `/reports/purchases?${params}`,
    }),
    getSalesReport: builder.query({
      query: (params) => `/reports/sales?${params}`,
    }),
    getTransferReport: builder.query({
      query: (params) => `/reports/transfers?${params}`,
    }),
    getProcessingReport: builder.query({
      query: (params) => `/reports/processing?${params}`,
    }),
    getStockReport: builder.query({
      query: (params) => `/reports/stock?${params}`,
    }),
    getPaymentsReport: builder.query({
      query: (params) => `/reports/payments?${params}`,
    }),
  }),
});

export const {
  useGetPurchaseReportQuery,
  useGetSalesReportQuery,
  useGetTransferReportQuery,
  useGetProcessingReportQuery,
  useGetStockReportQuery,
  useGetPaymentsReportQuery,
} = reportsApi;
