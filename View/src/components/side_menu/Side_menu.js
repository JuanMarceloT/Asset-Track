import React, { useEffect, useState, useMemo } from 'react';
import styles from './Side_menu.module.css'
import Selectable_menu from "./Selectable_menu"
import Info_Card from "./../cards/Info_Card"
import { GetUser , get_stock_price_by_id, get_assets_total_value, Get_Dividends, GetStockInfos } from '../../bff';


function Side_menu({ user_id, setReload, Reload}) {
    const [stocks, setstocks] = useState(null);
    const [transactions, settransacitons] = useState(null);
    const [Dividends, setDividends] = useState(0);
    const [Dividends_ytd, setDividends_ytd] = useState(0);
    const [stock_infos, setStockInfos] = useState([]);
    const [stock_prices, setstock_prices] = useState({});
    const [total_assets_value, settotal_assets_value] = useState(0);


    useEffect(() => {
        async function fetchData() {
            
            try {
                let user = await GetUser(user_id);
                // console.log(user);
                setstocks(user.stocks);
                settransacitons(user.transactions);

                let stock_infos = await GetStockInfos();
                setStockInfos(stock_infos);

                let dividends = await Get_Dividends(user_id);
                setDividends(dividends);

                let now = new Date();
                setDividends_ytd(dividends[now.getFullYear()].total_earned);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }finally{
                setReload(false);
            }
        }
        fetchData();
    }, [Reload]);


    const prices = useMemo(() => {
        if(stocks){
            Get_prices(stocks);
            total_value(stocks);
        }
    }, [stocks]);

    async function Get_prices(stocks) {

        const response = {};

        for (const stock of stocks) {
            try {
              const price = await get_stock_price_by_id(stock.stock_id);
              const variation = parseInt((price * 100 / parseFloat(stock.avg_price_in_real)) - 100);
              response[stock.stock_id] = {
                price,
                variation,
              };
            } catch (error) {
              console.error(`Error fetching price for stock ID ${stock.stock_id}:`, error);
            }
          }

        setstock_prices(response);
        return response;
    };


    async function total_value(stocks){
        let total_value = await get_assets_total_value(stocks);
        settotal_assets_value(total_value);
        return total_value;
    };

    return (
        <div className={styles.container}>
            <div className={styles.stocks}>
                <div className={styles.card}>
                    <div className={styles.cards}>
                        <Info_Card content={{ title: "Investido", content: `R$ ${total_assets_value.toFixed(2)}`, subcontent: "+12% this month" }} />
                    </div>
                    <div className={styles.cards}>
                        <Info_Card content={{ title: "Dividendos deste ano", content: `R$ ${Dividends_ytd.toFixed(2)}`, subcontent: "+8% this year" }} />
                    </div>
                </div>
                <div className={styles.input}>
                    <Selectable_menu id={user_id} stocks={stocks} stock_prices={stock_prices} transactions={transactions} Dividends={Dividends} setReload={setReload} stock_infos={stock_infos} />
                </div>
            </div>
        </div>
    );
}

export default React.memo(Side_menu);

