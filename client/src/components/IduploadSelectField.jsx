import { MenuItem, Select } from "@mui/material";
import React from "react";

export default function IduploadSelectField({
  name,
  fieldName,
  value,
  selectItems,
  id,
  setGroupInfo,
}) {
  return (
    <div className="mt-3 w-100">
      <label className="form-label">{fieldName}</label>
      <Select
        name={name}
        value={value}
        color="default"
        onChange={(e) => {
          setGroupInfo((prevGroupInfo) =>
            prevGroupInfo.map((member, index) =>
              index === id ? { ...member, [name]: e.target.value } : member
            )
          );
        }}
        size="small"
        fullWidth
      >
        {selectItems.map((item) => (
          <MenuItem value={item}>{item}</MenuItem>
        ))}
      </Select>
      {/* <Select
        name={name}
        
        value={value}
        color="default"
        onChange={onChange}
        required
      >
        {selectItems.map((item) => (
          <option>{item}</option>
        ))}
      </Select> */}
    </div>
  );
}
