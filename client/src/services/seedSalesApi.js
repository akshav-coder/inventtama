import { apiSlice } from "./apiSlice";

export const seedSalesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSeedSales: builder.query({
      query: () => "/seed-sales",
      providesTags: ["SeedSales"],
    }),
    createSeedSale: builder.mutation({
      query: (data) => ({
        url: "/seed-sales",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SeedSales"],
    }),
    updateSeedSale: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/seed-sales/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SeedSales"],
    }),
    deleteSeedSale: builder.mutation({
      query: (id) => ({
        url: `/seed-sales/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SeedSales"],
    }),
  }),
});

export const {
  useGetSeedSalesQuery,
  useCreateSeedSaleMutation,
  useUpdateSeedSaleMutation,
  useDeleteSeedSaleMutation,
} = seedSalesApi;
