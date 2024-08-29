import React, { useEffect, useState } from 'react';
import styles from './Side_menu.module.css'
import Selectable_menu from "./Selectable_menu"
import Info_Card from "./../cards/Info_Card"
import { GetUser } from '../../bff';

function Side_menu({ user_id }) {
    const [stocks, setstocks] = useState(null);
    const [transactions, settransacitons] = useState(null);
    const [Invested, setInvested] = useState(0);
    const [Dividends, setDividends] = useState(0);
    const [Dividends_ytd, setDividends_ytd] = useState(0);
    const [stock_infos, setStockInfos] = useState([]);


    useEffect(() => {
        async function fetchData() {
            try {
                let user = await GetUser(user_id);
                console.log(user);
                setstocks(user.stocks);
                settransacitons(user.transactions);

                const newStockInfos = [];

                user && user.stocks.forEach(element => {
                    newStockInfos[element.stock_id] = {
                        img: element.img_url,
                        stock_name: element.stock_name
                    };
                });

                setStockInfos(newStockInfos);
                console.log(newStockInfos);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.stocks}>
                <div className={styles.card}>
                    <div className={styles.cards}>
                        <Info_Card content={{ title: "Investido", content: `R$ ${Invested.toFixed(2)}`, subcontent: "+12% this month" }} />
                    </div>
                    <div className={styles.cards}>
                        <Info_Card content={{ title: "Dividendos deste ano", content: `R$ ${Dividends_ytd.toFixed(2)}`, subcontent: "+8% this year" }} />
                    </div>
                </div>
                <div className={styles.input}>
                    <Selectable_menu id={user_id} stocks={stocks} transactions={transactions} Dividends={Dividends} stock_infos={stock_infos} />
                </div>
            </div>
        </div>
    );
}

export default React.memo(Side_menu);

