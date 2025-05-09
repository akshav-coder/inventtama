import { apiSlice } from "./apiSlice";

export const facilityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFacilities: builder.query({
      query: () => "/facilities", // This should match your backend route
    }),
  }),
});

export const { useGetFacilitiesQuery } = facilityApi;
