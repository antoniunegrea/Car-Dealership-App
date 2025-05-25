import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Legend } from "recharts";
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: 'white',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{label}</p>
                <p style={{ margin: 0, color: payload[0].color }}>
                    {payload[0].name}: {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

const Charts: React.FC<ChartsProps> = ({ cars, dealerships }) => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
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
        const manufacturerStats: ManufacturerData[] = Object.entries(manufacturerCounts)
            .map(([name, value]) => ({
                name,
                value: value as number,
            }))
            .sort((a, b) => b.value - a.value); // Sort by value descending
        setManufacturerData(manufacturerStats);

        const yearCounts = cars.reduce((acc: { [key: string]: number }, car: Car) => {
            acc[car.year] = (acc[car.year] || 0) + 1;
            return acc;
        }, {});
        const yearStats: YearData[] = Object.entries(yearCounts)
            .map(([name, value]) => ({
                name,
                value: value as number,
            }))
            .sort((a, b) => Number(a.name) - Number(b.name)); // Sort by year
        setYearData(yearStats);
    }, [cars]);

    useEffect(() => {
        const dealershipCounts = dealerships.reduce((acc: { [key: string]: number }, dealership: Dealership) => {
            acc[dealership.name] = (acc[dealership.name] || 0) + 1;
            return acc;
        }, {});
        const dealershipStats: DealershipData[] = Object.entries(dealershipCounts)
            .map(([name, value]) => ({
                name,
                value: value as number,
            }))
            .sort((a, b) => b.value - a.value); // Sort by value descending
        setDealershipData(dealershipStats);

        const dealershipCountStats: DealershipCountData[] = Object.entries(dealershipCounts)
            .map(([name, value]) => ({
                name,
                value: value as number,
            }))
            .sort((a, b) => b.value - a.value); // Sort by value descending
        setDealershipCountData(dealershipCountStats);
    }, [dealerships]);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
            <button 
                onClick={() => navigate("/dealerships")}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                Go Back Home
            </button>
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
                gap: "20px",
                padding: "20px"
            }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#333', marginBottom: '20px' }}>Car Price Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={priceData}>
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="price" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#333', marginBottom: '20px' }}>Cars by Manufacturer</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={manufacturerData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                activeIndex={activeIndex ?? undefined}
                                onMouseEnter={onPieEnter}
                                onMouseLeave={onPieLeave}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                                {manufacturerData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        stroke={activeIndex === index ? '#fff' : undefined}
                                        strokeWidth={activeIndex === index ? 2 : 0}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#333', marginBottom: '20px' }}>Yearly Trends</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={yearData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#82ca9d" 
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#333', marginBottom: '20px' }}>Dealership Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={dealershipData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                activeIndex={activeIndex ?? undefined}
                                onMouseEnter={onPieEnter}
                                onMouseLeave={onPieLeave}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                                {dealershipData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        stroke={activeIndex === index ? '#fff' : undefined}
                                        strokeWidth={activeIndex === index ? 2 : 0}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#333', marginBottom: '20px' }}>Dealership Car Count</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dealershipCountData}>
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" fill="#8884d8">
                                {dealershipCountData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Charts;