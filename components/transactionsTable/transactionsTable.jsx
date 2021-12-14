import React, { useEffect, useState } from "react";
import styles from "./transactionsTable.module.scss";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
} from "@material-ui/core";
import { numberWithSpaces } from "../../utils/functions/numberWithSpaces";
import { useRouter } from "next/router";
import axios from "axios";
import { API_TRANSACTIONS } from "../../utils/constants/routers";
import moment from "moment";

function createData(
  purchasedCryptoSymbol,
  purchasedPrice,
  quantity,
  purchasedDate
) {
  return {
    purchasedCryptoSymbol,
    purchasedPrice,
    quantity,
    purchasedDate,
    allCost: purchasedPrice * quantity,
  };
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#333333",
    color: "#707070",
    fontFamily: "Montserrat",
    fontWeight: 600,
    textAlign: "center",
  },
  body: {
    padding: 10,
    fontSize: 14,
    fontFamily: "Montserrat",
    textAlign: "center",
    fontWeight: 600,
    color: "white",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: "#434343",
    "&:nth-of-type(odd)": {
      backgroundColor: "#565656",
    },
  },
}))(TableRow);

const TransactionsTable = ({ transactionsArr }) => {
  const [tableRows, setTableRows] = useState([]);
  moment.locale("pl");

  const createRows = (transactions) => {
    const rows = transactions?.map((item) =>
      createData(
        item.purchasedCryptoSymbol,
        item.purchasedPrice,
        item.quantity,
        item.purchasedDate
      )
    );
    setTableRows(rows);
  };

  useEffect(() => {
    createRows(transactionsArr);
  }, [transactionsArr]);

  return (
    <section className={styles.tableWrapper}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Kryptowaluta</StyledTableCell>
              <StyledTableCell align="right">Cena</StyledTableCell>
              <StyledTableCell align="right">Ilość</StyledTableCell>
              <StyledTableCell align="right">Za ile kupiłeś</StyledTableCell>
              <StyledTableCell align="right">Data</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row) => (
              <StyledTableRow key={row.purchasedCryptoSymbol}>
                <StyledTableCell component="th" scope="row">
                  {row.purchasedCryptoSymbol.toUpperCase()}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {numberWithSpaces(row.purchasedPrice)} $
                </StyledTableCell>
                <StyledTableCell align="right">{row.quantity}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.allCost.toFixed(1)} $
                </StyledTableCell>
                <StyledTableCell align="right">
                  {moment(row.purchasedDate).format("DD/MM/YYYY")}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
};

export default TransactionsTable;
