import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {Button} from "@material-ui/core";
const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function StickyHeadTable(props) {
  const classes = useStyles();

  const handleChangePage = (event, newPage) => {
    props.setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    props.setPage(0);
    props.setSize(+event.target.value);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {props.columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.slice(0, props.size).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {props.columns.map((column) => {
                    const value = row[column.id];
                    if (column.onClick) {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Button variant="outlined" style={{height: '20px'}} onClick={() => column.onClick(value)}>
                            {column.id === 'id' ? "Details" : value}</Button>
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && !isNaN(parseInt(value)) ? column.format(value) : value}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        component="div"
        count={props.total}
        rowsPerPage={props.size}
        page={props.page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}