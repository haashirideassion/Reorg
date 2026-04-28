import React from 'react';
import PdfLogoHeader from './PdfLogoHeader';

const ReadinessScorecardPDF = ({ userData, overallStatus, totalScore, sections, getSectionScore, getStatus, options, answers, radarPoints }) => {
    return (
        <div id="readiness-pdf-template" style={{
            width: '794px',
            minHeight: '1120px',
            padding: '40px 40px 100px 40px',
            backgroundColor: '#ffffff',
            color: '#000000',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.5',
            margin: '0',
            boxSizing: 'border-box',
            position: 'relative'
        }}>
            <div style={{ height: '1010px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                <PdfLogoHeader title="Readiness Assessment" name={userData.name} />

                {/* Hero Section */}
            <div style={{
                border: `2px solid ${overallStatus.hexColor}`,
                borderRadius: '20px',
                marginBottom: '40px',
                display: 'flex',
                width: '100%',
                pageBreakInside: 'avoid',
                backgroundColor: '#ffffff',
                overflow: 'hidden'
            }}>
                <div style={{ width: '260px', backgroundColor: '#f9fafb', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src={overallStatus.image}
                        alt=""
                        style={{ width: '260px', height: '260px', objectFit: 'cover', display: 'block' }}
                    />
                </div>
                <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            fontSize: '56px',
                            fontWeight: '700',
                            color: overallStatus.hexColor,
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'center',
                            lineHeight: '1'
                        }}>
                            {totalScore}
                            <span style={{ fontSize: '20px', color: '#9ca3af', marginLeft: '3px', fontWeight: '500' }}>/100</span>
                        </div>
                    </div>
                    <h2 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#111827' }}>{overallStatus.label}</h2>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 15px 0' }}>{overallStatus.zone}</p>
                    <p style={{ fontSize: '14px', color: '#4b5563', margin: '0', lineHeight: '1.5' }}>{overallStatus.desc}</p>
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
                                            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{score % 1 === 0 ? score : score.toFixed(1)}/15</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            </div>

            {/* PAGE 2: Breakdown pt 1 */}
            <div style={{ height: '1010px', boxSizing: 'border-box', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '30px', borderBottom: '2px solid #22c55e', paddingBottom: '10px' }}>
                    Response Detail Breakdown
                </h3>

                {sections.slice(0, 2).map((sec) => (
                    <div key={sec.id} style={{ marginBottom: '40px', pageBreakInside: 'avoid' }}>
                        <h4 style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold', 
                            color: '#166534', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.1em',
                            marginBottom: '16px', 
                            borderBottom: '1px solid #e5e7eb',
                            paddingBottom: '8px'
                        }}>
                            {sec.title}
                        </h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {sec.questions.map((q, qIdx) => {
                                const sectionStartIdx = sections.slice(0, sec.id).reduce((acc, s) => acc + s.questions.length, 0);
                                const globalIdx = sectionStartIdx + qIdx;
                                const answer = answers[globalIdx];
                                const optionLabel = options.find(o => o.val === answer)?.label || 'N/A';
                                const color = answer === 3 ? '#15803d' : answer === 2 ? '#b45309' : '#b91c1c';
                                const bgColor = answer === 3 ? '#f0fdf4' : answer === 2 ? '#fffbeb' : '#fef2f2';
                                const borderColor = answer === 3 ? '#bbf7d0' : answer === 2 ? '#fde68a' : '#fecaca';
                                return (
                                    <div key={q.id} style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '32px',
                                        backgroundColor: '#f9fafb',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        pageBreakInside: 'avoid'
                                    }}>
                                        <p style={{ 
                                            fontSize: '14px', 
                                            fontWeight: '300',
                                            lineHeight: '1.6',
                                            flex: 1,
                                            margin: 0,
                                            color: '#374151'
                                        }}>
                                            <span style={{ fontWeight: 'bold', marginRight: '8px', color: '#9ca3af' }}>{qIdx + 1}.</span>
                                            {q.text}
                                        </p>
                                        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                textAlign: 'center',
                                                width: '96px',
                                                paddingTop: '2px',
                                                paddingBottom: '6px',
                                                fontSize: '10px',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                backgroundColor: bgColor,
                                                color: color,
                                                borderRadius: '9999px',
                                                border: `1px solid ${borderColor}`,
                                                lineHeight: '1'
                                            }}>
                                                {optionLabel}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGE 3: Breakdown pt 2 */}
            <div style={{ height: '1010px', boxSizing: 'border-box', paddingTop: '20px' }}>
                {sections.slice(2, 4).map((sec) => (
                    <div key={sec.id} style={{ marginBottom: '40px', pageBreakInside: 'avoid' }}>
                        <h4 style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold', 
                            color: '#166534', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.1em',
                            marginBottom: '16px', 
                            borderBottom: '1px solid #e5e7eb',
                            paddingBottom: '8px'
                        }}>
                            {sec.title}
                        </h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {sec.questions.map((q, qIdx) => {
                                const sectionStartIdx = sections.slice(0, sec.id).reduce((acc, s) => acc + s.questions.length, 0);
                                const globalIdx = sectionStartIdx + qIdx;
                                const answer = answers[globalIdx];
                                const optionLabel = options.find(o => o.val === answer)?.label || 'N/A';
                                const color = answer === 3 ? '#15803d' : answer === 2 ? '#b45309' : '#b91c1c';
                                const bgColor = answer === 3 ? '#f0fdf4' : answer === 2 ? '#fffbeb' : '#fef2f2';
                                const borderColor = answer === 3 ? '#bbf7d0' : answer === 2 ? '#fde68a' : '#fecaca';
                                return (
                                    <div key={q.id} style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '32px',
                                        backgroundColor: '#f9fafb',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        pageBreakInside: 'avoid'
                                    }}>
                                        <p style={{ 
                                            fontSize: '14px', 
                                            fontWeight: '300',
                                            lineHeight: '1.6',
                                            flex: 1,
                                            margin: 0,
                                            color: '#374151'
                                        }}>
                                            <span style={{ fontWeight: 'bold', marginRight: '8px', color: '#9ca3af' }}>{qIdx + 1}.</span>
                                            {q.text}
                                        </p>
                                        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                textAlign: 'center',
                                                width: '96px',
                                                paddingTop: '2px',
                                                paddingBottom: '6px',
                                                fontSize: '10px',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                backgroundColor: bgColor,
                                                color: color,
                                                borderRadius: '9999px',
                                                border: `1px solid ${borderColor}`,
                                                lineHeight: '1'
                                            }}>
                                                {optionLabel}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGE 4: Breakdown pt 3 */}
            <div style={{ height: '1010px', boxSizing: 'border-box', paddingTop: '20px' }}>
                {sections.slice(4, 6).map((sec) => (
                    <div key={sec.id} style={{ marginBottom: '40px', pageBreakInside: 'avoid' }}>
                        <h4 style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold', 
                            color: '#166534', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.1em',
                            marginBottom: '16px', 
                            borderBottom: '1px solid #e5e7eb',
                            paddingBottom: '8px'
                        }}>
                            {sec.title}
                        </h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {sec.questions.map((q, qIdx) => {
                                const sectionStartIdx = sections.slice(0, sec.id).reduce((acc, s) => acc + s.questions.length, 0);
                                const globalIdx = sectionStartIdx + qIdx;
                                const answer = answers[globalIdx];
                                const optionLabel = options.find(o => o.val === answer)?.label || 'N/A';
                                const color = answer === 3 ? '#15803d' : answer === 2 ? '#b45309' : '#b91c1c';
                                const bgColor = answer === 3 ? '#f0fdf4' : answer === 2 ? '#fffbeb' : '#fef2f2';
                                const borderColor = answer === 3 ? '#bbf7d0' : answer === 2 ? '#fde68a' : '#fecaca';
                                return (
                                    <div key={q.id} style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '32px',
                                        backgroundColor: '#f9fafb',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        pageBreakInside: 'avoid'
                                    }}>
                                        <p style={{ 
                                            fontSize: '14px', 
                                            fontWeight: '300',
                                            lineHeight: '1.6',
                                            flex: 1,
                                            margin: 0,
                                            color: '#374151'
                                        }}>
                                            <span style={{ fontWeight: 'bold', marginRight: '8px', color: '#9ca3af' }}>{qIdx + 1}.</span>
                                            {q.text}
                                        </p>
                                        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '96px',
                                                height: '28px',
                                                fontSize: '10px',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                backgroundColor: bgColor,
                                                color: color,
                                                borderRadius: '9999px',
                                                border: `1px solid ${borderColor}`,
                                                lineHeight: '1'
                                            }}>
                                                <span style={{ position: 'relative', top: '-1.5px' }}>{optionLabel}</span>
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGE 5: Breakdown pt 4 & Footer */}
            <div style={{ height: '1010px', boxSizing: 'border-box', paddingTop: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                    {sections.slice(6).map((sec) => (
                        <div key={sec.id} style={{ marginBottom: '40px', pageBreakInside: 'avoid' }}>
                            <h4 style={{ 
                                fontSize: '18px', 
                                fontWeight: 'bold', 
                                color: '#166534', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.1em',
                                marginBottom: '16px', 
                                borderBottom: '1px solid #e5e7eb',
                                paddingBottom: '8px'
                            }}>
                                {sec.title}
                            </h4>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {sec.questions.map((q, qIdx) => {
                                    const sectionStartIdx = sections.slice(0, sec.id).reduce((acc, s) => acc + s.questions.length, 0);
                                    const globalIdx = sectionStartIdx + qIdx;
                                    const answer = answers[globalIdx];
                                    const optionLabel = options.find(o => o.val === answer)?.label || 'N/A';
                                    const color = answer === 3 ? '#15803d' : answer === 2 ? '#b45309' : '#b91c1c';
                                    const bgColor = answer === 3 ? '#f0fdf4' : answer === 2 ? '#fffbeb' : '#fef2f2';
                                    const borderColor = answer === 3 ? '#bbf7d0' : answer === 2 ? '#fde68a' : '#fecaca';
                                    return (
                                        <div key={q.id} style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '32px',
                                            backgroundColor: '#f9fafb',
                                            padding: '16px',
                                            borderRadius: '12px',
                                            pageBreakInside: 'avoid'
                                        }}>
                                            <p style={{ 
                                                fontSize: '14px', 
                                                fontWeight: '300',
                                                lineHeight: '1.6',
                                                flex: 1,
                                                margin: 0,
                                                color: '#374151'
                                            }}>
                                                <span style={{ fontWeight: 'bold', marginRight: '8px', color: '#9ca3af' }}>{qIdx + 1}.</span>
                                                {q.text}
                                            </p>
                                            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    textAlign: 'center',
                                                    width: '96px',
                                                    paddingTop: '2px',
                                                    paddingBottom: '6px',
                                                    fontSize: '10px',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    backgroundColor: bgColor,
                                                    color: color,
                                                    borderRadius: '9999px',
                                                    border: `1px solid ${borderColor}`,
                                                    lineHeight: '1'
                                                }}>
                                                    {optionLabel}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{ paddingTop: '20px', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '10px', color: '#9ca3af' }}>
                    © 2026 RE:ORG Readiness Assessment. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default ReadinessScorecardPDF;
