import React from "react";
import styles from "./mainTile.module.scss";
import { CircularProgress } from "@material-ui/core";
import {numberWithSpaces} from "../../utils/functions/numberWithSpaces";

const MainTile = ({ title, value, suffix, isLoading, colorProfit = false }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <p>{title}</p>
        {isLoading ? (
          <CircularProgress size={25} color="primary" />
        ) : (
          <h1
            style={{
              color: colorProfit
                ? value > 0
                  ? "#97D268"
                  : "#F39E8A"
                : "white",
            }}
          >
            {suffix}
            {' '}
            {numberWithSpaces(value.toFixed(2))}
          </h1>
        )}
      </div>
    </div>
  );
};

MainTile.defaultProps = {
  title: "",
  value: 0,
  suffix: "$",
};

export default MainTile;
