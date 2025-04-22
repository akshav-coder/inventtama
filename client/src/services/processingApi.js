import { apiSlice } from "./apiSlice";

export const processingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProcessingLogs: builder.query({
      query: () => "/processing",
      providesTags: ["Processing"],
    }),
    createProcessingLog: builder.mutation({
      query: (data) => ({
        url: "/processing",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Processing"],
    }),
    updateProcessingLog: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/processing/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Processing"],
    }),
    deleteProcessingLog: builder.mutation({
      query: (id) => ({
        url: `/processing/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Processing"],
    }),
  }),
});

export const {
  useGetProcessingLogsQuery,
  useCreateProcessingLogMutation,
  useUpdateProcessingLogMutation,
  useDeleteProcessingLogMutation,
} = processingApi;
