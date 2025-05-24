import React from "react";
import "./StudentForm.css";

export default function StudentForm({ isEdit, handleSubmit, handleChange, formData, formErrors = {} }) {
    return (
        <div className="student-form">
            <h1>{isEdit ? "Edytuj ucznia" : "Dodaj nowego ucznia"}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <label>
                        Imię i nazwisko
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className={formErrors.name ? 'input-error' : ''} 
                        />
                        {formErrors.name && <span className="field-error-message">{formErrors.name}</span>}
                    </label>
                    <label>
                        Klasa
                        <input 
                            type="text" 
                            name="classtype" 
                            value={formData.classtype} 
                            onChange={handleChange}
                            className={formErrors.classtype ? 'input-error' : ''}
                        />
                        {formErrors.classtype && <span className="field-error-message">{formErrors.classtype}</span>}
                    </label>
                    <label>
                        Kontakt do rodzica
                        <input 
                            type="text" 
                            name="parent" 
                            value={formData.parent} 
                            onChange={handleChange}
                            className={formErrors.parent ? 'input-error' : ''}
                        />
                        {formErrors.parent && <span className="field-error-message">{formErrors.parent}</span>}
                    </label>
                    <label>
                        Stawka godzinowa
                        <input 
                            type="number" 
                            name="hourly_rate" 
                            value={formData.hourly_rate} 
                            onChange={handleChange}
                            className={formErrors.hourly_rate ? 'input-error' : ''}
                        />
                        {formErrors.hourly_rate && <span className="field-error-message">{formErrors.hourly_rate}</span>}
                    </label>
                    <label>
                        Discord Tag
                        <input 
                            type="text" 
                            name="discord" 
                            value={formData.discord} 
                            onChange={handleChange}
                            className={formErrors.discord ? 'input-error' : ''}
                        />
                        {formErrors.discord && <span className="field-error-message">{formErrors.discord}</span>}
                    </label>
                    <label>
                        Profil
                        <input 
                            type="text" 
                            name="profile" 
                            value={formData.profile} 
                            onChange={handleChange}
                            className={formErrors.profile ? 'input-error' : ''}
                        />
                        {formErrors.profile && <span className="field-error-message">{formErrors.profile}</span>}
                    </label>
                    <label>
                        Termin zajęć
                        <input 
                            type="text" 
                            name="classday" 
                            value={formData.classday} 
                            onChange={handleChange}
                            className={formErrors.classday ? 'input-error' : ''}
                        />
                        {formErrors.classday && <span className="field-error-message">{formErrors.classday}</span>}
                    </label>
                    <label>
                        Dodatkowe informacje / preferencje
                        <input 
                            type="text" 
                            name="additional_info" 
                            value={formData.additional_info} 
                            onChange={handleChange}
                            className={formErrors.additional_info ? 'input-error' : ''}
                        />
                        {formErrors.additional_info && <span className="field-error-message">{formErrors.additional_info}</span>}
                    </label>
                </div>
                <button type="submit">{isEdit ? "Zapisz zmiany" : "Dodaj ucznia"}</button>
            </form>
        </div>
    );
}