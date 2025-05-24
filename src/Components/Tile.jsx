import {useEffect, useState} from 'react';
import './Tile.css'

export default function Tile(props) {
    const tileStyle = {
        backgroundColor: 'white',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.12)',
        borderRadius: '16px',
        padding: '24px',
        titleAglin: 'center',
        width: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    }

    const titleStyle = {
        fontSize: "18px",
        fontWeight: "600",
        color: "#4A4A4A",
        marginBottom: "8px",
    };

    const valueStyle = {
        fontSize: "24px",
        fontWeight: "700",
        color: "#1A1A1A",
    };

    return (
        <div style={tileStyle}>
            <h1 style={titleStyle}>{props.title}</h1>
            <p style={valueStyle}>{props.value}</p>
        </div>
    )
}