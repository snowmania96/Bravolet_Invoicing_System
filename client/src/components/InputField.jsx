import React from "react";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";

export default function InputField({ name, value, fieldName, onChange }) {
  return (
    <div className="inputFieldItem">
      <div className="inputLabel">{fieldName}</div>
      <TextField
        variant="outlined"
        name={name}
        type={name === "email" ? "email" : null}
        value={value}
        required
        onChange={onChange}
        color="default"
        size="small"
        fullWidth
        InputProps={{ style: { fontSize: window.innerWidth > 1000 ? 14 : 12 } }}
      />
    </div>
  );
}
