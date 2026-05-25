import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import dayjs from "dayjs";
import { DateRangePicker } from "react-date-range";
import { CalanderIcon } from "../../icons/index";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(),
  },
}));

const getValidDefaultDateRange = (incomingRange) => {
  if (
    incomingRange?.startDate instanceof Date &&
    incomingRange?.endDate instanceof Date
  ) {
    return incomingRange;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(today);
  const startDate = new Date(today);
  startDate.setDate(endDate.getDate() - 0);

  return {
    startDate,
    endDate,
    key: "selection",
  };
};

const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isToday = (startDate, endDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isSameDay(startDate, today) && isSameDay(endDate, today);
};

const formatInputValue = (startDate, endDate) => {
  if (isToday(startDate, endDate)) {
    return "Today";
  }

  return `${dayjs(startDate).format("DD/MM/YYYY")} - ${dayjs(endDate).format(
    "DD/MM/YYYY"
  )}`;
};

const Calendar = ({
  getDataFromChildHandler,
  maxPastDays,
  defaultDateRange,
  openClick,
  setOpenClick,
  showDate,
}) => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState([]);
  const [selectedRange, setSelectedRange] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const initialRange = getValidDefaultDateRange(defaultDateRange);

    setState([initialRange]);
    setSelectedRange([initialRange]);

    setInputValue(
      formatInputValue(initialRange.startDate, initialRange.endDate)
    );
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
    setSelectedRange(state);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenClick?.(false);
  };

  const handleClear = () => {
    const resetRange = getValidDefaultDateRange(defaultDateRange);

    setState([resetRange]);
    setSelectedRange([resetRange]);
    setInputValue("");

    setOpen(false);
    setOpenClick?.(false);
  };

  const getDates = (startDate, endDate) => {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");

      dates.push(`${year}-${month}-${day}`);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const handleApply = () => {
    const [range] = state;
    if (!range.startDate || !range.endDate) return;

    setInputValue(formatInputValue(range.startDate, range.endDate));

    setOpenClick?.(false);
    setOpen(false);

    const dates = getDates(range.startDate, range.endDate);

    let resultArray;

    if (dates.length === 1) {
      resultArray = Array.from({ length: 24 }, (_, i) => i);
    } else if (dates.length > 31) {
      resultArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
    } else {
      resultArray = dates;
    }

    getDataFromChildHandler([range], resultArray);
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (maxPastDays !== undefined) {
      const limit = new Date(today);
      limit.setDate(limit.getDate() - maxPastDays);

      return date > today || date < limit;
    }

    return date > today;
  };

  const handleOnChange = (ranges) => {
    const selection = ranges.selection;

    setInputValue(formatInputValue(selection.startDate, selection.endDate));

    setSelectedRange([selection]);
    setState([selection]);
  };

  return (
    <>
      {showDate && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "216px",
            minWidth: "200px",
            height: "40px",
            border: "1px solid #FF9300",
            borderRadius: "24px",
            background:
              "linear-gradient(111.41deg, rgba(255, 255, 255, 0.272) 0%, rgba(255, 255, 255, 0.068) 100%)",
            backgroundColor: "transparent",
            padding: "0 10px",
            cursor: "pointer",
          }}
          onClick={handleClickOpen}
        >
          <CalanderIcon
            style={{ marginRight: "8px", color: "#555" }}
            fontSize={"17px"}
          />

          <input
            value={inputValue || "dd/mm/yyyy - dd/mm/yyyy"}
            readOnly
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontWeight: "bold",
              fontSize: "13px",
              width: "100%",
              cursor: "pointer",
            }}
          />
        </div>
      )}

      <BootstrapDialog
        fullWidth
        maxWidth="md"
        open={openClick || open}
        onClose={handleClose}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        <DialogContent
          sx={{
            backgroundColor: "#fff",
            m: 0,
            p: 1,
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DateRangePicker
            onChange={handleOnChange}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={selectedRange}
            direction="horizontal"
            disabledDay={isDateDisabled}
          />
        </DialogContent>

        <DialogActions sx={{ backgroundColor: "#fff", p: 0 }}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "primary.main",
              minWidth: "120px",
              color: "primary.main",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "transparent",
              },
            }}
            onClick={handleClear}
          >
            Clear
          </Button>

          <Button
            variant="contained"
            sx={{ minWidth: "120px" }}
            onClick={handleApply}
          >
            Apply
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

Calendar.propTypes = {
  getDataFromChildHandler: PropTypes.func.isRequired,
};

export default Calendar;