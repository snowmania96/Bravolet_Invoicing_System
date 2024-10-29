import React from "react";

export default function IduploadSelectField({
  name,
  fieldName,
  value,
  onChange,
  selectItems,
  customStyle,
}) {
  return (
    <div className="mt-3 w-100">
      <label className="form-label">{fieldName}</label>
      <select
        className="form-control"
        name={name}
        value={value}
        color="default"
        onChange={onChange}
        required
      >
        {selectItems.map((item) => (
          <option>{item}</option>
        ))}
      </select>
      <div className="valid-feedback">Valid</div>
      <div className="invalid-feedback">This field is required</div>
    </div>
  );
}
