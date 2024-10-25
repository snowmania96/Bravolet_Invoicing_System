import axios from "axios";
import fs from "fs";

export const saveGuestyAuthKey = async () => {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  };

  try {
    const response = await axios.post(
      "https://open-api.guesty.com/oauth2/token",
      {
        grant_type: "client_credentials",
        scope: "open-api",
        client_secret: process.env.GUESTY_CLIENT_SECRET,
        client_id: process.env.GUESTY_CLIENT_ID,
      },
      config
    );
    // return response.data.access_token;
    // console.log(response.data.access_token);
    fs.writeFileSync("config.js", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.log(error);
  }
};

// module.exports = getGuestyAuthKey;
