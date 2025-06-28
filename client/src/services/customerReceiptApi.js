import { apiSlice } from "./apiSlice";

export const customerReceiptApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReceipts: builder.query({
      query: () => "/customer-receipts",
      providesTags: ["CustomerReceipt"],
    }),
    getReceipt: builder.query({
      query: (id) => `/customer-receipts/${id}`,
    }),
    createReceipt: builder.mutation({
      query: (data) => ({
        url: "/customer-receipts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CustomerReceipt", "Customer", "Sales"],
    }),
    updateReceipt: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/customer-receipts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CustomerReceipt", "Customer", "Sales"],
    }),
    deleteReceipt: builder.mutation({
      query: (id) => ({
        url: `/customer-receipts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CustomerReceipt", "Customer", "Sales"],
    }),
  }),
});

export const {
  useGetReceiptsQuery,
  useGetReceiptQuery,
  useCreateReceiptMutation,
  useUpdateReceiptMutation,
  useDeleteReceiptMutation,
} = customerReceiptApi;
