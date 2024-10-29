import { Box, Button, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import BoltIcon from "@mui/icons-material/Bolt";
import IduploadInputField from "components/IduploadInputField";
import IduploadSelectField from "components/IduploadSelectField";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export default function Idupload() {
  const [formData, setFormData] = useState({
    surname: "",
    givenname: "",
    gender: "",
    arriveDate: "",
    stayDates: "",
    accomodationType: "",
    numberOfAccommodation: "",
    dateOfBirth: dayjs("2022-04-17"),
    placeOfBirth: "",
    citizenship: "",
    documentType: "",
    documentNumber: "",
    placeOfReleaseDocument: "",
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="jumbotron text-center" style={{ textAlign: "center" }}>
        <Typography variant="h1">Bravolet Invoicing System</Typography>
        <Typography className="mt-3" variant="h3">
          Upload Your ID Document
        </Typography>
      </div>
      <div className="mt-4 container" style={{ width: "700px" }}>
        <form className="was-validated">
          <Box
            component="section"
            sx={{ p: 2, border: "1px solid black", borderRadius: "10px" }}
          >
            <div className="d-flex flex-row">
              <div className="col-7 m-auto">
                <Typography variant="h5" fontWeight="bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-lightning-charge-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" />
                  </svg>{" "}
                  UPLOAD PASSPORT
                </Typography>
                <div className="mt-2">
                  Upload your ID with the type of jpg, png
                </div>
              </div>
              <div className="d-flex col-5 m-auto justify-content-center">
                <Button
                  variant="contained"
                  color="success"
                  className="p-2 w-75"
                >
                  Upload ID Document
                </Button>
              </div>
            </div>
          </Box>
          <div className="d-flex flex-row mt-3">
            <p className="text-danger">*</p>
            <p className="text-secondary">Required</p>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <Typography variant="h3" color="grey">
              Personal information
            </Typography>
            <Button variant="contained">Clear</Button>
          </div>

          <Divider
            style={{
              marginTop: "5px",
              borderBottomWidth: "1px",
              backgroundColor: "grey",
            }}
          />
          <div className="d-flex flex-row justify-content-between">
            <div className="mr-1 w-100">
              <IduploadInputField
                name={"surname"}
                fieldName={"Surname"}
                onChange={onChange}
                value={formData.surname}
              />
            </div>
            <div className="ml-1 w-100">
              <IduploadInputField
                name={"givenname"}
                fieldName={"Given Name"}
                onChange={onChange}
                value={formData.givenname}
              />
            </div>
          </div>

          <div className="d-flex flex-row justify-content-between">
            <div className="w-100 mt-3">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{
                    paddingTop: "-8px",
                  }}
                >
                  <DemoItem>
                    <label className="form-label">Date of Birth</label>
                    <div>
                      <DatePicker
                        value={formData.dateOfBirth}
                        sx={{ marginTop: "2px", width: "331px" }}
                        slotProps={{ textField: { size: "small" } }}
                        onChange={(e) => {
                          setFormData({ ...formData, dateOfBirth: e });
                        }}
                      />
                    </div>

                    <div
                      style={{
                        width: "100%",
                        marginTop: ".25rem",
                        fontSize: "80%",
                        color: "#28a745",
                      }}
                    >
                      This field is required
                    </div>
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div className="w-100 ml-1">
              <IduploadSelectField
                name={"gender"}
                fieldName={"Gender"}
                onChange={onChange}
                value={formData.gender}
                selectItems={["Male", "Female"]}
              />
            </div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <div className="mr-1 w-100">
              <IduploadInputField
                name={"citizenship"}
                fieldName={"Citizenship"}
                onChange={onChange}
                value={formData.citizenship}
              />
            </div>
            <div className="ml-1 w-100">
              <IduploadInputField
                name={"placeOfBirth"}
                fieldName={"Place of Birth"}
                onChange={onChange}
                value={formData.placeOfBirth}
              />
            </div>
          </div>
          <IduploadInputField
            name={"placeOfReleaseDocument"}
            fieldName={"Place of Release Document"}
            onChange={onChange}
            value={formData.placeOfReleaseDocument}
          />
          <div className="d-flex flex-row justify-content-between">
            <div className="mr-1 w-100">
              <IduploadInputField
                name={"documentType"}
                fieldName={"Document Type"}
                onChange={onChange}
                value={formData.documentType}
              />
            </div>
            <div className="ml-1 w-100">
              <IduploadInputField
                name={"documentNumber"}
                fieldName={"Document Number"}
                onChange={onChange}
                value={formData.documentNumber}
              />
            </div>
          </div>
          <div>
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
