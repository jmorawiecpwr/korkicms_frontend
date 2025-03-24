import React, { useEffect, useState } from 'react';
import Tile from './Tile';

export default function DashboardSummary({ students }) {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState("–");

    useEffect(() => {
        fetchLessons();
    }, [students]);

    const fetchLessons = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/lessons/");
            const data = await res.json();
            setLessons(data);
        } catch (err) {
            console.error("Błąd pobierania lekcji:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let interval;
        if (!loading && lessons.length > 0) {
            const now = new Date();
            const nextLessonDate = lessons
                .map(l => new Date(l.date))
                .filter(d => d > now)
                .sort((a, b) => a - b)[0];

            if (nextLessonDate) {
                interval = setInterval(() => {
                    const now = new Date();
                    const diff = nextLessonDate - now;
                    if (diff > 0) {
                        const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
                        const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
                        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
                        setTimeRemaining(`${hours}:${minutes}:${seconds}`);
                    } else {
                        setTimeRemaining("Już trwa");
                        clearInterval(interval);
                    }
                }, 1000);
            } else {
                setTimeRemaining("–");
            }
        }

        return () => clearInterval(interval);
    }, [lessons, loading]);

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
    const homeworkToCheck = lessons.filter(l => !l.homework_done).length;
    const projection = lessonsThisMonth.length;

    return (
        <div className="tile-container">
            <Tile title="Twój zarobek za ten miesiąc" value={`${earnings.toFixed(2)} zł`} />
            <Tile title="Ilość prac domowych do sprawdzenia" value={homeworkToCheck} />
            <Tile title="Ilość odwołanych zajęć" value="–" />
            <Tile title="Nierozliczonych zajęć" value={unsettledCount} />
            <Tile title="Projekcja liczby godzin" value={projection} />
            <Tile title="Do następnych zajęć pozostało" value={timeRemaining} />
        </div>
    );
}