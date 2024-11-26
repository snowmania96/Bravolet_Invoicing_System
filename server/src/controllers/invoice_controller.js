import {
  getCityTax,
  getInvoiceNumber,
  updateInvoiceNumber,
} from "../config/config.js";
import { fetchReservationInfo } from "../cron/apiintegration/GuestyApi.js";
import User from "../model/User.js";
import fs from "fs";
import {
  createInvoice,
  deleteReceipt,
  getDocument,
  sendEmail,
  updateReceipt,
} from "../cron/apiintegration/FattureApi.js";

export const getReservationInfo = async (req, res) => {
  try {
    const guest = await User.findOne({ confirmationCode: req.params.id });
    if (!guest) {
      return res
        .status(404)
        .json({ error: "You have no permission to see this page." });
    }
    const reservationId = guest.reservationId;
    let guestyAuthKey = fs.readFileSync("./config.js", "utf8");

    //Fetch Reservation info from the Guesty
    const reservationInfo = await fetchReservationInfo(
      guestyAuthKey,
      reservationId
    );

    const cityTax = getCityTax(reservationInfo);

    const result = {
      guestName: reservationInfo.guest.fullName,
      reservationId: reservationId,
      checkIn: guest.checkIn,
      checkOut: guest.checkOut,
      listingFullName: reservationInfo.listing.title,
      listingAddress: reservationInfo.listing.address.full,
      grandTotal: cityTax.flag
        ? reservationInfo.money.hostPayout - cityTax.amount
        : reservationInfo.money.hostPayout,
      maxTouristTax: cityTax.amount,
      extra: guest.extra,
      finalized: guest.finalized,
    };
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const sendInvoiceInfo = async (req, res) => {
  try {
    const invoiceInfo = req.body;
    const guest = await User.findOne({ confirmationCode: req.params.id });

    const reservationId = guest.reservationId;
    let guestyAuthKey = fs.readFileSync("./config.js", "utf8");

    //Fetch Reservation info from the Guesty
    const reservationInfo = await fetchReservationInfo(
      guestyAuthKey,
      reservationId
    );

    let pdfUrl,
      documentNumber,
      documentId = guest.documentId;
    //Check individual or company
    if (invoiceInfo.isIndividual === "individual") {
      //Update Receipt
      const updatedReceipt = await updateReceipt(
        reservationInfo,
        invoiceInfo,
        guest.documentId
      );
      const document = await getDocument(guest.documentId);
      documentNumber = `ricevuta nr. ${document.data.number}/R`;
      pdfUrl = updatedReceipt.data.url;
    } else if (invoiceInfo.isIndividual === "company") {
      //Delete the Receipt
      const response = await deleteReceipt(guest.documentId);
      const today = new Date().toISOString().split("T")[0];

      //Get invoiceNumber
      const invoiceNumber = await getInvoiceNumber(today);

      //Create an invoice
      const invoice = await createInvoice(
        reservationInfo,
        invoiceInfo,
        invoiceNumber
      );
      documentNumber = `fattura nr. ${invoiceNumber}/E`;
      pdfUrl = invoice.data.url;
      documentId = invoice.data.id;
      //Update invoiceNumber
      await updateInvoiceNumber(invoiceNumber + 1);
    }

    //Update our database
    const newGuest = await User.findOneAndUpdate(
      { confirmationCode: req.params.id },
      {
        ...guest._doc,
        contactEmail: invoiceInfo.email,
        address: invoiceInfo.address,
        country: invoiceInfo.country,
        companyName: invoiceInfo.companyName,
        vatNumber: invoiceInfo.vat,
        billingCode: invoiceInfo.billingCode,
        pecAddress: invoiceInfo.pecAddress,
        documentId: documentId,
        extra: pdfUrl,
        finalized: true,
      }
    );

    //Send message to Guests
    const result = await sendEmail(documentNumber, documentId, invoiceInfo);

    return res.status(200).json(pdfUrl);
  } catch (err) {
    console.log(err);
  }
  //Save in our Database
};
