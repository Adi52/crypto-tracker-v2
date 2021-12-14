import React from 'react';
import styles from './transparentButton.module.scss';

const TransparentButton = ({onClick, icon}) => {
  return <div className={styles.container} onClick={onClick}>
    {icon}
  </div>
}

export default TransparentButton;
