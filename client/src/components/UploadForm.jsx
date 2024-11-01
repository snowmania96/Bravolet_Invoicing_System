import axios from "axios";
import React, { useState, useCallback } from "react";
import Dropzone from "react-dropzone";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export default function UploadForm({ setIdUploaded }) {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(true);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState([]);
  const [checkbox, setCheckbox] = useState(false);
  const onDrop = (files) => {
    if (files.length > 0) {
      console.log(files);
      setSelectedFiles(files);
    }
  };

  const parseProgress = (progressEvent) => {
    setProgress((progressEvent.loaded / progressEvent.total) * 100);
  };

  const upload = async (e) => {
    e.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      setMessage("Please select a file to upload.");
      return;
    }

    const file = selectedFiles[0];
    setProgress(0);
    setCurrentFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/idupload/asdf`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: parseProgress,
        }
      );
      setMessage(response.data);
      setIdUploaded((prevIdUploaded) => !prevIdUploaded);
    } catch (err) {
      setMessage("Error uploading file");
    }
  };

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
                <div style={{ fontSize: "20px" }}>
                  Drag and drop file here, or click to select file
                </div>
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
                  Agree to terms and conditions
                </label>
                <div className="invalid-feedback">
                  You must agree before uploading.
                </div>
              </div>
            </div>
            <aside className="selected-file-wrapper">
              <button
                className="btn"
                disabled={!selectedFiles || !checkbox}
                style={{
                  backgroundColor: "#00756a",
                  color: "white",
                  width: "100%",
                  height: "40px",
                }}
                onClick={upload}
              >
                Upload
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
