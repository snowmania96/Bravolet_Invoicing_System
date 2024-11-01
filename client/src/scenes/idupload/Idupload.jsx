import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import IduploadInputField from "components/IduploadInputField";
import IduploadSelectField from "components/IduploadSelectField";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import IduploadAutocomplete from "components/IduploadAutocomplete";
import documenti from "scenes/idupload/documenti.json";
import comuni from "scenes/idupload/comuni.json";
import stati from "scenes/idupload/stati.json";
import { green, pink } from "@mui/material/colors";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CleaaningServicesIcon from "@mui/icons-material/CleaningServices";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadForm from "components/UploadForm";

export default function Idupload() {
  //Individual memberInfo
  const memberInfo = {
    surname: "",
    givenname: "",
    gender: "",
    dateOfBirth: dayjs("2024-01-01"),
    placeOfBirth: { Descrizione: "" },
    citizenship: { Descrizione: "" },
    documentType: { Descrizione: "" },
    documentNumber: "",
    placeOfReleaseDocument: { Descrizione: "" },
  };
  const [idUploaded, setIdUploaded] = useState(false);
  //Group info
  const [groupInfo, setGroupInfo] = useState([memberInfo]);
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
          {idUploaded ? (
            <div>
              {groupInfo.map((member, id) => {
                return (
                  <div>
                    {id === 0 ? (
                      <div className="d-flex justify-content-between mt-5">
                        <h3>Personal Information</h3>
                        <Button
                          color="default"
                          onClick={() => {
                            setGroupInfo((prevGroupInfo) =>
                              prevGroupInfo.map((member, index) =>
                                index === 0 ? memberInfo : member
                              )
                            );
                          }}
                        >
                          <CleaaningServicesIcon /> Clear
                        </Button>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between mt-5">
                        <h4>Member {id}</h4>

                        <Button
                          color="default"
                          onClick={() => {
                            setGroupInfo((prevGroupInfo) =>
                              prevGroupInfo.filter(
                                (member, index) => index !== id
                              )
                            );
                          }}
                        >
                          <DeleteIcon /> Delete
                        </Button>
                      </div>
                    )}
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
                          id={id}
                          value={groupInfo[id].surname}
                          setGroupInfo={setGroupInfo}
                        />
                      </div>
                      <div className="ml-1 w-100">
                        <IduploadInputField
                          name={"givenname"}
                          fieldName={"Given Name"}
                          value={groupInfo[id].givenname}
                          id={id}
                          setGroupInfo={setGroupInfo}
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
                              <label className="form-label">
                                Date of Birth
                              </label>
                              <div>
                                <DatePicker
                                  value={groupInfo[id].dateOfBirth}
                                  sx={{ width: "331px" }}
                                  slotProps={{ textField: { size: "small" } }}
                                  onChange={(e) => {
                                    setGroupInfo((prevGroupInfo) =>
                                      prevGroupInfo.map((member, index) =>
                                        index === id
                                          ? { ...member, dateOfBirth: e }
                                          : member
                                      )
                                    );
                                  }}
                                />
                              </div>
                            </DemoItem>
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                      <div className="w-100 ml-1">
                        <IduploadSelectField
                          name={"gender"}
                          fieldName={"Gender"}
                          value={groupInfo[id].gender}
                          selectItems={["Male", "Female"]}
                          id={id}
                          setGroupInfo={setGroupInfo}
                        />
                      </div>
                    </div>

                    <IduploadAutocomplete
                      fieldName={"Citizenship"}
                      items={stati}
                      value={groupInfo[id].citizenship}
                      name={"citizenship"}
                      id={id}
                      setGroupInfo={setGroupInfo}
                    />
                    <IduploadAutocomplete
                      fieldName={"Place of Birth"}
                      items={comuni}
                      name={"placeOfBirth"}
                      value={groupInfo[id].placeOfBirth}
                      id={id}
                      setGroupInfo={setGroupInfo}
                    />
                    {id === 0 && (
                      <div>
                        <IduploadAutocomplete
                          fieldName={"Place of Release Document"}
                          items={comuni}
                          value={groupInfo[id].placeOfReleaseDocument}
                          name={"placeOfReleaseDocument"}
                          id={id}
                          setGroupInfo={setGroupInfo}
                        />
                        <div className="d-flex flex-row justify-content-between">
                          <div className="mr-1 w-100">
                            <IduploadAutocomplete
                              fieldName={"Document Type"}
                              items={documenti}
                              name={"documentType"}
                              value={groupInfo[id].documentType}
                              id={id}
                              setGroupInfo={setGroupInfo}
                            />
                          </div>
                          <div className="ml-1 w-100">
                            <IduploadInputField
                              name={"documentNumber"}
                              fieldName={"Document Number"}
                              id={id}
                              setGroupInfo={setGroupInfo}
                              value={groupInfo[id].documentNumber}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="d-flex justify-content-center mt-5">
                <Button
                  onClick={() =>
                    setGroupInfo((prevGroupInfo) => [
                      ...prevGroupInfo,
                      memberInfo,
                    ])
                  }
                >
                  <Avatar sx={{ bgcolor: green[500] }}>
                    <GroupAddIcon />
                  </Avatar>
                </Button>
              </div>
              <div className="mt-5 mb-5">
                <button
                  className="btn"
                  type="submit"
                  style={{
                    backgroundColor: "#00756a",
                    color: "white",
                    width: "100%",
                    height: "40px",
                    marginBottom: "50px",
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <UploadForm setIdUploaded={setIdUploaded} />
          )}
        </form>
      </div>
    </div>
  );
}
