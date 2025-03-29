import React, { useState, useEffect } from "react";
import { Trash2 } from 'lucide-react';
import './LessonPanel.css';

export default function LessonPanel({ studentId, lessons, onLessonSettled, onLessonUpdate }) {

    const [newLesson, setNewLesson] = useState({
        date: '',
        topic: '',
        homework: '',
    });

    const API_KEY = 'http://127.0.0.1:8000/api/lessons/';

    const handleDelete = async (id) => {
        const res = await fetch(`${API_KEY}${id}/`, { method: "DELETE" });
        if (res.ok) {
            onLessonUpdate(id, null);
        }        
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLesson(prev => ({ ...prev, [name]: value }));
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lessonToSend),
        });
        if (res.ok) {
            const newLesson = await res.json();
            onLessonUpdate(newLesson.id, newLesson);
            setNewLesson({ date: "", topic: "", homework: "" });
        }        
    };

    const toggleLessonField = async (lessonId, fieldName, currentValue) => {
        try {
            const res = await fetch(`${API_KEY}${lessonId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [fieldName]: !currentValue }),
            });
    
   
            if (res.ok) {
                onLessonUpdate(lessonId, { [fieldName]: !currentValue });
                onLessonSettled?.();
            }
             else {
                console.error("Błąd przy aktualizacji pola:", fieldName);
            }
        } catch (err) {
            console.error("Błąd połączenia:", err);
        }
    };    

    return (
        <div className="lesson-panel">
            <h3>Lekcje ucznia</h3>

            {lessons.length === 0 ? (
                <p className="no-lessons-message">Brak lekcji.</p>
            ) : (
                lessons.map(lesson => (
                    <div key={lesson.id} className="lesson-card">
                        <button onClick={() => handleDelete(lesson.id)} className="trash-btn-left" title="Usuń lekcję">
                            <Trash2 />
                        </button>

                        <span className="lesson-date-topic">
                            {lesson.date} – {lesson.topic || "Brak tematu"}
                        </span>

                        <span className="lesson-homework-text">
                            Praca domowa: {lesson.homework || "Brak"}
                        </span>
                        <div className="lesson-actions">
                            <button
                                className={`lesson-btn ${lesson.is_settled ? "active" : ""}`}
                                onClick={() => toggleLessonField(lesson.id, "is_settled", lesson.is_settled)}
                                type="button"
                            >
                                {lesson.is_settled ? "Zajęcia rozliczone" : "Zajęcia nie rozliczone"}
                            </button>

                            <button
                                className={`lesson-btn ${lesson.homework_done ? "active" : ""}`}
                                onClick={() => toggleLessonField(lesson.id, "homework_done", lesson.homework_done)}
                                type="button"
                            >
                                {lesson.homework_done ? "Praca domowa odrobiona" : "Praca domowa nie odrobiona"}
                            </button>

                            <button
                                className={`lesson-btn ${lesson.homework_sent ? "active" : ""}`}
                                onClick={() => toggleLessonField(lesson.id, "homework_sent", lesson.homework_sent)}
                                type="button"
                            >
                                {lesson.homework_sent ? "Praca domowa odesłana" : "Praca domowa nie odesłana"}
                            </button>
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
                <button type="submit" className="add-lesson-btn">Dodaj</button>
            </form>
        </div>
    );
}