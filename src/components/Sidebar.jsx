import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Columns, Archive, Briefcase, BarChart2, Shield, CalendarDays, FileText } from 'lucide-react';
import { useAppContext, ROLES } from '../context/AppContext';
import './Sidebar.css';

const Sidebar = () => {
    const { role, setRole } = useAppContext();

    // Define links based on role
    const getLinks = () => {
        switch (role) {
            case ROLES.ADMINISTRATIVO:
                return [
                    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
                    { to: '/turnado', icon: FileText, label: 'Carga y Turnado' },
                    { to: '/expedientes', icon: FileText, label: 'Expedientes Totales' },
                    { to: '/archive', icon: Archive, label: 'Archivo Físico' },
                    { to: '/qr-inventory', icon: Briefcase, label: 'Inventario QR' },
                    { to: '/calendar', icon: CalendarDays, label: 'Calendario Audiencias' },
                ];
            case ROLES.ABOGADO:
                return [
                    { to: '/', icon: LayoutDashboard, label: 'Mi Tablero' },
                    { to: '/expedientes', icon: FileText, label: 'Buscador Expedientes' },
                    { to: '/kanban', icon: Columns, label: 'Mis Expedientes' },
                    { to: '/calendar', icon: CalendarDays, label: 'Mi Calendario' },
                ];
            case ROLES.JUD:
            default:
                return [
                    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
                    { to: '/turnado', icon: FileText, label: 'Carga y Turnado' },
                    { to: '/expedientes', icon: FileText, label: 'Expedientes' },
                    { to: '/kanban', icon: Columns, label: 'Tablero de Flujo' },
                    { to: '/archive', icon: Archive, label: 'Archivo Físico' },
                    { to: '/calendar', icon: CalendarDays, label: 'Calendario' },
                    { to: '/workload', icon: Briefcase, label: 'Mi Carga de Trabajo' },
                    { to: '/history', icon: Briefcase, label: 'Historial Global' },
                    { to: '/reports', icon: BarChart2, label: 'Reportes' },
                    { to: '/roles', icon: Shield, label: 'Gestión de Roles' },
                ];
        }
    };

    const links = getLinks();

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">⚖️</div>
                <h2>LegalSaaS</h2>
            </div>
            <nav className="sidebar-nav">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            <span>{link.label}</span>
                        </NavLink>
                    );
                })}
            </nav>
            {/* Role Switcher for Demo Purposes */}
            <div className="role-switcher-demo">
                <p className="demo-label">Simular Rol (Demo):</p>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="role-select"
                >
                    {Object.values(ROLES).map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </div>
        </aside >
    );
};

export default Sidebar;
