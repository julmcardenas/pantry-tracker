import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Chip, Box, Button, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

// function createData(
//   name: string,
//   calories: number,
//   fat: number,
//   carbs: number,
//   protein: number,
// ) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

export default function InventoryStyledTable({ items, removeItemSingle, addItemSingle, deleteItemStock }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Item</StyledTableCell>
                        <StyledTableCell align="left">Availability</StyledTableCell>
                        <StyledTableCell align="center">Amount</StyledTableCell>
                        <StyledTableCell align="right"></StyledTableCell>
                        {/* <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
            <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => (
                        <StyledTableRow key={item.name}>
                            <StyledTableCell component="th" scope="row" >
                                <Typography
                                    variant='h4'
                                    color={'#333'}
                                >
                                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                </Typography>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                                {/* {item.count === 0 ? "Out of Stock" : "In Stock"} */}
                                <Chip label={item.count === 0 ? "Out Of Stock" : "In Stock"} color={item.count === 0 ? "error" : "success"} variant="outlined" />
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                <Box display={'flex'} gap={2} justifyContent={'center'} alignItems={'center'}>
                                    <Box><Button size='small' variant='contained' onClick={async() => await removeItemSingle(item.name)} disabled={item.count === 0}> - </Button></Box>
                                    <Typography variant='h4' color={'#333'} textAlign={'center'}> {item.count} </Typography>
                                    <Box><Button size='small' variant='contained' onClick={async() => await addItemSingle(item.name)}> + </Button></Box>
                                    {/* <IconButton aria-label="delete" onClick={() => deleteItemStock(item.name)}> <DeleteIcon /> </IconButton> */}
                                </Box>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                            <IconButton aria-label="delete" onClick={async() => await deleteItemStock(item.name)}> <DeleteIcon /> </IconButton>

                            </StyledTableCell>
                            {/* <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.protein}</StyledTableCell> */}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
