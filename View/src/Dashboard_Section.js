import React from 'react';

import styles from './Dashboard_Section.module.css';

function Dashboard_Section({ children }) {
    const childrenArray = React.Children.toArray(children);
    const firstChild = childrenArray[0];
    const secondChild = childrenArray[1];

    return (
        <div className={styles.container}>
            <div className={styles.stocks}>
                <div className={styles.card}>
                    <div className={styles.cards}>
                        {firstChild}
                    </div>
                    <div className={styles.cards}>
                        {childrenArray[1]}
                    </div>
                </div>
                <div className={styles.input}>
                    {childrenArray[2]}
                </div>
            </div>
            <div className={styles.graph}>
                {childrenArray[3]}
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

export default Dashboard_Section;

