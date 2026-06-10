import React, { useState, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";

import { CloseSimpleIcon } from "src/components/icons";
import { RiSearchFill } from "react-icons/ri";

const DebouncedInput = ({
  value,
  onChange,
  delay = 500,
  ...props
}) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(debouncedValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedValue, delay, onChange]);

  const handleChange = (event) => {
    setDebouncedValue(event.target.value);
  }; // here we definr set the Debunce Value 

  const handleClear = () => {
    setDebouncedValue("");
    onChange("");
  };

  return (
    <TextField
      type="text"
      // fullWidth
      value={debouncedValue}
      onChange={handleChange}
      {...props}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <RiSearchFill size={"22px"} />
            </InputAdornment>
          ),

          endAdornment: (
            <InputAdornment position="end">
              {value && (
                <IconButton
                  size="small"
                  onClick={handleClear}
                >
                  <CloseSimpleIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default DebouncedInput;