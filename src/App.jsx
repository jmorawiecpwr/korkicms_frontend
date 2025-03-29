import React, { useState, useEffect } from "react";
import Tile from "./Components/Tile.jsx";
import Accordion from "./Components/Accordion.jsx";
import StudentForm from "./Components/StudentForm.jsx";
import Details from "./Components/Details.jsx";
import LessonPanel from "./Components/LessonPanel.jsx";
import "./App.css";
import StudentSummary from "./Components/StudentSummary.jsx";
import DashboardSummary from "./Components/DashboardSummary.jsx";
import EarningsChart from "./Components/EarningChart.jsx";

function App() {
    const API_URL = "http://127.0.0.1:8000/api/students/";
    const LESSONS_API = "http://127.0.0.1:8000/api/lessons/";
    const [lessons, setLessons] = useState([]);
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

    useEffect(() => {
        fetchStudents();
        fetchLessons();
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

    const fetchLessons = async () => {
        try {
            const res = await fetch(LESSONS_API);
            if (!res.ok) throw new Error("Błąd podczas ładowania lekcji!");
            const data = await res.json();
            setLessons(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleEdit = (student) => {
        setIsFormOpen(!isFormOpen);
        setFormData(student);
        setEditingStudent(student);
        setSelectedStudentID(null)
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
            if (!res.ok) throw new Error("Błąd podczas usuwania ucznia!");

            await refreshData();
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
            await refreshData();
    
            setEditingStudent(null);
            setFormData({
                name: "",
                classtype: "",
                discord: "",
                classday: "",
                parent: "",
                hourly_rate: "",
                profile: "",
                additional_info: "",
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

    const handleLessonSettled = async (lessonId) => {
        try {
            await fetch(`${LESSONS_API}${lessonId}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_settled: true })
            });
            await refreshData();
        } catch (error) {
            console.error("Błąd aktualizacji lekcji:", error);
        }
    };

    const refreshData = async () =>  {
        try {
            const [studentsRes, lessonsRes] = await Promise.all([
                fetch(API_URL),
                fetch(LESSONS_API)
            ])
            if (!studentsRes.ok || !lessonsRes.ok) { throw new Error("Błąd przy pobieraniu danych studentów lub uczniów") }
            const studentsData = await studentsRes.json();
            const lessonsData = await lessonsRes.json();

            setStudents(studentsData);
            setLessons(lessonsData)
        } catch (err) { console.error(err) }
    };

    const updateSingleLesson = (lessonId, updatedData) => {
        if (updatedData === null) {
            setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
        } else {
            const exists = lessons.some(l => l.id === lessonId);
            setLessons(prev =>
                exists
                    ? prev.map(lesson => lesson.id === lessonId ? { ...lesson, ...updatedData } : lesson)
                    : [...prev, updatedData]
            );
        }
    };
    
    

    return (
        <React.Fragment>
            <h2><b>Recap</b> Twoich korepetycji</h2>
            <DashboardSummary students={students} lessons={lessons} />
            <h2>Lista uczniów</h2>
            {students.length === 0 ? <p>Brak uczniów</p> : (
                students.map((student) => (
                    (() => {
                        const studentLessons = lessons
                          .filter(l => l.student === student.id)
                          .sort((a, b) => new Date(b.date) - new Date(a.date));
                      
                        const latestLesson = studentLessons[0];
                      
                        return (
                          <Accordion
                            key={student.id}
                            name={student.name}
                            homework={
                              latestLesson?.homework?.trim()
                                ? latestLesson.homework
                                : "Brak pracy domowej"
                            }
                            topic={
                              latestLesson?.topic?.trim()
                                ? latestLesson.topic
                                : "Nie uzupełniono tematów"
                            }
                          >
                            <button className="btn edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(student); }}>Edytuj</button>
                            <button className="btn delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(student.id); }}>Usuń</button>
                            <button className="btn details-btn" onClick={(e) => { e.stopPropagation(); handleDetails(student); }}>Szczegóły</button>
                          </Accordion>
                        );
                      })()                      
                ))
            )}
            <button className="add-student-btn" onClick={() => {
                setSelectedStudentID(null)
                setIsFormOpen(!isFormOpen)
                setEditingStudent(null);
                setFormData({
                    name: "",
                    classtype: "",
                    discord: "",
                    classday: "",
                    parent: "",
                    hourly_rate: "",
                    profile: "",
                    additional_info: "",
                });
            }}>Dodaj nowego ucznia</button>
            {isFormOpen && (
                <StudentForm
                    isEdit={!!editingStudent}
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    formData={formData}
                />
            )}
           {selectedStudentID && (() => {
                 const student = students.find((s) => s.id === selectedStudentID);
                 return (
                    <React.Fragment>
                        <Details
                            student={student}
                            onClose={() => setSelectedStudentID(null)}
                        />
                        <LessonPanel 
                            studentId={student.id} 
                            lessons={lessons.filter(l => l.student === student.id)}
                            onLessonSettled={handleLessonSettled}
                            onLessonUpdate={updateSingleLesson}
                        />
                    <StudentSummary student={student} lessons={lessons.filter(l => l.student === student.id)} />
                    </React.Fragment>
                    );
})()}
             <EarningsChart students={students} lessons={lessons} />
        </React.Fragment>
    );
}

export default App;