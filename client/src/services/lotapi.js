import { apiSlice } from "./apiSlice";

export const lotApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLots: builder.query({
      query: (coldStorageId) => `/lots?coldStorageId=${coldStorageId}`,
      providesTags: ["Lot"],
    }),
    createLot: builder.mutation({
      query: (newLot) => ({
        url: "/lots",
        method: "POST",
        body: newLot,
      }),
      invalidatesTags: ["Lot"],
    }),
    updateLot: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/lots/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Lot"],
    }),
  }),
});

export const { useGetLotsQuery, useCreateLotMutation, useUpdateLotMutation } =
  lotApi;
