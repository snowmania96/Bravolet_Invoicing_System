import React from "react";

export default function IduploadInputField({
  name,
  value,
  fieldName,
  onChange,
}) {
  return (
    <div className="mt-3 w-100">
      <label className="form-label">{fieldName}</label>
      <input
        type="text"
        name={name}
        value={value}
        className="form-control"
        onChange={onChange}
        required
      />
      <div className="valid-feedback">Valid</div>
      <div className="invalid-feedback">This field is required</div>
    </div>
  );
}
