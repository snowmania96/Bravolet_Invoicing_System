import React, { useState } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  Typography,
  OutlinedInput,
} from "@mui/material";
import country from "country-list-js";

// console.log(country.findByIso3("UKR"));

export default function InputCountrySelect({ name, value, onChange }) {
  return (
    <div className="inputCountrySelect">
      <div className="inputLabel">Country</div>
      <FormControl
        size="small"
        style={{ width: "200px", fontSize: window.innerWidth > 1000 ? 14 : 12 }}
      >
        <Select name={name} value={value} color="default" onChange={onChange}>
          {country.names().map((country) => (
            <MenuItem value={country}>
              <div style={{ fontSize: window.innerWidth > 1000 ? 14 : 12 }}>
                {country}
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
