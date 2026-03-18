import React from 'react';

const ReadinessScorecardPDF = ({ userData, overallStatus, totalScore, sections, getSectionScore, getStatus, options, answers, radarPoints }) => {
    return (
        <div id="readiness-pdf-template" style={{
            width: '794px',
            padding: '40px',
            backgroundColor: '#ffffff',
            color: '#000000',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.5',
            margin: '0',
            boxSizing: 'border-box'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #f3f4f6', paddingBottom: '20px' }}>
                <h1 style={{ fontSize: '28px', margin: '0 0 10px 0', fontWeight: 'bold' }}>RE:ORG Readiness Assessment</h1>
                <p style={{ fontSize: '16px', color: '#6b7280', fontStyle: 'italic', margin: '0' }}>Prepared for: {userData.name}</p>
            </div>

            {/* Hero Section */}
            <div style={{
                border: `2px solid ${overallStatus.hexColor}`,
                borderRadius: '20px',
                marginBottom: '40px',
                overflow: 'hidden',
                display: 'table',
                width: '100%',
                pageBreakInside: 'avoid'
            }}>
                <div style={{ display: 'table-row' }}>
                    <div style={{ display: 'table-cell', width: '260px', verticalAlign: 'middle', backgroundColor: '#f9fafb' }}>
                        <img
                            src={overallStatus.image}
                            alt=""
                            style={{ width: '260px', height: '260px', objectFit: 'cover' }}
                        />
                    </div>
                    <div style={{ display: 'table-cell', padding: '30px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{
                                fontSize: '48px',
                                fontWeight: 'bold',
                                color: overallStatus.hexColor
                            }}>
                                {totalScore}<span style={{ fontSize: '18px', color: '#9ca3af' }}>/100</span>
                            </div>
                        </div>
                        <h2 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold' }}>{overallStatus.label}</h2>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 15px 0' }}>{overallStatus.zone}</p>
                        <p style={{ fontSize: '14px', color: '#4b5563', margin: '0' }}>{overallStatus.desc}</p>
                    </div>
                </div>
            </div>

            {/* Metrics Section */}
            <div style={{ display: 'table', width: '100%', borderCollapse: 'separate', borderSpacing: '20px 0', marginBottom: '40px' }}>
                <div style={{ display: 'table-row' }}>
                    {/* Radar Representation (Simplified) */}
                    <div style={{ display: 'table-cell', width: '50%', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '15px', verticalAlign: 'top', pageBreakInside: 'avoid' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
                            Excellence Radar
                        </h3>
                        <div style={{ textAlign: 'center' }}>
                            <svg viewBox="0 0 300 300" style={{ width: '240px', height: '240px' }}>
                                {[0.33, 0.66, 1.0].map((scale, sIdx) => {
                                    const radius = 100 * scale;
                                    const pts = [0, 1, 2, 3, 4, 5, 6].map((i) => {
                                        const angle = (Math.PI / 2) - (2 * Math.PI * i / 7);
                                        const x = 150 + radius * Math.cos(angle);
                                        const y = 150 - radius * Math.sin(angle);
                                        return `${x},${y}`;
                                    }).join(" ");
                                    return <polygon key={sIdx} points={pts} fill="none" stroke="#e5e7eb" strokeWidth="1" />;
                                })}
                                {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                                    const angle = (Math.PI / 2) - (2 * Math.PI * i / 7);
                                    const x = 150 + 100 * Math.cos(angle);
                                    const y = 150 - 100 * Math.sin(angle);
                                    return <line key={i} x1="150" y1="150" x2={x} y2={y} stroke="#e5e7eb" strokeWidth="1" />;
                                })}
                                <polygon
                                    points={radarPoints}
                                    fill={overallStatus.hexColor}
                                    fillOpacity="0.3"
                                    stroke={overallStatus.hexColor}
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Detailed Breakdown Section */}
                    <div style={{ display: 'table-cell', width: '50%', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '15px', verticalAlign: 'top', pageBreakInside: 'avoid' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
                            Readiness Scores
                        </h3>
                        <div style={{ paddingTop: '5px' }}>
                            {sections.map((sec) => {
                                const score = getSectionScore(sec.id);
                                // Simple color logic for readiness
                                const color = score > 10 ? '#22c55e' : score > 5 ? '#f59e0b' : '#ef4444';
                                return (
                                    <div key={sec.id} style={{ marginBottom: '15px', borderBottom: '1px solid #f9fafb', paddingBottom: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{sec.title}</span>
                                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: color }}>{Math.round((score / 15) * 100)}%</span>
                                        </div>
                                        <div style={{ height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden', marginBottom: '5px' }}>
                                            <div style={{ width: `${(score / 15) * 100}%`, height: '100%', backgroundColor: color }}></div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{score}/15</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Breakdown Section */}
            <div style={{ marginTop: '40px', pageBreakBefore: 'always' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '30px', borderBottom: '2px solid #22c55e', paddingBottom: '10px' }}>
                    Response Detail Breakdown
                </h3>

                {sections.map((sec) => (
                    <div key={sec.id} style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#166534', textTransform: 'uppercase', marginBottom: '15px', borderLeft: '4px solid #22c55e', paddingLeft: '10px' }}>
                            {sec.title}
                        </h4>
                        <div style={{ display: 'block' }}>
                            {sec.questions.map((q, qIdx) => {
                                const sectionStartIdx = sections.slice(0, sec.id).reduce((acc, s) => acc + s.questions.length, 0);
                                const globalIdx = sectionStartIdx + qIdx;
                                const answer = answers[globalIdx];
                                const optionLabel = options.find(o => o.val === answer)?.label || "N/A";
                                const color = answer === 3 ? '#15803d' : answer === 2 ? '#b45309' : '#b91c1c';
                                const bgColor = answer === 3 ? '#f0fdf4' : answer === 2 ? '#fffbeb' : '#fef2f2';

                                return (
                                    <div key={q.id} style={{
                                        display: 'table',
                                        width: '100%',
                                        backgroundColor: '#f9fafb',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{ display: 'table-row' }}>
                                            <div style={{ display: 'table-cell', fontSize: '13px', verticalAlign: 'top' }}>
                                                <span style={{ fontWeight: 'bold', marginRight: '8px', color: '#9ca3af' }}>{qIdx + 1}.</span>
                                                {q.text}
                                            </div>
                                            <div style={{ display: 'table-cell', width: '120px', textAlign: 'right', verticalAlign: 'middle' }}>
                                                <span style={{
                                                    fontSize: '11px',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    padding: '4px 10px',
                                                    backgroundColor: bgColor,
                                                    color: color,
                                                    borderRadius: '12px',
                                                    border: `1px solid ${color}44`
                                                }}>
                                                    {optionLabel}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '10px', color: '#9ca3af' }}>
                © 2026 RE:ORG Readiness Assessment. All rights reserved.
            </div>
        </div>
    );
};

export default ReadinessScorecardPDF;
