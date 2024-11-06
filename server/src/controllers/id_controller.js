import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import { fetchReservationInfoFromConfirmationCode } from "../cron/apiintegration/GuestyApi.js";
import { generatePolicyServiceText } from "../config/config.js";
import axios from "axios";
import mindee from "mindee";

export const idUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${req.params.id}.jpg`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
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
    const urlCommand = new GetObjectCommand({
      Bucket: params.Bucket,
      Key: params.Key,
    });
    const signedUrl = await getSignedUrl(s3Client, urlCommand, {
      expiresIn: 3600,
    });

    //Extract information from ID url=> signedUrl
    const mindeeClient = new mindee.Client({
      apiKey: process.env.MINDEE_API_KEY,
    });

    const idSource = mindeeClient.docFromUrl(signedUrl);

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
    const groupInfo = req.body;
    const confirmationCode = req.params.id;
    let guestyAuthKey = fs.readFileSync("./config.js", "utf8");
    const reservationInfo = await fetchReservationInfoFromConfirmationCode(
      guestyAuthKey,
      confirmationCode
    );
    const serivceText = generatePolicyServiceText(
      reservationInfo.nightsCount,
      groupInfo
    );
    const authKey = await getAuthenticationToken();
    //Send it to the Police Service
    const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
          <GestioneAppartamenti_Test xmlns="AlloggiatiService">
            <Utente>${process.env.POLICY_SERVICE_USER_NAME}</Utente>
            <token>${authKey}</token>
            <ElencoSchedine>
              ${serivceText}
            </ElencoSchedine>
            <IdAppartamento>000001</IdAppartamento>
          </GestioneAppartamenti_Test>
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
    if (flag) res.status(200).json("Succeed");
    else res.status(400).json("Input Data error");
  } catch (err) {
    res.status(500).json("Policy server error");
  }
};

const getAuthenticationToken = async () => {
  try {
    const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
          <soap12:Body>
            <GenerateToken xmlns="AlloggiatiService">
              <Utente>${process.env.POLICY_SERVICE_USER_NAME}</Utente>
              <Password>${process.env.POLICY_SERVICE_PASSWORD}</Password>
              <WsKey>${process.env.POLICY_SERVICE_WSKEY}</WsKey>
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
