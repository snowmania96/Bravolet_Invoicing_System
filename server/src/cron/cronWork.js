import Apartment from "../model/Apartment.js";
import User from "../model/User.js";
import fs from "fs";

import {
  fetchReservationId,
  fetchReservationInfo,
} from "./apiintegration/GuestyApi.js";
import { createNewReceipt } from "./apiintegration/FattureApi.js";
import {
  getApartmentId,
  getAuthenticationToken,
  getReceiptNumber,
  updateReceiptNumber,
} from "../config/config.js";
import Id from "../model/Id.js";

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

      //Send geust info to policy service.

      //find ids have to be send today.
      const guestInfo = await Id.find({
        checkIn: day,
        sent: "false",
        submitted: true,
      });
      for (let i = 0; i < guestInfo.length; i++) {
        const policyServiceInfo = getApartmentId(guestInfo[i].nickname);
        console.log(policyServiceInfo);
        let soapRequest, policyId, authKey, policyUsername;

        //For the apartment still don't get permission.
        if (policyServiceInfo === undefined) {
          continue;
        } else {
          policyId = policyServiceInfo.policyId;
          authKey = await getAuthenticationToken(policyId);

          if (policyId === 1) {
            policyUsername = process.env.POLICY_SERVICE_USER_NAME_1;
          } else if (policyId === 2) {
            policyUsername = process.env.POLICY_SERVICE_USER_NAME_2;
          }

          //Send it to the Police Service
          soapRequest = `<?xml version="1.0" encoding="utf-8"?>
            <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
              <soap12:Body>
                <GestioneAppartamenti_Send xmlns="AlloggiatiService">
                  <Utente>${policyUsername}</Utente>
                  <token>${authKey}</token>
                  <ElencoSchedine>
                    ${guestInfo[i].guestInfoText}
                  </ElencoSchedine>
                  <IdAppartamento>${policyServiceInfo.apartmentId}</IdAppartamento>
                </GestioneAppartamenti_Send>
              </soap12:Body>
            </soap12:Envelope>`;
        }
        await axios.post(
          "https://alloggiatiweb.poliziadistato.it/service/service.asmx",
          soapRequest,
          {
            headers: {
              "Content-Type": "application/soap+xml; charset=utf-8",
            },
          }
        );
        const idInfo = await Id.findOneAndUpdate(
          { confirmationCode: guestInfo[i].confirmationCode },
          { sent: "false->true" },
          { new: true }
        );
      }
    }
  } catch (err) {
    console.log("cron work error", err);
  }
};
