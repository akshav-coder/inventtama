import { apiSlice } from "./apiSlice";

export const purchaseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPurchases: builder.query({
      query: () => "/purchases",
      providesTags: ["Purchase"],
    }),

    getPurchaseById: builder.query({
      query: (id) => `/purchases/${id}`,
      providesTags: ["Purchase"],
    }),

    createPurchase: builder.mutation({
      query: (data) => ({
        url: "/purchases",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Purchase"],
    }),

    updatePurchase: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/purchases/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Purchase"],
    }),

    deletePurchase: builder.mutation({
      query: (id) => ({
        url: `/purchases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Purchase"],
    }),
  }),
});

export const {
  useGetAllPurchasesQuery,
  useGetPurchaseByIdQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApi;
