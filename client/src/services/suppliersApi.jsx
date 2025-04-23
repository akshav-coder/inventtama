import { apiSlice } from "./apiSlice";

export const suppliersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query({
      query: () => "/suppliers/list",
      providesTags: ["Supplier"],
    }),

    addSupplier: builder.mutation({
      query: (data) => ({
        url: "/suppliers/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const { useGetSuppliersQuery, useAddSupplierMutation } = suppliersApi;
