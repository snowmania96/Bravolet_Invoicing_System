import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const jwtToken = () => {
  const authData = JSON.parse(localStorage.getItem("admin"));
  return "Bearer " + String(authData.token);
};

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: ["Guests", "Apartments", "Admins"],
  endpoints: (build) => ({
    getApartments: build.query({
      query: () => ({
        url: `apartment/get`,
        headers: { Authorization: jwtToken() },
      }),
      providesTags: ["Apartments"],
    }),
    getGuests: build.query({
      query: () => ({
        url: `guest/get`,
        headers: { Authorization: jwtToken() },
      }),
      providesTags: ["Guests"],
    }),
    getAdmins: build.query({
      query: () => ({
        url: `management/admin`,
        headers: { Authorization: jwtToken() },
      }),
      providesTags: ["Admins"],
    }),
  }),
});

export const { useGetApartmentsQuery, useGetGuestsQuery, useGetAdminsQuery } =
  api;
