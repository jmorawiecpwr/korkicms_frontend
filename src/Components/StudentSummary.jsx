import React, { useEffect } from 'react';
import './StudentSummary.css'

export default function StudentSummary({ student, lessons }) {

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();
const rate = parseFloat(student.hourly_rate || 0);

const settled = lessons.filter((l) => {
    if (!l.is_settled) return false;

    const lessonDate = new Date(l.date);
    const lessonMonth = lessonDate.getMonth();
    const lessonYear = lessonDate.getFullYear();

    return lessonMonth === currentMonth && lessonYear === currentYear;
});
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