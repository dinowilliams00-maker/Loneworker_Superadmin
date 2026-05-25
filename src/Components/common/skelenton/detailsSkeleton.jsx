import React from "react";
import {
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";

const DetailsSkeleton = () => {
  return (
    <Grid
      container
      mt={3}
      p={3}
      justifyContent="space-between"
      alignItems="center"
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
      }}
    >
      <Grid>
        <Grid
          container
          gap={3}
          alignItems="center"
        >
          <Skeleton
            variant="rectangular"
            width={100}
            height={100}
          />

          <Grid>
            <Typography
              variant="h3"
              color="info"
            >
              <Skeleton width={200} />
            </Typography>

            <Typography
              variant="body1"
              color="info"
            >
              User - <Skeleton width={100} />
            </Typography>
          </Grid>

          <Grid>
            <Grid container gap={2}>
              <Grid>
                <Skeleton
                  variant="rectangular"
                  width={120}
                  height={32}
                />
              </Grid>

              <Grid>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                />
              </Grid>

              <Grid>
                <Skeleton
                  variant="rectangular"
                  width={40}
                  height={32}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid>
        <Skeleton
          variant="rectangular"
          width={300}
          height={100}
        />
      </Grid>
    </Grid>
  );
};

export default DetailsSkeleton;