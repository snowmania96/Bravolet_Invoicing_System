import fs from "fs";
import { fetchReservationInfoFromConfirmationCode } from "../cron/apiintegration/GuestyApi.js";
import { getNotes } from "../config/config.js";

export const fetchNote = async (req, res) => {
  try {
    const { id } = req.params;
    let guestyAuthKey = fs.readFileSync("./config.js", "utf8");
    const reservationInfo = await fetchReservationInfoFromConfirmationCode(
      guestyAuthKey,
      id
    );
    const note = await getNotes(reservationInfo);
    return res.status(200).json(note);
  } catch (err) {
    console.log(err);
  }
};
