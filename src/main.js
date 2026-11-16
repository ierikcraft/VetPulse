import './styles/main.css';
import {
  I18N,
  FOOD_PLANT_GUIDE,
  SPECIES_LIST,
  evaluateTriage,
  evaluateToxin,
  estimateCost,
} from './data/clinicalData.js';
import {
  getState,
  getActivePet,
  setState,
  subscribe,
  escapeHtml,
  resetAllData,
  MAX_PETS,
  MAX_DOC_SIZE_BYTES,
} from './state/store.js';
import { icon, speciesIcon } from './utils/icons.js';
import { renderTriageView } from './views/triageView.js';
import { renderToxinsView, renderGuideCards } from './views/toxinsView.js';
import { renderCostsView } from './views/costsView.js';
import { renderPetsView } from './views/petsView.js';
import { renderBriefView, buildBriefPlainText } from './views/briefView.js';
import { renderProModal } from './views/proModal.js';
import { renderEmergencyModal } from './views/emergencyModal.js';
import { renderSetupView } from './views/setupView.js';

const NAV_ITEMS = [
  { id: 'triage', icon: 'stethoscope', key: 'navTriage' },
  { id: 'toxins', icon: 'flask', key: 'navToxins' },
  { id: 'costs', icon: 'wallet', key: 'navCosts' },
  { id: 'pets', icon: 'paw', key: 'navPets' },
  { id: 'brief', icon: 'clipboard', key: 'navBrief' },
];

let toastMessage = '';
let toastTimer = null;
let rpmTaps = [];

function showToast(msg) {
  toastMessage = msg;
  render();
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage = '';
    render();
  }, 2600);
}

function renderActiveView(state, activePet) {
  switch (state.activeTab) {
    case 'toxins':
      return renderToxinsView(state, activePet);
    case 'costs':
      return renderCostsView(state);
    case 'pets':
      return renderPetsView(state, activePet);
    case 'brief':
      return renderBriefView(state, activePet);
    case 'triage':
    default:
      return renderTriageView(state, activePet);
  }
}

function render() {
  const state = getState();
  const activePet = getActivePet();
  const dict = I18N[state.lang] || I18N.es;
  const isEs = state.lang === 'es';
  const appEl = document.getElementById('app');
  if (!appEl) return;

  document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');

  if (state.pets.length === 0) {
    appEl.innerHTML = `
      ${renderSetupView(state)}
      ${toastMessage ? `<div class="toast" role="status">${escapeHtml(toastMessage)}</div>` : ''}
    `;
    return;
  }

  const petIcon = speciesIcon(activePet.species, 16);

  appEl.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar" aria-label="Main navigation">
        <div class="brand-row">
          <img src="/icon.jpg" alt="VetPulse" class="brand-icon" />
          <div>
            <div class="brand-title">VetPulse</div>
            <div class="brand-sub">${escapeHtml(dict.appTagline)}</div>
          </div>
        </div>

        <nav class="nav-list">
          ${NAV_ITEMS.map(
            (item) => `
            <button
              type="button"
              id="nav-desktop-${item.id}"
              class="nav-item ${state.activeTab === item.id ? 'active' : ''}"
              data-action="nav"
              data-tab="${item.id}"
            >
              ${icon(item.icon, 18)}
              <span>${escapeHtml(dict[item.key])}</span>
            </button>
          `
          ).join('')}
        </nav>

        <div class="sidebar-footer">
          <button type="button" id="btn-sidebar-pro" class="pro-promo-card" data-action="open-pro">
            <div class="pro-promo-title">
              <span>VetPulse Pro</span>
              ${state.isPro ? icon('check', 16) : icon('arrowRight', 16)}
            </div>
            <div class="pro-promo-desc">
              ${
                state.isPro
                  ? (isEs ? 'Suscripción activa. Mascotas ilimitadas.' : 'Active plan. Unlimited pets.')
                  : (isEs ? 'Historial PDF, alertas y +150 tóxicos.' : 'PDF history, alerts & 150+ toxins.')
              }
            </div>
          </button>
          <button
            type="button"
            id="btn-sidebar-reset"
            class="btn btn-danger-soft btn-block"
            style="margin-top:8px; min-height:36px; font-size:0.78rem; padding:6px 10px;"
            data-action="open-reset-confirm"
          >
            ${icon('trash', 14)}
            <span>${isEs ? 'Borrar todos los datos' : 'Erase all data'}</span>
          </button>
        </div>
      </aside>

      <div class="main-area">
        <header class="topbar">
          <div class="mobile-brand">
            <img src="/icon.jpg" alt="VetPulse" />
            <span class="brand-title" style="font-size:1.05rem;">VetPulse</span>
          </div>

          <div class="topbar-controls">
            ${
              state.pets.length === 0
                ? `<button type="button" id="btn-topbar-add-pet" class="btn btn-primary" style="min-height:36px; padding:6px 13px; font-size:0.82rem; border-radius:999px;" data-action="go-add-pet">
                    ${icon('plus', 14)}
                    <span>${isEs ? 'Añadir mascota' : 'Add pet'}</span>
                  </button>`
                : `<div class="pet-switcher">
                    ${petIcon}
                    <select id="global-pet-select" aria-label="${escapeHtml(dict.activePet)}" data-action="switch-pet">
                      ${state.pets
                        .map(
                          (p) =>
                            `<option value="${escapeHtml(p.id)}" ${p.id === activePet.id ? 'selected' : ''}>${escapeHtml(p.name)} (${escapeHtml(p.weightKg)}kg)</option>`
                        )
                        .join('')}
                      ${
                        state.pets.length < MAX_PETS
                          ? `<option value="__add_new__">+ ${isEs ? 'Añadir nueva mascota...' : 'Add new pet...'}</option>`
                          : ''
                      }
                    </select>
                  </div>`
            }

            <button type="button" id="btn-topbar-sos" class="sos-btn" data-action="open-sos">
              ${icon('alert', 14)}
              <span>SOS</span>
            </button>

            <button
              type="button"
              id="btn-theme-toggle"
              class="icon-btn"
              data-action="toggle-theme"
              title="${isEs ? 'Modo Noche (Triaje nocturno)' : 'Night-Triage Mode'}"
              aria-label="Toggle dark mode"
            >
              ${state.darkMode ? icon('sun', 16) : icon('moon', 16)}
            </button>

            <button type="button" id="btn-lang-toggle" class="lang-toggle" data-action="toggle-lang">
              ${state.lang === 'es' ? 'ES / EN' : 'EN / ES'}
            </button>

            <button type="button" id="btn-mobile-pro" class="pro-pill-btn" data-action="open-pro">
              Pro
            </button>
          </div>
        </header>

        <main class="content-container">
          <div class="disclaimer-banner" role="note">
            ${icon('info', 16)}
            <span>${escapeHtml(dict.disclaimer)}</span>
          </div>
          ${renderActiveView(state, activePet)}
        </main>
      </div>

      <nav class="mobile-bottom-nav" aria-label="Mobile navigation">
        ${NAV_ITEMS.map(
          (item) => `
          <button
            type="button"
            id="nav-mobile-${item.id}"
            class="mobile-tab ${state.activeTab === item.id ? 'active' : ''}"
            data-action="nav"
            data-tab="${item.id}"
          >
            ${icon(item.icon, 20)}
            <span>${escapeHtml(dict[item.key])}</span>
          </button>
        `
        ).join('')}
      </nav>
    </div>

    ${renderProModal(state)}
    ${renderEmergencyModal(state)}
    ${toastMessage ? `<div class="toast" role="status">${escapeHtml(toastMessage)}</div>` : ''}
  `;
}

const appRoot = document.getElementById('app');

appRoot.addEventListener('click', async (e) => {
  const target = e.target.closest('[data-action]');
  if (!target) return;

  const action = target.dataset.action;
  const state = getState();
  const activePet = getActivePet();
  const isEs = state.lang === 'es';

  switch (action) {
    case 'nav': {
      setState({ activeTab: target.dataset.tab });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    }
    case 'toggle-lang': {
      setState({ lang: state.lang === 'es' ? 'en' : 'es' });
      break;
    }
    case 'toggle-theme': {
      setState({ darkMode: !state.darkMode });
      break;
    }
    case 'open-pro': {
      setState({ showProModal: true });
      break;
    }
    case 'close-pro': {
      setState({ showProModal: false });
      break;
    }
    case 'close-pro-backdrop': {
      if (e.target.id === 'pro-modal-backdrop') {
        setState({ showProModal: false });
      }
      break;
    }
    case 'activate-pro': {
      setState({ isPro: true, showProModal: false });
      showToast(isEs ? '¡VetPulse Pro activado (prueba gratuita)!' : 'VetPulse Pro activated (free trial)!');
      break;
    }
    case 'open-sos': {
      setState({ showEmergencyModal: true });
      break;
    }
    case 'close-sos': {
      setState({ showEmergencyModal: false });
      break;
    }
    case 'close-sos-backdrop': {
      if (e.target.id === 'sos-modal-backdrop') {
        setState({ showEmergencyModal: false });
      }
      break;
    }
    case 'sos-to-brief': {
      setState({ showEmergencyModal: false, activeTab: 'brief' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    }
    case 'select-category': {
      setState({
        triageDraft: { ...state.triageDraft, selectedCategory: target.dataset.category },
      });
      break;
    }
    case 'toggle-symptom': {
      const symId = target.dataset.symptom;
      const list = state.triageDraft.selectedSymptoms;
      const next = list.includes(symId) ? list.filter((id) => id !== symId) : [...list, symId];
      setState({
        triageDraft: { ...state.triageDraft, selectedSymptoms: next },
      });
      break;
    }
    case 'toggle-redflag': {
      const rfId = target.dataset.redflag;
      const list = state.triageDraft.redFlags;
      const next = list.includes(rfId) ? list.filter((id) => id !== rfId) : [...list, rfId];
      setState({
        triageDraft: { ...state.triageDraft, redFlags: next },
      });
      break;
    }
    case 'select-gum': {
      setState({
        triageDraft: {
          ...state.triageDraft,
          vitals: { ...(state.triageDraft.vitals || {}), gums: target.dataset.gum },
        },
      });
      break;
    }
    case 'tap-rpm': {
      const now = Date.now();
      rpmTaps = rpmTaps.filter((t) => now - t < 15000);
      rpmTaps.push(now);
      if (rpmTaps.length >= 3) {
        const spanSec = (rpmTaps[rpmTaps.length - 1] - rpmTaps[0]) / 1000;
        if (spanSec > 0.3) {
          const rpm = Math.round(((rpmTaps.length - 1) / spanSec) * 60);
          state.triageDraft.vitals = { ...(state.triageDraft.vitals || {}), rpm: String(rpm) };
          const inputEl = document.getElementById('vitals-rpm');
          if (inputEl) inputEl.value = String(rpm);
          target.innerHTML = `${icon('wind', 15)} <span>${rpm} RPM</span>`;
        }
      } else {
        target.innerHTML = `${icon('wind', 15)} <span>${rpmTaps.length}/3...</span>`;
      }
      break;
    }
    case 'set-intensity': {
      setState({
        triageDraft: { ...state.triageDraft, intensity: target.dataset.intensity },
      });
      break;
    }
    case 'run-triage': {
      const result = evaluateTriage({
        species: activePet.species,
        ageGroup: activePet.ageGroup || 'adult',
        selectedSymptoms: state.triageDraft.selectedSymptoms,
        redFlags: state.triageDraft.redFlags,
        durationHours: Number(state.triageDraft.durationHours),
        intensity: state.triageDraft.intensity,
        vitals: state.triageDraft.vitals,
      });
      setState({
        triageDraft: { ...state.triageDraft, result },
      });
      const card = document.getElementById('triage-result-card');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      break;
    }
    case 'reset-triage': {
      rpmTaps = [];
      setState({
        triageDraft: {
          ...state.triageDraft,
          selectedSymptoms: [],
          redFlags: [],
          notes: '',
          vitals: { gums: 'pink', tempC: '', rpm: '' },
          result: null,
        },
      });
      break;
    }
    case 'go-brief': {
      setState({ activeTab: 'brief' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    }
    case 'go-costs': {
      setState({ activeTab: 'costs' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    }
    case 'calc-toxin': {
      const result = evaluateToxin({
        toxinId: state.toxinDraft.toxinId,
        species: activePet.species,
        weightKg: activePet.weightKg,
        amount: state.toxinDraft.amount,
      });
      setState({
        toxinDraft: { ...state.toxinDraft, result },
      });
      const card = document.getElementById('toxin-result-card');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      break;
    }
    case 'filter-guide': {
      setState({
        toxinDraft: { ...state.toxinDraft, guideFilter: target.dataset.filter },
      });
      break;
    }
    case 'pick-toxin': {
      setState({
        toxinDraft: { ...state.toxinDraft, toxinId: target.dataset.toxinId, result: null },
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    }
    case 'set-cost-clinic': {
      setState({ costDraft: { ...state.costDraft, clinicType: target.dataset.clinic } });
      break;
    }
    case 'set-cost-size': {
      setState({ costDraft: { ...state.costDraft, petSize: target.dataset.size } });
      break;
    }
    case 'select-setup-species': {
      const sp = target.dataset.species;
      state.setupDraftSpecies = sp;
      const hidden = document.getElementById('setup-species-input');
      if (hidden) hidden.value = sp;
      document.querySelectorAll('.setup-species-tile').forEach((btn) => {
        const isCurrent = btn.dataset.species === sp;
        btn.classList.toggle('active', isCurrent);
        btn.setAttribute('aria-pressed', String(isCurrent));
      });
      const spMeta = SPECIES_LIST.find((s) => s.id === sp) || SPECIES_LIST[0];
      const breedInput = document.getElementById('setup-pet-breed');
      if (breedInput) breedInput.placeholder = spMeta.defaultBreed[state.lang] || spMeta.defaultBreed.es;
      break;
    }
    case 'select-care-species': {
      setState({ careGuideSpecies: target.dataset.species });
      break;
    }
    case 'go-add-pet': {
      setState({ activeTab: 'pets' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const nameInput = document.getElementById('pet-name');
      if (nameInput) nameInput.focus();
      break;
    }
    case 'select-pet': {
      setState({
        activePetId: target.dataset.petId,
        careGuideSpecies: null,
        triageDraft: { ...state.triageDraft, result: null },
        toxinDraft: { ...state.toxinDraft, result: null },
      });
      break;
    }
    case 'open-reset-confirm': {
      setState({ activeTab: 'pets', showResetConfirm: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    }
    case 'cancel-reset-all': {
      setState({ showResetConfirm: false });
      break;
    }
    case 'confirm-reset-all': {
      resetAllData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(isEs ? 'Todos los datos han sido borrados' : 'All data has been erased');
      break;
    }
    case 'delete-pet': {
      const delId = target.dataset.petId;
      const remaining = state.pets.filter((p) => p.id !== delId);
      setState({
        pets: remaining,
        activePetId: remaining.length > 0 ? (state.activePetId === delId ? remaining[0].id : state.activePetId) : null,
      });
      showToast(isEs ? 'Mascota eliminada' : 'Pet removed');
      break;
    }
    case 'delete-vet-visit': {
      const visitId = target.dataset.visitId;
      const updatedPets = state.pets.map((p) =>
        p.id === activePet.id
          ? { ...p, vetVisits: (p.vetVisits || []).filter((v) => v.id !== visitId) }
          : p
      );
      setState({ pets: updatedPets });
      showToast(isEs ? 'Visita eliminada' : 'Vet visit removed');
      break;
    }
    case 'delete-doc': {
      const docId = target.dataset.docId;
      const updatedPets = state.pets.map((p) =>
        p.id === activePet.id
          ? { ...p, documents: (p.documents || []).filter((d) => d.id !== docId) }
          : p
      );
      setState({ pets: updatedPets });
      showToast(isEs ? 'Documento eliminado' : 'Document removed');
      break;
    }
    case 'complete-reminder': {
      const remId = target.dataset.remId;
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      let completedTitle = '';

      const updatedPets = state.pets.map((p) => {
        if (p.id !== activePet.id) return p;
        const nextRems = (p.reminders || []).map((r) => {
          if (r.id !== remId) return r;
          completedTitle = r.title;
          const nextDate = new Date(today);
          nextDate.setDate(nextDate.getDate() + (Number(r.freqDays) || 30));
          return { ...r, dueDate: nextDate.toISOString().slice(0, 10) };
        });
        const nextLogs = completedTitle
          ? [{ id: `log_${Date.now()}`, date: todayStr, type: 'med', note: `${isEs ? 'Administrado' : 'Done'}: ${completedTitle}` }, ...(p.logs || [])]
          : p.logs;
        return { ...p, reminders: nextRems, logs: nextLogs };
      });
      setState({ pets: updatedPets });
      showToast(isEs ? '¡Registrado y próxima fecha actualizada!' : 'Logged & next due date updated!');
      break;
    }
    case 'export-backup': {
      const blob = new Blob([JSON.stringify(state.pets, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vetpulse-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(isEs ? 'Backup JSON descargado' : 'JSON backup downloaded');
      break;
    }
    case 'copy-brief': {
      const text = buildBriefPlainText(state, activePet);
      try {
        await navigator.clipboard.writeText(text);
        showToast(I18N[state.lang].copiedSuccess);
      } catch {
        showToast(isEs ? 'Copia manual: usa Imprimir / PDF' : 'Copy unavailable: use Print / PDF');
      }
      break;
    }
    case 'print-brief': {
      window.print();
      break;
    }
  }
});

appRoot.addEventListener('change', (e) => {
  const target = e.target;
  const action = target.dataset.action;
  if (!action) return;
  const state = getState();

  switch (action) {
    case 'switch-pet':
      if (target.value === '__add_new__') {
        setState({ activeTab: 'pets' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const nameInput = document.getElementById('pet-name');
        if (nameInput) nameInput.focus();
      } else {
        setState({
          activePetId: target.value,
          careGuideSpecies: null,
          triageDraft: { ...state.triageDraft, result: null },
          toxinDraft: { ...state.toxinDraft, result: null },
        });
      }
      break;
    case 'change-duration':
      setState({ triageDraft: { ...state.triageDraft, durationHours: Number(target.value) } });
      break;
    case 'change-toxin':
      setState({ toxinDraft: { ...state.toxinDraft, toxinId: target.value, result: null } });
      break;
    case 'change-cost-region':
      setState({ costDraft: { ...state.costDraft, regionId: target.value } });
      break;
    case 'change-cost-scenario':
      setState({ costDraft: { ...state.costDraft, scenarioId: target.value } });
      break;
    case 'change-ins-budget':
      setState({ costDraft: { ...state.costDraft, insuranceMonthly: Number(target.value) } });
      break;
  }
});

appRoot.addEventListener('input', (e) => {
  const target = e.target;
  const action = target.dataset.action;
  if (!action) return;
  const state = getState();

  if (action === 'change-triage-notes') {
    state.triageDraft.notes = target.value;
  } else if (action === 'change-toxin-amount') {
    state.toxinDraft.amount = target.value;
  } else if (action === 'change-vitals-temp') {
    state.triageDraft.vitals = { ...(state.triageDraft.vitals || {}), tempC: target.value };
  } else if (action === 'change-vitals-rpm') {
    state.triageDraft.vitals = { ...(state.triageDraft.vitals || {}), rpm: target.value };
  } else if (action === 'change-vet-contact') {
    const field = target.dataset.field;
    if (field) {
      state.vetContacts[field] = target.value;
      if (field === 'erPhone') {
        const callLink = document.getElementById('sos-call-link');
        if (callLink) callLink.setAttribute('href', `tel:${target.value.replace(/\s+/g, '')}`);
      }
    }
  } else if (action === 'search-guide') {
    state.toxinDraft.guideQuery = target.value;
    const grid = document.getElementById('guide-results-grid');
    if (grid) {
      const q = target.value.trim().toLowerCase();
      const f = state.toxinDraft.guideFilter || 'all';
      const filtered = FOOD_PLANT_GUIDE.filter((item) => {
        const matchCat = f === 'all' || item.cat === f;
        const matchQuery = !q || item.name[state.lang].toLowerCase().includes(q) || item.note[state.lang].toLowerCase().includes(q);
        return matchCat && matchQuery;
      });
      grid.innerHTML = renderGuideCards(filtered, state.lang);
    }
  } else if (action === 'change-ins-budget') {
    const val = Number(target.value);
    state.costDraft.insuranceMonthly = val;
    const est = estimateCost(state.costDraft);
    const suffix = est.region.suffix || '';
    const yearlySavings = Math.round(val * 12);
    const avgMidCost = Math.round((est.totalMin + est.totalMax) / 2);
    const isEs = state.lang === 'es';

    const lbl = document.getElementById('ins-budget-label');
    const yr = document.getElementById('ins-yearly-display');
    const adv = document.getElementById('ins-advice-display');
    if (lbl) lbl.textContent = `${est.region.currency}${val}/${isEs ? 'mes' : 'mo'}`;
    if (yr) yr.textContent = `${est.region.currency}${yearlySavings.toLocaleString()}${suffix}`;
    if (adv) {
      adv.textContent =
        yearlySavings >= avgMidCost
          ? (isEs ? 'Tu hucha anual cubriría este escenario sin seguro.' : 'Your 1-year fund covers this scenario without insurance.')
          : (isEs ? 'Un seguro con cobertura de urgencias evitaría pagar la diferencia de golpe.' : 'Emergency pet insurance would buffer the gap.');
    }
  }

  try {
    localStorage.setItem('vetpulse_state_v3', JSON.stringify(state));
  } catch {}
});

appRoot.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const action = form.dataset.action;
  const state = getState();
  const activePet = getActivePet();
  const isEs = state.lang === 'es';
  const fd = new FormData(form);

  if (action === 'submit-log') {
    const type = fd.get('type');
    const weightVal = parseFloat(fd.get('weightKg'));
    const note = String(fd.get('note') || '').trim();
    if (!note) return;

    const today = new Date().toISOString().slice(0, 10);
    const updatedPets = state.pets.map((p) => {
      if (p.id !== activePet.id) return p;
      const nextWeights =
        Number.isFinite(weightVal) && weightVal > 0
          ? [...(p.weights || []), { date: today, kg: weightVal }]
          : p.weights;
      const nextWeightKg = Number.isFinite(weightVal) && weightVal > 0 ? weightVal : p.weightKg;
      return {
        ...p,
        weightKg: nextWeightKg,
        weights: nextWeights,
        logs: [{ id: `log_${Date.now()}`, date: today, type, note }, ...(p.logs || [])],
      };
    });

    setState({ pets: updatedPets });
    showToast(isEs ? 'Registro guardado' : 'Entry saved');
  } else if (action === 'submit-reminder') {
    const title = String(fd.get('title') || '').trim();
    const freqDays = parseInt(fd.get('freqDays'), 10) || 30;
    if (!title) return;
    const due = new Date();
    due.setDate(due.getDate() + freqDays);
    const rem = { id: `rem_${Date.now()}`, title, freqDays, dueDate: due.toISOString().slice(0, 10) };

    const updatedPets = state.pets.map((p) =>
      p.id === activePet.id ? { ...p, reminders: [rem, ...(p.reminders || [])] } : p
    );
    setState({ pets: updatedPets });
    showToast(isEs ? 'Recordatorio añadido' : 'Reminder added');
  } else if (action === 'submit-setup') {
    const name = String(fd.get('name') || '').trim();
    const rawSpecies = String(fd.get('species') || state.setupDraftSpecies || 'dog');
    const spMeta = SPECIES_LIST.find((s) => s.id === rawSpecies) || SPECIES_LIST[0];
    const species = spMeta.id;
    const weightKg = parseFloat(fd.get('weightKg'));
    const ageYears = parseInt(fd.get('ageYears'), 10);
    const breed = String(fd.get('breed') || '').trim() || spMeta.defaultBreed[state.lang] || spMeta.defaultBreed.es;
    const allergies = String(fd.get('allergies') || '').trim();
    const meds = String(fd.get('meds') || '').trim();
    const clinicName = String(fd.get('clinicName') || '').trim() || state.vetContacts.clinicName;
    const erPhone = String(fd.get('erPhone') || '').trim() || state.vetContacts.erPhone;
    const regionId = String(fd.get('regionId') || state.costDraft.regionId || 'ES');

    if (!name || !Number.isFinite(weightKg) || weightKg <= 0 || !Number.isFinite(ageYears) || ageYears < 0) {
      showToast(isEs ? 'Revisa el nombre, peso y edad de tu mascota' : 'Check your pet’s name, weight, and age');
      return;
    }

    const ageGroup = ageYears < 1 ? 'puppy' : ageYears >= 8 ? 'senior' : 'adult';
    const petSize = weightKg < 10 ? 'small' : weightKg > 25 ? 'large' : 'medium';
    const newId = `pet_${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);
    const newPet = {
      id: newId,
      name,
      species,
      breed,
      ageYears,
      ageGroup,
      weightKg,
      allergies: allergies || (isEs ? 'Ninguna conocida' : 'None known'),
      meds: meds || (isEs ? 'Ninguna' : 'None'),
      weights: [{ date: today, kg: weightKg }],
      logs: [],
      reminders: [],
      vetVisits: [],
      documents: [],
    };

    setState({
      pets: [newPet],
      activePetId: newId,
      activeTab: 'triage',
      careGuideSpecies: null,
      vetContacts: {
        ...state.vetContacts,
        clinicName,
        erPhone,
      },
      costDraft: {
        ...state.costDraft,
        regionId,
        petSize,
      },
    });
    showToast(isEs ? `¡Perfil de ${name} configurado!` : `${name}’s profile is ready!`);
  } else if (action === 'submit-pet') {
    if (state.pets.length >= MAX_PETS) {
      showToast(isEs ? `Máximo de ${MAX_PETS} mascotas alcanzado` : `Maximum of ${MAX_PETS} pets reached`);
      return;
    }

    const name = String(fd.get('name') || '').trim();
    const rawSpecies = String(fd.get('species') || 'dog');
    const spMeta = SPECIES_LIST.find((s) => s.id === rawSpecies) || SPECIES_LIST[0];
    const species = spMeta.id;
    const weightKg = parseFloat(fd.get('weightKg'));
    const ageYears = parseInt(fd.get('ageYears'), 10);
    const breed = String(fd.get('breed') || '').trim() || spMeta.defaultBreed[state.lang] || spMeta.defaultBreed.es;
    const allergies = String(fd.get('allergies') || '').trim();

    if (!name || !Number.isFinite(weightKg) || weightKg <= 0 || !Number.isFinite(ageYears) || ageYears < 0) {
      showToast(isEs ? 'Revisa nombre, peso y edad' : 'Check name, weight, and age');
      return;
    }

    const ageGroup = ageYears < 1 ? 'puppy' : ageYears >= 8 ? 'senior' : 'adult';
    const newId = `pet_${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);
    const newPet = {
      id: newId,
      name,
      species,
      breed,
      ageYears,
      ageGroup,
      weightKg,
      allergies: allergies || (isEs ? 'Ninguna conocida' : 'None known'),
      meds: isEs ? 'Ninguna' : 'None',
      weights: [{ date: today, kg: weightKg }],
      logs: [],
      reminders: [],
      vetVisits: [],
      documents: [],
    };

    setState({
      pets: [...state.pets, newPet],
      activePetId: newId,
      careGuideSpecies: null,
    });
    showToast(isEs ? `${name} añadido (${state.pets.length + 1}/${MAX_PETS})` : `${name} added (${state.pets.length + 1}/${MAX_PETS})`);
  } else if (action === 'submit-vet-visit') {
    const date = String(fd.get('date') || '').trim() || new Date().toISOString().slice(0, 10);
    const clinic = String(fd.get('clinic') || '').trim();
    const reason = String(fd.get('reason') || '').trim();
    const diagnosis = String(fd.get('diagnosis') || '').trim();
    const costRaw = parseFloat(fd.get('cost'));
    const cost = Number.isFinite(costRaw) && costRaw >= 0 ? costRaw : null;

    if (!reason) {
      showToast(isEs ? 'Indica el motivo de la visita' : 'Enter the visit reason');
      return;
    }

    const visit = {
      id: `visit_${Date.now()}`,
      date,
      clinic,
      reason,
      diagnosis,
      cost,
    };

    const updatedPets = state.pets.map((p) =>
      p.id === activePet.id ? { ...p, vetVisits: [visit, ...(p.vetVisits || [])] } : p
    );
    setState({ pets: updatedPets });
    showToast(isEs ? 'Visita guardada' : 'Vet visit saved');
  } else if (action === 'submit-doc') {
    const fileInput = form.querySelector('#doc-file');
    const file = fileInput && fileInput.files && fileInput.files[0];
    if (!file) {
      showToast(isEs ? 'Selecciona un archivo' : 'Select a file');
      return;
    }
    if (file.size > MAX_DOC_SIZE_BYTES) {
      showToast(isEs ? 'El archivo supera el límite de 1.5 MB' : 'File exceeds 1.5 MB limit');
      return;
    }

    const title = String(fd.get('title') || '').trim() || file.name;
    const category = String(fd.get('category') || 'other');
    const uploadedAt = new Date().toISOString().slice(0, 10);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const docItem = {
        id: `doc_${Date.now()}`,
        title,
        category,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        uploadedAt,
        dataUrl,
      };
      const latestState = getState();
      const updatedPets = latestState.pets.map((p) =>
        p.id === activePet.id ? { ...p, documents: [docItem, ...(p.documents || [])] } : p
      );
      const savedOk = setState({ pets: updatedPets });
      if (savedOk) {
        showToast(isEs ? 'Documento guardado' : 'Document saved');
      } else {
        showToast(isEs ? 'Almacenamiento lleno: elimina algún archivo antiguo' : 'Storage full: remove an older document');
      }
    };
    reader.onerror = () => {
      showToast(isEs ? 'No se pudo leer el archivo' : 'Failed to read file');
    };
    reader.readAsDataURL(file);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const s = getState();
    if (s.showProModal || s.showEmergencyModal) {
      setState({ showProModal: false, showEmergencyModal: false });
    }
  }
});

subscribe(render);
render();
