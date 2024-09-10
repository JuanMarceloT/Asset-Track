import React from 'react';
import '../../config.js';// Import the global configuration here
import styles from './Info_Card.module.css'; 

function Info_Card({content}) {

  if(!content)
    return

  return (
    <div className={styles.container}>
      <span id={styles.title}>{content.title}</span>
      <span id={styles.content}>{content.content}</span>
      <span id={styles.subcontent}>{content.subcontent}</span>
    </div>
  );
}

export default Info_Card;
