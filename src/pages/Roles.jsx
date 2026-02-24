import React from 'react';
import { Shield, Edit, Trash2 } from 'lucide-react';
import { useAppContext, ROLES } from '../context/AppContext';
import './Roles.css';

const users = [
    { name: 'Dra. Elena Vargas', email: 'evargas@juzgado.gob', role: 'JUD', lastAccess: 'Hace 5 min', status: 'Activo' },
    { name: 'Lic. Juan Pérez', email: 'jperez@juzgado.gob', role: 'Administrativo', lastAccess: 'Hace 1 hora', status: 'Activo' },
    { name: 'Abg. Roberto Ruiz', email: 'rruiz@juzgado.gob', role: 'Abogado', lastAccess: 'Ayer', status: 'Activo' },
    { name: 'Abg. María Sosa', email: 'msosa@juzgado.gob', role: 'Abogado', lastAccess: 'Hace 3 días', status: 'Inactivo' },
];

const Roles = () => {
    const { role } = useAppContext();
    const canManageRoles = role === ROLES.JUD;

    return (
        <div className="page-wrapper">
            <div className="page-header roles-header">
                <div>
                    <h1>Gestión de Roles y Accesos</h1>
                    <p>Administración del personal y permisos del sistema</p>
                </div>
                {canManageRoles && <button className="btn btn-primary">Nuevo Usuario</button>}
            </div>

            <div className="kpi-row">
                <div className="card role-stat-card">
                    <div className="role-stat-icon jud">
                        <Shield size={24} />
                    </div>
                    <div className="role-stat-info">
                        <h3>JUD (Total)</h3>
                        <p>1 Usuario</p>
                    </div>
                </div>
                <div className="card role-stat-card">
                    <div className="role-stat-icon admin">
                        <Shield size={24} />
                    </div>
                    <div className="role-stat-info">
                        <h3>Administrativo (Archivo)</h3>
                        <p>3 Usuarios</p>
                    </div>
                </div>
                <div className="card role-stat-card">
                    <div className="role-stat-icon abogado">
                        <Shield size={24} />
                    </div>
                    <div className="role-stat-info">
                        <h3>Abogado (Ejecución)</h3>
                        <p>8 Usuarios</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="table-filters" style={{ justifyContent: 'space-between', marginBottom: '16px' }}>
                    <input type="text" placeholder="Buscar usuario por nombre o email..." className="search-input" style={{ maxWidth: '400px' }} />
                    <select className="filter-select">
                        <option>Filtrar por Rol</option>
                        <option>JUD</option>
                        <option>Administrativo</option>
                        <option>Abogado</option>
                    </select>
                </div>
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Último Acceso</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, i) => (
                            <tr key={i}>
                                <td className="fw-bold">{u.name}</td>
                                <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                                <td>
                                    <span className={`role-badge ${u.role.toLowerCase()}`}>{u.role}</span>
                                </td>
                                <td>{u.lastAccess}</td>
                                <td>
                                    <span className={`status-badge ${u.status === 'Activo' ? 'success' : 'neutral'}`}>{u.status}</span>
                                </td>
                                <td>
                                    {canManageRoles ? (
                                        <div className="row-actions">
                                            <button className="icon-btn"><Edit size={16} /></button>
                                            <button className="icon-btn text-danger"><Trash2 size={16} /></button>
                                        </div>
                                    ) : (
                                        <span className="text-muted" style={{ fontSize: '12px' }}>Sin permisos</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Roles;
