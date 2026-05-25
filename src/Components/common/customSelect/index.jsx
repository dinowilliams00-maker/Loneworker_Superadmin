import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function CustomSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  error = false,
  helperText,
  required = false,
  fullWidth = true,
  size = "medium",
  variant = "outlined",
  sx,
  minWidth = 120,
  id,
  name,
  displayEmpty = false,
}) {
  const selectId =
    id || `select-${(label ?? "select").toLowerCase().replace(/\s+/g, "-")}`;

  const labelId = `${selectId}-label`;

  const handleChange = (event) => {
    const selectedValue = event.target.value;

    const matchedOption = options.find(
      (opt) => opt.value === selectedValue
    );

    if (matchedOption) {
      onChange(matchedOption);
    } else {
      onChange(selectedValue);
    }
  };

  return (
    <Box sx={{ minWidth, ...sx }}>
      <FormControl
        fullWidth={fullWidth}
        error={error}
        disabled={disabled}
        required={required}
        size={size}
        variant={variant}
      >
        <InputLabel id={labelId} sx={{ color: "primary.main" }}>
          {label}
        </InputLabel>

        <Select
          labelId={labelId}
          id={selectId}
          name={name}
          value={value}
          label={label}
          onChange={(e) => handleChange(e)}
          displayEmpty={displayEmpty || !!placeholder}
        >
          {placeholder && (
            <MenuItem value="" disabled>
              <em>{placeholder}</em>
            </MenuItem>
          )}

          {options.map((option) => (
            <MenuItem
              key={option._id}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>

        {helperText && (
          <Box
            component="span"
            sx={{
              fontSize: "0.75rem",
              color: error ? "error.main" : "text.secondary",
              mt: 0.5,
              ml: 1.75,
            }}
          >
            {helperText}
          </Box>
        )}
      </FormControl>
    </Box>
  );
}