import React from "react";
import styles from "./Dividends_menu.module.css";
import ScrollableDivs from "../cards/ScrollableDivs";
import { get_stock_img_by_id, get_stock_name_by_id, formatMonthYear } from "../../bff";

function Dividends_menu({ dividends, stock_infos }) {

    // console.log(dividends);
    const renderDividends = () => {
        return Object.keys(dividends).reverse().map(year => {
            return Object.keys(dividends[year]['months']).reverse().map(month => {
                return Object.keys(dividends[year]['months'][month]['days']).reverse().map(day => {
                    return Object.keys(dividends[year]['months'][month]['days'][day]['stocks']).reverse().map(id => {
                        let stock = dividends[year]['months'][month]['days'][day]['stocks'][id];
                        return (
                            <tr className={styles.card} key={`${day}-${month}-${year}-${id}`}>
                                <td><img src={stock_infos[id].img_url} alt='logo'></img></td>
                                <td>{stock_infos[id].stock_name}</td>
                                <td>{`${day}/${month}/${year}`}</td>
                                <td>{stock.div_per_share.toFixed(2)}</td>
                                <td>{stock.total_div.toFixed(2)}</td>
                            </tr>
                        );
                    });
                });
            });
        });
    };

    return (<div className={styles.assetMenu}>
        <ScrollableDivs>
            {dividends != null && (<table>
                <thead>
                    <tr>
                        <th colSpan={2}>Stock</th>
                        <th>Data</th>
                        <th>Div. per share</th>
                        <th>Total Div.</th>
                    </tr>
                </thead>
                <tbody>
                {renderDividends()}
                        {/* // Object.entries(dividends).reverse().map(([dividendKey, dividend]) => (
                        //     Object.entries(dividend["Dividends"]["stock_dividends"]).map(([stockId]) => (
                        //         <tr className={styles.card}>
                        //             <td><img src={get_stock_img_by_id(parseInt(stockId))} alt='logo'></img></td>
                        //             <td>{get_stock_name_by_id(parseInt(stockId))}</td>
                        //             <td>{formatMonthYear(dividend["year"], dividend["month"])}</td>
                        //             <td>{dividend["Dividends"]["stock_dividends"][stockId].dividends_per_share.toFixed(2)}</td>
                        //             <td>{dividend["Dividends"]["stock_dividends"][stockId].total_Dividends.toFixed(2)}</td>
                        //         </tr>
                        //     ))
                        // )) */}
                    
                </tbody>
            </table>

            )}
        </ScrollableDivs>
    </div>)
}

export default Dividends_menu;