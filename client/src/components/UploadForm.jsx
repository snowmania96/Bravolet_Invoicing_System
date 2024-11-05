import axios from "axios";
import dayjs from "dayjs";
import React, { useState, useCallback } from "react";
import Dropzone from "react-dropzone";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export default function UploadForm({ setIdUploaded, setGroupInfo, id }) {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(true);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState("Caricamento");
  const [text, setText] = useState(
    "Trascina e rilascia il file qui oppure fai clic per selezionare il file"
  );
  const [checkbox, setCheckbox] = useState(false);
  const onDrop = (files) => {
    if (files.length > 0) {
      if (!files[0].type.startsWith("image/")) {
        setText("Carica un file immagine.");
        return;
      }
      setSelectedFiles(files);
    }
  };

  const parseProgress = (progressEvent) => {
    setProgress(Math.floor((progressEvent.loaded / progressEvent.total) * 100));
  };

  const upload = async (e) => {
    e.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      setMessage("Seleziona un file da caricare.");
      return;
    }

    const file = selectedFiles[0];
    setProgress(0);
    setCurrentFile(file);
    setLoading("Caricamento...");
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
          onUploadProgress: parseProgress,
        }
      );
      const extractedInfo = response.data;
      if (extractedInfo.surname === undefined) {
        setMessage("Caricamento non riuscito. Prova un altro ID.");
        setLoading("Caricamento");
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
        setMessage("Caricamento riuscito");
        setIdUploaded((prevIdUploaded) => !prevIdUploaded);
      }
    } catch (err) {
      if (err.status === 400) setMessage("File immagine non valido");
      else if (err.status === 500)
        setMessage("Errore durante il caricamento del file");
      setLoading("Caricamento");
    }
  };
  console.log(!selectedFiles || !checkbox || loading === "Caricamento...");
  console.log(!selectedFiles);
  console.log(!checkbox);
  console.log(loading === "Caricamento...");
  return (
    <div className="mt-3">
      {currentFile && progress !== 0 && (
        <div className="progress mb-3">
          <div
            className="progress-bar progress-bar-info progress-bar-striped"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      )}
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
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={checkbox}
                  onChange={() => setCheckbox(!checkbox)}
                  required
                />
                <label className="form-check-label" for="invalidCheck">
                  Accetta termini e condizioni
                </label>
                <div className="invalid-feedback">
                  Devi accettare prima del caricamento.
                </div>
              </div>
            </div>
            <aside className="selected-file-wrapper">
              <button
                className="btn"
                disabled={
                  !selectedFiles || !checkbox || loading === "Caricamento..."
                }
                style={{
                  backgroundColor: "#00756a",
                  color: "white",
                  width: "100%",
                  height: "40px",
                }}
                onClick={upload}
              >
                {loading}
              </button>
            </aside>
          </section>
        )}
      </Dropzone>

      <div className="alert alert-light" role="alert">
        {message}
      </div>
    </div>
  );
}
