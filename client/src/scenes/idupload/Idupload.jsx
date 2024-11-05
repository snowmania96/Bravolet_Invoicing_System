import {
  Avatar,
  Button,
  Divider,
  getInputLabelUtilityClasses,
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
import axios from "axios";
import "dayjs/locale/it";
import { useParams } from "react-router-dom";
import image from "./check (1).png";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

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
  const [submitText, setSubmitText] = useState("Submit");
  const { id } = useParams();

  const onClickSubmitButton = async (e) => {
    e.preventDefault();
    setSubmitText("Submitting...");
    try {
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/idupload/input/${id}`,
        groupInfo
      );
      console.log(response.data);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.error, { position: "top-right" });
    }
  };

  return (
    <div>
      <div
        className="jumbotron text-center w-100"
        style={{ textAlign: "center" }}
      >
        <Typography variant="h1">Bravolet Sistema di Fatturazione</Typography>
        <Typography className="mt-3" variant="h3">
          Carica il tuo documento d'identità
        </Typography>
      </div>
      <div className="mt-4 container" style={{ width: "700px" }}>
        {submitText === "Submit" ? (
          <form className="was-validated">
            {idUploaded ? (
              <div>
                {groupInfo.map((member, id) => {
                  return (
                    <div>
                      {id === 0 ? (
                        <div className="d-flex justify-content-between mt-5">
                          <h3>Informazioni Personali</h3>
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
                            <CleaaningServicesIcon /> Chiara
                          </Button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-between mt-5">
                          <h4>Membro ${id}</h4>

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
                            <DeleteIcon /> Eliminare
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
                            fieldName={"Cognome"}
                            id={id}
                            value={groupInfo[id].surname}
                            setGroupInfo={setGroupInfo}
                          />
                        </div>
                        <div className="ml-1 w-100">
                          <IduploadInputField
                            name={"givenname"}
                            fieldName={"Nome"}
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
                                  {"Data Nascita"}
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
                            fieldName={"Sesso"}
                            value={groupInfo[id].gender}
                            selectItems={["Maschio", "Femmina"]}
                            id={id}
                            setGroupInfo={setGroupInfo}
                          />
                        </div>
                      </div>

                      <IduploadAutocomplete
                        fieldName={"Cittadinanza"}
                        items={stati}
                        value={groupInfo[id].citizenship}
                        name={"citizenship"}
                        id={id}
                        setGroupInfo={setGroupInfo}
                      />
                      <IduploadAutocomplete
                        fieldName={"Comune Nascita"}
                        items={comuni}
                        name={"placeOfBirth"}
                        value={groupInfo[id].placeOfBirth}
                        id={id}
                        setGroupInfo={setGroupInfo}
                      />
                      {id === 0 && (
                        <div>
                          <IduploadAutocomplete
                            fieldName={"Luogo Rilascio Documento"}
                            items={comuni}
                            value={groupInfo[id].placeOfReleaseDocument}
                            name={"placeOfReleaseDocument"}
                            id={id}
                            setGroupInfo={setGroupInfo}
                          />
                          <div className="d-flex flex-row justify-content-between">
                            <div className="mr-1 w-100">
                              <IduploadAutocomplete
                                fieldName={"Tipo Documento"}
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
                                fieldName={"Numero Documento"}
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
                    disabled={submitText === "Submit" ? false : true}
                    style={{
                      backgroundColor: "#00756a",
                      color: "white",
                      width: "100%",
                      height: "40px",
                      marginBottom: "50px",
                    }}
                    onClick={onClickSubmitButton}
                  >
                    {submitText}
                  </button>
                </div>
              </div>
            ) : (
              <UploadForm
                setIdUploaded={setIdUploaded}
                setGroupInfo={setGroupInfo}
                id={id}
              />
            )}
          </form>
        ) : (
          <div className="d-flex flex-column align-items-center">
            <div>
              <h4>Grazie!</h4>
            </div>
            <div className="mt-3">
              <img src={image} width={"70px"} />
            </div>
            <div className="mt-5">
              <h4>Le tue informazioni sono state inviate con successo.</h4>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
