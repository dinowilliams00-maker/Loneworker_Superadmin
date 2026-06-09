import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

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
  MenuProps,
  searchable = false, // ← new prop: shows a search box inside the dropdown
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const selectId =
    id || `select-${(label ?? "select").toLowerCase().replace(/\s+/g, "-")}`;
  const labelId = `${selectId}-label`;

  // Filter options by search query when searchable is enabled
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter((opt) =>
      opt.label?.toLowerCase().includes(q)
    );
  }, [options, searchQuery, searchable]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    const matchedOption = options.find((opt) => opt.value === selectedValue);
    if (matchedOption) {
      onChange(matchedOption);
    } else {
      onChange(selectedValue);
    }
  };

  const handleClose = () => {
    // Reset search when dropdown closes
    setSearchQuery("");
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
          onClose={handleClose}
          displayEmpty={displayEmpty || !!placeholder}
          MenuProps={{
            PaperProps: {
              style: { maxHeight: 48 * 10 },
            },
            autoFocus: false,
            ...MenuProps,
          }}
        >
          {/* Search box at top of dropdown — only when searchable */}
          {searchable && (
            <Box
              sx={{ px: 1.5, py: 1, position: "sticky", top: 0, bgcolor: "background.paper", zIndex: 1 }}
              onKeyDown={(e) => e.stopPropagation()} // prevent select keyboard nav interfering
            >
              <TextField
                size="small"
                fullWidth
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </Box>
          )}

          {placeholder && (
            <MenuItem value="" disabled>
              <em>{placeholder}</em>
            </MenuItem>
          )}

          {filteredOptions.map((option) => (
            <MenuItem
              key={option._id ?? option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}

          {searchable && filteredOptions.length === 0 && (
            <MenuItem disabled>
              <em>No results found</em>
            </MenuItem>
          )}
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
