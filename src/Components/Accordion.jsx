import React, { useState } from "react";
import "./Accordion.css";

const Accordion = ({ name, homework, topic, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="accordion">
            <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <span className="accordion-title">{name}</span>
                <div className="accordion-buttons">
                    {children}
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