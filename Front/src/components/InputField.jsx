import React from "react";

export default function InputField({ label, type, id, placeholder, disabled,value, onChange}) {
  return (
    <div className="mb-3 d-flex align-items-center">
      <label
        htmlFor={id}
        className="col-sm-4 col-lg-2 d-flex justify-content-end align-items-center form-label me-2"
      >
        {label}
      </label>
      <div className="col-sm-5 col-lg-7 mx-auto rounded border-black">
        <input
          type={type}
          className="form-control border-black"
          disabled={disabled}
          value={value}
          id={id}
          placeholder={placeholder}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
