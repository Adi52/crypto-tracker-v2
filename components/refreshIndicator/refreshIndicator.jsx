import React from 'react';
import styles from './refreshIndicator.module.scss';
import {CircularProgress} from "@material-ui/core";

const RefreshIndicator = () => {

  return <div className={styles.wrapper}>
    <CircularProgress color="primary" />
  </div>
}

export default RefreshIndicator;
