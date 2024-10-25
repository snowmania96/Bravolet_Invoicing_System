import openApiDocs from "@api/open-api-docs";
import { saveGuestyAuthKey } from "../authentication/SaveGuestyAuthKey.js";

export const fetchReservationId = async (apiKey, today) => {
  try {
    openApiDocs.auth(`Bearer ${apiKey}`);
    let { data } = await openApiDocs.getReservations({
      filters: `[{"field":"checkOut", "operator":"$between","from":"${today}T00:00:00%2B01:00","to":"${today}T23:59:59%2B01:00"}]`,
      limit: "100",
      fields: "id%20checkIn%20checkOut%20status",
    });
    return data.results;
  } catch (error) {
    console.log(error.status);
    if (error.status == 401) {
      const newApiKey = await saveGuestyAuthKey();
      // console.log(newApiKey);
      return await fetchReservationId(newApiKey, today);
    }
    console.log("Fetch Reservation Id Error: ", error);
  }
};

export const fetchReservationInfo = async (apiKey, id) => {
  try {
    openApiDocs.auth(`Bearer ${apiKey}`);
    let { data } = await openApiDocs.getReservationsId({
      id: id,
    });
    return data;
  } catch (error) {
    if (error.status == 401) {
      const newApiKey = await saveGuestyAuthKey();
      return await fetchReservationInfo(newApiKey, id);
    }
    console.log("Fetch Reservation Info Error: ", error);
  }
};
