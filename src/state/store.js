// Application state & localStorage persistence

const STORAGE_KEY = 'vetpulse_state_v2';
export const MAX_PETS = 5;

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getDefaultState() {
  const today = new Date();
  const addDays = (d) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + d);
    return dt.toISOString().slice(0, 10);
  };

  return {
    lang: 'es',
    darkMode: false,
    activeTab: 'triage',
    activePetId: 'pet_luna',
    isPro: false,
    showProModal: false,
    showEmergencyModal: false,
    vetContacts: {
      clinicName: 'Clínica Veterinaria Central',
      regularPhone: '+34 910 000 111',
      erPhone: '+34 910 000 999',
    },
    pets: [
      {
        id: 'pet_luna',
        name: 'Luna',
        species: 'dog',
        breed: 'Mestiza / Border Collie',
        ageYears: 5,
        ageGroup: 'adult',
        weightKg: 16.5,
        allergies: 'Pollo (sensibilidad digestiva)',
        meds: 'Simparica Trio (mensual)',
        weights: [
          { date: '2026-06-01', kg: 16.0 },
          { date: '2026-08-15', kg: 16.2 },
          { date: '2026-10-01', kg: 16.4 },
          { date: '2026-11-10', kg: 16.5 },
        ],
        logs: [
          { id: 'log_1', date: '2026-11-10', type: 'vaccine', note: 'Vacuna polivalente anual al día' },
          { id: 'log_2', date: '2026-10-22', type: 'symptom', note: 'Cojera leve pata trasera derecha tras correr, resuelta en 24h' },
        ],
        reminders: [
          { id: 'rem_1', title: 'Simparica Trio (antiparasitario)', freqDays: 30, dueDate: addDays(3) },
          { id: 'rem_2', title: 'Vacuna Rabia anual', freqDays: 365, dueDate: addDays(42) },
        ],
      },
      {
        id: 'pet_milo',
        name: 'Milo',
        species: 'cat',
        breed: 'Común Europeo',
        ageYears: 11,
        ageGroup: 'senior',
        weightKg: 4.8,
        allergies: 'Ninguna conocida',
        meds: 'Suplemento renal Semintra (diario)',
        weights: [
          { date: '2026-06-01', kg: 5.1 },
          { date: '2026-08-15', kg: 5.0 },
          { date: '2026-10-01', kg: 4.9 },
          { date: '2026-11-10', kg: 4.8 },
        ],
        logs: [
          { id: 'log_3', date: '2026-11-05', type: 'checkup', note: 'Analítica renal estable (creatinina 1.5)' },
        ],
        reminders: [
          { id: 'rem_3', title: 'Semintra 1 dosis diaria', freqDays: 1, dueDate: addDays(0) },
        ],
      },
    ],
    triageDraft: {
      selectedCategory: 'digestive',
      selectedSymptoms: [],
      redFlags: [],
      durationHours: 4,
      intensity: 'mild',
      notes: '',
      vitals: {
        gums: 'pink',
        tempC: '',
        rpm: '',
      },
      result: null,
    },
    toxinDraft: {
      toxinId: 'dark_chocolate',
      amount: 30,
      guideQuery: '',
      guideFilter: 'all',
      result: null,
    },
    costDraft: {
      regionId: 'ES',
      clinicType: 'regular',
      petSize: 'medium',
      scenarioId: 'consult_blood',
      insuranceMonthly: 28,
    },
    briefQuestions: [
      '¿Qué pruebas son imprescindibles hoy y cuáles pueden esperar?',
      '¿Cuál es el presupuesto aproximado antes de realizar pruebas?',
      '¿Qué señales concretas indican que debo volver a urgencias?',
    ],
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    const defaults = getDefaultState();
    return {
      ...defaults,
      ...parsed,
      vetContacts: { ...defaults.vetContacts, ...(parsed.vetContacts || {}) },
      triageDraft: {
        ...defaults.triageDraft,
        ...(parsed.triageDraft || {}),
        vitals: { ...defaults.triageDraft.vitals, ...((parsed.triageDraft && parsed.triageDraft.vitals) || {}) },
      },
      toxinDraft: { ...defaults.toxinDraft, ...(parsed.toxinDraft || {}) },
      costDraft: { ...defaults.costDraft, ...(parsed.costDraft || {}) },
      pets: Array.isArray(parsed.pets) && parsed.pets.length > 0 ? parsed.pets : defaults.pets,
    };
  } catch {
    return getDefaultState();
  }
}

let state = loadState();
const listeners = new Set();

export function getState() {
  return state;
}

export function getActivePet() {
  return state.pets.find((p) => p.id === state.activePetId) || state.pets[0];
}

export function setState(updater) {
  const next = typeof updater === 'function' ? updater(state) : { ...state, ...updater };
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors gracefully
  }
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function resetAllData() {
  const fresh = getDefaultState();
  fresh.lang = state.lang;
  fresh.darkMode = state.darkMode;
  setState(fresh);
}
