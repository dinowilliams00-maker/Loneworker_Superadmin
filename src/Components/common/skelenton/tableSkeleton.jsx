import React from "react";
import {
  Grid,
  TableCell,
  TableRow,
  Skeleton,
} from "@mui/material";

const TableSkeleton = ({
  rowNumber,
  tableCell,
  showOption,
}) => {
  return (
    <>
      {rowNumber?.length > 0 &&
        rowNumber.map((_, index) => (
          <TableRow
            key={index}
            hover
            tabIndex={-1}
            sx={{
              "&:last-child td, &:last-child th": {
                border: 0,
              },
            }}
          >
            {tableCell?.length > 0 &&
              tableCell.map((width, i) => (
                <TableCell
                  component="th"
                  scope="row"
                  key={i}
                  align={i === 0 ? "left" : "center"}
                  sx={{ width }}
                >
                  <Grid
                    container
                    justifyContent={
                      i === 0 ? "left" : "center"
                    }
                  >
                    <Skeleton
                      variant="text"
                      sx={{
                        fontSize: "1rem",
                        width: "50%",
                        height: "40%",
                        padding: "5px",
                      }}
                    />
                  </Grid>
                </TableCell>
              ))}

            {showOption && (
              <TableCell
                component="th"
                scope="row"
                padding="none"
                width={showOption?.[0]}
              >
                <Grid
                  container
                  justifyContent="space-evenly"
                  width="100px"
                >
                  {showOption.map((_, b) => (
                    <Grid size={4} key={b}>
                      <Skeleton
                        variant="circular"
                        width="30px"
                        height="30px"
                        sx={{
                          fontSize: "1rem",
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </TableCell>
            )}
          </TableRow>
        ))}
    </>
  );
};

export default TableSkeleton;