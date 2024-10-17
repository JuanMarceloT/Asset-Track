import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

import ClipLoader from 'react-spinners/ClipLoader';

function GraphFunction({ graph, Loading }) {

    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {

        if(!graph[0]){
            return;
        }
        const data = formatToGraphData(graph[0].data);

        const datasets = graph.map((valuesArray, index) => ({
            data: valuesArray.data,  // Assuming each `valuesArray` is an array of numbers for each dataset
            borderColor: `rgba(${256 - (256 / graph.length) * index}, ${256 - (256 / graph.length) * index}, ${256 - (256 / graph.length) * index})`,  // Adjust colors dynamically if needed
            backgroundColor:`rgba(${256 - (256 / graph.length) * index}, ${256 - (256 / graph.length) * index}, ${256 - (256 / graph.length) * index})`,  // Create different colors for each dataset
            fill: false,
            pointRadius: 0,  // Remove the dots
            pointHoverRadius: 0  // Remove the dots on hover
        }));
    

        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Destroy the previous chart instance if it exists
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            // Create a new chart instance
            chartInstanceRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: { display: false },
                        tooltip: { 
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                title: function(tooltipItems) {
                                    return tooltipItems[0].label; 
                                },
                                label: function(tooltipItem) {
                                    const datasetIndex = tooltipItem.datasetIndex;
                                    console.log(tooltipItem);
                                    return `${graph[datasetIndex].label}: ${+tooltipItem.formattedValue > 0 ? "+" : null}${(+tooltipItem.formattedValue).toFixed(2)}%`;
                                }
                            }
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
                                color: 'white' // Set x-axis title color
                            },
                            ticks: {
                                color: 'white' // Set x-axis ticks color
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                color: 'white' // Set y-axis title color
                            },
                            ticks: {
                                color: 'white' // Set y-axis ticks color
                            },
                            suggestedMax: getGraphScale(data) 
                        },
                    }
                }
            });
        }

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [graph]);

    return (
        <>
            <div style={{ position: 'relative' }}>
                {Loading ? (
                    <div style={{ position: 'absolute', top: '0%', left: '50%', transform: 'translate(-50%, 100%)' }}>
                        <ClipLoader color="#ffffff" size={100} />
                    </div>
                ): null}
                
            </div>
            <canvas ref={chartRef} />
        </>
    );
}

function getGraphScale(data) {
    const max = Math.max(...data.values);
    const min = Math.min(...data.values);

    if (min !== 0 && max / min >= 1.4) {
        return max;
    }

    return max * 1.6;
}

function formatToGraphData(params) {
    const formattedData = {
        labels: [],
        values: []
    };

    Object.entries(params).forEach(([key, value]) => {
        formattedData.labels.push(key);
        formattedData.values.push(value.toFixed(2));
    });

    return formattedData;
}

export default GraphFunction;
