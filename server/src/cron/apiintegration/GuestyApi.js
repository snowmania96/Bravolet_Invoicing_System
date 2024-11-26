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

export const fetchReservationInfoFromConfirmationCode = async (
  apiKey,
  confirmationCode
) => {
  try {
    openApiDocs.auth(`Bearer ${apiKey}`);
    let { data } = await openApiDocs.getReservations({
      filters: `[{"field":"confirmationCode", "operator":"$eq","value": "${confirmationCode}"}]`,
      limit: "100",
      fields: "id%20checkIn%20checkOut%20nightsCount%20nickName%20listing",
    });
    return data.results[0];
  } catch (error) {
    console.log(error.status);
    if (error.status == 401) {
      const newApiKey = await saveGuestyAuthKey();
      // console.log(newApiKey);
      return await fetchReservationInfoFromConfirmationCode(
        newApiKey,
        confirmationCode
      );
    }
    console.log("Fetch Reservation from confirmationcode Error: ", error);
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

export const fetchConversationInfo = async (apiKey, reservationInfo) => {
  try {
    openApiDocs.auth(`Bearer ${apiKey}`);
    const response = await openApiDocs.getCommunicationConversations({
      filters: `[{"field":"reservation._id", "operator":"$eq","value": "${reservationInfo._id}"}]`,
    });

    console.log(response.data.data.conversations[0]);
    return response.data.data.conversations[0];
  } catch (error) {
    console.log(error.status);
    if (error.status == 401) {
      const newApiKey = await saveGuestyAuthKey();
      // console.log(newApiKey);
      return await fetchConversationInfo(newApiKey, reservationInfo);
    }
    console.log("Fetch conversation Info Error: ", error);
  }
};

export const postNoteToConversationWithoutSending = async (
  apiKey,
  groupInfo,
  conversationId
) => {
  try {
    let noteText = `${groupInfo[0].givenname} ${groupInfo[0].surname} successfully posted their ID information.`;
    noteText += "<br> The registered guests are";
    for (let i = 0; i < groupInfo.length; i++) {
      noteText += "<br>";
      noteText += groupInfo[i].givenname + " " + groupInfo[i].surname + " ";
      noteText += groupInfo[i].citizenship.Descrizione + " ";
      const date = new Date(groupInfo[i].dateOfBirth);
      date.setDate(date.getDate() + 1);
      const birthDateString = date.toISOString().split("T")[0];
      noteText += birthDateString;
    }
    openApiDocs.auth(`Bearer ${apiKey}`);
    const response =
      await openApiDocs.postCommunicationConversationsConversationidPosts(
        {
          module: { type: "note" },
          body: noteText,
        },
        {
          conversationId: conversationId,
        }
      );
  } catch (error) {
    console.log(error.status);
    if (error.status == 401) {
      const newApiKey = await saveGuestyAuthKey();
      // console.log(newApiKey);
      return await postNoteToConversationWithoutSending(newApiKey, groupInfo);
    }
    console.log("Fetch conversation Info Error: ", error);
  }
};
