import React, { useState } from 'react';
import { Search, Filter, History, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './GlobalHistory.css';

const GlobalHistory = () => {
    const { globalActivities } = useAppContext();

    // States for filters
    const [filterCorp, setFilterCorp] = useState('Todas');
    const [filterType, setFilterType] = useState('Todos');
    const [filterWord, setFilterWord] = useState('');

    // Derived metrics
    const todayActs = globalActivities.filter(a => a.fecha.startsWith('2023-10-25')).length;
    const countPP = globalActivities.filter(a => a.corporacion === 'P.P').length;
    const countPA = globalActivities.filter(a => a.corporacion === 'P.A').length;
    const countPBI = globalActivities.filter(a => a.corporacion === 'P.B.I').length;
    const latestActivity = globalActivities[0];

    // Filtering Logic
    const filteredActivities = globalActivities.filter(item => {
        const matchCorp = filterCorp === 'Todas' || item.corporacion === filterCorp;
        const matchType = filterType === 'Todos' || item.tipo === filterType;
        const matchWord = item.folio.toLowerCase().includes(filterWord.toLowerCase()) ||
            item.responsable.toLowerCase().includes(filterWord.toLowerCase());
        return matchCorp && matchType && matchWord;
    });

    return (
        <div className="page-wrapper">
            <div className="page-header history-header">
                <div>
                    <h1>Historial Global de Actuaciones</h1>
                    <p>Módulo de auditoría y seguimiento en tiempo real del área</p>
                </div>
            </div>

            {/* Tarjetas de Resumen Estadístico */}
            <div className="kpi-row">
                <div className="card stat-card">
                    <div className="stat-info">
                        <h3>Actuaciones Hoy</h3>
                        <p className="kpi-value">{todayActs}</p>
                    </div>
                    <History size={32} className="stat-icon-bg" />
                </div>
                <div className="card stat-card">
                    <div className="stat-info">
                        <h3>Movimiento por Corporación</h3>
                        <div className="corp-stats">
                            <span>P.P: <strong>{countPP}</strong></span>
                            <span>P.A: <strong>{countPA}</strong></span>
                            <span>P.B.I: <strong>{countPBI}</strong></span>
                        </div>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="stat-info">
                        <h3>Último Cambio</h3>
                        <p className="latest-change">{latestActivity.folio} - {latestActivity.accion}</p>
                        <small>{latestActivity.fecha}</small>
                    </div>
                </div>
            </div>

            {/* Filtros Avanzados */}
            <div className="card filters-container">
                <div className="search-bar" style={{ maxWidth: '300px' }}>
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar folio o abogado..."
                        className="search-input"
                        value={filterWord}
                        onChange={(e) => setFilterWord(e.target.value)}
                    />
                </div>

                <div className="dropdowns">
                    <div className="filter-group">
                        <span className="filter-label"><Filter size={14} /> Corporación:</span>
                        <select className="filter-select" value={filterCorp} onChange={e => setFilterCorp(e.target.value)}>
                            <option>Todas</option>
                            <option>P.P</option>
                            <option>P.A</option>
                            <option>P.B.I</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <span className="filter-label"><Filter size={14} /> Tipo:</span>
                        <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                            <option>Todos</option>
                            <option>RH</option>
                            <option>CHJ</option>
                            <option>VG</option>
                            <option>SP</option>
                            <option>CCC</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <span className="filter-label">Fecha:</span>
                        <input type="date" className="filter-select" />
                    </div>
                </div>
            </div>

            {/* Panel Central de Actividad (Feed) */}
            <div className="card activity-feed-container">
                <h3 className="section-title">Feed de Actividad Reciente</h3>

                <div className="feed-list">
                    {filteredActivities.map((act) => (
                        <div key={act.id} className="feed-card">
                            <div className="feed-card-header">
                                <div>
                                    <a href={`/case/${act.folio}`} className="feed-folio">{act.folio} <ChevronRight size={14} /></a>
                                    <div className="feed-badges">
                                        <span className="feed-badge type">{act.tipo}</span>
                                        <span className="feed-badge corp">{act.corporacion}</span>
                                    </div>
                                </div>
                                <div className="feed-time">{act.fecha}</div>
                            </div>
                            <div className="feed-card-body">
                                <p className="feed-action"><strong>{act.accion}</strong></p>
                                <p className="feed-responsable">Registrado por: <em>{act.responsable}</em></p>
                            </div>
                        </div>
                    ))}
                    {filteredActivities.length === 0 && <p className="empty-message">No se encontraron actuaciones con los filtros actuales.</p>}
                </div>
            </div>
        </div>
    );
};

export default GlobalHistory;
