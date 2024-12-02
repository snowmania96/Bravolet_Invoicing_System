import { S3Client, PutObjectCommand, ExpressionType } from "@aws-sdk/client-s3";
import fs from "fs";
import { fetchReservationInfoFromConfirmationCode } from "../cron/apiintegration/GuestyApi.js";
import {
  generatePolicyServiceText,
  getApartmentId,
  getAuthenticationToken,
  postNoteOnGuestyInbox,
} from "../config/config.js";
import axios from "axios";
import mindee from "mindee";
import Id from "../model/Id.js";

export const idUpload = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const filetype = req.file.mimetype.split("/")[1];

  const ssecKey = Buffer.from(process.env.S3_ENCRYPT_KEY).toString("base64");
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${req.params.id}(${ip}).${filetype}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    ACL: "private",
    SSECustomerAlgorithm: "AES256",
    SSECustomerKey: ssecKey,
  };

  const s3Client = new S3Client({
    region: "us-west-2", // e.g., 'us-west-2'
    endpoint: process.env.S3_END_POINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  });

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    //Extract information from ID url=> signedUrl
    const mindeeClient = new mindee.Client({
      apiKey: process.env.MINDEE_API_KEY,
    });

    const idSource = mindeeClient.docFromBuffer(
      req.file.buffer,
      req.file.originalname
    );

    const apiResponse = await mindeeClient.enqueueAndParse(
      mindee.product.InternationalIdV2,
      idSource
    );

    const extractedIdinfo = apiResponse.document.inference.prediction;

    if (extractedIdinfo.surnames[0] === undefined) {
      return res.status(400).json("Invalid Image File");
    }

    const idInfo = {
      givenname:
        extractedIdinfo.givenNames[0].value === undefined
          ? ""
          : extractedIdinfo.givenNames[0].value,
      surname:
        extractedIdinfo.surnames[0].value === undefined
          ? ""
          : extractedIdinfo.surnames[0].value,
      birthDate:
        extractedIdinfo.birthDate.value === undefined
          ? "2024-01-01"
          : extractedIdinfo.birthDate.value,
      documentNumber:
        extractedIdinfo.documentNumber.value == undefined
          ? ""
          : extractedIdinfo.documentNumber.value,
      gender:
        extractedIdinfo.sex.value === undefined
          ? ""
          : extractedIdinfo.sex.value,
      nationality:
        extractedIdinfo.nationality.value === undefined
          ? "ITA"
          : extractedIdinfo.nationality.value,
      documentType:
        extractedIdinfo.documentType.value === undefined
          ? ""
          : extractedIdinfo.documentType.value,
      placeOfBirth:
        extractedIdinfo.birthPlace.value === undefined
          ? ""
          : extractedIdinfo.birthPlace.value,
    };

    res.status(200).json(idInfo);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file");
  }
};

export const sendToPolicyService = async (req, res) => {
  try {
    const { groupInfo, reservationInfo } = req.body;
    const serivceText = generatePolicyServiceText(
      reservationInfo.nightsCount,
      groupInfo,
      new Date().toISOString()
    );

    const policyServiceInfo = getApartmentId(reservationInfo.listing.nickname);
    let soapRequest, policyId, authKey, policyUsername;

    const currentTime = new Date();
    const checkInTime = new Date(reservationInfo.checkIn.split("T")[0]);

    //Enusre sent to policy service or not
    let sent = "false";

    //For the apartment still don't get permission.
    if (policyServiceInfo === undefined || currentTime < checkInTime) {
      policyId = 1;
      policyUsername = process.env.POLICY_SERVICE_USER_NAME_1;
      authKey = await getAuthenticationToken(policyId);

      //Test to send policy service.
      soapRequest = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
          <soap12:Body>
            <GestioneAppartamenti_Test xmlns="AlloggiatiService">
              <Utente>${policyUsername}</Utente>
              <token>${authKey}</token>
              <ElencoSchedine>
                ${serivceText}
              </ElencoSchedine>
              <IdAppartamento>000001</IdAppartamento>
            </GestioneAppartamenti_Test>
          </soap12:Body>
        </soap12:Envelope>`;
    } else {
      sent = "true";
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
                ${serivceText}
              </ElencoSchedine>
              <IdAppartamento>${policyServiceInfo.apartmentId}</IdAppartamento>
            </GestioneAppartamenti_Send>
          </soap12:Body>
        </soap12:Envelope>`;
    }
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
      const realServiceText = generatePolicyServiceText(
        reservationInfo.nightsCount,
        groupInfo,
        reservationInfo.checkIn
      );
      const idInfo = await Id.create({
        confirmationCode: req.params.id,
        guestInfoText: realServiceText,
        checkIn: reservationInfo.checkIn.split("T")[0],
        sent: sent,
        nickname: reservationInfo.listing.nickname,
      });
      if (idInfo) {
        //Post Note on Guesty Inbox
        await postNoteOnGuestyInbox(groupInfo, reservationInfo);

        return res.status(200).json("Succeed");
      } else {
        return res.status(422).json("Saving in our Database is failed");
      }
    } else return res.status(400).json("Input Data error");
  } catch (err) {
    res.status(500).json("Policy server error");
  }
};

export const fetchReservation = async (req, res) => {
  try {
    // get the location of IP
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    // const ip = "14.139.128.17";
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    let location = "";
    fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IP_GEOLOCATION_API_KEY}&ip=${ip}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        location = JSON.parse(result).country_name;
      })
      .catch((error) => console.error(error));

    const { id } = req.params;
    let guestyAuthKey = fs.readFileSync("./config.js", "utf8");
    const reservationInfo = await fetchReservationInfoFromConfirmationCode(
      guestyAuthKey,
      id
    );
    // console.log(reservationInfo);
    const idInfo = await Id.findOne({ confirmationCode: id });

    const now = new Date();
    //Set Expiration Date as the next day of the Check In Date
    const nextDay = new Date(reservationInfo.checkIn.split("T")[0]);
    nextDay.setDate(nextDay.getDate() + 1);
    const formattedDate = nextDay.toISOString().split("T")[0];
    const expirationDate = new Date(formattedDate);

    if (!reservationInfo) return res.status(404).json("Not Found");

    if (idInfo) return res.status(400).json("You can upload once");

    if (now > expirationDate)
      return res
        .status(400)
        .json("You can upload before the next day of check in");

    return res.status(200).json({ reservationInfo, location });
  } catch {
    res.status(404).json("note found the confirmation code");
  }
};

export const getIdInfos = async (req, res) => {
  try {
    const IDs = await Id.find({});
    return res.status(200).json(IDs);
  } catch (err) {
    console.log(err);
  }
};

export const getIdInfo = async (req, res) => {
  try {
    const ID = await Id.findOne({ confirmationCode: req.params.id });
    if (ID) {
      return res.status(200).json(ID);
    }
  } catch (err) {
    console.log(err);
  }
};

export const test = async (req, res) => {
  try {
    const guestInfo = await Id.find({ checkIn: req.params.id, sent: "false" });
    return res.status(200).json(guestInfo);
  } catch (err) {
    console.log(err);
  }
};
