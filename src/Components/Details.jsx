import React from 'react';
import './Details.css'

export default function Details({student, onClose}) {

    const [rolled, setRolled] = React.useState(false);

    return (
        <React.Fragment>
        <div className="details-modal">
            <h1>{student.name}</h1>
            <p>Klasa: {student.classtype}</p>
            <p>Discord: {student.discord}</p>
            <p>Dzień zajęć: {student.classday}</p>
            <p>Rodzic: {student.parent}</p>
            <p>Stawka godzinowa: {student.hourly_rate}</p>
            <p>Profil: {student.profile}</p>
            <p>Dodatkowe informacje: {student.additional_info}</p>
            <button onClick={onClose}>Zamknij</button>
        </div>
        </React.Fragment>
    )
}