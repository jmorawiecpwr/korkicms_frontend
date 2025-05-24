import React, { useState } from 'react';
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

const nightModeTextColors = '#A0AEC0';
const nightModeGridBorderColors = '#4A5568';
const nightModeTitleColors = '#CBD5E0';

const lightModeTextColors = '#6c757d';
const lightModeGridBorderColors = '#e0e0e0';
const lightModeTitleColors = '#343a40';


export default function EarningsChart({ students, lessons, isNightMode }) {
    const [filter, setFilter] = useState('all');
    const [chartType, setChartType] = useState('bar');

    const now = new Date();
    const filteredLessons = lessons.filter(lesson => {
        const date = new Date(lesson.date);
        if (!lesson.is_settled) return false;
        if (filter === 'this-year') {
            return date.getFullYear() === now.getFullYear();
        }
        if (filter === 'last-6-months') {
            const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
            return date >= sixMonthsAgo && date <= now;
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

    const sortedKeys = Object.keys(monthlyEarningsMap).sort((a, b) => {
        // Sortowanie chronologiczne
        const [yearA, monthA] = a.split('-').map(Number);
        const [yearB, monthB] = b.split('-').map(Number);
        if (yearA !== yearB) return yearA - yearB;
        return monthA - monthB;
    });

    const labels = sortedKeys.map(k => {
        const [year, month] = k.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleString('pl-PL', { month: 'short', year: 'numeric' }).replace('.', ''); 
    });
    const dataValues = sortedKeys.map(k => monthlyEarningsMap[k]);

    const chartData = {
        labels,
        datasets: [{
            label: 'Zarobki (zł)',
            data: dataValues,
            backgroundColor: isNightMode ? 'rgba(99, 179, 237, 0.6)' : 'rgba(75, 192, 192, 0.6)',
            borderColor: isNightMode ? 'rgba(99, 179, 237, 1)' : 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: chartType === 'line',
            borderRadius: chartType === 'bar' ? 4 : 0,
            tension: chartType === 'line' ? 0.3 : 0,
        }],
    };

    const currentTextColor = isNightMode ? nightModeTextColors : lightModeTextColors;
    const currentGridColor = isNightMode ? nightModeGridBorderColors : lightModeGridBorderColors;
    const currentTitleColor = isNightMode ? nightModeTitleColors : lightModeTitleColors;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                display: false,
            },
            title: { 
                display: true, 
                text: 'Zarobki miesięczne',
                color: currentTitleColor,
                font: { size: 16, weight: '500' }
            },
            tooltip: {
                titleColor: currentTitleColor,
                bodyColor: currentTextColor,
                backgroundColor: isNightMode ? 'rgba(45, 55, 72, 0.9)' : 'rgba(255,255,255,0.9)',
                borderColor: currentGridColor,
                borderWidth: 1,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: value => `${value} zł`,
                    color: currentTextColor,
                },
                grid: {
                    color: currentGridColor,
                    borderColor: currentGridColor
                }
            },
            x: {
                ticks: {
                    color: currentTextColor,
                },
                grid: {
                    color: currentGridColor,
                    borderColor: currentGridColor
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
            <div className="chart-wrapper"> {/* Dodatkowy wrapper dla wysokości wykresu */}
                {chartType === 'bar' ? (
                    <Bar data={chartData} options={chartOptions} />
                ) : (
                    <Line data={chartData} options={chartOptions} />
                )}
            </div>
        </div>
    );
}