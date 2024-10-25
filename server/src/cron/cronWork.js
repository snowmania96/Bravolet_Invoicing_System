import Apartment from "../model/Apartment.js";
import User from "../model/User.js";
import fs from "fs";

import {
  fetchReservationId,
  fetchReservationInfo,
} from "./apiintegration/GuestyApi.js";
import { createNewReceipt } from "./apiintegration/FattureApi.js";
import { getReceiptNumber, updateReceiptNumber } from "../config/config.js";

export const cronWork = async (day) => {
  try {
    //Get Auth key from the config.js
    let guestyAuthKey = fs.readFileSync("./config.js", "utf8");

    //Fetch reservation list checking out this day
    const reservationIdList = await fetchReservationId(guestyAuthKey, day);

    //Get Auth Key again cause it can be changed in fetchreservationId fuction.
    guestyAuthKey = fs.readFileSync("./config.js", "utf8");

    //Create temp receipt to the Fatture
    for (let i = 0; i < reservationIdList.length; i++) {
      if (reservationIdList[i].status != "confirmed") continue;
      const reservationInfo = await fetchReservationInfo(
        guestyAuthKey,
        reservationIdList[i]._id
      );
      //Fetch receipt document number from database
      const receiptNumber = await getReceiptNumber(day);

      // //Create Temp Fatture Receipts.
      const result = await createNewReceipt(reservationInfo, receiptNumber);

      // //Update document number
      await updateReceiptNumber(receiptNumber + 1);

      //Save in Database
      const findApartment = await Apartment.findOne({
        name: reservationInfo.listing.nickname,
      });
      if (!findApartment) {
        await Apartment.create({
          name: reservationInfo.listing.nickname || "",
          photo: reservationInfo.listing.picture.thumbnail || "",
          address: reservationInfo.listing.address.full || "",
        });
      }
      const findGuest = await User.findOne({
        confirmationCode: reservationInfo.confirmationCode,
      });
      if (!findGuest) {
        await User.create({
          name: reservationInfo.guest.fullName,
          address: reservationInfo.guest.hometown,
          phoneNumber: reservationInfo.guest.phone,
          confirmationCode: reservationInfo.confirmationCode,
          reservationId: reservationInfo._id,
          checkIn: reservationInfo.checkIn.split("T")[0],
          checkOut: reservationInfo.checkOut.split("T")[0],
          documentId: result.data.id,
          extra: result.data.url,
          role: "user",
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
