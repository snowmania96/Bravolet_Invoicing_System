import React, { useState } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  Typography,
  OutlinedInput,
} from "@mui/material";
import country from "country-list-js";

export default function InputCountrySelect({ name, value, onChange }) {
  return (
    <div className="inputCountrySelect">
      <div className="inputLabel">Country</div>
      <FormControl size="small" style={{ width: "200px" }}>
        <Select name={name} value={value} color="default" onChange={onChange}>
          {country.names().map((country) => (
            <MenuItem value={country}>
              <div className="isIndividual">{country}</div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
