import axios from "axios";
import Id from "../model/Id.js";
import { getApartmentId, getAuthenticationToken } from "../config/config.js";

export const cronWork1 = async (day) => {
  try {
    console.log(day);
    const unSubmitted = await Id.find({ checkIn: day, submitted: false });
    console.log(unSubmitted);
    for (let i = 0; i < unSubmitted.length; i++) {
      const policyServiceInfo = getApartmentId(unSubmitted[i].nickname);
      let soapRequest, policyId, authKey, policyUsername;
      if (policyServiceInfo === undefined) {
        await Id.findOneAndUpdate(
          { confirmationCode: unSubmitted[i].confirmationCode },
          { submitted: true },
          { new: true }
        );
      } else {
        policyId = policyServiceInfo.policyId;
        authKey = await getAuthenticationToken(policyId);
        if (policyId === 1) {
          policyUsername = process.env.POLICY_SERVICE_USER_NAME_1;
        } else if (policyId === 2) {
          policyUsername = process.env.POLICY_SERVICE_USER_NAME_2;
        }

        soapRequest = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
          <soap12:Body>
            <GestioneAppartamenti_Send xmlns="AlloggiatiService">
              <Utente>${policyUsername}</Utente>
              <token>${authKey}</token>
              <ElencoSchedine>
                ${unSubmitted[i].guestInfoText}
              </ElencoSchedine>
              <IdAppartamento>${policyServiceInfo.apartmentId}</IdAppartamento>
            </GestioneAppartamenti_Send>
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

        let flag = true;
        const checkResult = response.data.split(/<\/?esito>/);
        for (let i = 1; i < checkResult.length; i += 2) {
          if (checkResult[i] === "false") flag = false;
        }
        if (flag) {
          const updated = await Id.findOneAndUpdate(
            { confirmationCode: unSubmitted[i].confirmationCode },
            { submitted: true, sent: true },
            { new: true }
          );
          console.log(updated);
        }
      }
    }
  } catch (err) {
    console.log("cronwork1 failed", err);
  }
};
