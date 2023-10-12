import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
    Bar,
    ComposedChart,
} from 'recharts';

const ChartComponent = ({ data }) => {
    return (
        <div
            style={{
                width: "100%",
                height: "400px",
                background: "#232323",
                padding: "1rem",
            }}
        >
            <ResponsiveContainer>
                <ComposedChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid horizontal={true} vertical={false} />
                    <XAxis dataKey="name" scale="band" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="c" barSize={10} fill="rgb(0 255 240)" />
                    <Bar dataKey="h" barSize={10} fill="rgb(0 255 240)" />
                    <Bar dataKey="l" barSize={10} fill="rgb(0 255 240)" />
                    <Bar dataKey="n" barSize={10} fill="rgb(0 255 240)" />
                    <Bar dataKey="o" barSize={10} fill="rgb(0 255 240)" />
                    <Bar dataKey="t" barSize={10} fill="rgb(0 255 240)" />
                    <Bar dataKey="v" barSize={10} fill="rgb(0 255 240)" />
                    <Bar dataKey="vw" barSize={10} fill="rgb(0 255 240)" />

                    <Line type="monotone" dataKey="c" stroke="white" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="h" stroke="white" />
                    <Line type="monotone" dataKey="l" stroke="white" />
                    <Line type="monotone" dataKey="n" stroke="white" />
                    <Line type="monotone" dataKey="o" stroke="white" />
                    <Line type="monotone" dataKey="t" stroke="white" />
                    <Line type="monotone" dataKey="v" stroke="white" />
                    <Line type="monotone" dataKey="vw" stroke="white" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

const Trading = () => {
    const [stockData, setStockData] = useState([]);
    const apiKey = 'be1hPzvVwCupKwp5OVOASeQ_TBaOMayu';
    const symbol = 'AAPL';

    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2022-01-01/2023-01-01?unadjusted=false&apiKey=${apiKey}`;

    useEffect(() => {
        // const fetchData = async () => {
        //     try {
        //         const response = await fetch(apiUrl);
        //         const data = await response.json();
        //         setStockData(data.results);
        //         console.log(data);
        //     } catch (error) {
        //         console.error('Error fetching data:', error);
        //     }
        // };
        // fetchData();
        axios.get(endpoint)
            .then((response) => {
                const data = response.data;
                const date = data.results[0].t; // Adjust the property path based on the actual response structure
                console.log('Date:', new Date(date * 1000)); // Convert timestamp to a JavaScript Date
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [apiUrl]);
    console.log(stockData);
    return (
        <>
            <ChartComponent data={stockData} />
        </>
    );
};

export default Trading;
