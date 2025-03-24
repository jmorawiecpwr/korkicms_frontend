import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import './EarningChart.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

export default function EarningsChart({ students }) {
    const [lessons, setLessons] = useState([]);
    const [filter, setFilter] = useState('all');
    const [chartType, setChartType] = useState('bar');

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/lessons/");
            const data = await res.json();
            setLessons(data);
        } catch (err) {
            console.error("Błąd pobierania lekcji:", err);
        }
    };

    const now = new Date();
    const filteredLessons = lessons.filter(lesson => {
        const date = new Date(lesson.date);
        if (!lesson.is_settled) return false;
        if (filter === 'this-year') {
            return date.getFullYear() === now.getFullYear();
        }
        if (filter === 'last-6-months') {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
            sixMonthsAgo.setDate(1);
            return date >= sixMonthsAgo;
        }
        return true;
    });

    const monthlyEarningsMap = {};
    filteredLessons.forEach(lesson => {
        const date = new Date(lesson.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const student = students.find(s => s.id === lesson.student);
        const rate = parseFloat(student?.hourly_rate || 0);
        monthlyEarningsMap[key] = (monthlyEarningsMap[key] || 0) + rate;
    });

    const sortedKeys = Object.keys(monthlyEarningsMap).sort();
    const labels = sortedKeys.map(k => {
        const [year, month] = k.split('-');
        const date = new Date(year, month - 1);
        return `${date.toLocaleString('pl-PL', { month: 'short' })} ${year}`;
    });
    const dataValues = sortedKeys.map(k => monthlyEarningsMap[k]);

    const chartData = {
        labels,
        datasets: [{
            label: 'Zarobki (zł)',
            data: dataValues,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: true,
            borderRadius: 4,
            tension: 0.3,
        }],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Zarobki miesięczne' }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: value => `${value} zł`,
                }
            }
        }
    };

    return (
        <div className="earnings-chart-container">
            <div className="earnings-chart-controls">
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">Wszystkie miesiące</option>
                    <option value="this-year">Tylko ten rok</option>
                    <option value="last-6-months">Ostatnie 6 miesięcy</option>
                </select>
                <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                    <option value="bar">Wykres słupkowy</option>
                    <option value="line">Wykres liniowy</option>
                </select>
            </div>
            {chartType === 'bar' ? (
                <Bar data={chartData} options={chartOptions} />
            ) : (
                <Line data={chartData} options={chartOptions} />
            )}
        </div>
    );
}