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
        setIsFormOpen(!isFormOpen);
        setFormData(student);
        setEditingStudent(student);
        setSelectedStudentID(null)
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
            if(editingStudent) {
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

            if(!response.ok) throw new Error(response.statusText);
            const updatedStudent = await response.json();

            if(editingStudent) {
                setStudents((prev) =>
                    prev.map((s) => (s.id === editingStudent.id ? { ...s, ...updatedStudent } : s))
                );
                setEditingStudent(null);
            } else {
                setStudents((prev) => [...prev, updatedStudent]);
            }

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

    return (
        <React.Fragment>
            <h2><b>Recap</b> Twoich korepetycji</h2>
            <DashboardSummary students={students} />
            <h2>Lista uczniów</h2>
            {students.length === 0 ? <p>Brak uczniów</p> : (
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
                        <button className="btn edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(student); }}>Edytuj</button>
                        <button className="btn delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(student.id); }}>Usuń</button>
                        <button className="btn details-btn" onClick={(e) => { e.stopPropagation(); handleDetails(student); }}>Szczegóły</button>
                    </Accordion>
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
                        <LessonPanel studentId={student.id} />
                        <StudentSummary student={student} />
                    </React.Fragment>
                    );
})()}
            <EarningsChart students={students} />
        </React.Fragment>
    );
}

export default App;