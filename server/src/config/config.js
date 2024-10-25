import Schema from "../model/Schema.js";
import ReceiptNumber from "../model/ReceiptNumber.js";
import InvoiceNumber from "../model/InvoiceNumber.js";
import Apartment from "../model/Apartment.js";

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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
