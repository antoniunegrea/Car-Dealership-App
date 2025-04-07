import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useNavigate } from "react-router-dom";
import Car from "../model/Car";

interface ChartsProps {
    cars: Car[];
}

interface PriceData {
    name: string;
    price: number;
}

interface ManufacturerData {
    name: string;
    value: number;
}

interface YearData {
    name: string;
    value: number;
}

const Charts: React.FC<ChartsProps> = ({ cars }) => {
    const navigate = useNavigate();

    const [priceData, setPriceData] = useState<PriceData[]>([]);
    const [manufacturerData, setManufacturerData] = useState<ManufacturerData[]>([]);
    const [yearData, setYearData] = useState<YearData[]>([]);

    useEffect(() => {
        const priceStats: PriceData[] = cars.map(car => ({
            name: car.model,
            price: car.price,
        }));
        setPriceData(priceStats);

        const manufacturerCounts = cars.reduce((acc: { [key: string]: number }, car: Car) => {
            acc[car.manufacturer] = (acc[car.manufacturer] || 0) + 1;
            return acc;
        }, {});
        const manufacturerStats: ManufacturerData[] = Object.entries(manufacturerCounts).map(([name, value]) => ({
            name,
            value: value as number,
        }));
        setManufacturerData(manufacturerStats);

        const yearCounts = cars.reduce((acc: { [key: string]: number }, car: Car) => {
            acc[car.year] = (acc[car.year] || 0) + 1;
            return acc;
        }, {});
        const yearStats: YearData[] = Object.entries(yearCounts).map(([name, value]) => ({
            name,
            value: value as number,
        }));
        setYearData(yearStats);
    }, [cars]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div>
            <button onClick={() => navigate("/")}>Go Back Home</button>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div>
                    <h2>Car Price Distribution</h2>
                    <BarChart width={400} height={300} data={priceData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="price" fill="#8884d8" />
                    </BarChart>
                </div>
                <div>
                    <h2>Cars by Manufacturer</h2>
                    <PieChart width={400} height={300}>
                        <Pie
                            data={manufacturerData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                        >
                            {manufacturerData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
                <div>
                    <h2>Yearly Trends</h2>
                    <LineChart width={400} height={300} data={yearData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                    </LineChart>
                </div>
            </div>
        </div>
    );
};

export default Charts;