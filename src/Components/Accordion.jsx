import React, { useState } from "react";
import { PlusCircle, Info, Edit, Trash2 } from "lucide-react";
import "./Accordion.css";

const Accordion = ({ 
    name, 
    homework, 
    topic, 
    onDetailsClick, 
    onLessonsClick, 
    onEditClick, 
    onDeleteClick 
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="accordion">
            <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <span className="accordion-title">{name}</span>
                <div className="accordion-buttons">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDetailsClick(); }}
                        className="button-icon"
                        aria-label="Szczegóły ucznia"
                        title="Szczegóły ucznia"
                    >
                        <Info size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onLessonsClick(); }}
                        className="button-icon"
                        aria-label="Lekcje"
                        title="Lekcje"
                    >
                        <PlusCircle size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEditClick(); }}
                        className="button-icon button-edit"
                        aria-label="Edytuj ucznia"
                        title="Edytuj dane ucznia"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDeleteClick(); }}
                        className="button-icon button-delete"
                        aria-label="Usuń ucznia"
                        title="Usuń ucznia"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="accordion-content">
                    <p><strong>Ostatni temat:</strong> {topic}</p>
                    <p><strong>Zadana praca domowa:</strong> {homework}</p>
                </div>
            )}
        </div>
    );
};

export default Accordion;