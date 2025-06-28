import { apiSlice } from "./apiSlice";

export const supplierPaymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: (params) => ({
        url: "/supplier-payments",
        params,
      }),
      providesTags: ["SupplierPayment"],
    }),
    getPayment: builder.query({
      query: (id) => `/supplier-payments/${id}`,
    }),
    createPayment: builder.mutation({
      query: (data) => ({
        url: "/supplier-payments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SupplierPayment", "Supplier"],
    }),
    updatePayment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/supplier-payments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SupplierPayment", "Supplier"],
    }),
    deletePayment: builder.mutation({
      query: (id) => ({
        url: `/supplier-payments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SupplierPayment", "Supplier"],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = supplierPaymentApi;
