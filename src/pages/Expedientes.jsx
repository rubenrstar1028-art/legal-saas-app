import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useAppContext, ROLES } from '../context/AppContext';
import './Expedientes.css';

const Expedientes = () => {
    const { cases, role, activeUser } = useAppContext();
    const [searchWord, setSearchWord] = useState('');
    const [filterType, setFilterType] = useState('Todos');
    const [filterCorp, setFilterCorp] = useState('Todas');

    // RBAC Restrictions
    const canCreate = role === ROLES.JUD || role === ROLES.ABOGADO;
    const canEdit = (itemLawyer) => role === ROLES.JUD || (role === ROLES.ABOGADO && itemLawyer === activeUser);
    const canDelete = role === ROLES.JUD;

    const filteredCases = cases.filter(c => {
        const matchSearch = c.expId.toLowerCase().includes(searchWord.toLowerCase()) || c.lawyer.toLowerCase().includes(searchWord.toLowerCase());
        const matchType = filterType === 'Todos' || c.type === filterType;
        const matchCorp = filterCorp === 'Todas' || (c.corporacion && c.corporacion === filterCorp);
        return matchSearch && matchType && matchCorp;
    });

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div>
                    <h1>Directorio Maestro de Expedientes</h1>
                    <p>Base de datos central con todos los registros activos e inactivos</p>
                </div>
                {canCreate && (
                    <button className="btn btn-primary">
                        <Plus size={18} />
                        Nuevo Expediente
                    </button>
                )}
            </div>

            <div className="card expedientes-container">
                <div className="table-filters">
                    <div className="search-bar" style={{ maxWidth: '350px' }}>
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por Folio o Abogado..."
                            className="search-input"
                            value={searchWord}
                            onChange={(e) => setSearchWord(e.target.value)}
                        />
                    </div>

                    <div className="dropdowns">
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
                            <span className="filter-label"><Filter size={14} /> Corp:</span>
                            <select className="filter-select" value={filterCorp} onChange={e => setFilterCorp(e.target.value)}>
                                <option>Todas</option>
                                <option>P.P</option>
                                <option>P.A</option>
                                <option>P.B.I</option>
                            </select>
                        </div>
                    </div>
                </div>

                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Folio</th>
                            <th>Tipo</th>
                            <th>Corporación</th>
                            <th>Abogado Asignado</th>
                            <th>Fecha Registro</th>
                            <th>Estatus Actual</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCases.map((c) => (
                            <tr key={c.id}>
                                <td className="fw-bold text-primary">{c.expId}</td>
                                <td>{c.type}</td>
                                <td>{c.corporacion || 'N/A'}</td>
                                <td>{c.lawyer}</td>
                                <td>{c.date}</td>
                                <td>
                                    <span className={`status-badge ${c.urgency === 'critical' ? 'danger' : c.urgency === 'warning' ? 'warning' : 'success'}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="row-actions">
                                        <button className="icon-btn" title="Ver Detalle"><Eye size={16} /></button>
                                        {canEdit(c.lawyer) && (
                                            <button className="icon-btn text-primary" title="Editar"><Edit2 size={16} /></button>
                                        )}
                                        {canDelete && (
                                            <button className="icon-btn text-danger" title="Eliminar"><Trash2 size={16} /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredCases.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                                    No se encontraron expedientes.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Expedientes;
