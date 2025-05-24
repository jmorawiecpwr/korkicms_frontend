import React from 'react';
import './Details.css'

export default function Details({student, onClose}) {
    return (
        <React.Fragment>
        <div className="student-details-content">
            <h1>{student.name}</h1>
            <p><strong>Klasa:</strong> {student.classtype}</p>
            <p><strong>Discord:</strong> {student.discord}</p>
            <p><strong>Dzień zajęć:</strong> {student.classday}</p>
            <p><strong>Rodzic:</strong> {student.parent}</p>
            <p><strong>Stawka godzinowa:</strong> {parseFloat(student.hourly_rate).toFixed(2)} zł</p>
            <p><strong>Profil:</strong> {student.profile}</p>
            <p><strong>Dodatkowe informacje:</strong> {student.additional_info}</p>
            <button onClick={onClose} className="details-close-btn">Zamknij</button>
        </div>
        </React.Fragment>
    )
}