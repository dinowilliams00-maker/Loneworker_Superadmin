import { useState } from "react";
import {
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";

import { MailIcon, CloseEye, OpenEye, PasswordIcon } from "../icons";

const CustomTextField = ({
  type,
  label,
  placeholder,
  error,
  helperText,
  name,
  value,
  select,
  onChange,
  defaultValue,
  selectData,
  disabled,
  field,
  size,
  onKeyDown,
  multiline,
  icon,
  button,
  handleClickOpen,
  shrink,
  maxLength,
  ...restProps
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Stack>
      <TextField
        {...restProps}
        name={name}
        label={label}
        multiline={multiline}
        error={error}
        onKeyDown={onKeyDown}
        value={value}
        type={
          field === "password"
            ? showPassword
              ? "text"
              : "password"
            : type === "date"
              ? "date"
              : type || "text"
        }
        select={!!select}
        defaultValue={defaultValue}
        variant="outlined"
        size={size}
        placeholder={placeholder}
        helperText={helperText}
        onChange={onChange}
        disabled={disabled}
        sx={{
          mb: 2,
          "& .MuiInputBase-input": {
            textAlign: field === "button" ? "left" : "inherit",
          },
          "& .MuiInputBase-root": {
            justifyContent: field === "button" ? "space-between" : "inherit",
          },
        }}
        // MUI v6: use slotProps instead of InputLabelProps / inputProps / InputProps
        slotProps={{
          inputLabel: { shrink: shrink },
          htmlInput: { maxLength: maxLength },
          input: {
            startAdornment:
              field === "email" || field === "password" ? (
                <InputAdornment position="start">
                  {field === "email" && <MailIcon fontSize="medium" />}
                  {field === "password" && <PasswordIcon />}
                </InputAdornment>
              ) : null,

            endAdornment:
              field === "password" ? (
                <InputAdornment
                  position="end"
                  onClick={handleTogglePassword}
                  sx={{ cursor: "pointer" }}
                >
                  {showPassword ? <CloseEye /> : <OpenEye />}
                </InputAdornment>
              ) : field === "button" ? (
                <InputAdornment position="end">
                  <Button
                    variant="outlined"
                    startIcon={icon}
                    size="small"
                    onClick={handleClickOpen}
                  >
                    {button}
                  </Button>
                </InputAdornment>
              ) : null,
          },
        }}
      >
        {select && selectData && selectData.length > 0 ? (
          selectData.map((option) => (
            <MenuItem
              key={option._id}
              value={option._id}
              sx={{ fontSize: "12px" }}
            >
              {option.label}
            </MenuItem>
          ))
        ) : select ? (
          <MenuItem disabled value="">
            <Typography>No data</Typography>
          </MenuItem>
        ) : null}
      </TextField>
    </Stack>
  );
};

export default CustomTextField;
