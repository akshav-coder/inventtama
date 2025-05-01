import { apiSlice } from "./apiSlice";

export const storageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addStorageOption: builder.mutation({
      query: (option) => ({
        url: "/storage-options",
        method: "POST",
        body: option,
      }),
    }),
  }),
});

export const { useAddStorageOptionMutation } = storageApi;
