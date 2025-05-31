import { apiSlice } from "./apiSlice";

export const storageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStorages: builder.query({
      query: (type) => `/storages?type=${type}`,
      providesTags: ["Storage"],
    }),
    createStorage: builder.mutation({
      query: (newStorage) => ({
        url: "/storages",
        method: "POST",
        body: newStorage,
      }),
      invalidatesTags: ["Storage"],
    }),
  }),
});

export const { useGetStoragesQuery, useCreateStorageMutation } = storageApi;
