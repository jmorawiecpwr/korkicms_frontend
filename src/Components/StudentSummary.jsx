import React, { useEffect } from 'react';
import './StudentSummary.css'

export default function StudentSummary({ student }) {
    const [loading, setLoading] = React.useState(true);
    const [lessons, setLessons] = React.useState([]);

    const API_LESSONS = `http://127.0.0.1:8000/api/lessons/?student=${student.id}`;

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const res = await fetch(API_LESSONS);
            const data = await res.json();
            setLessons(data);
        } catch (err) {
            console.log(err);
        } finally { setLoading(false) }
    }
    if (loading) return <p>Wczytywanie danych o uczniu...</p>

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();
const rate = parseFloat(student.hourly_rate || 0);

const settled = lessons.filter( (l) => l.is_settled && new Date(l.date).getMonth() === currentMonth && new Date(l.date).getFullYear() === currentYear);
const unsettled = lessons.filter((l) => !l.is_settled);

const monthlyEarnings = settled.length * rate;
const debt = unsettled.length * rate;

return (
    <div className="student-summary">
        <p><b>Zarobek w tym miesiącu:</b> {monthlyEarnings.toFixed(2)} zł</p>
        <p><b>Zaległość ucznia:</b> {debt.toFixed(2)} zł</p>
    </div>
);
};