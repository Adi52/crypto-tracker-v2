import React from 'react';
import styles from './addButton.module.scss';
import AddIcon from "@material-ui/icons/Add";

const AddButton = ({onClick}) => {

  return <div onClick={onClick} className={styles.wrapper}>
    <AddIcon style={{fontSize: 30, color: 'white'}} />
  </div>
}

export default AddButton;
