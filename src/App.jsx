import React, { useState, useEffect } from "react";
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

    const [formErrors, setFormErrors] = useState({}); 

    const authHeaders = token
        ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        : { "Content-Type": "application/json" };

    useEffect(() => {
        const savedMode = localStorage.getItem('nightMode');
        if (savedMode) {
            setIsNightMode(JSON.parse(savedMode));
        }
        if (token) {
            fetchStudents();
            fetchLessons();
        }
    }, [token]);

    useEffect(() => {
        if (isNightMode) {
            document.body.classList.add('night-mode');
        } else {
            document.body.classList.remove('night-mode');
        }
    }, [isNightMode]);

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
            } else if (authMode === "register" && res.ok) { 
                setAuthMode("login"); 
            }
        } catch (err) {
            console.error("Auth error:", err.message);
            // tu wstawić błąd dla użytkownika do wyświetlenia
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
            if (!res.ok) throw new Error("Błąd podczas ładowania danych uczniów!");
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

    const refreshData = async () => {
        await Promise.all([fetchStudents(), fetchLessons()]);
    };

    const handleEdit = (student) => {
        setIsFormOpen(true);
        setFormData(student);
        setEditingStudent(student);
        setSelectedStudentID(null); 
        setFormErrors({}); 
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_URL}${id}/`, {
                method: "DELETE",
                headers: authHeaders,
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

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = "Imię i nazwisko jest wymagane.";
        if (!formData.classtype.trim()) errors.classtype = "Klasa jest wymagana.";
        if (!formData.hourly_rate || formData.hourly_rate.toString().trim() === "") errors.hourly_rate = "Stawka godzinowa jest wymagana.";
        // dodam resztę jak mi się będzie chciało i jak nie zapomnę
        if (!formData.discord.trim()) errors.discord = "Discord Tag jest wymagany.";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return; 
        }
        setFormErrors({}); 
        try {
            const url = editingStudent ? `${API_URL}${editingStudent.id}/` : API_URL;
            const method = editingStudent ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: authHeaders,
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                 const errorData = await res.json(); 
                 throw new Error(errorData.detail || `Błąd zapisu ucznia: ${res.statusText}`);
            }
            await refreshData();
            resetFormAndCloseModal();
        } catch (error) {
            console.error(error.message);
            setFormErrors({ api: error.message || "Wystąpił błąd serwera." });
        }
    };
    
    const resetFormFields = () => {
        setFormData({
            name: "", classtype: "", discord: "", classday: "", parent: "",
            hourly_rate: "", profile: "", additional_info: "",
        });
        setEditingStudent(null);
        setFormErrors({});
    };

    const resetFormAndCloseModal = () => {
        resetFormFields();
        setIsFormOpen(false);
    };
    
    const openNewStudentForm = () => {
        resetFormFields();
        setSelectedStudentID(null);
        setIsFormOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prevErrors => {
                const newErrors = {...prevErrors};
                delete newErrors[name];
                return newErrors;
            });
        }
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
        resetFormFields();
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
            <div className={`auth-wrapper ${isNightMode ? 'night-mode' : ''}`} style={{ colorScheme: isNightMode ? "dark" : "light" }}>
                 <div className="night-mode-toggle-container" style={{ position: 'absolute', top: '20px', right: '20px'}}>
                    <button onClick={toggleNightMode} className="night-mode-toggle">
                        <span className="icon">{isNightMode ? '☀️' : '🌙'}</span>
                        {isNightMode ? 'Tryb Dzienny' : 'Tryb Nocny'}
                    </button>
                </div>
                <div className="auth-card">
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
        <div className={`app-container ${isNightMode ? 'night-mode' : ''}`}>
            <div className="night-mode-toggle-container">
                <button onClick={toggleNightMode} className="night-mode-toggle">
                    <span className="icon">{isNightMode ? '☀️' : '🌙'}</span>
                    {isNightMode ? 'Tryb Dzienny' : 'Tryb Nocny'}
                </button>
            </div>

            <section className="recap-section">
                <h2><b>Recap</b> Twoich korepetycji</h2>
                <DashboardSummary students={students} lessons={lessons} />
            </section>

            <section className="students-list-section">
                <h2>Lista uczniów</h2>
                {students.length === 0 ? <p>Brak uczniów do wyświetlenia.</p> : (
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
                                <div className="accordion-actions">
                                    <button className="btn edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(student); }}>Edytuj</button>
                                    <button className="btn delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(student.id); }}>Usuń</button>
                                    <button className="btn details-btn" onClick={(e) => { e.stopPropagation(); handleDetails(student); }}>Szczegóły</button>
                                </div>
                            </Accordion>
                        );
                    })
                )}
                <button className="add-student-btn" onClick={openNewStudentForm}>
                    Dodaj nowego ucznia
                </button>
            </section>

            {isFormOpen && (
                <div className="form-overlay" onClick={handleCloseForm}>
                    <div className="student-form-modal" onClick={(e) => e.stopPropagation()}>
                        {Object.keys(formErrors).length > 0 && !formErrors.api && (
                            <div className="form-error-summary">
                                Nie wszystkie wymagane pola zostały uzupełnione. Sprawdź podświetlone pola.
                            </div>
                        )}
                        {formErrors.api && (
                             <div className="form-error-summary api-error">
                                Błąd serwera: {formErrors.api}
                            </div>
                        )}
                        <StudentForm
                            isEdit={!!editingStudent}
                            handleSubmit={handleSubmit}
                            handleChange={handleChange}
                            formData={formData}
                            formErrors={formErrors} 
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
                            <LessonPanel
                                studentId={student.id}
                                lessons={lessons.filter(l => l.student === student.id)}
                                onLessonSettled={handleLessonSettled}
                                onLessonUpdate={updateSingleLesson} 
                                authHeaders={authHeaders}
                                LESSONS_API={LESSONS_API}
                                refreshData={refreshData}
                            />
                            <StudentSummary student={student} lessons={lessons.filter(l => l.student === student.id)} />
                        </div>
                    </div>
                );
            })()}
            
            <section className="chart-section">
                <EarningsChart students={students} lessons={lessons} />
            </section>
            
            <footer className="app-footer">
                <button onClick={handleLogout} className="logout-footer-btn">Wyloguj się</button>
            </footer>
        </div>
    );
}

export default App;