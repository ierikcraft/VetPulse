// Application state & localStorage persistence

const STORAGE_KEY = 'vetpulse_state_v3';
export const MAX_PETS = 5;
export const MAX_DOC_SIZE_BYTES = 1572864; // 1.5 MB per file for safe localStorage persistence

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getDefaultState() {
  return {
    lang: 'es',
    darkMode: false,
    activeTab: 'pets',
    activePetId: null,
    isPro: false,
    showProModal: false,
    showEmergencyModal: false,
    vetContacts: {
      clinicName: 'Clínica Veterinaria Central',
      regularPhone: '+34 910 000 111',
      erPhone: '+34 910 000 999',
    },
    pets: [],
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
    const loadedPets = Array.isArray(parsed.pets)
      ? parsed.pets.slice(0, MAX_PETS).map((p) => ({
          ...p,
          vetVisits: Array.isArray(p.vetVisits) ? p.vetVisits : [],
          documents: Array.isArray(p.documents) ? p.documents : [],
        }))
      : [];
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
      pets: loadedPets,
      activePetId: loadedPets.length > 0 ? (parsed.activePetId || loadedPets[0].id) : null,
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
  if (state.pets.length > 0) {
    return state.pets.find((p) => p.id === state.activePetId) || state.pets[0];
  }
  return {
    id: null,
    isPlaceholder: true,
    name: state.lang === 'es' ? 'Mi Mascota' : 'My Pet',
    species: 'dog',
    breed: state.lang === 'es' ? 'Sin registrar' : 'Unregistered',
    ageYears: 3,
    ageGroup: 'adult',
    weightKg: 10,
    allergies: '',
    meds: '',
    weights: [],
    logs: [],
    reminders: [],
    vetVisits: [],
    documents: [],
  };
}

export function setState(updater) {
  const next = typeof updater === 'function' ? updater(state) : { ...state, ...updater };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    state = next;
    listeners.forEach((fn) => fn(state));
    return true;
  } catch {
    state = next;
    listeners.forEach((fn) => fn(state));
    return false;
  }
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
