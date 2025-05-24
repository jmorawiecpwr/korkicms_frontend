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
            {/* Dodajemy tytuł sekcji, jeśli go brakuje, dla spójności */}
            <h4 className="summary-title">Podsumowanie Płatności</h4>
            <p><strong className="summary-label">Zarobek w tym miesiącu:</strong> <span className="summary-value">{monthlyEarnings.toFixed(2)} zł</span></p>
            <p><strong className="summary-label">Zaległość ucznia:</strong> <span className="summary-value">{debt.toFixed(2)} zł</span></p>
        </div>
    );
};