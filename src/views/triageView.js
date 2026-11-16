import { SYMPTOM_CATEGORIES, RED_FLAGS, GUM_COLORS, SPECIES_LIST, SPECIES_CARE_GUIDES, getSpeciesLabel } from '../data/clinicalData.js';
import { escapeHtml } from '../state/store.js';
import { icon, speciesIcon } from '../utils/icons.js';

export function renderTriageView(state, activePet) {
  const { lang, triageDraft } = state;
  const isEs = lang === 'es';
  const activeCat = SYMPTOM_CATEGORIES.find((c) => c.id === triageDraft.selectedCategory) || SYMPTOM_CATEGORIES[0];
  const vitals = triageDraft.vitals || { gums: 'pink', tempC: '', rpm: '' };

  const selectedChipsCount = triageDraft.selectedSymptoms.length + triageDraft.redFlags.length;
  const nextRem = (activePet.reminders || [])[0];
  const petIcon = speciesIcon(activePet.species, 16);
  const spLabel = getSpeciesLabel(activePet.species, lang);
  const guideSpecies = state.careGuideSpecies || activePet.species || 'dog';

  return `
    <section class="page-section" aria-labelledby="triage-heading">
      <div class="quick-hero-strip">
        <div>
          <div style="display:flex; align-items:center; gap:6px; font-size:0.8rem; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.04em;">
            ${petIcon}
            <span>${escapeHtml(activePet.name)} · ${escapeHtml(spLabel)} · ${escapeHtml(activePet.weightKg)} kg · ${escapeHtml(activePet.ageYears)} ${isEs ? 'años' : 'yrs'}</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; font-size:0.86rem; color:var(--text-secondary); margin-top:3px;">
            ${icon('clock', 14)}
            <span>
              ${
                nextRem
                  ? `${isEs ? 'Próximo cuidado:' : 'Next care:'} <strong>${escapeHtml(nextRem.title)}</strong> (${escapeHtml(nextRem.dueDate)})`
                  : (isEs ? 'Sin recordatorios pendientes' : 'No pending reminders')
              }
            </span>
          </div>
        </div>
        <div class="quick-actions-row">
          <button type="button" class="btn btn-secondary" style="min-height:38px; padding:6px 12px; font-size:0.82rem;" data-action="nav" data-tab="toxins">
            ${icon('flask', 15)}
            <span>${isEs ? '¿Comió algo tóxico?' : 'Ate something toxic?'}</span>
          </button>
          <button type="button" class="btn btn-danger-soft" style="min-height:38px; padding:6px 12px; font-size:0.82rem;" data-action="open-sos">
            ${icon('alert', 15)}
            <span>${isEs ? 'Primeros Auxilios' : 'First Aid'}</span>
          </button>
        </div>
      </div>

      <div class="page-header">
        <h1 id="triage-heading">${isEs ? '¿Urgencias o Esperar?' : 'ER Now or Wait?'}</h1>
        <p>${
          isEs
            ? `Marca los síntomas y constantes de <strong>${escapeHtml(activePet.name)}</strong> para obtener orientación clínica inmediata.`
            : `Select <strong>${escapeHtml(activePet.name)}</strong>’s symptoms and vitals for immediate clinical guidance.`
        }</p>
      </div>

      <div class="workspace-split">
        <div>
          <div class="card">
            <div class="card-title">${icon('stethoscope', 18)} <span>1. ${isEs ? '¿Qué zona o tipo de síntoma notas?' : 'What area or symptom type do you notice?'}</span></div>
            <div class="category-tabs" role="tablist">
              ${SYMPTOM_CATEGORIES.map(
                (cat) => `
                <button
                  type="button"
                  id="cat-tab-${cat.id}"
                  class="cat-pill ${cat.id === activeCat.id ? 'active' : ''}"
                  data-action="select-category"
                  data-category="${cat.id}"
                  role="tab"
                  aria-selected="${cat.id === activeCat.id}"
                >
                  ${icon(cat.icon, 15)}
                  <span>${escapeHtml(cat.label[lang])}</span>
                </button>
              `
              ).join('')}
            </div>

            <div class="chip-grid" role="group" aria-label="${isEs ? 'Síntomas' : 'Symptoms'}">
              ${activeCat.symptoms
                .map((sym) => {
                  const isSelected = triageDraft.selectedSymptoms.includes(sym.id);
                  return `
                    <button
                      type="button"
                      id="sym-${sym.id}"
                      class="symptom-chip ${isSelected ? 'selected' : ''}"
                      data-action="toggle-symptom"
                      data-symptom="${sym.id}"
                      aria-pressed="${isSelected}"
                    >
                      ${isSelected ? icon('check', 15) : icon('plus', 15)}
                      <span>${escapeHtml(sym.label[lang])}</span>
                    </button>
                  `;
                })
                .join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-title">${icon('alert', 18)} <span>2. ${isEs ? 'Señales de alarma vitales (Red Flags)' : 'Vital Red Flags'}</span></div>
            <div class="chip-grid">
              ${RED_FLAGS.map((rf) => {
                const isSelected = triageDraft.redFlags.includes(rf.id);
                return `
                  <button
                    type="button"
                    id="rf-${rf.id}"
                    class="symptom-chip redflag ${isSelected ? 'selected' : ''}"
                    data-action="toggle-redflag"
                    data-redflag="${rf.id}"
                    aria-pressed="${isSelected}"
                  >
                    ${isSelected ? icon('alert', 15) : icon('plus', 15)}
                    <span>${escapeHtml(rf.label[lang])}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-title">${icon('activity', 18)} <span>3. ${isEs ? 'Constantes Vitales Rápidas' : 'Quick Vitals Check'}</span></div>

            <div class="form-group">
              <label class="form-label">${isEs ? 'Color de las encías (levanta suavemente el labio superior)' : 'Gum color (gently lift upper lip)'}</label>
              <div class="gum-grid">
                ${GUM_COLORS.map(
                  (g) => `
                  <button
                    type="button"
                    class="gum-btn ${vitals.gums === g.id ? 'selected' : ''}"
                    data-action="select-gum"
                    data-gum="${g.id}"
                  >
                    <span class="gum-swatch" style="background:${g.color};"></span>
                    <span>${escapeHtml(g.label[lang])}</span>
                  </button>
                `
                ).join('')}
              </div>
            </div>

            <div class="grid-2" style="margin-top:12px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" for="vitals-rpm">${isEs ? 'Respiraciones/min en reposo (RPM)' : 'Resting Breaths/min (RPM)'}</label>
                <div class="tap-pulse-box">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <input
                      id="vitals-rpm"
                      type="number"
                      min="5"
                      max="120"
                      class="form-control"
                      style="width:88px;"
                      placeholder="24"
                      value="${escapeHtml(vitals.rpm)}"
                      data-action="change-vitals-rpm"
                    />
                    <span style="font-size:0.78rem; color:var(--text-muted);">${isEs ? 'Normal' : 'Normal'} ${escapeHtml((SPECIES_LIST.find((s) => s.id === activePet.species) || SPECIES_LIST[0]).normalRpm)}</span>
                  </div>
                  <button type="button" id="btn-tap-rpm" class="tap-pulse-btn" data-action="tap-rpm">
                    ${icon('wind', 15)}
                    <span>${isEs ? 'Tocar al respirar' : 'Tap per breath'}</span>
                  </button>
                </div>
              </div>

              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" for="vitals-temp">${isEs ? 'Temperatura (°C, opcional)' : 'Temp (°C, optional)'}</label>
                <input
                  id="vitals-temp"
                  type="number"
                  step="0.1"
                  min="15"
                  max="44"
                  class="form-control"
                  placeholder="Normal ${escapeHtml((SPECIES_LIST.find((s) => s.id === activePet.species) || SPECIES_LIST[0]).normalTemp)}"
                  value="${escapeHtml(vitals.tempC)}"
                  data-action="change-vitals-temp"
                />
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title">${icon('clock', 18)} <span>4. ${isEs ? 'Duración, intensidad y notas' : 'Duration, Intensity & Notes'}</span></div>
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label" for="triage-duration">${isEs ? '¿Desde hace cuántas horas?' : 'Hours since onset'}</label>
                <select id="triage-duration" class="form-control" data-action="change-duration">
                  <option value="2" ${Number(triageDraft.durationHours) === 2 ? 'selected' : ''}>${isEs ? 'Menos de 4 horas' : 'Less than 4 hours'}</option>
                  <option value="12" ${Number(triageDraft.durationHours) === 12 ? 'selected' : ''}>${isEs ? 'Entre 4 y 12 horas' : '4 to 12 hours'}</option>
                  <option value="24" ${Number(triageDraft.durationHours) === 24 ? 'selected' : ''}>${isEs ? '12 a 24 horas' : '12 to 24 hours'}</option>
                  <option value="48" ${Number(triageDraft.durationHours) === 48 ? 'selected' : ''}>${isEs ? 'Más de 24-48 horas' : 'More than 24-48 hours'}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">${isEs ? 'Estado general' : 'Energy & intensity'}</label>
                <div class="segmented-control" role="group" aria-label="Intensity">
                  ${[
                    { id: 'mild', es: 'Leve', en: 'Mild' },
                    { id: 'moderate', es: 'Moderado', en: 'Moderate' },
                    { id: 'severe', es: 'Intenso', en: 'Severe' },
                  ]
                    .map(
                      (opt) => `
                    <button
                      type="button"
                      class="seg-btn ${triageDraft.intensity === opt.id ? 'active' : ''}"
                      data-action="set-intensity"
                      data-intensity="${opt.id}"
                    >
                      ${opt[lang]}
                    </button>
                  `
                    )
                    .join('')}
                </div>
              </div>
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" for="triage-notes">${isEs ? 'Notas adicionales (se incluirán en la Ficha Vet)' : 'Additional notes (included in Vet Brief)'}</label>
              <textarea
                id="triage-notes"
                class="form-control"
                placeholder="${isEs ? 'Ej: Vomitó espuma amarilla a las 22:30, comió algo del suelo en el parque...' : 'E.g., Vomited yellow foam at 10:30 PM, ate something off the ground...'}"
                data-action="change-triage-notes"
              >${escapeHtml(triageDraft.notes)}</textarea>
            </div>
          </div>
        </div>

        <aside class="sticky-panel">
          <div class="card">
            <div class="card-title">${icon('heartPulse', 18)} <span>${isEs ? 'Evaluación Clínica' : 'Clinical Evaluation'}</span></div>
            <p style="font-size:0.86rem; color:var(--text-secondary); margin:0 0 14px;">
              ${
                isEs
                  ? `Has seleccionado <strong>${selectedChipsCount}</strong> ${selectedChipsCount === 1 ? 'síntoma o alarma' : 'síntomas o alarmas'}.`
                  : `You selected <strong>${selectedChipsCount}</strong> ${selectedChipsCount === 1 ? 'symptom or flag' : 'symptoms or flags'}.`
              }
            </p>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <button type="button" id="btn-run-triage" class="btn btn-primary btn-block" data-action="run-triage">
                ${icon('stethoscope', 17)}
                <span>${isEs ? 'Evaluar ahora' : 'Evaluate now'}</span>
              </button>
              <button type="button" id="btn-reset-triage" class="btn btn-secondary btn-block" data-action="reset-triage">
                ${icon('x', 16)}
                <span>${isEs ? 'Limpiar selección' : 'Clear selection'}</span>
              </button>
            </div>
          </div>

          ${renderTriageResult(triageDraft.result, lang)}
        </aside>
      </div>

      ${renderSpeciesCareGuide(guideSpecies, lang)}
    </section>
  `;
}

function renderSpeciesCareGuide(guideSpecies, lang) {
  const isEs = lang === 'es';
  const spMeta = SPECIES_LIST.find((s) => s.id === guideSpecies) || SPECIES_LIST[0];
  const guide = SPECIES_CARE_GUIDES[spMeta.id] || SPECIES_CARE_GUIDES.dog;

  return `
    <div id="species-care-guide" class="card" style="margin-top:18px;">
      <div class="card-title" style="justify-content:space-between; flex-wrap:wrap; gap:10px;">
        <span style="display:flex; align-items:center; gap:8px;">
          ${speciesIcon(spMeta.id, 18)}
          <span>${isEs ? 'Ayudas y Cómo Curar por Especie' : 'Species-Specific Care & Treatment Guide'}</span>
        </span>
        <span style="font-size:0.78rem; font-weight:600; color:var(--text-secondary);">
          ${isEs ? 'Constantes normales:' : 'Normal vitals:'} ${escapeHtml(spMeta.normalTemp)} · ${escapeHtml(spMeta.normalRpm)}
        </span>
      </div>

      <div class="category-tabs" style="margin-bottom:14px;">
        ${SPECIES_LIST.map(
          (sp) => `
          <button
            type="button"
            id="guide-sp-${sp.id}"
            class="cat-pill ${sp.id === spMeta.id ? 'active' : ''}"
            data-action="select-care-species"
            data-species="${sp.id}"
          >
            ${speciesIcon(sp.id, 15)}
            <span>${escapeHtml(sp.label[lang])}</span>
          </button>
        `
        ).join('')}
      </div>

      <p style="font-size:0.9rem; color:var(--text-secondary); margin:0 0 14px;">
        ${escapeHtml(guide.summary[lang])}
      </p>

      <div class="grid-2" style="margin-bottom:14px;">
        ${guide.conditions
          .map(
            (cond) => `
          <div style="padding:12px 14px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); background:var(--surface-elevated, var(--bg));">
            <div style="font-weight:700; font-size:0.92rem; margin-bottom:6px; color:var(--primary);">
              ${escapeHtml(cond.title[lang])}
            </div>
            <div style="font-size:0.86rem; color:var(--text-secondary); line-height:1.45;">
              ${escapeHtml(cond.cure[lang])}
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="result-lists">
        <div class="result-box">
          <h4>${icon('check', 15)} <span>${isEs ? 'Cuidados seguros en casa' : 'Safe home stabilization'}</span></h4>
          <ul>
            ${guide.homeCare[lang].map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
        <div class="result-box">
          <h4>${icon('ban', 15)} <span>${isEs ? 'Peligros / Qué evitar' : 'Dangers / What to avoid'}</span></h4>
          <p style="margin:0; font-size:0.86rem; color:var(--text-secondary); line-height:1.45;">
            ${escapeHtml(guide.avoid[lang])}
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderTriageResult(result, lang) {
  if (!result) return '';
  const isEs = lang === 'es';
  const g = result.guidance;

  return `
    <div id="triage-result-card" class="result-card ${result.level}" role="region" aria-live="polite">
      <div class="result-badge">${escapeHtml(g.badge[lang])}</div>
      <h2 class="result-title">${escapeHtml(g.title[lang])}</h2>
      <p style="margin:0 0 10px; color:var(--text-secondary); font-size:0.9rem;">${escapeHtml(g.subtitle[lang])}</p>

      ${
        result.reasons.length > 0
          ? `<div style="font-size:0.84rem; margin-bottom:12px; font-weight:600;">
              ${result.reasons.map((r) => `• ${escapeHtml(r[lang])}`).join('<br/>')}
            </div>`
          : ''
      }

      <div class="result-lists">
        <div class="result-box">
          <h4>${icon('check', 15)} <span>${isEs ? 'Qué hacer AHORA' : 'What to DO now'}</span></h4>
          <ul>
            ${g.dos[lang].map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
        <div class="result-box">
          <h4>${icon('ban', 15)} <span>${isEs ? 'Qué NO hacer' : 'What NOT to do'}</span></h4>
          <ul>
            ${g.donts[lang].map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px; margin-top:14px;">
        <button type="button" id="btn-triage-to-brief" class="btn btn-primary btn-block" data-action="go-brief">
          ${icon('clipboard', 16)}
          <span>${isEs ? 'Generar Ficha para el Vet' : 'Generate Vet-Visit Brief'}</span>
        </button>
        <button type="button" id="btn-triage-to-costs" class="btn btn-secondary btn-block" data-action="go-costs">
          ${icon('wallet', 16)}
          <span>${isEs ? 'Ver coste estimado' : 'Check estimated cost'}</span>
        </button>
      </div>
    </div>
  `;
}
