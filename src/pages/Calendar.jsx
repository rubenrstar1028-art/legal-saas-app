import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, Plus, X, FileText, Download, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useAppContext, ROLES } from '../context/AppContext';
import './Calendar.css';

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const daysOfWeek = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb', 'Dom'];

const Calendar = () => {
    const { cases, role } = useAppContext();
    const canCreate = role === ROLES.JUD || role === ROLES.ABOGADO;

    const [filterAbogado, setFilterAbogado] = useState('Todos');
    const [filterCorp, setFilterCorp] = useState('Todos');
    const [toastMsg, setToastMsg] = useState('');

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    let filteredHearings = cases.filter(c => c.audiencia);
    if (filterAbogado !== 'Todos') {
        filteredHearings = filteredHearings.filter(c => c.lawyer === filterAbogado);
    }
    if (filterCorp !== 'Todos') {
        filteredHearings = filteredHearings.filter(c => c.corporacion && c.corporacion === filterCorp);
    }

    // Real system default: 2026-02-20
    const systemToday = new Date('2026-02-20T12:00:00');

    const [currentDate, setCurrentDate] = useState(systemToday);
    const [selectedDate, setSelectedDate] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    // getDay() gives 0 for Sunday. We want 0 for Monday.
    const getFirstDayOfMonth = (y, m) => {
        let day = new Date(y, m, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToday = () => setCurrentDate(systemToday);

    const getDayDots = (dateStr) => {
        const dailyHearings = filteredHearings.filter(h => h.deadline === dateStr);
        return dailyHearings.map(h => {
            let color = 'default';
            if (h.type === 'RH') color = 'blue';
            if (h.type === 'VG') color = 'green';
            if (h.type === 'CHJ') color = 'red';
            return { id: h.id, color, time: h.audiencia.split('-')[0].trim() };
        });
    };

    const handleDayClick = (dayStr) => {
        setSelectedDate(dayStr);
    };

    const selectedDayHearings = selectedDate ? filteredHearings.filter(h => h.deadline === selectedDate) : [];

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Agenda Semanal/Mensual', 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text('LegalSaaS - Área Hood', 14, 30);
        doc.text(`Filtros Aplicados: Abogado (${filterAbogado}) | Corporación (${filterCorp})`, 14, 38);

        const tableData = filteredHearings.map(h => [
            h.expId,
            h.lawyer,
            h.type,
            h.audiencia ? h.audiencia.split('-')[0].trim() : '',
            h.deadline
        ]);

        doc.autoTable({
            startY: 45,
            head: [['Folio', 'Abogado Responsable', 'Tipo de Expediente', 'Hora', 'Fecha']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] }
        });

        doc.save('agenda-hood.pdf');
        showToast('PDF generado y descargado exitosamente');
    };

    const exportExcel = () => {
        const wsData = filteredHearings.map(h => ({
            'Folio': h.expId,
            'Tipo de Expediente': h.type,
            'Corporación': h.corporacion || 'N/A',
            'Abogado Asignado': h.lawyer,
            'Estatus': h.status,
            'Fecha de Audiencia': h.deadline,
            'Hora': h.audiencia ? h.audiencia.split('-')[0].trim() : ''
        }));

        const ws = XLSX.utils.json_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Audiencias');
        XLSX.writeFile(wb, 'agenda-hood.xlsx');
        showToast('Excel generado y descargado exitosamente');
    };

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div>
                    <h1>Calendario de Audiencias</h1>
                    <p>Programación de citatorios y desahogos en todas las salas</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-outline" onClick={exportPDF}>
                        <FileText size={18} />
                        Exportar a PDF
                    </button>
                    <button className="btn btn-outline" onClick={exportExcel}>
                        <Download size={18} />
                        Exportar a Excel
                    </button>
                    {canCreate && (
                        <button className="btn btn-primary">
                            <Plus size={18} />
                            Programar Audiencia
                        </button>
                    )}
                </div>
            </div>

            {/* Filtros Container */}
            <div className="card mb-4 p-3 d-flex align-items-center gap-3">
                <Filter size={18} className="text-muted" />
                <span className="fw-bold">Filtros Activos:</span>
                <select className="form-select" style={{ width: '200px' }} value={filterAbogado} onChange={e => setFilterAbogado(e.target.value)}>
                    <option value="Todos">Todos los Abogados</option>
                    <option value="Abg. Martínez">Abg. Martínez</option>
                    <option value="Abg. Ruiz">Abg. Ruiz</option>
                    <option value="Abg. García">Abg. García</option>
                    <option value="Abg. Sosa">Abg. Sosa</option>
                </select>
                <select className="form-select" style={{ width: '200px' }} value={filterCorp} onChange={e => setFilterCorp(e.target.value)}>
                    <option value="Todos">Todas las Corporaciones</option>
                    <option value="P.P">P.P (Policía Preventiva)</option>
                    <option value="P.A">P.A (Policía Auxiliar)</option>
                    <option value="P.B.I">P.B.I</option>
                </select>
            </div>

            <div className="dashboard-main-row split-60-40">
                <div className="card calendar-view">
                    <div className="calendar-header">
                        <h2>{months[month]} {year}</h2>
                        <div className="calendar-nav">
                            <button className="btn btn-outline small" onClick={prevMonth}>&lt;</button>
                            <button className="btn btn-outline small" onClick={goToday}>Hoy</button>
                            <button className="btn btn-outline small" onClick={nextMonth}>&gt;</button>
                        </div>
                    </div>

                    <div className="calendar-grid">
                        {daysOfWeek.map(d => (
                            <div key={d} className="calendar-day-header">{d}</div>
                        ))}

                        {/* Empty padding days */}
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="calendar-day empty"></div>
                        ))}

                        {/* Actual days */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayNum = i + 1;
                            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
                            const isToday = systemToday.getDate() === dayNum && systemToday.getMonth() === month && systemToday.getFullYear() === year;
                            const dots = getDayDots(dateStr);

                            return (
                                <div
                                    key={dayNum}
                                    className={`calendar-day clickable-day ${isToday ? 'today' : ''}`}
                                    onClick={() => handleDayClick(dateStr)}
                                    title="Ver audiencias"
                                >
                                    <span className="day-number">{dayNum}</span>
                                    <div className="dots-container">
                                        {dots.map((dot, idx) => (
                                            <div key={idx} className={`event-dot dot-${dot.color}`} title={dot.time}></div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="card upcoming-hearings">
                    <h3 className="section-title">Próximas Audiencias (Global)</h3>
                    <div className="hearings-list">
                        {filteredHearings.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 5).map(h => {
                            return (
                                <div key={h.id} className="hearing-card">
                                    <div className="hearing-date">
                                        <CalendarIcon size={16} />
                                        <span style={{ fontSize: '10px' }}>{h.deadline.split('-').slice(1).join('/')}</span>
                                    </div>
                                    <div className="hearing-details">
                                        <h4>{h.expId} - {h.type}</h4>
                                        <p className="hearing-time"><Clock size={14} /> {h.audiencia}</p>
                                        <p className="hearing-lawyer"><Users size={14} /> {h.lawyer}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal de Audiencias del Día */}
            {selectedDate && (
                <div className="modal-overlay" onClick={() => setSelectedDate(null)}>
                    <div className="modal-content" style={{ width: '500px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Audiencias del Día ({selectedDate})</h2>
                            <button className="close-btn" onClick={() => setSelectedDate(null)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            {selectedDayHearings.length === 0 ? (
                                <p className="text-center text-muted p-4">Sin audiencias para esta fecha.</p>
                            ) : (
                                <div className="hearings-list p-0">
                                    {selectedDayHearings.map(h => (
                                        <div key={h.id} className="hearing-card">
                                            <div className="hearing-details">
                                                <h4 className="fw-bold text-primary">{h.expId}</h4>
                                                <p className="hearing-time"><Clock size={14} /> {h.audiencia}</p>
                                                <p className="hearing-lawyer"><Users size={14} /> {h.lawyer}</p>
                                                <p className="hearing-lawyer text-muted" style={{ marginTop: '4px' }}>Corporación: <strong>{h.corporacion || '-'}</strong></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {toastMsg && (
                <div className="toast-notification">
                    {toastMsg}
                </div>
            )}
        </div>
    );
};

export default Calendar;
