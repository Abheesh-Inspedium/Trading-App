import { Box, Heading } from '@chakra-ui/react';
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

const TradingTest = () => {
    const [stockData, setStockData] = useState([]);
    const [stockDataWithDates, setStockDataWithDates] = useState([]);
    const startDate = '2022-01-01';
    const endDate = '2023-01-01';
    const apiKey = 'be1hPzvVwCupKwp5OVOASeQ_TBaOMayu';
    const symbol = 'AAPL';
    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2022-01-01/2023-01-01?unadjusted=false&apiKey=${apiKey}`;

    function formatDate(date) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    }

    const fetchData = () => {
        return axios.get(apiUrl);
    };

    const updateData = () => {
        fetchData()
            .then((response) => {
                const data = response?.data;
                console.log('data:', data);
                if (data && data.results) {
                    data.results.sort((a, b) => b.t - a.t);
                    const limitedData = data.results.slice(0, 10);
                    setStockDataWithDates(
                        limitedData.map(item => ({
                            date: formatDate(new Date(item.t)),
                            close: item.c,
                            low: item.l,
                            high: item.h,
                        }))
                    );
                    console.log(stockDataWithDates);
                    localStorage.setItem('stockData', JSON.stringify(data));
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
                setTimeout(updateData, 60000);
            });
    };


    useEffect(() => {
        const data = localStorage.getItem('stockData');
        if (data && data.length > 2) {
            const parsedData = JSON.parse(data);
            parsedData.results.sort((a, b) => b.t - a.t);
            const limitedData = parsedData.results.slice(0, 10);
            setStockDataWithDates(
                limitedData.map(item => ({
                    date: formatDate(new Date(item.t)),
                    close: item.c,
                    low: item.l,
                    high: item.h,
                }))
            );
        }
        else {
            updateData();
        }
    }, []);

    return (
        <Box padding={'3rem'}>
            <Heading>Apple's Stock Value for the last week of 2022</Heading>
            <ChartComponent data={stockDataWithDates} />
            <Heading>Apple's Stock Value for the last week of 2022</Heading>
            <ChartComponent data={stockDataWithDates} />

        </Box>
    );
};

export default TradingTest;
