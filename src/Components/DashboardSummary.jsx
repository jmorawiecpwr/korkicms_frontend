import React, { useEffect, useState } from 'react';
import Tile from './Tile';

export default function DashboardSummary({ students, lessons }) {

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lessonsThisMonth = lessons.filter(l => {
        const date = new Date(l.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const earnings = lessonsThisMonth
        .filter(l => l.is_settled)
        .reduce((sum, lesson) => {
            const student = students.find(s => s.id === lesson.student);
            const rate = parseFloat(student?.hourly_rate || 0);
            return sum + rate;
        }, 0);

    const unsettledCount = lessons.filter(l => !l.is_settled).length;
    const homeworkToCheck = lessons.filter(l => !l.homework_sent).length;

    return (
        <div className="tile-container">
            <Tile title="Twój zarobek za ten miesiąc" value={`${earnings.toFixed(2)} zł`} />
            <Tile title="Ilość prac domowych do sprawdzenia" value={homeworkToCheck} />
            <Tile title="Nierozliczonych zajęć" value={unsettledCount} />
        </div>
    );
}