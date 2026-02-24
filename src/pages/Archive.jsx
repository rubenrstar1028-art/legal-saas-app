import React from 'react';
import { Search, FileDown } from 'lucide-react';
import './Archive.css';

const mockInventory = [
    { id: 'RH/2025/0001', location: 'Abg. Martínez', date: '12 Oct 2023', days: 8, status: 'Demorado' },
    { id: 'VG/2025/0045', location: 'En Archivo Central', date: '-', days: 0, status: 'Disponible' },
    { id: 'CHJ/2025/0122', location: 'Abg. García', date: '18 Oct 2023', days: 2, status: 'A tiempo' },
    { id: 'SP/2025/0088', location: 'Abg. Ruiz', date: '14 Oct 2023', days: 6, status: 'Demorado' },
    { id: 'CCC/2025/0005', location: 'Juzgado 5to', date: '20 Oct 2023', days: 0, status: 'A tiempo' },
];

const Archive = () => {
    return (
        <div className="page-wrapper">
            <div className="page-header archive-header">
                <div>
                    <h1>Archivo Físico / Inventario</h1>
                    <p>Control de ubicación y préstamos de expedientes</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary">
                        <FileDown size={18} />
                        Exportar Inventario (Excel)
                    </button>
                </div>
            </div>

            <div className="card archive-table-container">
                <div className="table-filters">
                    <div className="search-bar" style={{ maxWidth: '300px' }}>
                        <Search size={16} className="search-icon" />
                        <input type="text" placeholder="Filtrar por Expediente o Abogado..." className="search-input" />
                    </div>
                    <select className="filter-select">
                        <option>Todos los Estatus</option>
                        <option>Demorado</option>
                        <option>A tiempo</option>
                        <option>Disponible</option>
                    </select>
                </div>

                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>ID Expediente</th>
                            <th>Ubicación / Poseedor</th>
                            <th>Fecha de Salida</th>
                            <th>Días Transcurridos</th>
                            <th>Estatus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockInventory.map((item, index) => (
                            <tr key={index}>
                                <td className="fw-bold">{item.id}</td>
                                <td>
                                    <div className="poseedor-cell">
                                        {item.location !== 'En Archivo Central' && <div className="tiny-avatar">{item.location.charAt(4) || 'J'}</div>}
                                        {item.location}
                                    </div>
                                </td>
                                <td>{item.date}</td>
                                <td>{item.days > 0 ? `${item.days} días` : '-'}</td>
                                <td>
                                    <span className={`status-badge ${item.status === 'Demorado' ? 'danger' : item.status === 'A tiempo' ? 'success' : 'neutral'}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Archive;
