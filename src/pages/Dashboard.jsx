import React, { useState } from 'react';
import { useAppContext, ROLES } from '../context/AppContext';
import { AlertCircle, Calendar, FileText, CheckCircle, Clock, X, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Views based on Role
const JudDashboard = ({ hideWorkloadChart = false }) => {
    const { cases, globalActivities } = useAppContext();
    const navigate = useNavigate();

    // Local state for modals and drawers
    const [isAgendaOpen, setIsAgendaOpen] = useState(false);
    const [isPuntosOpen, setIsPuntosOpen] = useState(false);
    const [isCaducarOpen, setIsCaducarOpen] = useState(false);
    const [isExpedientesOpen, setIsExpedientesOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Dynamic metrics
    const totalExpedientes = 1245 + cases.length - 8; // Adjusting base to show dynamic growth
    const caducarCases = cases.filter(c => c.urgency === 'critical' || c.urgency === 'warning');
    const audiencias = cases.filter(c => c.audiencia !== null);

    // Complexity points
    const ptsBreakdown = {
        RH: cases.filter(c => c.type === 'RH').reduce((acc, c) => acc + c.pts, 0),
        VG: cases.filter(c => c.type === 'VG').reduce((acc, c) => acc + c.pts, 0),
        CHJ: cases.filter(c => c.type === 'CHJ').reduce((acc, c) => acc + c.pts, 0),
        SP: cases.filter(c => c.type === 'SP').reduce((acc, c) => acc + c.pts, 0),
        CCC: cases.filter(c => c.type === 'CCC').reduce((acc, c) => acc + c.pts, 0),
    };
    const totalPts = Object.values(ptsBreakdown).reduce((a, b) => a + b, 0);

    // Workload computation
    const getWorkload = (lawyerName) => cases.filter(c => c.lawyer === lawyerName).reduce((acc, c) => acc + c.pts, 0);
    const workloadData = [
        { name: 'Abg. García', pts: getWorkload('Abg. García') },
        { name: 'Abg. Martínez', pts: getWorkload('Abg. Martínez') },
        { name: 'Abg. Ruiz', pts: getWorkload('Abg. Ruiz') },
        { name: 'Abg. Sosa', pts: getWorkload('Abg. Sosa') },
    ];

    const handleBarClick = (data) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            const lawyerName = data.activePayload[0].payload.name;
            navigate('/workload', { state: { selectedLawyer: lawyerName } });
        }
    };

    // Filter and slice for inline expedientes view
    const sortedCases = [...cases].reverse(); // Assumes newer are added to context or by date logic, simple reverse for demo
    const filteredExpedientes = sortedCases.filter(c => c.expId.toLowerCase().includes(searchTerm.toLowerCase()));
    const recentExpedientes = filteredExpedientes.slice(0, 10);

    return (
        <div className="dashboard-jud">
            <div className="kpi-row interactive-kpis">
                <div className="card kpi-card clickable" onClick={() => setIsExpedientesOpen(!isExpedientesOpen)}>
                    <div className="kpi-icon blue"><FileText size={24} /></div>
                    <div className="kpi-info">
                        <h3>Total Expedientes</h3>
                        <p className="kpi-value">{totalExpedientes}</p>
                    </div>
                </div>
                <div className="card kpi-card danger clickable" onClick={() => setIsCaducarOpen(true)}>
                    <div className="kpi-icon"><AlertCircle size={24} /></div>
                    <div className="kpi-info">
                        <h3>Próximos a Caducar</h3>
                        <p className="kpi-value">{12 + caducarCases.length}</p>
                    </div>
                </div>
                <div className="card kpi-card clickable" onClick={() => setIsAgendaOpen(true)}>
                    <div className="kpi-icon green"><Calendar size={24} /></div>
                    <div className="kpi-info">
                        <h3>Audiencias Hoy</h3>
                        <p className="kpi-value">{8 + audiencias.length}</p>
                    </div>
                </div>
                <div className="card kpi-card clickable" onClick={() => setIsPuntosOpen(true)}>
                    <div className="kpi-icon yellow"><CheckCircle size={24} /></div>
                    <div className="kpi-info">
                        <h3>Puntos de Complejidad</h3>
                        <p className="kpi-value">{totalPts} pts</p>
                    </div>
                </div>
            </div>

            {isExpedientesOpen && (
                <div className="card w-100" style={{ marginBottom: '24px', animation: 'fadeIn 0.3s ease-out' }}>
                    <div className="table-filters" style={{ justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h3 className="section-title m-0">Últimos Expedientes ({filteredExpedientes.length})</h3>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div className="search-bar" style={{ maxWidth: '300px' }}>
                                <Search size={16} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Buscar por folio..."
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="icon-btn" onClick={() => setIsExpedientesOpen(false)}><X size={20} /></button>
                        </div>
                    </div>
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Folio</th>
                                <th>Tipo</th>
                                <th>Corporación</th>
                                <th>Estatus</th>
                                <th>Abogado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentExpedientes.map(c => (
                                <tr key={c.id}>
                                    <td className="fw-bold text-primary">{c.expId}</td>
                                    <td>{c.type}</td>
                                    <td>{c.corporacion || '-'}</td>
                                    <td>
                                        <span className={`status-badge ${c.status === 'Done' ? 'success' : c.status === 'Blocked' ? 'danger' : 'neutral'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td>{c.lawyer}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredExpedientes.length > 10 && (
                        <div className="text-center mt-3" style={{ textAlign: 'center', marginTop: '16px' }}>
                            <button className="btn btn-outline" onClick={() => navigate('/expedientes')}>Ver todos los expedientes →</button>
                        </div>
                    )}
                </div>
            )}

            <div className="dashboard-main-row">
                {!hideWorkloadChart && (
                    <div className="card chart-container">
                        <h3 className="section-title">Carga de Trabajo por Abogado</h3>
                        <div style={{ width: '100%', height: '300px' }}>
                            <ResponsiveContainer>
                                <BarChart layout="vertical" data={workloadData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }} onClick={handleBarClick} style={{ cursor: 'pointer' }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                                    <XAxis type="number" stroke="var(--text-muted)" />
                                    <YAxis dataKey="name" type="category" stroke="var(--text-muted)" />
                                    <Tooltip cursor={{ fill: 'var(--bg-primary)' }} contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                                    <Bar dataKey="pts" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={24}>
                                        {workloadData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill="var(--color-primary)" className="bar-hover-effect" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
                <div className={`card activity-container ${hideWorkloadChart ? 'w-100' : ''}`}>
                    <h3 className="section-title">Actividad Reciente</h3>
                    <ul className="activity-list">
                        {globalActivities.slice(0, 5).map(item => (
                            <li key={item.id} className="activity-item clickable-activity" onClick={() => navigate('/history')}>
                                <div className="activity-icon"><Clock size={16} /></div>
                                <div className="activity-content">
                                    <strong>{item.accion}</strong>
                                    <p className="activity-desc">
                                        <span className="activity-folio">{item.folio}</span> - {item.responsable}
                                    </p>
                                    <small>{item.fecha}</small>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Modal Agenda del Día */}
            {isAgendaOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '600px' }}>
                        <div className="modal-header">
                            <h2>Agenda del Día (Audiencias)</h2>
                            <button className="close-btn" onClick={() => setIsAgendaOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body p-0">
                            <table className="inventory-table">
                                <thead>
                                    <tr>
                                        <th>Folio</th>
                                        <th>Hora / Conexión</th>
                                        <th>Abogado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td className="fw-bold text-primary">RH/2025/0041</td><td>08:00 AM - Sala 1</td><td>Abg. Ruiz</td></tr>
                                    <tr><td className="fw-bold text-primary">CHJ/2025/0045</td><td>08:30 AM - Virtual</td><td>Abg. García</td></tr>
                                    {audiencias.map(a => (
                                        <tr key={a.id}>
                                            <td className="fw-bold text-primary">{a.expId}</td>
                                            <td>{a.audiencia}</td>
                                            <td>{a.lawyer}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Puntos de Complejidad */}
            {isPuntosOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '400px' }}>
                        <div className="modal-header">
                            <h2>Desglose de Complejidad</h2>
                            <button className="close-btn" onClick={() => setIsPuntosOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body p-0">
                            <table className="inventory-table">
                                <thead>
                                    <tr>
                                        <th>Tipo de Expediente</th>
                                        <th>Puntos Sustraídos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td className="fw-bold">Gestión RH</td><td>{ptsBreakdown.RH + 15} pts</td></tr>
                                    <tr><td className="fw-bold">Quejas VG</td><td>{ptsBreakdown.VG + 10} pts</td></tr>
                                    <tr><td className="fw-bold">Consejo Honor CHJ</td><td>{ptsBreakdown.CHJ + 20} pts</td></tr>
                                    <tr><td className="fw-bold">Servicio Prov. SP</td><td>{ptsBreakdown.SP + 5} pts</td></tr>
                                    <tr><td className="fw-bold">Contencioso CCC</td><td>{ptsBreakdown.CCC + 3} pts</td></tr>
                                </tbody>
                                <tfoot>
                                    <tr style={{ backgroundColor: 'var(--bg-primary)' }}>
                                        <td className="fw-bold text-right">TOTAL:</td>
                                        <td className="fw-bold text-primary">{totalPts} pts</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Drawer Próximos a Caducar */}
            {isCaducarOpen && (
                <div className="drawer-overlay" onClick={() => setIsCaducarOpen(false)}>
                    <div className="drawer-content" onClick={e => e.stopPropagation()}>
                        <div className="drawer-header">
                            <h2>Expedientes con Riesgo de Caducidad ({"<"} 5 días)</h2>
                            <button className="close-btn" onClick={() => setIsCaducarOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="drawer-body p-0">
                            <div className="p-4" style={{ padding: '16px' }}>
                                <p className="text-muted mb-3" style={{ marginBottom: '16px' }}>Total de expedientes críticos: {6 + caducarCases.length}</p>
                                <button className="btn btn-primary w-100 mb-4" onClick={() => navigate('/kanban')} style={{ width: '100%', marginBottom: '24px' }}>Ver en Tablero de Flujo</button>

                                <div className="feed-list" style={{ maxHeight: '100%' }}>
                                    {caducarCases.map(c => (
                                        <div key={c.id} className="feed-card" style={{ borderLeft: `4px solid ${c.urgency === 'critical' ? 'var(--color-danger)' : 'var(--color-warning)'}` }}>
                                            <div className="feed-card-header">
                                                <div className="feed-folio">{c.expId}</div>
                                                <div className="feed-badge" style={{ backgroundColor: c.urgency === 'critical' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(241, 196, 15, 0.1)', color: c.urgency === 'critical' ? 'var(--color-danger)' : 'var(--color-warning)' }}>Quedan {c.urgency === 'critical' ? '2' : '4'} días</div>
                                            </div>
                                            <div className="feed-card-body">
                                                <p className="text-muted" style={{ fontSize: '13px' }}>Abogado Asignado: <strong>{c.lawyer}</strong></p>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Mock padding */}
                                    <div className="feed-card" style={{ borderLeft: `4px solid var(--color-danger)` }}>
                                        <div className="feed-card-header"><div className="feed-folio">VG/2025/0333</div><div className="feed-badge text-danger" style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', color: 'var(--color-danger)' }}>Expira MAÑANA</div></div>
                                        <div className="feed-card-body"><p className="text-muted" style={{ fontSize: '13px' }}>Abogado Asignado: <strong>Abg. Sosa</strong></p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AbogadoDashboard = () => (
    <div className="dashboard-abogado">
        <div className="kpi-row">
            <div className="card kpi-card">
                <h3>Mis Expedientes Activos</h3>
                <p className="kpi-value">15</p>
            </div>
            <div className="card kpi-card">
                <h3>Puntos de Complejidad</h3>
                <p className="kpi-value">38 pts</p>
            </div>
            <div className="card kpi-card primary">
                <h3>Audiencias (7 días)</h3>
                <p className="kpi-value">3</p>
            </div>
            <div className="card kpi-card danger">
                <h3>Urgencias/Caducidades</h3>
                <p className="kpi-value">1</p>
            </div>
        </div>

        <div className="dashboard-main-row split-60-40">
            <div className="card">
                <h3 className="section-title">Mi Kanban Personal</h3>
                <div className="mini-kanban">
                    <div className="mini-col">
                        <h4>Por Atender (2)</h4>
                        <div className="mini-card outline-red">SP/2025/0888</div>
                    </div>
                    <div className="mini-col">
                        <h4>En Trámite (10)</h4>
                        <div className="mini-card outline-blue">RH/2025/0001</div>
                    </div>
                    <div className="mini-col">
                        <h4>Esperando Firma (3)</h4>
                    </div>
                </div>
            </div>
            <div className="card">
                <h3 className="section-title">Calendario Deportivo</h3>
                <p>No hay audiencias programadas para hoy.</p>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { role } = useAppContext();

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <h1>Dashboard Ejecutivo</h1>
                <p>Vista general de {role}</p>
            </div>

            {role === ROLES.JUD && <JudDashboard />}
            {role === ROLES.ADMINISTRATIVO && <JudDashboard hideWorkloadChart={true} />}
            {role === ROLES.ABOGADO && <AbogadoDashboard />}

        </div>
    );
};

export default Dashboard;
