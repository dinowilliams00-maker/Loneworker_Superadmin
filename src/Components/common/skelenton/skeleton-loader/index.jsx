import React from "react";
import Skeleton from "@mui/material/Skeleton";

const SkeletonLoader = ({
  width = "100%",
  height = 200,
  sx,
}) => {
  return (
    <Skeleton
      width={width}
      variant="text"
      animation="wave"
      height={height}
      sx={sx}
    />
  );
};

export default SkeletonLoader;