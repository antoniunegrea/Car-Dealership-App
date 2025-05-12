import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useNavigate } from "react-router-dom";
import Car from "../model/Car";
import Dealership from "../model/Dealership";

interface ChartsProps {
    cars: Car[];
    dealerships: Dealership[];
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

interface DealershipData {
    name: string;
    value: number;
}

interface DealershipCountData {
    name: string;
    value: number;
}

const Charts: React.FC<ChartsProps> = ({ cars, dealerships }) => {
    const navigate = useNavigate();

    const [priceData, setPriceData] = useState<PriceData[]>([]);
    const [manufacturerData, setManufacturerData] = useState<ManufacturerData[]>([]);
    const [yearData, setYearData] = useState<YearData[]>([]);
    const [dealershipData, setDealershipData] = useState<DealershipData[]>([]);
    const [dealershipCountData, setDealershipCountData] = useState<DealershipCountData[]>([]);


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

    useEffect(() => {
        const dealershipCounts = dealerships.reduce((acc: { [key: string]: number }, dealership: Dealership) => {
            acc[dealership.name] = (acc[dealership.name] || 0) + 1;
            return acc;
        }, {});
        const dealershipStats: DealershipData[] = Object.entries(dealershipCounts).map(([name, value]) => ({
            name,
            value: value as number,
        }));
        setDealershipData(dealershipStats);

        const dealershipCountStats: DealershipCountData[] = Object.entries(dealershipCounts).map(([name, value]) => ({
            name,
            value: value as number,
        }));
        setDealershipCountData(dealershipCountStats);
    }, [dealerships]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div>
            <button onClick={() => navigate("/dealerships")}>Go Back Home</button>
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
                <div>
                    <h2>Dealerships</h2>
                    <PieChart width={400} height={300}>
                        <Pie data={dealershipData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} />
                    </PieChart>
                </div>
                <div>
                    <h2>Dealerships Count</h2>
                    <PieChart width={400} height={300}>
                        <Pie data={dealershipCountData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default Charts;