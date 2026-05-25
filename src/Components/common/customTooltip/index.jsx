import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Zoom from "@mui/material/Zoom";

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    slots={{ transition: Zoom }}
    arrow
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  "& .MuiTooltip-arrow": {
    color: theme.palette.secondary.dark,
  },

  "& .MuiTooltip-tooltip": {
    color: theme.palette.background?.paper,
    backgroundColor: theme.palette.secondary.dark,
    lineHeight: 1.2,
    padding: "4px 8px",
    fontSize: 12,
  },
}));

export default CustomTooltip;