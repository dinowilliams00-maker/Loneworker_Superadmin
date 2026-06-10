import React from "react";
import noData from "../../../../assets/images/nodata.png";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  TableHead,
  Box,
  Grid,
} from "@mui/material";
import TableSkeleton from "../../skelenton/tableSkeleton";

const CustomTable = (props) => {
  const {
    rows,
    columns,
    pagination,
    setPagination,
    count,
    loading,
    ActionSkeletonLength,
  } = props;

  const handleChangePage = (_event, newPage) => {
    setPagination?.((prev) => ({
      ...prev,
      page: newPage + 1,
    }));
  };
  // Here we handle the rows per page
  const handleChangeRowsPerPage = (event) => {
    setPagination?.((prev) => ({
      ...prev,
      page: 1,
      rowsPerPage: parseInt(event.target.value, 10),
    }));
  };

  return (
    <TableContainer
      sx={{
        overflowX: "auto",
        border: "1px solid #e5eaef",
        borderRadius: "24px",
      }}
    >
      <Table aria-label="custom pagination table" stickyHeader>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'background.default' }}>
            {columns?.map((column, index) => (
              <TableCell
                key={index}
                align={
                  index === 0 || index === columns.length - 1
                    ? index === 0
                      ? "left"
                      : "center"
                    : "center"
                }
                sx={{
                  padding: "12px 15px",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                  lineHeight: "1.3",
                  minWidth: "80px",
                  maxWidth: "200px",
                  fontWeight: 600,
                  color: 'text.primary',
                  backgroundColor: 'background.default'
                }}
              >
                <strong style={{ fontSize: "14px" }}>{column}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody sx={{ bgcolor: "white" }}>
          {loading ? (
            <TableSkeleton
              rowNumber={new Array(10).fill(0)}
              tableCell={new Array(columns?.length - 1).fill("20%")}
              showOption={new Array(ActionSkeletonLength).fill(0)}
            />
          ) : (
            rows?.map((row, i) => (
              <TableRow
                key={i}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  overflow: "hidden",
                  "&:hover": { backgroundColor: 'action.hover' },
                  cursor: 'pointer',
                }}
              >
                {Object.values(row).map((ele, ind) => (
                  <TableCell
                    key={ind}
                    align={
                      ind === 0 || ind === Object.values(row).length - 1
                        ? ind === 0
                          ? "left"
                          : "center"
                        : "center"
                    }
                    component="th"
                    scope="row"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minWidth: "80px",
                      maxWidth: "200px",
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                    }}
                  >
                    {!Array.isArray(ele) ? (
                      ele
                    ) : (
                      <Box>
                        {ele?.map((btn, idx) => (
                          <React.Fragment key={idx}>
                            {btn}
                          </React.Fragment>
                        ))}
                      </Box>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>

        <TableFooter>
          {!loading && rows?.length === 0 && (
            <TableRow sx={{ bgcolor: "white" }}>
              <TableCell colSpan={columns.length}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 300,
                 }}
                >
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img src={noData} alt="nodata" />
                  </Grid>
                </Box>
              </TableCell>
            </TableRow>
          )}

          {pagination && (
            <TableRow>
              <TablePagination
                page={(pagination?.page || 1) - 1}
                count={count ?? 0}
                rowsPerPageOptions={[
                  10,
                  25,
                  50,
                  100,
                  200,
                  { label: "All", value: 10000 },
                ]}
                rowsPerPage={pagination?.rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          )}
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;