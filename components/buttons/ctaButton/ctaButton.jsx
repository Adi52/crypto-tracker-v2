import React from "react";
import styles from "./ctaButton.module.scss";
import { CircularProgress } from "@material-ui/core";

const CtaButton = ({ onClick, title, disabled = false, style }) => {
  return (
    <button
      className={styles.button}
      type={"button"}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {disabled ? <CircularProgress size={25} color="white" /> : title}
    </button>
  );
};

export default CtaButton;
