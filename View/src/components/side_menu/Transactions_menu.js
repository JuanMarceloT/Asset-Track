import React from "react";
import '../../config.js';// Import the global configuration here
import styles from "./Transactions_menu.module.css";
import ScrollableDivs from "../cards/ScrollableDivs";
import TransactionCard from "../cards/Transaction_card";


function Transactions_menu({ transactions , stock_infos}) {
    return (<div className={styles.assetMenu}>
        <ScrollableDivs>
            {transactions != null && (<table>
                <thead>
                    <tr>
                        <th colSpan={2}>Stock</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Units</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        transactions && transactions.map((transaction) => (
                            <TransactionCard key={transaction.id} transaction={{ type: transaction.transaction_type, date: transaction.timestamp, units: transaction.units, price: transaction.price_in_real, stock_id: transaction.stock_id, img: stock_infos[transaction.stock_id].img_url,  stock_name: stock_infos[transaction.stock_id].stock_name  }} />
                        ))
                    }
                </tbody>
            </table>

            )}
        </ScrollableDivs>
    </div>)
}

export default Transactions_menu;