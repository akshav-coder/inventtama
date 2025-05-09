import { apiSlice } from "./apiSlice";

export const lotApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLotsByFacility: builder.query({
      query: (facilityId) => `/lots?facility=${facilityId}`,
    }),
  }),
});

export const { useGetLotsByFacilityQuery } = lotApi;
