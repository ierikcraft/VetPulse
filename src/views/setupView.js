import { SPECIES_LIST, COST_REGIONS } from '../data/clinicalData.js';
import { escapeHtml } from '../state/store.js';
import { icon, speciesIcon } from '../utils/icons.js';

export function renderSetupView(state) {
  const { lang, vetContacts, costDraft } = state;
  const isEs = lang === 'es';
  const selectedSpecies = state.setupDraftSpecies || 'dog';
  const spMeta = SPECIES_LIST.find((s) => s.id === selectedSpecies) || SPECIES_LIST[0];

  return `
    <div id="setup-screen" class="setup-screen">
      <div class="setup-topbar">
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="/icon.jpg" alt="VetPulse" style="width:36px; height:36px; border-radius:10px; object-fit:cover; border:1px solid var(--border-subtle);" />
          <div>
            <div class="brand-title" style="font-size:1.08rem;">VetPulse</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${isEs ? 'Configuración inicial' : 'Initial Setup'}</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button
            type="button"
            id="btn-setup-theme"
            class="icon-btn"
            data-action="toggle-theme"
            aria-label="Toggle dark mode"
          >
            ${state.darkMode ? icon('sun', 16) : icon('moon', 16)}
          </button>
          <button type="button" id="btn-setup-lang" class="lang-toggle" data-action="toggle-lang">
            ${lang === 'es' ? 'ES / EN' : 'EN / ES'}
          </button>
        </div>
      </div>

      <div class="setup-card">
        <div class="setup-header">
          <span class="setup-step-pill">
            ${icon('paw', 14)}
            <span>${isEs ? 'Paso único · Tu mascota real' : 'Single step · Your real pet'}</span>
          </span>
          <h1 id="setup-heading">${isEs ? 'Configura el perfil de tu mascota' : 'Set up your pet’s profile'}</h1>
          <p>${
            isEs
              ? 'Personaliza el triaje clínico, las dosis por peso, las guías de cuidado por especie y tu contacto de urgencias.'
              : 'Personalize clinical triage, weight-based doses, species care guides, and your emergency vet contact.'
          }</p>
        </div>

        <form id="form-initial-setup" data-action="submit-setup">
          <input type="hidden" id="setup-species-input" name="species" value="${escapeHtml(selectedSpecies)}" />

          <div class="setup-section">
            <label class="form-label">${isEs ? '1. ¿Qué animal es tu mascota?' : '1. What species is your pet?'}</label>
            <div class="setup-species-grid" role="radiogroup" aria-label="${isEs ? 'Especie' : 'Species'}">
              ${SPECIES_LIST.map((sp) => {
                const active = sp.id === selectedSpecies;
                return `
                  <button
                    type="button"
                    id="setup-sp-${sp.id}"
                    class="setup-species-tile ${active ? 'active' : ''}"
                    data-action="select-setup-species"
                    data-species="${sp.id}"
                    aria-pressed="${active}"
                  >
                    <span class="setup-species-icon">${speciesIcon(sp.id, 22)}</span>
                    <span class="setup-species-name">${escapeHtml(sp.label[lang])}</span>
                    <span class="setup-species-vitals">${escapeHtml(sp.normalTemp)}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div class="setup-section">
            <label class="form-label" style="margin-bottom:10px; display:block;">
              ${isEs ? '2. Datos principales de tu mascota' : '2. Your pet’s main details'}
            </label>
            <div class="grid-3">
              <div class="form-group">
                <label class="form-label" for="setup-pet-name">${isEs ? 'Nombre *' : 'Name *'}</label>
                <input id="setup-pet-name" name="name" type="text" class="form-control" required placeholder="${isEs ? 'Ej: Coco, Kira...' : 'E.g. Coco, Kira...'}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="setup-pet-weight">${isEs ? 'Peso (kg) *' : 'Weight (kg) *'}</label>
                <input id="setup-pet-weight" name="weightKg" type="number" step="0.01" min="0.02" class="form-control" required placeholder="4.5" />
              </div>
              <div class="form-group">
                <label class="form-label" for="setup-pet-age">${isEs ? 'Edad (años) *' : 'Age (years) *'}</label>
                <input id="setup-pet-age" name="ageYears" type="number" step="1" min="0" max="60" class="form-control" required placeholder="2" />
              </div>
            </div>

            <div class="grid-3">
              <div class="form-group">
                <label class="form-label" for="setup-pet-breed">${isEs ? 'Raza / Variedad' : 'Breed / Variety'}</label>
                <input id="setup-pet-breed" name="breed" type="text" class="form-control" placeholder="${escapeHtml(spMeta.defaultBreed[lang])}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="setup-pet-allergies">${isEs ? 'Alergias o patologías' : 'Allergies / conditions'}</label>
                <input id="setup-pet-allergies" name="allergies" type="text" class="form-control" placeholder="${isEs ? 'Ninguna / Opcional' : 'None / Optional'}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="setup-pet-meds">${isEs ? 'Medicación habitual' : 'Current medication'}</label>
                <input id="setup-pet-meds" name="meds" type="text" class="form-control" placeholder="${isEs ? 'Ninguna / Opcional' : 'None / Optional'}" />
              </div>
            </div>
          </div>

          <div class="setup-section">
            <label class="form-label" style="margin-bottom:10px; display:block;">
              ${isEs ? '3. Tu clínica de confianza y moneda (opcional)' : '3. Preferred clinic & currency (optional)'}
            </label>
            <div class="grid-3">
              <div class="form-group">
                <label class="form-label" for="setup-clinic-name">${isEs ? 'Nombre de tu clínica' : 'Clinic name'}</label>
                <input id="setup-clinic-name" name="clinicName" type="text" class="form-control" value="${escapeHtml(vetContacts.clinicName)}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="setup-er-phone">${isEs ? 'Teléfono Urgencias 24h' : '24h ER Phone'}</label>
                <input id="setup-er-phone" name="erPhone" type="tel" class="form-control" value="${escapeHtml(vetContacts.erPhone)}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="setup-region">${isEs ? 'Región / Moneda' : 'Region / Currency'}</label>
                <select id="setup-region" name="regionId" class="form-control">
                  ${COST_REGIONS.map(
                    (r) => `<option value="${r.id}" ${r.id === costDraft.regionId ? 'selected' : ''}>${escapeHtml(r.label[lang])}</option>`
                  ).join('')}
                </select>
              </div>
            </div>
          </div>

          <div class="setup-actions">
            <button type="submit" id="btn-complete-setup" class="btn btn-primary btn-block" style="min-height:48px; font-size:0.98rem;">
              ${icon('check', 18)}
              <span>${isEs ? 'Guardar y entrar a VetPulse' : 'Save & enter VetPulse'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
