import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const ROLES = {
  JUD: 'JUD',
  ADMINISTRATIVO: 'Administrativo',
  ABOGADO: 'Abogado',
};

export const VALID_TYPES = ['RH', 'CHJ', 'VG', 'SP', 'CCC'];

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState(ROLES.JUD);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Global Activity Feed
  const [globalActivities, setGlobalActivities] = useState([
    { id: 1, folio: 'RH/2025/0001', tipo: 'RH', corporacion: 'P.P', accion: 'Resolución subida', responsable: 'Abg. García', fecha: '2023-10-25 10:15:00' },
    { id: 2, folio: 'CHJ/2025/0045', tipo: 'CHJ', corporacion: 'P.A', accion: 'Cambio de Estatus a Listo', responsable: 'JUD', fecha: '2023-10-25 09:30:00' },
    { id: 3, folio: 'VG/2025/0102', tipo: 'VG', corporacion: 'P.B.I', accion: 'Expediente Físico Solicitado', responsable: 'Abg. Martínez', fecha: '2023-10-25 08:00:00' },
  ]);

  const addActivity = (activity) => {
    setGlobalActivities(prev => [{ id: Date.now(), ...activity }, ...prev]);
  };

  // Mock Active User Identity based on Role
  const activeUser = role === ROLES.JUD ? 'Dra. Elena Vargas (JUD)' : role === ROLES.ADMINISTRATIVO ? 'Lic. Juan Pérez' : 'Abg. García';

  // Global Cases Data
  const [cases, setCases] = useState([
    { id: '1', expId: 'RH/2025/0001', pts: 15, lawyer: 'Abg. Martínez', status: 'Backlog', urgency: 'normal', type: 'RH', deadline: '2026-02-15', audiencia: null, date: '12 Oct 2023' },
    { id: '2', expId: 'VG/2025/0045', pts: 8, lawyer: 'Abg. Ruiz', status: 'Ready', urgency: 'warning', type: 'VG', deadline: '2026-02-20', audiencia: '10:00 AM - Sala 3', date: '01 Nov 2023' },
    { id: '3', expId: 'CHJ/2025/0122', pts: 25, lawyer: 'Abg. García', status: 'In Progress', urgency: 'critical', type: 'CHJ', deadline: '2026-02-22', audiencia: '12:30 PM - Zoom', date: '18 Oct 2023' },
    { id: '4', expId: 'SP/2025/0088', pts: 12, lawyer: 'Abg. Sosa', status: 'Blocked', urgency: 'critical', type: 'SP', deadline: '2026-02-25', audiencia: '09:00 AM - Sala 1', date: '10 Oct 2023' },
    { id: '5', expId: 'CCC/2025/0005', pts: 5, lawyer: 'Abg. Martínez', status: 'Done', urgency: 'normal', type: 'CCC', deadline: '2026-02-28', audiencia: null, date: '15 Sep 2023' },
    { id: '6', expId: 'RH/2025/0099', pts: 18, lawyer: 'Abg. García', status: 'Backlog', urgency: 'warning', type: 'RH', deadline: '2026-02-10', audiencia: null, date: '20 Oct 2023' },
    { id: '7', expId: 'VG/2025/0101', pts: 10, lawyer: 'Abg. Ruiz', status: 'Ready', urgency: 'critical', type: 'VG', corporacion: 'P.A', deadline: '2026-02-18', audiencia: '11:00 AM - Sala 2', date: '05 Oct 2023' },
    { id: '8', expId: 'CHJ/2025/0102', pts: 22, lawyer: 'Abg. Sosa', status: 'In Progress', urgency: 'warning', type: 'CHJ', corporacion: 'P.P', deadline: '2026-02-20', audiencia: '14:00 PM - Virtual', date: '08 Oct 2023' },
  ]);

  const [notifications, setNotifications] = useState([]);

  // Smart Alerts Logic: Generate notifications based on upcoming hearings
  useEffect(() => {
    // Mock logic: Find hearings within the next 24h (mocked visually)
    const newNotifications = cases
      .filter(c => c.audiencia)
      .map(c => ({
        id: `noti-${c.id}`,
        message: `Recordatorio: Tienes una audiencia MAÑANA para el expediente ${c.expId} a las ${c.audiencia.split('-')[0].trim()}`,
        lawyer: c.lawyer,
        isRead: false
      }));
    setNotifications(newNotifications);
  }, [cases]);

  const visibleNotifications = notifications.filter(n => role === ROLES.JUD || n.lawyer === activeUser);

  const updateCaseStatus = (caseId, newStatus) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: newStatus } : c));
  };

  // Case Parsing & Addition Logic (Área Hood)
  const addParsedCases = (folios) => {
    const ptsMap = { 'RH': 15, 'CHJ': 25, 'VG': 10, 'SP': 12, 'CCC': 5 };

    // Validate formatting before saving any
    const invalidFolios = folios.filter(folio => {
      const parts = folio.split('/');
      return parts.length !== 3 || !VALID_TYPES.includes(parts[0].toUpperCase());
    });

    if (invalidFolios.length > 0) {
      return { success: false, error: `Nomenclatura no válida encontrada: ${invalidFolios.join(', ')}. Use el formato TIPO/AÑO/FOLIO (Ej. RH/2025/0001) con tipos válidos: ${VALID_TYPES.join(', ')}` };
    }

    const newCases = folios.map((folio, idx) => {
      const typeStr = folio.split('/')[0].toUpperCase();
      const pts = ptsMap[typeStr];

      return {
        id: `cnew-${Date.now()}-${idx}`,
        expId: folio,
        pts: pts,
        lawyer: 'Pendiente', // Pendiente por Turnar
        status: 'Backlog',
        urgency: 'normal',
        type: typeStr,
        corporacion: 'P.A',
        deadline: '2023-11-30',
        audiencia: null,
        date: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
      };
    });

    setCases(prev => [...newCases, ...prev]);

    addActivity({
      folio: newCases.length > 1 ? `Lote de ${newCases.length} Folios` : folios[0],
      tipo: 'Varios',
      corporacion: 'P.A',
      accion: 'Carga de Expediente(s) (Pendiente por Turnar)',
      responsable: activeUser,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    return { success: true };
  };

  // Turnado Automático por Complejidad
  const autoAssignCases = (selectedLawyers) => {
    if (!selectedLawyers || selectedLawyers.length === 0) return;

    let updatedCases = [...cases];
    const pendingCases = updatedCases.filter(c => c.lawyer === 'Pendiente').sort((a, b) => b.pts - a.pts); // Sort by highest complexity first

    // Get current load of selected lawyers
    let lawyerLoads = selectedLawyers.map(lw => ({
      name: lw,
      load: updatedCases.filter(c => c.lawyer === lw).reduce((acc, c) => acc + c.pts, 0)
    }));

    pendingCases.forEach(pCase => {
      // Find lawyer with least load
      lawyerLoads.sort((a, b) => a.load - b.load);
      const chosenLawyer = lawyerLoads[0];

      // Assign case
      const caseIndex = updatedCases.findIndex(c => c.id === pCase.id);
      updatedCases[caseIndex].lawyer = chosenLawyer.name;

      // Update load
      chosenLawyer.load += pCase.pts;
    });

    setCases(updatedCases);

    addActivity({
      folio: `Lote de ${pendingCases.length} Folios`,
      tipo: 'Varios',
      corporacion: 'Varios',
      accion: 'Turnado Automático Completado',
      responsable: activeUser,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
  };

  // Turnado Manual (Drag & Drop or Select)
  const manualAssignCase = (caseId, lawyerName) => {
    updateCaseStatus(caseId, 'Backlog'); // reset status if needed
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, lawyer: lawyerName } : c));

    const affectedCase = cases.find(c => c.id === caseId);
    if (affectedCase) {
      addActivity({
        folio: affectedCase.expId,
        tipo: affectedCase.type,
        corporacion: affectedCase.corporacion,
        accion: `Turnado Manual a ${lawyerName}`,
        responsable: activeUser,
        fecha: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    }
  };

  // Apply dark mode theme to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleQRModal = () => setIsQRModalOpen(!isQRModalOpen);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isDarkMode,
        toggleDarkMode,
        isQRModalOpen,
        toggleQRModal,
        globalActivities,
        addActivity,
        cases,
        updateCaseStatus,
        activeUser,
        visibleNotifications,
        addParsedCases,
        autoAssignCases,
        manualAssignCase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
