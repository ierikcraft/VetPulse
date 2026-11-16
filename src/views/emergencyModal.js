import { FIRST_AID_GUIDES } from '../data/clinicalData.js';
import { escapeHtml } from '../state/store.js';
import { icon } from '../utils/icons.js';

export function renderEmergencyModal(state) {
  if (!state.showEmergencyModal) return '';
  const isEs = state.lang === 'es';
  const { vetContacts } = state;

  return `
    <div class="modal-backdrop" id="sos-modal-backdrop" data-action="close-sos-backdrop" role="dialog" aria-modal="true" aria-labelledby="sos-modal-title">
      <div class="modal-panel" style="max-width:560px; max-height:90vh; overflow-y:auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <span class="result-badge" style="background:var(--emergency-solid); margin:0;">
            ${icon('alert', 13)}
            <span>${isEs ? 'MODO EMERGENCIA 24H' : '24H EMERGENCY MODE'}</span>
          </span>
          <button type="button" id="btn-close-sos" class="btn btn-secondary" style="min-height:36px; padding:4px 10px;" data-action="close-sos" aria-label="Close">
            ${icon('x', 16)}
          </button>
        </div>

        <h2 id="sos-modal-title" style="font-size:1.3rem; margin-bottom:12px;">
          ${isEs ? 'Acción Rápida y Primeros Auxilios' : 'Rapid Action & First Aid'}
        </h2>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px; margin-bottom:16px;">
          <a
            id="sos-call-link"
            href="tel:${escapeHtml(vetContacts.erPhone.replace(/\s+/g, ''))}"
            class="btn btn-primary"
            style="background:var(--emergency-solid); color:#FFFFFF; text-decoration:none;"
          >
            ${icon('phone', 16)}
            <span>${isEs ? 'Llamar Urgencias 24h' : 'Call 24h ER Vet'}</span>
          </a>
          <a
            href="https://www.google.com/maps/search/veterinario+urgencias+24h"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-secondary"
            style="text-decoration:none;"
          >
            ${icon('mapPin', 16)}
            <span>${isEs ? 'Mapa Vet 24h cercano' : 'Find 24h ER on Maps'}</span>
          </a>
        </div>

        <div class="card" style="padding:14px; margin-bottom:16px; background:var(--bg-canvas);">
          <div style="font-size:0.84rem; font-weight:700; margin-bottom:8px;">
            ${isEs ? 'Tus teléfonos guardados (edita si quieres):' : 'Your saved clinic numbers:'}
          </div>
          <div class="grid-2" style="gap:8px;">
            <input
              id="sos-clinic-name"
              type="text"
              class="form-control"
              style="min-height:38px; font-size:0.85rem;"
              value="${escapeHtml(vetContacts.clinicName)}"
              placeholder="${isEs ? 'Nombre clínica' : 'Clinic name'}"
              data-action="change-vet-contact"
              data-field="clinicName"
            />
            <input
              id="sos-er-phone"
              type="tel"
              class="form-control"
              style="min-height:38px; font-size:0.85rem;"
              value="${escapeHtml(vetContacts.erPhone)}"
              placeholder="${isEs ? 'Tel. Urgencias 24h' : '24h ER Phone'}"
              data-action="change-vet-contact"
              data-field="erPhone"
            />
          </div>
        </div>

        <div style="font-weight:700; font-size:0.92rem; margin-bottom:8px;">
          ${isEs ? 'Guías paso a paso mientras vas de camino:' : 'Step-by-step guides while on the way:'}
        </div>

        ${FIRST_AID_GUIDES.map(
          (g) => `
          <details class="firstaid-card">
            <summary>
              <span style="display:flex; align-items:center; gap:8px;">
                <span style="color:var(--primary);">${icon(g.icon, 16)}</span>
                <span>${escapeHtml(g.title[state.lang])}</span>
              </span>
              <span style="color:var(--text-muted);">${icon('chevronDown', 16)}</span>
            </summary>
            <ol>
              ${g.steps[state.lang].map((step) => `<li>${escapeHtml(step)}</li>`).join('')}
            </ol>
          </details>
        `
        ).join('')}

        <button type="button" class="btn btn-primary btn-block" style="margin-top:8px;" data-action="sos-to-brief">
          ${icon('clipboard', 16)}
          <span>${isEs ? 'Abrir Ficha Clínica para el Vet' : 'Open Vet-Visit Brief'}</span>
        </button>
      </div>
    </div>
  `;
}
