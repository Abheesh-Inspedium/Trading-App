import { Box, Heading } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
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
    const maxC = Math.max(...data.map(item => item.close));
    const maxH = Math.max(...data.map(item => item.high));
    const maxL = Math.max(...data.map(item => item.low));
    const maxValues = [maxC, maxH, maxL];
    const minValues = [maxC, maxH, maxL];

    const overallMax = Math.ceil(Math.max(...maxValues));
    const overallMin = Math.floor(Math.min(...minValues));

    const yDomain = [overallMin - 10, overallMax + 10];
    const lineSize = {
        strokeWidth: 2,
    };
    return (
        <div
            style={{
                width: "100%",
                height: "400px",
                background: "#fff",
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
                    <XAxis dataKey="date" scale="band" />
                    <YAxis domain={yDomain} />
                    <Tooltip />
                    <Legend />

                    <Line type="monotone" dataKey="close" {...lineSize} stroke="blue" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="low" {...lineSize} stroke="red" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="high" {...lineSize} stroke="green" activeDot={{ r: 8 }} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

const Trading = () => {
    const stocks = ['TSM', 'AAPL', 'MSFT']
    const [stocksData, setStocksData] = useState([]);
    const startDate = '2022-01-01';
    const endDate = '2023-01-01';
    const apiKey = 'be1hPzvVwCupKwp5OVOASeQ_TBaOMayu';

    function formatDate(date) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    }

    const fetchData = async (stock) => {
        return await axios.get(`https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/2022-01-01/2023-01-01?unadjusted=false&apiKey=${apiKey}`);
    };

    const updateData = () => {
        console.log('Fetching');
        stocks.map((stock) => {
            fetchData(stock)
                .then((response) => {
                    const data = response?.data;
                    console.log(data);
                    if (data && data.results) {
                        data.results.sort((a, b) => b.t - a.t);
                        const limitedData = data.results.slice(0, 10);
                        const customData = limitedData.map((item) => ({
                            date: formatDate(new Date(item.t)),
                            close: item.c,
                            low: item.l,
                            high: item.h,
                        }))
                        console.log(customData);
                        setStocksData([...stocksData, customData]);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                })
        })
    };

    useEffect(() => {
        const data = localStorage.getItem('stockData');

        if (data && data.length > 2) {
            console.log('localStorage');
            const parsedData = JSON.parse(data);
            console.log(parsedData);
            setStocksData(parsedData);
        }
        else {
            updateData();
            console.log('Stocks: ', stocksData);
            localStorage.setItem('stockData', JSON.stringify(stocksData));
        }
        setTimeout(updateData, 60000);
    }, []);
    let count = 0;
    console.log(count.current);
    return (
        <Box padding={'3rem'}>
            {stocksData.map((stockData) => {
                count++
                return (
                    <>
                        <Heading>{stocks[count]}'s Stock Value for the last week of 2022</Heading>
                        <ChartComponent data={stockData} />
                    </>
                );
            })}
        </Box>
    );
};

export default Trading;
