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
    const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
    const API_URL = `${API_BASE}/api/students/`;
    const LESSONS_API = `${API_BASE}/api/lessons/`;
    const TOKEN_URL = `${API_BASE}/api/token/`;
    const REGISTER_URL = `${API_BASE}/api/register/`;

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

    const [token, setToken] = useState(localStorage.getItem("access_token") || null);
    const [authMode, setAuthMode] = useState("login");
    const [authData, setAuthData] = useState({ username: "", password: "" });

    const authHeaders = token
        ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        : { "Content-Type": "application/json" };

    useEffect(() => {
        if (token) {
            fetchStudents();
            fetchLessons();
        }
    }, [token]);

    const handleAuthChange = (e) => {
        setAuthData({ ...authData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        const url = authMode === "register" ? REGISTER_URL : TOKEN_URL;
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(authData),
            });
            if (!res.ok) throw new Error("Błąd autoryzacji");
            const data = await res.json();
            if (data.access) {
                localStorage.setItem("access_token", data.access);
                setToken(data.access);
            } else {
                setAuthMode("login");
            }
        } catch (err) {
            console.error("Auth error:", err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setToken(null);
        setStudents([]);
        setLessons([]);
    };

    const fetchStudents = async () => {
        try {
            const res = await fetch(API_URL, { headers: authHeaders });
            if (!res.ok) throw new Error("Błąd podczas ładowania danych!");
            const data = await res.json();
            setStudents(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchLessons = async () => {
        try {
            const res = await fetch(LESSONS_API, { headers: authHeaders });
            if (!res.ok) throw new Error("Błąd podczas ładowania lekcji!");
            const data = await res.json();
            setLessons(data);
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
            const res = await fetch(`${API_URL}${id}/`, {
                method: "DELETE",
                headers: authHeaders
            });
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
                    headers: authHeaders,
                    body: JSON.stringify(formData),
                });
            } else {
                response = await fetch(API_URL, {
                    method: "POST",
                    headers: authHeaders,
                    body: JSON.stringify(formData),
                });
            }

            if (!response.ok) throw new Error(response.statusText);
            await refreshData();
            setEditingStudent(null);
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
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
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLessonSettled = async (lessonId) => {
        try {
            await fetch(`${LESSONS_API}${lessonId}/`, {
                method: "PATCH",
                headers: authHeaders,
                body: JSON.stringify({ is_settled: true })
            });
            await refreshData();
        } catch (error) {
            console.error("Błąd aktualizacji lekcji:", error);
        }
    };

    const refreshData = async () => {
        await Promise.all([fetchStudents(), fetchLessons()]);
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

    if (!token) {
        return (
            <div className="auth-wrapper">
                <div className="auth-card no-bg">
                    <h2>{authMode === "login" ? "Logowanie" : "Rejestracja"}</h2>
                    <form onSubmit={handleAuth}>
                        <input type="text" name="username" placeholder="Login" value={authData.username} onChange={handleAuthChange} required />
                        <input type="password" name="password" placeholder="Hasło" value={authData.password} onChange={handleAuthChange} required />
                        <button type="submit">{authMode === "login" ? "Zaloguj się" : "Zarejestruj się"}</button>
                    </form>
                    <p>
                        {authMode === "login" ? "Nie masz konta?" : "Masz już konto?"} {" "}
                        <button className="switch-auth" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
                            {authMode === "login" ? "Zarejestruj się" : "Zaloguj się"}
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <React.Fragment>
            <h2><b>Recap</b> Twoich korepetycji</h2>
            <DashboardSummary students={students} lessons={lessons} />
            <h2>Lista uczniów</h2>
            {students.length === 0 ? <p>Brak uczniów</p> : (
                students.map((student) => {
                    const studentLessons = lessons
                        .filter(l => l.student === student.id)
                        .sort((a, b) => new Date(b.date) - new Date(a.date));

                    const latestLesson = studentLessons[0];

                    return (
                        <Accordion
                            key={student.id}
                            name={student.name}
                            homework={latestLesson?.homework?.trim() || "Brak pracy domowej"}
                            topic={latestLesson?.topic?.trim() || "Nie uzupełniono tematów"}
                        >
                            <button className="btn edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(student); }}>Edytuj</button>
                            <button className="btn delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(student.id); }}>Usuń</button>
                            <button className="btn details-btn" onClick={(e) => { e.stopPropagation(); handleDetails(student); }}>Szczegóły</button>
                        </Accordion>
                    );
                })
            )}
            <button className="add-student-btn" onClick={() => {
                setSelectedStudentID(null);
                setIsFormOpen(true);
                setEditingStudent(null);
                resetForm();
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
                        <Details student={student} onClose={() => setSelectedStudentID(null)} />
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

            <footer className="app-footer">
                <button onClick={handleLogout} className="logout-footer-btn">Wyloguj się</button>
            </footer>
        </React.Fragment>
    );
}

export default App;