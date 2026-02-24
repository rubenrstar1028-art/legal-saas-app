import React from 'react';
import { Download, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import './Reports.css';

const sixMonthData = [
    { month: 'Jun', resueltos: 30, ingresados: 45 },
    { month: 'Jul', resueltos: 42, ingresados: 38 },
    { month: 'Ago', resueltos: 50, ingresados: 55 },
    { month: 'Sep', resueltos: 65, ingresados: 40 },
    { month: 'Oct', resueltos: 55, ingresados: 42 },
    { month: 'Nov', resueltos: 80, ingresados: 60 },
];

const statusData = [
    { name: 'Finalizados', value: 400, color: '#2ECC71' },
    { name: 'En Trámite', value: 300, color: '#3498DB' },
    { name: 'Bloqueados', value: 100, color: '#E74C3C' },
];

const productivityData = [
    { name: 'Abg. García', cerrados: 85 },
    { name: 'Abg. Ruiz', cerrados: 120 },
    { name: 'Abg. Sosa', cerrados: 45 },
    { name: 'Abg. Martínez', cerrados: 90 },
];

const Reports = () => {
    return (
        <div className="page-wrapper">
            <div className="page-header archive-header">
                <div>
                    <h1>Reportes y Analítica</h1>
                    <p>Métricas de productividad y flujo del área</p>
                </div>
            </div>

            {/* Filtros Superiores */}
            <div className="card report-filters">
                <div className="filter-group">
                    <select className="filter-select"><option>Últimos 6 Meses</option></select>
                    <select className="filter-select"><option>Todos los Abogados</option></select>
                    <select className="filter-select"><option>Todos los Juicios</option></select>
                </div>
                <div className="report-actions">
                    <button className="btn btn-danger"><FileText size={16} /> Exportar PDF</button>
                    <button className="btn btn-success" style={{ backgroundColor: '#27ae60' }}><Download size={16} /> Exportar Excel</button>
                </div>
            </div>

            {/* Gráfica Principal Evolución */}
            <div className="card chart-card main-chart">
                <h3 className="section-title">Evolución de Expedientes: Resueltos vs Ingresados</h3>
                <div style={{ width: '100%', height: '350px' }}>
                    <ResponsiveContainer>
                        <AreaChart data={sixMonthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorResueltos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorIngresados" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--text-muted)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--text-muted)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="var(--text-muted)" />
                            <YAxis stroke="var(--text-muted)" />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                            <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="ingresados" stroke="var(--text-muted)" fillOpacity={1} fill="url(#colorIngresados)" />
                            <Area type="monotone" dataKey="resueltos" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorResueltos)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Fila Inferior 50/50 */}
            <div className="dashboard-main-row split-50">
                <div className="card chart-card">
                    <h3 className="section-title">Distribución de Estatus Actual</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Custom Legend */}
                    <div className="custom-legend">
                        {statusData.map(d => (
                            <div key={d.name} className="legend-item">
                                <div className="legend-color" style={{ backgroundColor: d.color }}></div>
                                <span>{d.name} ({d.value})</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card chart-card">
                    <h3 className="section-title">Productividad: Expedientes Cerrados</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <BarChart data={productivityData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                                <XAxis type="number" stroke="var(--text-muted)" />
                                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" />
                                <RechartsTooltip cursor={{ fill: 'var(--bg-primary)' }} contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                                <Bar dataKey="cerrados" fill="var(--color-success)" radius={[0, 4, 4, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
