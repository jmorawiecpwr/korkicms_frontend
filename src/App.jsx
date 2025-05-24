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
    const [isNightMode, setIsNightMode] = useState(false);

    const [token, setToken] = useState(localStorage.getItem("access_token") || null);
    const [authMode, setAuthMode] = useState("login");
    const [authData, setAuthData] = useState({ username: "", password: "" });

    const authHeaders = token
        ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        : { "Content-Type": "application/json" };

    useEffect(() => {
<<<<<<< HEAD
        fetchStudents();
        const savedMode = localStorage.getItem('nightMode');
        if (savedMode) {
            setIsNightMode(JSON.parse(savedMode));
        }
    }, []);
=======
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

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Błąd autoryzacji");

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
>>>>>>> b5dece2cc69a1ab24128f71f0a7ff5f36786367b

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
                headers: authHeaders,
            });
            if (!res.ok) throw new Error("Błąd podczas usuwania ucznia!");
<<<<<<< HEAD
            setStudents((prev) => prev.filter((student) => student.id !== id));
=======
            await refreshData();
>>>>>>> b5dece2cc69a1ab24128f71f0a7ff5f36786367b
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
<<<<<<< HEAD
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
=======
            const url = editingStudent ? `${API_URL}${editingStudent.id}/` : API_URL;
            const method = editingStudent ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: authHeaders,
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Błąd zapisu ucznia");
            await refreshData();
            resetForm();
>>>>>>> b5dece2cc69a1ab24128f71f0a7ff5f36786367b
        } catch (error) {
            console.error(error.message);
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
        setEditingStudent(null);
        setIsFormOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

<<<<<<< HEAD
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
=======
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
>>>>>>> b5dece2cc69a1ab24128f71f0a7ff5f36786367b

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
            <div className="auth-wrapper" style={{ colorScheme: "light" }}>
                <div className="auth-card no-bg">
                    <h2>{authMode === "login" ? "Logowanie" : "Rejestracja"}</h2>
                    <form onSubmit={handleAuth}>
                        <input type="text" name="username" placeholder="Login" value={authData.username} onChange={handleAuthChange} required />
                        <input type="password" name="password" placeholder="Hasło" value={authData.password} onChange={handleAuthChange} required />
                        <button type="submit">{authMode === "login" ? "Zaloguj się" : "Zarejestruj się"}</button>
                    </form>
                    <p>
                        {authMode === "login" ? "Nie masz konta?" : "Masz już konto?"}{" "}
                        <button className="switch-auth" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
                            {authMode === "login" ? "Zarejestruj się" : "Zaloguj się"}
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <h2><b>Recap</b> Twoich korepetycji</h2>
            <DashboardSummary students={students} lessons={lessons} />
            <h2>Lista uczniów</h2>
<<<<<<< HEAD
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
=======
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
                if (!student) return null;                
                return (
                    <>
                        <Details student={student} onClose={() => setSelectedStudentID(null)} />
                        <LessonPanel
                            studentId={student.id}
                            lessons={lessons.filter(l => l.student === student.id)}
                            onLessonSettled={handleLessonSettled}
                            onLessonUpdate={updateSingleLesson}
                        />
                        <StudentSummary student={student} lessons={lessons.filter(l => l.student === student.id)} />
                    </>
                );
            })()}
            <EarningsChart students={students} lessons={lessons} />
            <footer className="app-footer">
                <button onClick={handleLogout} className="logout-footer-btn">Wyloguj się</button>
            </footer>
        </>
>>>>>>> b5dece2cc69a1ab24128f71f0a7ff5f36786367b
    );
}

export default App;