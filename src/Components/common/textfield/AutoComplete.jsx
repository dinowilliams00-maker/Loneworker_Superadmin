import React from "react";
import {
  Autocomplete,
  TextField,
  Chip,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";

export const CustomAutoComplete = ({
  name,
  control,
  label,
  options = [],
  optionLabel,
  optionValue = "_id",
  multiple = false,
  required = false,
  errors,
  size = "small",
  chipSize = "small",
  placeholder,
  disabled = false,
  defaultValue,
  minWidth,
  value,
  onSelectionChange,
  disableClearable = false,
}) => {
  const isOptionEqualToValue = (option, val) => {
    if (!option || !val) return false;
    return option?.[optionValue] === val?.[optionValue];
  };

  // ---------------------------
  // WITHOUT REACT HOOK FORM
  // ---------------------------
  if (!control) {
    return (
      <FormControl fullWidth error={!!errors?.[name]}>
        <Autocomplete
          disableClearable={disableClearable}
          multiple={multiple}
          options={options}
          getOptionLabel={(option) => option?.[optionLabel] || ""}
          isOptionEqualToValue={isOptionEqualToValue}
          defaultValue={defaultValue ?? (multiple ? [] : null)}
          disabled={disabled}
          value={value}
          disableCloseOnSelect={multiple}
          onChange={(_, newValue) => {
            if (onSelectionChange) {
              onSelectionChange(newValue, name);
            }
          }}
          renderTags={(val, getTagProps) =>
            multiple &&
            val.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option?.[optionValue]}
                label={option?.[optionLabel]}
                size={chipSize}
                color="primary"
                sx={{
                  height: "24px",
                  "& .MuiChip-label": {
                    px: 0.8,
                    fontSize: "0.75rem",
                  },
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              name={name}
              size={size}
              label={label}
              placeholder={placeholder}
              error={!!errors?.[name]}
              sx={{ minWidth }}
            />
          )}
        />

        {errors?.[name] && (
          <FormHelperText error>
            {errors[name].message}
          </FormHelperText>
        )}
      </FormControl>
    );
  }

  // ---------------------------
  // WITH REACT HOOK FORM
  // ---------------------------
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? (multiple ? [] : null)}
      rules={{
        required: required ? `${label} is required` : false,
        validate: multiple
          ? (val) =>
              !required ||
              (val && val.length > 0) ||
              `Select at least one ${label}`
          : undefined,
      }}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors?.[name]}>
          <Autocomplete
            disableClearable={disableClearable}
            multiple={multiple}
            options={options}
            getOptionLabel={(option) => option?.[optionLabel] || ""}
            isOptionEqualToValue={isOptionEqualToValue}
            value={field.value}
            disabled={disabled}
            disableCloseOnSelect={multiple}
            onChange={(_, data) => {
              if (multiple && Array.isArray(data)) {
                const uniqueData = data.filter(
                  (item, index, self) =>
                    index ===
                    self.findIndex(
                      (t) => t?.[optionValue] === item?.[optionValue]
                    )
                );

                field.onChange(uniqueData);

                if (onSelectionChange) {
                  onSelectionChange(uniqueData, name);
                }
              } else {
                field.onChange(data);
              }
            }}
            renderTags={(val, getTagProps) =>
              multiple &&
              val.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option?.[optionValue]}
                  label={option?.[optionLabel]}
                  size={chipSize}
                  color="primary"
                  sx={{
                    height: "24px",
                    "& .MuiChip-label": {
                      px: 0.8,
                      fontSize: "0.75rem",
                    },
                  }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                size={size}
                label={label}
                placeholder={placeholder}
                error={!!errors?.[name]}
                sx={{ minWidth }}
              />
            )}
          />

          {errors?.[name] && (
            <FormHelperText error>
              {errors[name].message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};