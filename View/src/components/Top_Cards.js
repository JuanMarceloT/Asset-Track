import React from 'react';
import Info_Card from './Info_Card';
import styles from './Top_Cards.module.css'; 


function Top_Cards() {
  return (
    <div className={styles.container}>
        <Info_Card/>
        <Info_Card/>
        <Info_Card/>
    </div>
    
  );
}

export default Top_Cards;
