import React, { useState } from 'react';
import styles from './PlusButton.module.css';

const PlusButton = ({state, setState}) => {

  const handleClick = () => {
    setState(!state);
  };

  return (
    <button className={styles.plus} onClick={handleClick}>
      Add transaction
    </button>
  );
};

export default PlusButton;
