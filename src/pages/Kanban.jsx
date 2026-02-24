import React, { useState } from 'react';
import { useAppContext, ROLES } from '../context/AppContext';
import './Kanban.css';

const initialCards = [
    { id: '1', expId: 'RH/2025/0001', pts: 15, lawyer: 'Abg. Martínez', status: 'Backlog', urgency: 'normal' },
    { id: '2', expId: 'VG/2025/0045', pts: 8, lawyer: 'Abg. Ruiz', status: 'Ready', urgency: 'warning' },
    { id: '3', expId: 'CHJ/2025/0122', pts: 25, lawyer: 'Abg. García', status: 'In Progress', urgency: 'critical' },
    { id: '4', expId: 'SP/2025/0088', pts: 12, lawyer: 'Abg. Sosa', status: 'Blocked', urgency: 'critical' },
    { id: '5', expId: 'CCC/2025/0005', pts: 5, lawyer: 'Abg. Martínez', status: 'Done', urgency: 'normal' },
    { id: '6', expId: 'RH/2025/0099', pts: 18, lawyer: 'Abg. García', status: 'Backlog', urgency: 'warning' },
];

const columns = [
    { id: 'Backlog', title: 'Backlog (Recepción)' },
    { id: 'Ready', title: 'Listo para Audiencia' },
    { id: 'In Progress', title: 'En Trámite' },
    { id: 'Blocked', title: 'Bloqueado (Falta Firma)' },
    { id: 'Done', title: 'Finalizado (Dictamen)' },
];

const Kanban = () => {
    const { addActivity, role, activeUser } = useAppContext();
    const [cards, setCards] = useState(initialCards);

    const canMoveCard = (cardLawyer) => role === ROLES.JUD || (role === ROLES.ABOGADO && cardLawyer === activeUser);

    // Status indicators based on urgency
    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'critical': return 'var(--color-danger)';
            case 'warning': return 'var(--color-warning)';
            default: return 'var(--color-success)';
        }
    };

    const moveCard = (cardId, direction) => {
        // Basic mock implementation of moving a card left or right
        setCards(cards.map(card => {
            if (card.id === cardId) {
                const currentIndex = columns.findIndex(col => col.id === card.status);
                const nextIndex = currentIndex + direction;
                if (nextIndex >= 0 && nextIndex < columns.length) {
                    addActivity({
                        folio: card.expId,
                        tipo: 'RH',
                        corporacion: 'P.P',
                        accion: `Movido a ${columns[nextIndex].title}`,
                        responsable: role,
                        fecha: new Date().toISOString().replace('T', ' ').substring(0, 19)
                    });
                    return { ...card, status: columns[nextIndex].id };
                }
            }
            return card;
        }));
    };

    // Drag & Drop Handlers
    const handleDragStart = (e, card) => {
        if (!canMoveCard(card.lawyer)) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.setData('cardId', card.id);
    };

    const handleDrop = (e, columnId) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('cardId');
        if (cardId) {
            const cardToMove = cards.find(c => c.id === cardId);
            if (cardToMove && cardToMove.status !== columnId) {
                // Find column titles for the activity log
                const targetColTitle = columns.find(c => c.id === columnId)?.title || columnId;

                setCards(cards.map(card => {
                    if (card.id === cardId) {
                        return { ...card, status: columnId };
                    }
                    return card;
                }));

                addActivity({
                    folio: cardToMove.expId,
                    tipo: 'Movimiento',
                    corporacion: 'N/A',
                    accion: `Movido vía Drag & Drop a ${targetColTitle}`,
                    responsable: role,
                    fecha: new Date().toISOString().replace('T', ' ').substring(0, 19)
                });
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <h1>Tablero Kanban Jurídico</h1>
                <p>Vista 1920x1080 Widescreen - Flujo de trabajo horizontal</p>
            </div>

            <div className="kanban-board">
                {columns.map(col => {
                    const colCards = cards.filter(c => c.status === col.id);
                    return (
                        <div
                            key={col.id}
                            className="kanban-column"
                            onDrop={(e) => handleDrop(e, col.id)}
                            onDragOver={handleDragOver}
                        >
                            <div className="column-header">
                                <h3>{col.title}</h3>
                                <span className="card-count">{colCards.length}</span>
                            </div>
                            <div className="column-content">
                                {colCards.map(card => (
                                    <div
                                        key={card.id}
                                        className={`kanban-card ${canMoveCard(card.lawyer) ? 'draggable' : ''}`}
                                        style={{ borderLeftColor: getUrgencyColor(card.urgency) }}
                                        draggable={canMoveCard(card.lawyer)}
                                        onDragStart={(e) => handleDragStart(e, card)}
                                    >
                                        <div className="card-top">
                                            <span className="card-exp-id">{card.expId}</span>
                                            <div className="pts-badge">{card.pts}</div>
                                        </div>
                                        <div className="card-bottom">
                                            <div className="lawyer-info">
                                                <div className="tiny-avatar">{card.lawyer.charAt(4)}</div>
                                                <span>{card.lawyer}</span>
                                            </div>
                                            <div className="card-actions">
                                                {canMoveCard(card.lawyer) && (
                                                    <>
                                                        {col.id !== 'Backlog' && <button onClick={() => moveCard(card.id, -1)}>←</button>}
                                                        {col.id !== 'Done' && <button onClick={() => moveCard(card.id, 1)}>→</button>}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Kanban;
