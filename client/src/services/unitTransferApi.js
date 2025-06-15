import { apiSlice } from "./apiSlice";

export const unitTransferApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransfers: builder.query({
      query: (params) => ({
        url: `/unit-transfers${params ? `?${params}` : ""}`,
      }),
      providesTags: ["Transfer"],
    }),
    getTransferById: builder.query({
      query: (id) => `/unit-transfers/${id}`,
      providesTags: (result, error, id) => [{ type: "Transfer", id }],
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
      invalidatesTags: (result, error, { id }) => [
        "Transfer",
        { type: "Transfer", id },
      ],
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
  useGetTransferByIdQuery,
  useCreateTransferMutation,
  useUpdateTransferMutation,
  useDeleteTransferMutation,
} = unitTransferApi;
