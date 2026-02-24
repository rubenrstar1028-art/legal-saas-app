import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './QRModal.css';

const QRModal = () => {
    const { isQRModalOpen, toggleQRModal, addActivity, role } = useAppContext();
    const [scanned, setScanned] = useState(false);

    if (!isQRModalOpen) return null;

    const simulateScan = () => {
        setTimeout(() => setScanned(true), 1500);
    };

    const handleConfirm = () => {
        addActivity({
            folio: 'RH/2025/0001',
            tipo: 'RH',
            corporacion: 'P.A',
            accion: 'Control Archivo: Entrada/Salida',
            responsable: role,
            fecha: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
        alert('Movimiento registrado exitosamente.');
        setScanned(false);
        toggleQRModal();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Registrar Movimiento Físico</h2>
                    <button className="close-btn" onClick={toggleQRModal}><X size={20} /></button>
                </div>

                <div className="modal-body">
                    {/* Cámara Feed simulado */}
                    <div className="scan-area">
                        {!scanned ? (
                            <div className="camera-feed" onClick={simulateScan}>
                                <div className="scan-frame"></div>
                                <Camera size={48} className="camera-icon" />
                                <p>Coloque el código QR del expediente frente a la cámara (Click to simulate)</p>
                            </div>
                        ) : (
                            <div className="scan-success">
                                <div className="success-circle">✓</div>
                                <p>Código detectado</p>
                            </div>
                        )}
                    </div>

                    {/* Formulario / Confirmación */}
                    <div className="action-area">
                        {scanned ? (
                            <div className="form-container">
                                <div className="pre-filled">
                                    <p><strong>Expediente:</strong> RH/2025/0001</p>
                                    <p><strong>Actor:</strong> López vs. Empresa S.A.</p>
                                </div>
                                <div className="form-group">
                                    <label>Acción</label>
                                    <select className="form-select">
                                        <option>Entrada a Archivo</option>
                                        <option>Salida a Abogado</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Destino (Si es Salida)</label>
                                    <input type="text" className="form-input" placeholder="Buscar Abogado..." defaultValue="Abg. Martínez" />
                                </div>
                                <div className="modal-actions">
                                    <button className="btn btn-outline" onClick={() => setScanned(false)}>Cancelar</button>
                                    <button className="btn btn-success" onClick={handleConfirm}>Confirmar Registro</button>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>Esperando lectura del código QR...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRModal;
