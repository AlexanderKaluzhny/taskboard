import React from 'react';
import { styled } from '@material-ui/core/styles';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MuiPaper from '@material-ui/core/Paper';
import HeaderStatusFilterSelect from './HeaderStatusFilterSelect';

const Table = styled(MuiTable)({});

const Paper = styled(MuiPaper)({
  width: '99%',
  margin: 'auto',
  maxHeight: '75vh',
  overflow: 'auto',
});

const StyledTableCell = styled(TableCell)({
  backgroundColor: '#f5f5f5',
  color: 'black',
  fontSize: '1rem',
});

export default function (props) {
  return (
    <Paper>
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="center">Owner</StyledTableCell>
            <StyledTableCell align="center">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  alignContent: 'center',
                  justifyContent: 'center',
                }}
              >
                <div>Status</div>
                <HeaderStatusFilterSelect
                  statusFilter={props.statusFilter}
                  onStatusFilterChanged={props.onStatusFilterChanged}
                />
              </div>
            </StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>{props.children}</TableBody>
      </Table>
    </Paper>
  );
}
