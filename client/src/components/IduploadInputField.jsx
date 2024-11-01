import { TextField } from "@mui/material";
import React from "react";

export default function IduploadInputField({
  name,
  value,
  fieldName,
  id,
  setGroupInfo,
}) {
  return (
    <div className="mt-3 w-100 d-flex flex-column">
      <label className="form-label">{fieldName}</label>
      <TextField
        name={name}
        value={value}
        onChange={(e) => {
          setGroupInfo((prevGroupInfo) =>
            prevGroupInfo.map((member, index) =>
              index === id ? { ...member, [name]: e.target.value } : member
            )
          );
        }}
        required
        color="default"
        size="small"
      />
    </div>
  );
}
