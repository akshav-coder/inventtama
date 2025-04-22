import { apiSlice } from "./apiSlice";

export const wholesaleCreditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWholesaleCredits: builder.query({
      query: () => "/wholesale-credit",
      providesTags: ["WholesaleCredit"],
    }),
    createOrUpdateCredit: builder.mutation({
      query: (data) => ({
        url: "/wholesale-credit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WholesaleCredit"],
    }),
    deleteCreditEntry: builder.mutation({
      query: (id) => ({
        url: `/wholesale-credit/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WholesaleCredit"],
    }),
  }),
});

export const {
  useGetWholesaleCreditsQuery,
  useCreateOrUpdateCreditMutation,
  useDeleteCreditEntryMutation,
} = wholesaleCreditApi;
