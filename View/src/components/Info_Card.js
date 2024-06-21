import React from 'react';
import styles from './Info_Card.module.css'; 

function Info_Card() {
  return (
    <div className={styles.container}>
      <span id={styles.title}>Investido</span>
      <span id={styles.content}>$45,678.90</span>
      <span id={styles.subcontent}>+20% month over month</span>
    </div>
  );
}

export default Info_Card;
