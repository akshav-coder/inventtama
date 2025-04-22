import { apiSlice } from "./apiSlice";

export const unitTransferApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransfers: builder.query({
      query: () => "/unit-transfers",
      providesTags: ["Transfer"],
    }),
    createTransfer: builder.mutation({
      query: (data) => ({
        url: "/unit-transfers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Transfer"],
    }),
    updateTransfer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/unit-transfers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Transfer"],
    }),
    deleteTransfer: builder.mutation({
      query: (id) => ({
        url: `/unit-transfers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transfer"],
    }),
  }),
});

export const {
  useGetTransfersQuery,
  useCreateTransferMutation,
  useUpdateTransferMutation,
  useDeleteTransferMutation,
} = unitTransferApi;
