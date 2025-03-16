import React from "react";
import "./StudentForm.css";

export default function StudentForm({ isEdit, handleSubmit, handleChange, formData }) {
    return (
        <div className="student-form">
            <h1>{isEdit ? "Edytuj ucznia" : "Dodaj nowego ucznia"}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <label>
                        Imię i nazwisko
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </label>
                    <label>
                        Klasa
                        <input type="text" name="classtype" value={formData.classtype} onChange={handleChange} required />
                    </label>
                    <label>
                        Kontakt do rodzica
                        <input type="text" name="parent" value={formData.parent} onChange={handleChange} />
                    </label>
                    <label>
                        Stawka godzinowa
                        <input type="number" name="hourly_rate" value={formData.hourly_rate} onChange={handleChange} />
                    </label>
                    <label>
                        Discord Tag
                        <input type="text" name="discord" value={formData.discord} onChange={handleChange} />
                    </label>
                    <label>
                        Profil
                        <input type="text" name="profile" value={formData.profile} onChange={handleChange} />
                    </label>
                    <label>
                        Termin zajęć
                        <input type="text" name="classday" value={formData.classday} onChange={handleChange} />
                    </label>
                    <label>
                        Dodatkowe informacje / preferencje
                        <input type="text" name="additional_info" value={formData.additional_info} onChange={handleChange} />
                    </label>
                </div>
                <button type="submit">{isEdit ? "Zapisz zmiany" : "Dodaj ucznia"}</button>
            </form>
        </div>
    );
}