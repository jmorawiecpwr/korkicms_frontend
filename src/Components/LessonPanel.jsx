import React, {useState, useEffect} from "react";
import {Trash2} from 'lucide-react'
import './LessonPanel.css'

export default function LessonPanel({ studentId }) {
    const [lessons, setLessons] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [newLesson, setNewLesson] = React.useState({
        date: '',
        topic: '',
        homework: '',
    })

    const API_KEY = 'http://127.0.0.1:8000/api/lessons/';

    React.useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const res = await fetch(API_KEY);
            const data = await res.json();
            const filtered = data.filter(lesson => lesson.student === studentId)
            setLessons(filtered);
        } catch(err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    };

    const handleDelete = async (id) => {
        await fetch(`${API_KEY}${id}/`, { method: "DELETE" });
        setLessons(prev => prev.filter(lesson => lesson.id !== id))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLesson(prev => ({...prev, [name]: value}))
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        const lessonToSend = {
            ...newLesson,
            student: studentId,
            is_settled: false,
            homework_done: false,
            homework_sent: false,
        };

        const res = await fetch(API_KEY, {
            method: 'POST',
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(lessonToSend)
        });
        if (res.ok) {
            const newL = await res.json();
            setLessons(prev => [...prev, newL]);
            setNewLesson({date: "", topic: "", homework: ""});
        }
    };

    if (loading) return <p>Ładowanie lekcji...</p>;

    return (
<div className="lesson-panel">
    <h3>Lekcje ucznia</h3>

    {lessons.length === 0 ? (
    <p className="no-lessons-message">Brak lekcji.</p>
) : (
    lessons.map(lesson => (
        <div key={lesson.id} className="lesson-card">
            <button onClick={() => handleDelete(lesson.id)} className="trash-btn-left" title="Usuń lekcję">
                <Trash2 size={16} />
            </button>
            <div className="lesson-actions">
                <button className="status-btn">Odrobiona</button>
                <button className="status-btn">Odesłana</button>
                <button className="status-btn">Opłacona</button>
            </div>
            <div className="lesson-content">
                <b className="lesson-date">{lesson.date}</b>
                <div className="lesson-topic">Temat: {lesson.topic || "Brak"}</div>
                <p className="lesson-homework">Praca domowa: {lesson.homework || "Brak"}</p>
            </div>
        </div>
    ))
)}

    <form onSubmit={handleAddLesson} className="lesson-form">
        <h4>Dodaj nową lekcję</h4>
        <input
            type="date"
            name="date"
            value={newLesson.date}
            onChange={handleChange}
            required
        />
        <input
            type="text"
            name="topic"
            placeholder="Temat"
            value={newLesson.topic}
            onChange={handleChange}
            required
        />
        <input
            type="text"
            name="homework"
            placeholder="Praca domowa"
            value={newLesson.homework}
            onChange={handleChange}
        />
        <button type="submit">Dodaj</button>
    </form>
</div>
    );
};