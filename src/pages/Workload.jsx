import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import './Workload.css';

const Workload = () => {
    const { cases } = useAppContext();
    const location = useLocation();

    // Initial filter from navigation state
    const initialLawyerFilter = location.state?.selectedLawyer || 'Todos los Abogados';
    const [filterLawyer, setFilterLawyer] = useState(initialLawyerFilter);
    const [searchWord, setSearchWord] = useState('');

    useEffect(() => {
        if (location.state?.selectedLawyer) {
            setFilterLawyer(location.state.selectedLawyer);
        }
    }, [location.state]);

    // Compute dynamic lawyer stats from global cases
    const lawyerNames = ['Abg. Martínez', 'Abg. Ruiz', 'Abg. García', 'Abg. Sosa'];

    const lawyers = lawyerNames.map(name => {
        const theirCases = cases.filter(c => c.lawyer === name);
        const pts = theirCases.reduce((acc, c) => acc + c.pts, 0);
        return {
            name,
            load: theirCases.length,
            pts: pts,
            avatar: name.split(' ')[1].charAt(0)
        };
    });

    const filteredInventory = cases.filter(c => {
        const matchLawyer = filterLawyer === 'Todos los Abogados' || c.lawyer === filterLawyer;
        const matchSearch = c.expId.toLowerCase().includes(searchWord.toLowerCase()) || c.type.toLowerCase().includes(searchWord.toLowerCase());
        return matchLawyer && matchSearch;
    });

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <h1>Mi Carga de Trabajo / Inventario</h1>
                <p>Vista detallada de activos y carga por abogado</p>
            </div>

            {/* Tarjetas de Abogados */}
            <div className="lawyer-cards-grid">
                {lawyers.map((l, i) => (
                    <div className="card lawyer-card" key={i}>
                        <div className="lawyer-card-left">
                            <div className="lawyer-avatar">{l.avatar}</div>
                            <div className="lawyer-info-text">
                                <h3>{l.name}</h3>
                                <p>{l.load} Expedientes en Poder</p>
                            </div>
                        </div>
                        <div className="lawyer-card-right">
                            <div className="pts-circle">
                                <span className="pts-value">{l.pts}</span>
                                <span className="pts-label">PTS</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabla de Inventario Detallada */}
            <div className="card archive-table-container">
                <div className="table-filters" style={{ justifyContent: 'space-between' }}>
                    <div className="search-bar" style={{ maxWidth: '400px' }}>
                        <input type="text" placeholder="Buscar por ID o Tipo..." className="search-input" value={searchWord} onChange={e => setSearchWord(e.target.value)} />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <select className="filter-select" value={filterLawyer} onChange={e => setFilterLawyer(e.target.value)}>
                            <option>Todos los Abogados</option>
                            {lawyerNames.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <button className="btn btn-primary" style={{ backgroundColor: '#27ae60' }}>
                            <Download size={18} />
                            Exportar Inventario (Excel)
                        </button>
                    </div>
                </div>

                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>ID Expediente</th>
                            <th>Tipo / Complejidad</th>
                            <th>Abogado Asignado</th>
                            <th>Estatus y Urgencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.map((item, index) => (
                            <tr key={index}>
                                <td className="fw-bold">{item.expId}</td>
                                <td>{item.type} ({item.pts} pts)</td>
                                <td>{item.lawyer}</td>
                                <td>
                                    <span className={`status-badge ${item.urgency === 'critical' ? 'danger' : item.urgency === 'warning' ? 'warning' : 'success'}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {filteredInventory.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                                    No se encontraron expedientes con los filtros actuales.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Workload;
