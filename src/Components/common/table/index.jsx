import React from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
} from "@mui/material";

const CustomTable = ({
  rows,
  page,
  columns,
  setPage,
  setRowsPerPage,
  rowsPerPage,
  actions = [],
}) => {
  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
  };

  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
      <Table aria-label="custom pagination table" sx={{ minWidth: { xs: 650, md: '100%' } }}>
        <TableBody>
          {/* Here we definr the TableBody */}
          <TableRow>
            {columns.map((column, colIndex) => (
              <TableCell key={colIndex} align={column.align}>
                <strong>{column.label}</strong>
              </TableCell>
            ))}

            {actions.length > 0 && (
              <TableCell align="center">
                <strong>Action</strong>
              </TableCell>
            )}
          </TableRow>

          {rows &&
            rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} align={column.align}>
                    {row[column.id]}
                  </TableCell>
                ))}

                {actions.length > 0 && (
                  <TableCell align="center">
                    {actions.map((action, index) => (
                      <React.Fragment key={index}>
                        {action}
                      </React.Fragment>
                    ))}
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              page={page}
              count={rows.length}
              rowsPerPageOptions={[5, 10, 25]}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;