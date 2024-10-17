import React, { useEffect, useRef, useState } from 'react';
import '../../config.js';// Import the global configuration here
import styles from './Graph.module.css';
import GraphFunction from './graph_function.js';

import { GetUser, Create_New_Transaction, createNewUser, Get_Graph_Params, Get_Dividend_Graph_Params, Get_Percent_Graph_Params, Get_Index_Percent_Graph_Params, Get_Dividends, get_ytd_dividends } from '../../bff.js';

import Graph_time_selector from './Graph_time_selector';


const Graph = ({ user_id, Reload }) => {

    const [onSelectTimePeriod, SetonSelectTimePeriod] = useState('1m');
    const [graph, setGraph] = useState({});
    const [cached_graph, setCachedGraph] = useState({});
    const [graph_type, setgraph_type] = useState("stock");
    const [Loading, setLoading] = useState(false);

    const updateGraph = async () => {
        try {
            if (Reload) {
                setCachedGraph({});
            }
            if (!cached_graph[graph_type]) {
                cached_graph[graph_type] = {};
            }
            if (!cached_graph[graph_type][onSelectTimePeriod]) {

                let graph_params = [];  // Initialize an array to hold the graph parameters

                switch (graph_type) {
                    case "stock":
                        graph_params.push({label: "My Stocks", data: await Get_Graph_Params(user_id, onSelectTimePeriod)});
                        break;
                    case "dividends":
                        graph_params.push({label: "Dividends", data: await Get_Dividend_Graph_Params(user_id, onSelectTimePeriod)});
                        break;
                    case "ibov":
                        graph_params.push({label: "My portfolio", data: await Get_Percent_Graph_Params(user_id, onSelectTimePeriod)});
                        graph_params.push({label: "IBOV", data: await Get_Index_Percent_Graph_Params("ibov", onSelectTimePeriod)});
                        console.log(graph_params);
                        break;
                    default:
                        console.error("Invalid graph type:", graph_type);
                }
                
                setCachedGraph(prevCache => ({
                    ...prevCache,
                    [graph_type]: {
                        ...(prevCache[graph_type] || {}),
                        [onSelectTimePeriod]: graph_params
                    }
                }));
                setGraph(graph_params);
            } else {
                setGraph(cached_graph[graph_type][onSelectTimePeriod]);
            }
        } catch (error) {
            console.error("Error fetching graph:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        updateGraph();
    }, [onSelectTimePeriod, Reload, graph_type]);

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;

        setgraph_type(selectedValue);
    };

    const selectRef = useRef(null); // Ref for the select element

    const resetSelect = () => {
        if (selectRef.current) {
            selectRef.current.value = ""; // Reset the select value
        }
    };

    return <div className={styles.graph_dashboard}>
        <div className={styles.graph_types}>
            <button className={graph_type === 'stock' ? styles.selected : styles.btn} onClick={() => { setgraph_type("stock"); resetSelect() }}>Stocks</button>
            <button className={graph_type === 'dividends' ? styles.selected : styles.btn} onClick={() => { setgraph_type("dividends"); resetSelect() }}>Dividendos</button>
            <select id="itemSelect" ref={selectRef} onChange={handleSelectChange} className={graph_type == 'ibov' ? styles.selected : styles.btn}>
                <option value="" disabled selected>Compare to..</option>
                <option value="ibov" key="ibov" >Bovespa</option>
                {/* {
                        Object.keys(stock_infos).map(key => {
                            return (
                                <option key={key} value={key}>
                                    {stock_infos[key].name}
                                </option>
                            );
                        })
                    } */}
            </select>
        </div>
        <Graph_time_selector SetonSelectTimePeriod={SetonSelectTimePeriod} onSelectTimePeriod={onSelectTimePeriod} />
        <GraphFunction graph={graph} Loading={Loading} />;
    </div>
};

export default React.memo(Graph);
