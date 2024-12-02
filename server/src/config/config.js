import Schema from "../model/Schema.js";
import ReceiptNumber from "../model/ReceiptNumber.js";
import InvoiceNumber from "../model/InvoiceNumber.js";
import Apartment from "../model/Apartment.js";
import axios from "axios";
import fs from "fs";
import {
  fetchConversationInfo,
  postNoteToConversationWithoutSending,
} from "../cron/apiintegration/GuestyApi.js";

export const getNotes = async (reservationInfo) => {
  try {
    const schema = await Schema.findOne({ name: "InvoiceSchema" });
    if (!schema) return "";
    let notes = schema.note;
    const splitSections = notes.split(/{{|}}/);
    let variables = [];
    for (let i = 1; i < splitSections.length; i += 2) {
      variables.push(splitSections[i]);
    }
    for (let i = 0; i < variables.length; i++) {
      const apartment = await Apartment.findOne({
        name: reservationInfo.listing.nickname,
      });
      if (variables[i] == "fiscalInformation") {
        notes = notes.replaceAll(
          "{{fiscalInformation}}",
          apartment.information
        );
      }
      if (variables[i] == "apartmentAddress") {
        notes = notes.replaceAll("{{apartmentAddress}}", apartment.address);
      }
      if (variables[i] == "apartmentNickname") {
        notes = notes.replaceAll("{{apartmentNickname}}", apartment.name);
      }
      if (variables[i] == "checkIn") {
        notes = notes.replaceAll(
          "{{checkIn}}",
          reservationInfo.checkIn.split("T")[0]
        );
      }
      if (variables[i] == "checkOut") {
        notes = notes.replaceAll(
          "{{checkOut}}",
          reservationInfo.checkOut.split("T")[0]
        );
      }
      if (variables[i] == "reservationId") {
        notes = notes.replaceAll("{{reservationId}}", reservationInfo._id);
      }
      if (variables[i] == "confirmationCode") {
        notes = notes.replaceAll(
          "{{confirmationCode}}",
          reservationInfo.confirmationCode
        );
      }
      if (variables[i] == "guestName") {
        notes = notes.replaceAll(
          "{{guestName}}",
          reservationInfo.guest.fullName
        );
      }
      if (variables[i] == "companyName") {
        notes = notes.replaceAll(
          "{{companyName}}",
          "Medistart s.r.l. con sede legale in via Fortunato Zeni 18, 38068 Rovereto (TN), P. IVA 02345130229 nella persona del legale rappresentante pro-tempore dott. Carmelo Sangiorgio identificato come da visura depositata presso la competente Camera di Commercio"
        );
      }
    }
    return notes;
  } catch (err) {
    console.log("get note error", err);
  }
};

export const getReceiptNumber = async (day) => {
  try {
    let receiptNumber = await ReceiptNumber.findOne({});
    if (!receiptNumber) {
      receiptNumber = await ReceiptNumber.create({
        receiptNumber: 1,
      });
    }
    if (day.split("-")[1] === "01" && day.split("-")[2] === "01") {
      receiptNumber = await ReceiptNumber.findOneAndUpdate(
        {},
        {
          receiptNumber: 1,
        }
      );
      receiptNumber.receiptNumber = 1;
    }
    return receiptNumber.receiptNumber;
  } catch (err) {
    console.log("get receipt number error", err);
  }
};

export const updateReceiptNumber = async (number) => {
  try {
    await ReceiptNumber.findOneAndUpdate(
      {},
      {
        receiptNumber: number,
      }
    );
  } catch (err) {
    console.log("get update Receipt number error", err);
  }
};

export const getInvoiceNumber = async (day) => {
  try {
    let invoiceNumber = await InvoiceNumber.findOne({});
    if (!invoiceNumber) {
      invoiceNumber = await InvoiceNumber.create({
        invoiceNumber: 1,
      });
    }
    if (day.split("-")[1] === "01" && day.split("-")[2] === "01") {
      invoiceNumber = await InvoiceNumber.findOneAndUpdate(
        {},
        {
          invoiceNumber: 1,
        }
      );
      invoiceNumber.invoiceNumber = 1;
    }
    return invoiceNumber.invoiceNumber;
  } catch (err) {
    console.log("get invoice number error: ", err);
  }
};

export const updateInvoiceNumber = async (number) => {
  try {
    await InvoiceNumber.findOneAndUpdate(
      {},
      {
        invoiceNumber: number,
      }
    );
  } catch (err) {
    console.log("update invoice number error", err);
  }
};

export const getCityTax = (reservationInfo) => {
  //In case where can find city tax in invoice items.
  for (let i = 0; i < reservationInfo.money.invoiceItems.length; i++) {
    if (reservationInfo.money.invoiceItems[i].title == "CITY_TAX") {
      return {
        flag: true,
        amount: reservationInfo.money.invoiceItems[i].amount,
      };
    }
  }

  //In case the listing nickname is Milan
  if (reservationInfo.listing.nickname.split(" - ")[0] === "Milan") {
    return {
      flag: false,
      amount: 4.5 * reservationInfo.guestsCount * reservationInfo.nightsCount,
    };
  }

  //Or not.
  return {
    flag: false,
    amount: 2 * reservationInfo.guestsCount * reservationInfo.nightsCount,
  };
};

export const generatePolicyServiceText = (nightsCount, groupInfo, checkIn) => {
  let result = "";
  for (let i = 0; i < groupInfo.length; i++) {
    let individual = "<string>";
    //Insert Type of Accomodation 2
    if (i === 0) {
      if (groupInfo.length === 1) individual += "16";
      else individual += "18";
    } else {
      individual += "20";
    }

    //Insert Arrival Date 10
    const dateString = checkIn.split("T")[0].split("-");
    const formattedDate = `${dateString[2]}/${dateString[1]}/${dateString[0]}`;
    individual += formattedDate;

    //Insert Staying Dates 2
    if (nightsCount < 10) individual += `0${nightsCount}`;
    else individual += nightsCount;

    //Insert Surname 50
    individual += groupInfo[i].surname;
    individual += " ".repeat(50 - groupInfo[i].surname.length);

    //Insert givenname 30
    individual += groupInfo[i].givenname;
    individual += " ".repeat(30 - groupInfo[i].givenname.length);

    //Insert gender 1
    if (groupInfo[i].gender === "Maschio") individual += "1";
    else individual += "2";

    //Insert Date of Birth 10
    const date = new Date(groupInfo[i].dateOfBirth);
    date.setDate(date.getDate() + 1);
    const birthDateString = date.toISOString().split("T")[0].split("-");
    const formattedBirthDate = `${birthDateString[2]}/${birthDateString[1]}/${birthDateString[0]}`;
    individual += formattedBirthDate;

    //Insert common birth 9
    individual += groupInfo[i].placeOfBirth.Codice;

    //Insert provice onf birth 2
    individual += groupInfo[i].placeOfBirth.Provincia;

    //Insert state of birth 9
    if (groupInfo[i].placeOfBirth.Provincia === "ES")
      individual += groupInfo[i].placeOfBirth.Codice;
    else individual += "100000100";

    //Insert citizenship
    individual += groupInfo[i].citizenship.Codice;

    //Insert document type
    if (groupInfo[i].documentType.Codice !== undefined)
      individual += groupInfo[i].documentType.Codice;
    else individual += " ".repeat(5);

    //Insert document Number
    if (groupInfo[i].documentNumber !== "") {
      individual += groupInfo[i].documentNumber;
      individual += " ".repeat(20 - groupInfo[i].documentNumber.length);
    } else individual += " ".repeat(20);

    //Insert Place of ReleaseDocument
    if (groupInfo[i].placeOfReleaseDocument.Codice !== undefined)
      individual += groupInfo[i].placeOfReleaseDocument.Codice;
    else individual += " ".repeat(9);
    individual += "</string>";
    result += individual;
  }
  return result;
};

export const getApartmentId = (nickname) => {
  const mapping = {
    "Ghiberti - 4A": {
      apartmentId: "000001",
      policyId: 1,
    },
    "Ghiberti - 4B": {
      apartmentId: "000001",
      policyId: 1,
    },
    "Ghiberti - 4C": {
      apartmentId: "000001",
      policyId: 1,
    },
    "Ghiberti - 5A": {
      apartmentId: "000004",
      policyId: 2,
    },
    "Ghiberti - 5B": {
      apartmentId: "000005",
      policyId: 2,
    },
    "Ghiberti - 6A": {
      apartmentId: "000007",
      policyId: 2,
    },
    "Ghiberti - 6B": {
      apartmentId: "000008",
      policyId: 2,
    },
    "Ghiberti - 7A": {
      apartmentId: "000010",
      policyId: 2,
    },
    "Ghiberti - 7B": {
      apartmentId: "000009",
      policyId: 2,
    },
    "Ghiberti - 7C": {
      apartmentId: "000011",
      policyId: 2,
    },
    "Ghiberti - 8A": {
      apartmentId: "000012",
      policyId: 2,
    },
    "Ghiberti - 8B": {
      apartmentId: "000013",
      policyId: 2,
    },
    "Ghiberti - 8C": {
      apartmentId: "000014",
      policyId: 2,
    },
    "Ghiberti - 1A": {
      apartmentId: "000002",
      policyId: 1,
    },
    "Ghiberti - 1B": {
      apartmentId: "000002",
      policyId: 1,
    },
    "Ghiberti - 2A": {
      apartmentId: "000003",
      policyId: 1,
    },
    "Ghiberti - 2B": {
      apartmentId: "000003",
      policyId: 1,
    },
    "Ghiberti - 2C": {
      apartmentId: "000003",
      policyId: 1,
    },
    "Ghiberti - 5": {
      apartmentId: "000004",
      policyId: 2,
    },
    "Ghiberti - 6": {
      apartmentId: "000007",
      policyId: 2,
    },
    "Lazzaro - 1": {
      apartmentId: "000004",
      policyId: 1,
    },
    "Lazzaro - 2": {
      apartmentId: "000004",
      policyId: 1,
    },
    "Lazzaro - 3": {
      apartmentId: "000004",
      policyId: 1,
    },
    "Lazzaro - 4": {
      apartmentId: "000004",
      policyId: 1,
    },
    // "Lazzaro - 5": {
    //   apartmentId: "000004",
    //   policyId: 1,
    // },
    "Lazzaro - 6": {
      apartmentId: "000004",
      policyId: 1,
    },
    // "Lazzaro - 7": {
    //   apartmentId: "000004",
    //   policyId: 1,
    // },
    // "Lazzaro - 8": {
    //   apartmentId: "000004",
    //   policyId: 1,
    // },
    // "Lazzaro - 9": {
    //   apartmentId: "000004",
    //   policyId: 1,
    // },
    // "Milan - B Victory": {
    //   apartmentId: "000004",
    //   policyId: 1,
    // },
    // "Milan - SottoLoft": {
    //   apartmentId: "000004",
    //   policyId: 1,
    // },
    // "Milan - A Champagne": {
    //   apartmentId: "000004",
    //   policyId: 1,
    // },
    // "Milan - De Angeli": {
    //   apartmentId: "000004",
    //   policyId: 1,
    // },
    // "Milan - AB Kitchen": {
    //   apartmentId: "000004",
    //   policyId: 1,
    // },
    // "Milan Poma": {
    //   apartmentId: "000004",
    //   policyId: 1,
    // },
    // "Trieste - Spiridione": {
    //   apartmentId: "000004",
    //   policyId: 1,
    // },
  };
  return mapping[nickname];
};

export const getAddressInfo = async (address) => {
  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    {
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    }
  );

  let results = response.data.results;
  let province = "";
  let postalCode = "";

  // Loop through the address components to find province and postal code
  results[0].address_components.forEach((component) => {
    if (component.types.includes("administrative_area_level_2")) {
      province = component.short_name; // Province
    }
    if (component.types.includes("postal_code")) {
      postalCode = component.long_name; // Postal code
    }
  });

  return { province, postalCode };
};

export const postNoteOnGuestyInbox = async (groupInfo, reservationInfo) => {
  let guestyAuthKey = fs.readFileSync("./config.js", "utf-8");
  const conversationInfo = await fetchConversationInfo(
    guestyAuthKey,
    reservationInfo
  );

  guestyAuthKey = fs.readFileSync("./config.js", "utf-8");
  await postNoteToConversationWithoutSending(
    guestyAuthKey,
    groupInfo,
    conversationInfo._id
  );
};

export const getAuthenticationToken = async (policyId) => {
  let policyUsername, policyPassword, policyWSkey;
  if (policyId === 1) {
    policyUsername = process.env.POLICY_SERVICE_USER_NAME_1;
    policyPassword = process.env.POLICY_SERVICE_PASSWORD_1;
    policyWSkey = process.env.POLICY_SERVICE_WSKEY_1;
  } else if (policyId === 2) {
    policyUsername = process.env.POLICY_SERVICE_USER_NAME_2;
    policyPassword = process.env.POLICY_SERVICE_PASSWORD_2;
    policyWSkey = process.env.POLICY_SERVICE_WSKEY_2;
  }
  try {
    const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
          <soap12:Body>
            <GenerateToken xmlns="AlloggiatiService">
              <Utente>${policyUsername}</Utente>
              <Password>${policyPassword}</Password>
              <WsKey>${policyWSkey}</WsKey>
              <result>
                <ErroreDettaglio>string</ErroreDettaglio>
              </result>
            </GenerateToken>
          </soap12:Body>
        </soap12:Envelope>`;
    const response = await axios.post(
      "https://alloggiatiweb.poliziadistato.it/service/service.asmx",
      soapRequest,
      {
        headers: {
          "Content-Type": "application/soap+xml; charset=utf-8",
        },
      }
    );
    const result = response.data;
    return result.split(/<\/?token>/)[1];
  } catch (err) {
    console.log("Get Authentication Token");
  }
};
