import React from 'react';
import './config'; // Import the global configuration here
import styles from './Dashboard_Section.module.css';

function Dashboard_Section({ children }) {
    const childrenArray = React.Children.toArray(children);
    const firstChild = childrenArray[0];
    const secondChild = childrenArray[1];

    return (
        <div className={styles.container}>
            <div className={styles.stocks}>
                {firstChild}
            </div>
            <div className={styles.graph}>
                {secondChild}
            </div>
        </div>
    );
}


/*

<div className={styles.stocks}>
            <h1>Stocks</h1>
            <ScrollableDivs maxHeight={50}>
                <StocksCard stocks={stocks}/>
            </ScrollableDivs>  
            <New_Transaction_button/>  
            </div>




*/

export default React.memo(Dashboard_Section);

