import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import styles from './Graph.module.css';


import { formatMonthYear } from '../bff';
import Graph_time_selector from './Graph_time_selector';

function FormatToGraphData(Params){
    const data = {
        labels: [],
        values: []
    }   

    Object.keys(Params).map(key => {
        // console.log(Params[);
            data.labels.push(key);
            data.values.push(Params[key]);
        
        //return <div key={key}>{value.monthYear} = ${price} </div>;
    })

    console.log(data);
    return data;
}

const Graph = ({ Params , onSelectTimePeriod , SetonSelectTimePeriod}) => {
    const chartRef = useRef(null);
    const data = FormatToGraphData(Params);
    //console.log(data);
    
    useEffect(() => {
        let chartInstance = null;
        
        if (chartRef && chartRef.current) {
            // Destroy the previous chart instance if it exists
            if (chartInstance) {
                chartInstance.destroy();
            }    

            
            
            const ctx = chartRef.current.getContext('2d');
            // var gradient = ctx.createLinearGradient(0, 0, 0, 400);
            //     gradient.addColorStop(0, '#622bf8b7');   // Red color at the top
            //     gradient.addColorStop(0.2, '#622bf847');   // Red color at the top
            //     gradient.addColorStop(1, '#612af800');   // Blue color at the bottom
        
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

        // Return a cleanup function to destroy the chart when the component unmounts
        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [data]);

    return <div className={styles.graph_dashboard}>
        <Graph_time_selector SetonSelectTimePeriod={SetonSelectTimePeriod} onSelectTimePeriod={onSelectTimePeriod}/>
        <canvas ref={chartRef} />;
    </div>
};

export default Graph;

