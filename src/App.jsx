import React, { useState, useEffect } from "react";
import "./App.css";
import Tile from "./Components/Tile.jsx";
import Accordion from "./Components/Accordion.jsx";
import StudentForm from "./Components/StudentForm.jsx";
import Details from "./Components/Details.jsx";
import LessonPanel from "./Components/LessonPanel.jsx";

function App() {
    const API_URL = "http://127.0.0.1:8000/api/students/";
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        classtype: "",
        discord: "",
        classday: "",
        parent: "",
        hourly_rate: "",
        profile: "",
        additional_info: "",
    });
    const [editingStudent, setEditingStudent] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedStudentID, setSelectedStudentID] = useState(null);
    const [isNightMode, setIsNightMode] = useState(false);

    useEffect(() => {
        fetchStudents();
        const savedMode = localStorage.getItem('nightMode');
        if (savedMode) {
            setIsNightMode(JSON.parse(savedMode));
        }
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Błąd podczas ładowania danych!");
            const data = await res.json();
            setStudents(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleEdit = (student) => {
        setIsFormOpen(true);
        setFormData(student);
        setEditingStudent(student);
        setSelectedStudentID(null);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
            if (!res.ok) throw new Error("Błąd podczas usuwania ucznia!");
            setStudents((prev) => prev.filter((student) => student.id !== id));
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleDetails = (student) => {
        setIsFormOpen(false);
        setSelectedStudentID(selectedStudentID === student.id ? null : student.id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editingStudent) {
                response = await fetch(`${API_URL}${editingStudent.id}/`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
            } else {
                response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
            }

            if (!response.ok) throw new Error(response.statusText);
            const updatedStudent = await response.json();

            if (editingStudent) {
                setStudents((prev) =>
                    prev.map((s) => (s.id === editingStudent.id ? { ...s, ...updatedStudent } : s))
                );
                setEditingStudent(null);
            } else {
                setStudents((prev) => [...prev, updatedStudent]);
            }

            setFormData({
                name: "", classtype: "", discord: "", classday: "", parent: "",
                hourly_rate: "", profile: "", additional_info: "",
            });
            setIsFormOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleNightMode = () => {
        setIsNightMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('nightMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingStudent(null);
        setFormData({
            name: "", classtype: "", discord: "", classday: "", parent: "",
            hourly_rate: "", profile: "", additional_info: "",
        });
    };

    return (
        <div className={`app-container ${isNightMode ? 'night-mode' : ''}`}>
            <div className="night-mode-toggle-container">
                <button onClick={toggleNightMode} className="night-mode-toggle">
                    <span className="icon">{isNightMode ? '☀️' : '🌙'}</span>
                    {isNightMode ? 'Tryb Dzienny' : 'Tryb Nocny'}
                </button>
            </div>

            <h2><b>Recap</b> Twoich korepetycji</h2>
            <div className="tile-container">
                <Tile title='Twój zarobek za ten miesiąc' value='2300 zł' />
                <Tile title='Ilość prac domowych do sprawdzenia' value='2' />
                <Tile title='Ilość odwołanych zajęć' value='1' />
                <Tile title='Nierozliczonych zajęć' value='7' />
                <Tile title='Projekcja liczby godzin' value='34' />
                <Tile title='Do następnych zajęć pozostało' value='12:03:11' />
            </div>

            <h2>Lista uczniów</h2>
            {students.length === 0 ? <p>Brak uczniów do wyświetlenia.</p> : (
                students.map((student) => (
                    <Accordion
                        key={student.id}
                        name={student.name}
                        homework={
                            student.homeworks && student.homeworks.length > 0
                                ? student.homeworks[student.homeworks.length - 1].description
                                : "Brak pracy domowej"
                        }
                        topic={
                            student.topics && student.topics.length > 0
                                ? student.topics[student.topics.length - 1].description
                                : "Nie uzupełniono tematów"
                        }
                    >
                        <div className="accordion-actions">
                            <button className="btn edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(student); }}>Edytuj</button>
                            <button className="btn delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(student.id); }}>Usuń</button>
                            <button className="btn details-btn" onClick={(e) => { e.stopPropagation(); handleDetails(student); }}>Szczegóły</button>
                        </div>
                    </Accordion>
                ))
            )}
            <button className="add-student-btn" onClick={() => {
                setSelectedStudentID(null);
                setIsFormOpen(true);
                setEditingStudent(null);
                setFormData({
                    name: "", classtype: "", discord: "", classday: "", parent: "",
                    hourly_rate: "", profile: "", additional_info: "",
                });
            }}>Dodaj nowego ucznia</button>

            {isFormOpen && (
                <div className="form-overlay" onClick={handleCloseForm}>
                    <div className="student-form-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-form-btn" onClick={handleCloseForm}>×</button>
                        <StudentForm
                            isEdit={!!editingStudent}
                            handleSubmit={handleSubmit}
                            handleChange={handleChange}
                            formData={formData}
                        />
                    </div>
                </div>
            )}

            {selectedStudentID && (() => {
                const student = students.find((s) => s.id === selectedStudentID);
                if (!student) return null;
                return (
                    <div className="details-overlay" onClick={() => setSelectedStudentID(null)}>
                        <div className="details-modal" onClick={(e) => e.stopPropagation()}>
                             <Details
                                student={student}
                                onClose={() => setSelectedStudentID(null)}
                            />
                            <LessonPanel studentId={student.id} />
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}

export default App;