import React, { useEffect, useState } from "react";
// import { COIN_INFO_ROUTE } from "../../utils/constants/routers";
import axios from "axios";
import styles from "./cryptoPricesTable.module.scss";
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
import { COIN_INFO_ROUTE } from "../../utils/constants/routers";
import { numberWithSpaces } from "../../utils/functions/numberWithSpaces";

function createData(
  image,
  symbol,
  name,
  currentPrice,
  priceChange24h,
  priceChange7d
) {
  const firstCol = {
    image,
    symbol,
  };
  return { firstCol, name, currentPrice, priceChange24h, priceChange7d };
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
    padding: 5,
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

const CryptoPricesTable = ({ availableCrypto }) => {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [tableRows, setTableRows] = useState([]);

  const getCryptoData = async (cryptoId) => {
    const res = await axios.get(COIN_INFO_ROUTE(cryptoId));
    return res.data;
  };

  const createRows = (cryptoDataArr) => {
    const rows = cryptoDataArr.map((item) =>
      createData(
        item.image.thumb,
        item.symbol,
        item.name,
        item.market_data.current_price.usd,
        item.market_data.price_change_percentage_24h,
        item.market_data.price_change_percentage_7d
      )
    );
    setTableRows(rows);
  };

  const getCryptoDataArr = async (cryptoIdsArr) => {
    const cryptoDataArr = await Promise.all(
      cryptoIdsArr.map((cryptoId) => getCryptoData(cryptoId))
    );
    createRows(cryptoDataArr);
    setIsDataLoading(false);
  };

  useEffect(() => {
    if (availableCrypto.length > 0) {
      setIsDataLoading(true);
      const cryptoIdsArr = availableCrypto.map(
        (crypto) => crypto.purchasedCryptoId
      );
      getCryptoDataArr(cryptoIdsArr);
    }
  }, [availableCrypto]);

  if (isDataLoading) {
    return <CircularProgress color="primary" />;
  }

  return (
    <section className={styles.tableWrapper}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Kryptowaluta</StyledTableCell>
              <StyledTableCell align="right">Nazwa</StyledTableCell>
              <StyledTableCell align="right">Cena</StyledTableCell>
              <StyledTableCell align="right">24h</StyledTableCell>
              <StyledTableCell align="right">7d</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">
                  <div className={styles.firstColWrapper}>
                    <img
                      src={row.firstCol.image}
                      style={{ width: 18, height: 18 }}
                    />
                    <p>{row.firstCol.symbol}</p>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">{row.name}</StyledTableCell>
                <StyledTableCell align="right">
                  {numberWithSpaces(row.currentPrice)} $
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  style={{
                    color: row.priceChange24h >= 0 ? "#97D268" : "#F39E8A",
                  }}
                >
                  {row.priceChange24h}
                  {row.priceChange24h ? " %" : ""}
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  style={{
                    color: row.priceChange7d >= 0 ? "#97D268" : "#F39E8A",
                  }}
                >
                  {row.priceChange7d}
                  {row.priceChange7d ? " %" : ""}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
};

export default CryptoPricesTable;
