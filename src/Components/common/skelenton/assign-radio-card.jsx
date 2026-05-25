import React from "react";
import {
  Grid,
  Radio,
  Typography,
  useRadioGroup,
  FormControlLabel,
} from "@mui/material";

import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import { styled } from "@mui/material/styles";

const StyledFormControlLabel = styled((props) => (
  <FormControlLabel {...props} />
))(({ theme, checked }) => ({
  ".MuiFormControlLabel-label": checked && {
    color: theme.palette.primary.main,
  },
}));

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return (
    <StyledFormControlLabel
      checked={checked}
      {...props}
    />
  );
}

const ElementSkeleton = ({ arrayLength }) => (
  <>
    {Array.from({ length: arrayLength }).map((_, index) => (
      <React.Fragment key={index}>
        <Grid
          size={2.8}
          className="mt-20 assign-radio-grid relative"
        >
          <MyFormControlLabel
            label={
              <Typography className="width100">
                <Typography
                  color="secondary"
                  className="assign-text"
                >
                  <Skeleton
                    width="80%"
                    animation="wave"
                  />
                </Typography>

                <Tooltip
                  describeChild
                  title={<Skeleton width="80%" />}
                  arrow
                >
                  <Typography
                    variant="subtitle1"
                    className="assign-text"
                  >
                    <Skeleton
                      width="60%"
                      animation="wave"
                    />
                  </Typography>
                </Tooltip>
              </Typography>
            }
            control={
              <Radio
                icon={
                  <Skeleton
                    width={18}
                    height={25}
                    animation="wave"
                  />
                }
                checkedIcon={
                  <Skeleton
                    width={24}
                    height={24}
                    animation="wave"
                  />
                }
              />
            }
          />
        </Grid>

        <Grid size={0.2}></Grid>
      </React.Fragment>
    ))}
  </>
);

export default ElementSkeleton;