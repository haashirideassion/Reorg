import React from 'react';
import PdfLogoHeader from './PdfLogoHeader';

// Reusable helper: resolve answer option from a question's own options
const resolveOption = (q, answerVal) => q.options.find(o => o.val === answerVal);

const pillColors = {
    green:  { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
    yellow: { color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    red:    { color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
};

const sectionStatusLabel = (score) =>
    score > 60 ? 'Critical Resistance' : score > 30 ? 'Transition Strain' : 'Stable Flow';

const sectionStatusColor = (score) =>
    score > 60 ? '#ef4444' : score > 30 ? '#f59e0b' : '#22c55e';

const sectionInsight = (score) =>
    score > 60
        ? 'Deep organizational friction detected. Legacy patterns are stifling progress.'
        : score > 30
        ? 'Moderate signs of structural tension. Opportunities for optimization exist.'
        : 'Operational fluidity is high. Structure supports strategic execution.';

const ReadinessScorecardPDF = ({ userData, overallStatus, totalScore, sections, getSectionScore, answers, radarPoints }) => {
    return (
        <div
            id="readiness-pdf-template"
            style={{
                width: '794px',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.5',
                margin: '0',
                boxSizing: 'border-box',
            }}
        >
            {/* ─── PAGE 1: Summary ─────────────────────────────────── */}
            <div style={{ width: '794px', minHeight: '1122px', padding: '40px', boxSizing: 'border-box', pageBreakAfter: 'always' }}>
                <PdfLogoHeader title="Readiness Assessment" name={userData.name} />

                {/* Hero card */}
                <div style={{
                    border: `2px solid ${overallStatus.hexColor}`,
                    borderRadius: '20px',
                    marginBottom: '32px',
                    display: 'flex',
                    overflow: 'hidden',
                    pageBreakInside: 'avoid',
                }}>
                    <div style={{ width: '240px', flexShrink: 0, backgroundColor: '#f9fafb' }}>
                        <img
                            src={overallStatus.image}
                            alt=""
                            style={{ width: '240px', height: '240px', objectFit: 'cover', display: 'block' }}
                        />
                    </div>
                    <div style={{ flex: 1, padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '28px', margin: '0 0 8px 0', fontWeight: 'bold', color: '#111827' }}>{overallStatus.label}</h2>
                        <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#9ca3af', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 16px 0' }}>{overallStatus.zone}</p>
                        <p style={{ fontSize: '14px', color: '#4b5563', margin: '0', lineHeight: '1.6' }}>{overallStatus.desc}</p>
                    </div>
                </div>

                {/* Two-column metrics: Radar + Section scores */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                    {/* Radar */}
                    <div style={{ flex: 1, padding: '20px', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '16px', margin: '0 0 16px 0' }}>Excellence Radar</h3>
                        <div style={{ textAlign: 'center' }}>
                            <svg viewBox="0 0 300 300" style={{ width: '200px', height: '200px' }}>
                                {[0.33, 0.66, 1.0].map((scale, sIdx) => {
                                    const radius = 100 * scale;
                                    const pts = [0, 1, 2].map((i) => {
                                        const angle = (Math.PI / 2) - (2 * Math.PI * i / 3);
                                        const x = 150 + radius * Math.cos(angle);
                                        const y = 150 - radius * Math.sin(angle);
                                        return `${x},${y}`;
                                    }).join(' ');
                                    return <polygon key={sIdx} points={pts} fill="none" stroke="#e5e7eb" strokeWidth="1" />;
                                })}
                                {[0, 1, 2].map((i) => {
                                    const angle = (Math.PI / 2) - (2 * Math.PI * i / 3);
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

                    {/* Section Scores */}
                    <div style={{ flex: 1, padding: '20px', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 16px 0' }}>Section Scores</h3>
                        {sections.map((sec, idx) => {
                            const rawScore = getSectionScore(sec.id);
                            const pct = Math.round((rawScore / 15) * 100);
                            const barColor = sectionStatusColor(pct);
                            return (
                                <div key={sec.id} style={{ marginBottom: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{sec.title}</span>
                                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: barColor }}>{pct}%</span>
                                    </div>
                                    <div style={{ height: '7px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: barColor, borderRadius: '4px' }} />
                                    </div>
                                    <div style={{ marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: barColor, flexShrink: 0 }} />
                                        <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>{sectionStatusLabel(pct)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Signal summary row */}
                <div style={{ display: 'flex', gap: '16px' }}>
                    {[
                        { label: 'Currently Stable', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
                        { label: 'Needs Attention', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
                        { label: 'Immediate Attention', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
                    ].map(({ label, color, bg, border }) => (
                        <div key={label} style={{ flex: 1, textAlign: 'center', padding: '14px', border: `1px solid ${border}`, borderRadius: '12px', backgroundColor: bg }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, margin: '0 auto 6px' }} />
                            <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#6b7280' }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── PAGE 2: Organizational Breakdown ───────────────── */}
            <div style={{ width: '794px', padding: '40px', boxSizing: 'border-box' }}>
                <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                    paddingBottom: '10px',
                    borderBottom: '2px solid #22c55e',
                    color: '#111827',
                    margin: '0 0 24px 0',
                }}>
                    Organizational Breakdown
                </h3>

                {sections.map((sec, idx) => {
                    const rawScore = getSectionScore(sec.id);
                    const pct = Math.round((rawScore / 15) * 100);
                    const statusColor = sectionStatusColor(pct);
                    const statusLabel = sectionStatusLabel(pct);

                    return (
                        <div
                            key={sec.id}
                            style={{
                                marginBottom: '24px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                pageBreakInside: 'avoid',
                            }}
                        >
                            {/* Section header */}
                            <div style={{
                                padding: '16px 20px',
                                backgroundColor: '#f9fafb',
                                borderBottom: '1px solid #e5e7eb',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                                        {sec.title}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: statusColor, flexShrink: 0 }} />
                                        <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>{statusLabel}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '140px', height: '7px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: statusColor, borderRadius: '4px' }} />
                                    </div>
                                    <span style={{ fontSize: '22px', fontWeight: '300', color: '#111827', minWidth: '44px', textAlign: 'right' }}>{pct}%</span>
                                </div>
                            </div>

                            {/* Insight tag */}
                            <div style={{ padding: '8px 20px', backgroundColor: '#ffffff', borderBottom: '1px solid #f3f4f6' }}>
                                <p style={{ fontSize: '10px', color: '#9ca3af', fontStyle: 'italic', margin: 0 }}>{sectionInsight(pct)}</p>
                            </div>

                            {/* Questions */}
                            <div style={{ backgroundColor: '#ffffff' }}>
                                {sec.questions.map((q, qIdx) => {
                                    const sectionStartIdx = sections.slice(0, idx).reduce((acc, s) => acc + s.questions.length, 0);
                                    const globalIdx = sectionStartIdx + qIdx;
                                    const answerVal = answers[globalIdx];
                                    const selectedOpt = resolveOption(q, answerVal);
                                    const pill = selectedOpt ? pillColors[selectedOpt.color] || pillColors.red : null;
                                    const isLast = qIdx === sec.questions.length - 1;

                                    return (
                                        <div
                                            key={q.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '24px',
                                                padding: '12px 20px',
                                                borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                                                <span style={{
                                                    flexShrink: 0,
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '6px',
                                                    backgroundColor: '#f3f4f6',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '10px',
                                                    fontWeight: 'bold',
                                                    color: '#6b7280',
                                                }}>
                                                    {String(qIdx + 1).padStart(2, '0')}
                                                </span>
                                                <p style={{ fontSize: '12px', color: '#374151', margin: 0, lineHeight: '1.5', fontWeight: '300' }}>{q.text}</p>
                                            </div>
                                            {pill ? (
                                                <span style={{
                                                    flexShrink: 0,
                                                    display: 'inline-block',
                                                    textAlign: 'center',
                                                    paddingTop: '2px',
                                                    paddingBottom: '6px',
                                                    padding: '2px 12px 6px 12px',
                                                    borderRadius: '9999px',
                                                    border: `1px solid ${pill.border}`,
                                                    backgroundColor: pill.bg,
                                                    color: pill.color,
                                                    fontSize: '10px',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    lineHeight: '1',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    {selectedOpt.label}
                                                </span>
                                            ) : (
                                                <span style={{
                                                    flexShrink: 0,
                                                    display: 'inline-block',
                                                    textAlign: 'center',
                                                    padding: '2px 12px 6px 12px',
                                                    borderRadius: '9999px',
                                                    border: '1px solid #e5e7eb',
                                                    backgroundColor: '#f9fafb',
                                                    color: '#9ca3af',
                                                    fontSize: '10px',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    lineHeight: '1',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    N/A
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {/* Footer */}
                <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '10px', color: '#9ca3af' }}>
                    © 2026 RE:ORG Readiness Assessment. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default ReadinessScorecardPDF;
