import React, { useEffect, useState } from 'react';
import './Tile.css';

export default function Tile({ title, value, isLast }) {
    const [isBodyNightMode, setIsBodyNightMode] = useState(
        typeof document !== 'undefined' && document.body.classList.contains('night-mode')
    );

    useEffect(() => {
        if (typeof document === 'undefined') return;

        const checkNightMode = () => {
            setIsBodyNightMode(document.body.classList.contains('night-mode'));
        };

        checkNightMode(); 

        const observer = new MutationObserver(checkNightMode);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        return () => {
            observer.disconnect();
        };
    }, []);

    const tileClasses = [
        'tile',
        isBodyNightMode ? 'tile-night-mode' : '',
        isLast ? 'animate-tile-value' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={tileClasses}>
            <h3 className="tile-title">{title}</h3>
            <p className="tile-value">{value}</p>
        </div>
    );
}