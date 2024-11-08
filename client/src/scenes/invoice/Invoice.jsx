import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import InputField from "components/InputField";
import InputCountrySelect from "components/InputCountrySelect";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import GoogleMaps from "components/GoogleMaps";

const END_POINT = process.env.REACT_APP_BASE_URL;

export default function Invoice() {
  const theme = useTheme();
  const [formData, setFormaData] = useState({
    name: "",
    surname: "",
    companyName: "",
    address: "",
    country: "Italy",
    email: "",
    vat: "",
    billingCode: "",
    pecAddress: "",
    isIndividual: "individual",
    cityTax: 0,
  });
  const { id } = useParams();
  const [invoiceInfo, setInvoiceInfo] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);

  useEffect(() => {
    fetchInvoiceInfo();
  }, []);

  const fetchInvoiceInfo = async () => {
    try {
      const response = await axios.get(`${END_POINT}/invoice/${id}`);
      //Expiration Date
      const today = new Date();
      const dateObject = new Date(response.data.checkOut);
      if (today < dateObject) {
        setShowErrorMessage(true);
      }
      dateObject.setDate(dateObject.getDate() + 15);
      if (today > dateObject) {
        return window.location.replace(response.data.extra);
      }

      //Already Finalized
      if (response.data.finalized === true) {
        return window.location.replace(response.data.extra);
      }
      setInvoiceInfo(response.data);
    } catch (err) {
      setShowErrorMessage(true);
    }
  };

  const handleChange = (e) => {
    setFormaData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmited(true);
    try {
      const response = await axios.post(`${END_POINT}/invoice/${id}`, formData);
      window.location.replace(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="background">
      {showErrorMessage ? (
        <Card className="errorCard">
          <div style={{ textAlign: "center", margin: "auto" }}>
            You can download your receipt and pay the tourist tax on your
            check-out date
          </div>
        </Card>
      ) : (
        <Card
          className="card"
          sx={{
            backgroundColor: theme.palette.background.alt,
            margin: "auto",
          }}
        >
          <CardContent style={{ margin: "auto" }}>
            <form onSubmit={handleSubmit}>
              {/* <Typography variant="h1">Stefan Jeremic</Typography>
               */}
              <div className="guestName">{invoiceInfo.guestName}</div>
              <div className="reservationInfo">
                {`Reservation from ${invoiceInfo.checkIn} to ${invoiceInfo.checkOut} at ${invoiceInfo.listingFullName} (${invoiceInfo.listingAddress})`}
              </div>
              <div className="selectRadio">
                <div className="represent">I represent</div>
                <FormControl>
                  <RadioGroup
                    name="isIndividual"
                    onChange={handleChange}
                    value={formData.isIndividual}
                  >
                    <div className="formControl">
                      <FormControlLabel
                        value="individual"
                        control={<Radio color="success" />}
                        label={
                          <div className="isIndividual"> an Individual</div>
                        }
                      />
                      <FormControlLabel
                        value="company"
                        control={<Radio color="success" />}
                        label={<div className="isIndividual"> a Company</div>}
                      />
                    </div>
                  </RadioGroup>
                </FormControl>
              </div>
              {formData.isIndividual === "individual" ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <InputField
                      name={"name"}
                      onChange={handleChange}
                      value={formData.name}
                      fieldName={"Name"}
                    />
                    <InputField
                      name={"surname"}
                      onChange={handleChange}
                      value={formData.surname}
                      fieldName={"Surname"}
                    />
                  </div>
                  <GoogleMaps formData={formData} setFormData={setFormaData} />
                  <InputCountrySelect
                    name={"country"}
                    value={formData.country}
                    onChange={handleChange}
                  />
                  <InputField
                    name={"email"}
                    onChange={handleChange}
                    value={formData.email}
                    fieldName={"Email"}
                  />
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <InputField
                    name={"companyName"}
                    onChange={handleChange}
                    value={formData.companyName}
                    fieldName={`Company Name`}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <InputField
                      name={"name"}
                      onChange={handleChange}
                      value={formData.name}
                      fieldName={"Name"}
                    />
                    <InputField
                      name={"surname"}
                      onChange={handleChange}
                      value={formData.surname}
                      fieldName={"Surname"}
                    />
                  </div>
                  <GoogleMaps formData={formData} setFormData={setFormaData} />
                  <div className="vatFieldDirection">
                    <InputCountrySelect
                      name={"country"}
                      value={formData.country}
                      onChange={handleChange}
                    />
                    <InputField
                      name={"vat"}
                      onChange={handleChange}
                      value={formData.vat}
                      fieldName={"VAT"}
                    />
                  </div>
                  {formData.country === "Italy" && (
                    <div>
                      <InputField
                        name={"billingCode"}
                        onChange={handleChange}
                        value={formData.billingCode}
                        fieldName={"Codice Fatturazione"}
                      />
                      <InputField
                        name={"pecAddress"}
                        onChange={handleChange}
                        value={formData.pecAddress}
                        fieldName={"Indirizzo PEC"}
                      />
                    </div>
                  )}

                  <InputField
                    name={"email"}
                    onChange={handleChange}
                    value={formData.email}
                    fieldName={"Email"}
                  />
                </div>
              )}
              <Divider
                style={{
                  marginTop: "15px",
                  borderBottomWidth: "3px",
                  backgroundColor: "black",
                }}
              />
              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <div className="isIndividual">Total rent paid</div>
                <div className="isIndividual">
                  {Math.round(invoiceInfo.grandTotal * 100) / 100} Euro
                </div>
              </div>
              <div className="declareText">
                I declare, under my responsibility, to have paid in cash or{" "}
                <a
                  href="https://buy.stripe.com/00g4ip47qfxJcLu148"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  online using this link
                </a>{" "}
                the tourist tax equal to
              </div>
              <div className="totalMoney">
                <TextField
                  variant="outlined"
                  color="default"
                  size="small"
                  type="number"
                  name="cityTax"
                  value={formData.cityTax}
                  inputProps={{
                    min: 0,
                    max: invoiceInfo.maxTouristTax,
                    step: 0.1,
                    style: {
                      fontSize: window.innerWidth > 1000 ? 20 : 16,
                      textAlign: "center",
                    },
                  }}
                  onChange={handleChange}
                  required
                />
                Euro
              </div>

              <div className="finalButtonField">
                {isSubmited ? (
                  <Button type="submit" variant="contained" disabled>
                    {/* <Button variant="contained" onClick={handleSubmit}> */}
                    <div className="finalButton">
                      {formData.isIndividual === "individual"
                        ? "Download Receipt"
                        : "Download Invoice"}
                    </div>
                  </Button>
                ) : (
                  <Button type="submit" variant="contained">
                    {/* <Button variant="contained" onClick={handleSubmit}> */}
                    <div className="finalButton">
                      {formData.isIndividual === "individual"
                        ? "Download Receipt"
                        : "Download Invoice"}
                    </div>
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
