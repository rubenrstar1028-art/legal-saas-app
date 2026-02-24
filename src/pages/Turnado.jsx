import React, { useState } from 'react';
import { UploadCloud, PlayCircle, Users, ArrowRight, UserCheck } from 'lucide-react';
import { useAppContext, ROLES } from '../context/AppContext';
import './Turnado.css';

const Turnado = () => {
    const { cases, role, addParsedCases, autoAssignCases, manualAssignCase } = useAppContext();
    const [folioInput, setFolioInput] = useState('');
    const [selectedLawyers, setSelectedLawyers] = useState([
        'Abg. Martínez', 'Abg. Ruiz', 'Abg. García', 'Abg. Sosa'
    ]);
    const [errorMsg, setErrorMsg] = useState('');

    // Protect view: Only JUD and Admin can access
    if (role !== ROLES.JUD && role !== ROLES.ADMINISTRATIVO) {
        return (
            <div className="page-wrapper">
                <div className="card text-center text-danger p-4">
                    <h2>Acceso Restringido</h2>
                    <p>No tienes los permisos necesarios para realizar cargas o turnados.</p>
                </div>
            </div>
        );
    }

    const pendingCases = cases.filter(c => c.lawyer === 'Pendiente');

    const handleUpload = () => {
        setErrorMsg('');
        if (!folioInput.trim()) return;
        const folios = folioInput.split('\n').map(f => f.trim()).filter(f => f);
        const result = addParsedCases(folios);
        if (result && !result.success) {
            setErrorMsg(result.error);
        } else {
            setFolioInput('');
        }
    };

    const handleToggleLawyer = (lw) => {
        setSelectedLawyers(prev =>
            prev.includes(lw) ? prev.filter(l => l !== lw) : [...prev, lw]
        );
    };

    const handleDragStart = (e, caseId) => {
        e.dataTransfer.setData('caseId', caseId);
    };

    const handleDrop = (e, lawyerName) => {
        e.preventDefault();
        const caseId = e.dataTransfer.getData('caseId');
        if (caseId) {
            manualAssignCase(caseId, lawyerName);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const allLawyers = ['Abg. Martínez', 'Abg. Ruiz', 'Abg. García', 'Abg. Sosa'];

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div>
                    <h1>Módulo de Carga y Turnado (Área Hood)</h1>
                    <p>Recepción de folios, parsing inteligente y asignación basada en complejidad</p>
                </div>
            </div>

            <div className="dashboard-main-row split-50">
                {/* Panel Lado Izquierdo: Carga y Pool de Pendientes */}
                <div className="turnado-left">
                    <div className="card add-cases-card">
                        <h3 className="section-title"><UploadCloud size={18} /> Carga Manual / Masiva</h3>
                        <p className="text-muted text-sm mb-3">Ingresa los folios separados por línea. El sistema detectará automáticamente el tipo (RH, CHJ, etc.).</p>
                        <textarea
                            className="folio-textarea"
                            placeholder="Ejemplo:&#10;RH/2025/0001&#10;VG/2025/0045"
                            value={folioInput}
                            onChange={(e) => setFolioInput(e.target.value)}
                        />
                        {errorMsg && <div className="text-danger mt-2 mb-2" style={{ fontSize: '13px', fontWeight: 'bold' }}>{errorMsg}</div>}
                        <button className="btn btn-primary w-100 mt-2" onClick={handleUpload}>Registrar en Base de Datos</button>
                    </div>

                    <div className="card pending-pool-card">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="section-title m-0">Pendientes por Turnar</h3>
                            <span className="badge-count badge-warning">{pendingCases.length}</span>
                        </div>
                        <div className="pending-list">
                            {pendingCases.length === 0 ? (
                                <p className="text-center text-muted p-4">No hay expedientes pendientes.</p>
                            ) : (
                                pendingCases.map(c => (
                                    <div
                                        key={c.id}
                                        className="pending-item"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, c.id)}
                                        title="Arrastra para asignación manual"
                                    >
                                        <div className="pending-item-left">
                                            <span className="fw-bold text-primary">{c.expId}</span>
                                            <span className="type-pill">{c.type}</span>
                                        </div>
                                        <div className="pts-badge bg-light" title="Complejidad">{c.pts} pts</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Panel Lado Derecho: Asignación */}
                <div className="turnado-right card">
                    <h3 className="section-title"><Users size={18} /> Turnado y Abogados (Drag & Drop)</h3>

                    <div className="auto-assign-section">
                        <p className="text-muted text-sm">Selecciona los abogados disponibles para repartir automáticamente la carga pendiente basada en complejidad actual.</p>
                        <div className="lawyer-checkboxes">
                            {allLawyers.map(lw => (
                                <label key={lw} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={selectedLawyers.includes(lw)}
                                        onChange={() => handleToggleLawyer(lw)}
                                    />
                                    {lw}
                                </label>
                            ))}
                        </div>
                        <button
                            className="btn btn-outline w-100 mt-3 d-flex justify-content-center align-items-center gap-2"
                            onClick={() => autoAssignCases(selectedLawyers)}
                            disabled={pendingCases.length === 0 || selectedLawyers.length === 0}
                        >
                            <PlayCircle size={18} /> Ejecutar Turnado Automático
                        </button>
                    </div>

                    <div className="drop-zones mt-4">
                        <h4 className="border-bottom pb-2 mb-3">Asignación Manual (Arrastre Aquí)</h4>
                        {allLawyers.map(lw => {
                            const lCases = cases.filter(c => c.lawyer === lw);
                            const lPts = lCases.reduce((a, b) => a + b.pts, 0);
                            return (
                                <div
                                    key={lw}
                                    className="lawyer-drop-zone"
                                    onDrop={(e) => handleDrop(e, lw)}
                                    onDragOver={handleDragOver}
                                >
                                    <div className="zone-header">
                                        <UserCheck size={16} className="text-primary" />
                                        <span className="fw-bold">{lw}</span>
                                    </div>
                                    <div className="zone-stats text-muted text-sm">
                                        <span>Carga Actual: <strong>{lCases.length} exp</strong></span>
                                        <span>Complejidad: <strong>{lPts} pts</strong></span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Turnado;
