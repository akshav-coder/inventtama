import { apiSlice } from "./apiSlice";

export const supplierCreditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierCredits: builder.query({
      query: () => "/supplier-credit",
      providesTags: ["SupplierCredit"],
    }),
    createOrUpdateSupplierCredit: builder.mutation({
      query: (data) => ({
        url: "/supplier-credit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SupplierCredit"],
    }),
    deleteSupplierCredit: builder.mutation({
      query: (id) => ({
        url: `/supplier-credit/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SupplierCredit"],
    }),
  }),
});

export const {
  useGetSupplierCreditsQuery,
  useCreateOrUpdateSupplierCreditMutation,
  useDeleteSupplierCreditMutation,
} = supplierCreditApi;
