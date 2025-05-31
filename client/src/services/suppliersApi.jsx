import { apiSlice } from "./apiSlice";

export const suppliersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query({
      query: () => "suppliers/all",
      providesTags: ["Supplier"],
    }),
    getSupplier: builder.query({
      query: (id) => `suppliers/by-id/${id}`,
    }),
    addSupplier: builder.mutation({
      query: (newSupplier) => ({
        url: "suppliers/create",
        method: "POST",
        body: newSupplier,
      }),
      invalidatesTags: ["Supplier"],
    }),
    updateSupplier: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `suppliers/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Supplier"],
    }),
    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: `suppliers/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierQuery,
  useAddSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApi;
