import React, { useState } from 'react';
import { Search, Moon, Sun, Bell, QrCode } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Header.css';

const Header = () => {
    const { isDarkMode, toggleDarkMode, toggleQRModal, role, activeUser, visibleNotifications } = useAppContext();
    const [isNotiOpen, setIsNotiOpen] = useState(false);

    return (
        <header className="header">
            <div className="header-left">
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar expediente, actor, oficio..."
                        className="search-input"
                    />
                </div>
                <button className="btn btn-primary qr-btn" onClick={toggleQRModal}>
                    <QrCode size={18} />
                    Escanear QR
                </button>
            </div>

            <div className="header-right">
                <button className="icon-btn" onClick={toggleDarkMode} title="Alternar Modo Oscuro">
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className="icon-btn notification-btn" onClick={() => setIsNotiOpen(!isNotiOpen)}>
                    <Bell size={20} />
                    {visibleNotifications.length > 0 && <span className="badge">{visibleNotifications.length}</span>}
                </button>
                {isNotiOpen && (
                    <div className="notifications-dropdown">
                        <h3>Centro de Notificaciones</h3>
                        {visibleNotifications.length === 0 ? (
                            <p className="empty-noti">No hay alertas nuevas.</p>
                        ) : (
                            <ul className="noti-list">
                                {visibleNotifications.map(n => (
                                    <li key={n.id} className="noti-item">
                                        <div className="noti-dot"></div>
                                        <div>
                                            <p>{n.message}</p>
                                            <small>Para: {n.lawyer}</small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
                <div className="user-profile">
                    <div className="avatar">{activeUser.charAt(0)}</div>
                    <div className="user-info">
                        <span className="user-name">{activeUser}</span>
                        <span className="user-role">{role}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
