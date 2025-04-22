import { apiSlice } from "./apiSlice";

export const storageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStorageEntries: builder.query({
      query: () => "/storage",
      providesTags: ["Storage"],
    }),
    createStorageEntry: builder.mutation({
      query: (data) => ({
        url: "/storage",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Storage"],
    }),
    updateStorageEntry: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/storage/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Storage"],
    }),
    deleteStorageEntry: builder.mutation({
      query: (id) => ({
        url: `/storage/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Storage"],
    }),
  }),
});

export const {
  useGetStorageEntriesQuery,
  useCreateStorageEntryMutation,
  useUpdateStorageEntryMutation,
  useDeleteStorageEntryMutation,
} = storageApi;
