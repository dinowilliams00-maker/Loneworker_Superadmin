import React from "react";
import {
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";

const DetailsListingSkeleton = ({
  listingHead,
}) => {
  return (
    <Grid
      container
      direction="column"
      rowGap="20px"
      className="custom-Grid"
      mb={2}
    >
      <Grid container spacing={2}>
        {listingHead?.map((_, index) => (
          <Grid
            size={index < 2 ? 6 : 4}
            key={index}
          >
            <Typography
              mb={1}
              variant="body1"
              color="info"
            >
              <Skeleton
                width="40%"
                height={30}
              />
            </Typography>

            <Typography variant="h4">
              <Skeleton
                width="100%"
                height={60}
              />
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default DetailsListingSkeleton;