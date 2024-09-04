import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import styles from './Graph.module.css';

import { GetUser, Create_New_Transaction, createNewUser, Get_Graph_Params, Get_Dividends, get_ytd_dividends } from '../../bff.js';

import Graph_time_selector from './Graph_time_selector';

function FormatToGraphData(Params) {
    const formated_data = {
        labels: [],
        values: []
    }

    Object.keys(Params).map(key => {
        // console.log(Params[);
        formated_data.labels.push(key);
        formated_data.values.push(Params[key]);
    })

    // console.log(formated_data);
    return formated_data;
}


const Graph = ({ user_id, Reload }) => {

    const [onSelectTimePeriod, SetonSelectTimePeriod] = useState('1d');
    const [graph, setGraph] = useState({});
    const [cached_graph, setCachedGraph] = useState({}); 

    const updateGraph = async () => {
        try {
            if(Reload){
                setCachedGraph({});
            }

            if (!cached_graph[onSelectTimePeriod]) {
                const graph_params = await Get_Graph_Params(user_id, onSelectTimePeriod);
                setCachedGraph(prevCache => ({ ...prevCache, [onSelectTimePeriod]: graph_params }));
                setGraph(graph_params);
            } else {
                setGraph(cached_graph[onSelectTimePeriod]);
            }
        } catch (error) {
            console.error("Error fetching graph:", error);
        }
    };
    const chartRef = useRef(null);

    useEffect(() => {
        updateGraph();
    }, [onSelectTimePeriod, Reload]);

    useEffect(() => {
        const data = FormatToGraphData(graph);
        // console.log(data);
        let chartInstance = null;

        if (chartRef && chartRef.current) {
            // Destroy the previous chart instance if it exists
            if (chartInstance) {
                chartInstance.destroy();
            }

            const ctx = chartRef.current.getContext('2d');

            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        data: data.values,
                        borderColor: '#ffffff',
                        backgroundColor: '#612af800',
                        fill: true,
                        pointRadius: 0,  // Remove the dots
                        pointHoverRadius: 0  // Remove the dots on hover
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false  // Hide the legend
                        },
                        title: {
                            display: false,
                        },
                        tooltip: {
                            mode: 'index'
                        },
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            stacked: true,
                            title: {
                                display: true,
                                color: 'white' // Set y-axis title color to black
                            },
                            ticks: {
                                color: 'white' // Set y-axis ticks color to black
                            }
                        },
                        y: {
                            beginAtZero: true,
                            stacked: true,
                            title: {
                                display: true,
                                color: 'white' // Set y-axis title color to white
                            },
                            ticks: {
                                color: 'white' // Set y-axis ticks color to white
                            }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [graph]);

    return <div className={styles.graph_dashboard}>
        <Graph_time_selector SetonSelectTimePeriod={SetonSelectTimePeriod} onSelectTimePeriod={onSelectTimePeriod} />
        <canvas ref={chartRef} />;
    </div>
};

export default React.memo(Graph);

