import axios from "axios";
import dayjs from "dayjs";
import React, { useState, useCallback } from "react";
import Dropzone from "react-dropzone";
import state from "scenes/idupload/stati.json";
import comuni from "scenes/idupload/comuni.json";
import { LocalDining } from "@mui/icons-material";
import { Box } from "@mui/material";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import styled from "@emotion/styled";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export default function UploadForm({ setIdUploaded, setGroupInfo, id }) {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(
    "Trascina e rilascia il file qui oppure fai clic per selezionare il file"
  );
  const [checkbox, setCheckbox] = useState(false);
  const onDrop = (files) => {
    if (files.length > 0) {
      //image files and pdfs.
      if (
        !files[0].type.startsWith("image/") &&
        files[0].type !== "application/pdf"
      ) {
        setText("Carica un file immagine.");
        return;
      }
      setSelectedFiles(files);
    }
  };

  const upload = async (e) => {
    e.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      setMessage("Seleziona un file da caricare.");
      return;
    }

    const file = selectedFiles[0];
    setLoading(true);
    setMessage("Ci vorranno alcuni secondi");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/idupload/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const extractedInfo = response.data;
      if (extractedInfo.surname === undefined) {
        setMessage("Caricamento non riuscito. Prova un altro ID.");
        setLoading(false);
      } else {
        setGroupInfo((prevGroupInfo) =>
          prevGroupInfo.map((member, index) =>
            index === 0
              ? {
                  ...member,
                  surname: extractedInfo.surname,
                  givenname: extractedInfo.givenname,
                  gender:
                    extractedInfo.gender === undefined
                      ? ""
                      : extractedInfo.gender === "M"
                      ? "Maschio"
                      : "Femmina",
                  dateOfBirth: dayjs(extractedInfo.birthDate),
                  documentNumber: extractedInfo.documentNumber,
                }
              : member
          )
        );
        if (extractedInfo.nationality === "ITA") {
          setGroupInfo((prevGroupInfo) =>
            prevGroupInfo.map((member, index) =>
              index === 0
                ? {
                    ...member,
                    citizenship: {
                      Descrizione: "ITALIA",
                      Codice: "1000000100",
                    },
                  }
                : member
            )
          );

          //Set birth of place
          if (extractedInfo.placeOfBirth !== "") {
            let temp;
            for (let i = 0; i < comuni.length; i++) {
              if (extractedInfo.placeOfBirth === comuni[i].Descrizione) {
                temp = comuni[i];
              }
            }
            setGroupInfo((prevGroupInfo) =>
              prevGroupInfo.map((member, index) =>
                index === 0
                  ? {
                      ...member,
                      placeOfBirth: temp,
                    }
                  : member
              )
            );
          }
        } else {
          let country;
          for (let i = 0; i < state.length; i++) {
            if (state[i].ISO === extractedInfo.nationality) {
              country = state[i];
            }
          }
          setGroupInfo((prevGroupInfo) =>
            prevGroupInfo.map((member, index) =>
              index === 0
                ? {
                    ...member,
                    citizenship: country,
                    placeOfBirth: country,
                    placeOfReleaseDocument: country,
                  }
                : member
            )
          );
        }
        //set document Type: ID CARD or PASSPORT
        if (extractedInfo.documentType === "PASSPORT") {
          setGroupInfo((prevGroupInfo) =>
            prevGroupInfo.map((member, index) =>
              index === 0
                ? {
                    ...member,
                    documentType: {
                      Codice: "PASOR",
                      Descrizione: "PASSAPORTO ORDINARIO",
                    },
                  }
                : member
            )
          );
        } else {
          setGroupInfo((prevGroupInfo) =>
            prevGroupInfo.map((member, index) =>
              index === 0
                ? {
                    ...member,
                    documentType: {
                      Codice: "IDENT",
                      Descrizione: "CARTA DI IDENTITA'",
                    },
                  }
                : member
            )
          );
        }
        setMessage("Caricamento riuscito");
        setIdUploaded((prevIdUploaded) => !prevIdUploaded);
      }
    } catch (err) {
      if (err.status === 400) setMessage("Tipo di file non valido");
      else if (err.status === 500)
        setMessage("Errore durante il caricamento del file");
      setLoading(false);
    }
  };

  return (
    <Box>
      {loading ? (
        <CircularLoading />
      ) : (
        <div className="mt-5">
          <Dropzone onDrop={onDrop} multiple={false}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  {selectedFiles && selectedFiles[0].name ? (
                    <div className="selected-file">
                      {selectedFiles && selectedFiles[0].name}
                    </div>
                  ) : (
                    <div style={{ fontSize: "20px" }}>{text}</div>
                  )}
                </div>
                <div className="form-group mt-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={checkbox}
                      size={"large"}
                      onChange={() => setCheckbox(!checkbox)}
                      style={{ marginTop: "6px" }}
                      required
                    />
                    <div style={{ fontSize: "16px" }}>
                      Accetta <a href="#">Termini e eondizioni</a>
                    </div>
                  </div>
                </div>
                <aside className="selected-file-wrapper">
                  <button
                    className="btn"
                    disabled={!selectedFiles || !checkbox || loading}
                    style={{
                      backgroundColor: "#00756a",
                      color: "white",
                      width: "100%",
                      height: "40px",
                    }}
                    onClick={upload}
                  >
                    Caricamento
                  </button>
                </aside>
              </section>
            )}
          </Dropzone>
          <div className="alert alert-light text-danger" role="alert">
            {message}
          </div>
        </div>
      )}
    </Box>
  );
}

const CircularLoading = () => (
  <>
    <div style={{ marginTop: "10rem" }}>
      <div className="d-flex justify-content-center">
        <CircularProgress size={"4rem"} color="success" />
      </div>
      <h5 className="text-center mt-5">
        Rilevamento delle informazioni e validazione del documento
      </h5>
    </div>
  </>
);
