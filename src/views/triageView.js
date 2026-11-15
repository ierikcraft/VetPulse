import { SYMPTOM_CATEGORIES, RED_FLAGS, GUM_COLORS } from '../data/clinicalData.js';
import { escapeHtml } from '../state/store.js';

export function renderTriageView(state, activePet) {
  const { lang, triageDraft } = state;
  const isEs = lang === 'es';
  const activeCat = SYMPTOM_CATEGORIES.find((c) => c.id === triageDraft.selectedCategory) || SYMPTOM_CATEGORIES[0];
  const vitals = triageDraft.vitals || { gums: 'pink', tempC: '', rpm: '' };

  const selectedChipsCount = triageDraft.selectedSymptoms.length + triageDraft.redFlags.length;
  const nextRem = (activePet.reminders || [])[0];

  return `
    <section class="page-section" aria-labelledby="triage-heading">
      <div class="quick-hero-strip">
        <div>
          <div style="font-size:0.78rem; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.04em;">
            ${activePet.species === 'dog' ? '🐶' : '🐱'} ${escapeHtml(activePet.name)} · ${escapeHtml(activePet.weightKg)} kg · ${escapeHtml(activePet.ageYears)} ${isEs ? 'años' : 'yrs'}
          </div>
          <div style="font-size:0.86rem; color:var(--text-secondary); margin-top:2px;">
            ${
              nextRem
                ? `⏰ ${isEs ? 'Próximo cuidado:' : 'Next care:'} <strong>${escapeHtml(nextRem.title)}</strong> (${escapeHtml(nextRem.dueDate)})`
                : (isEs ? 'Sin recordatorios pendientes' : 'No pending reminders')
            }
          </div>
        </div>
        <div class="quick-actions-row">
          <button type="button" class="btn btn-secondary" style="min-height:36px; padding:6px 12px; font-size:0.82rem;" data-action="nav" data-tab="toxins">
            🧪 ${isEs ? '¿Comió algo tóxico?' : 'Ate something toxic?'}
          </button>
          <button type="button" class="btn btn-danger-soft" style="min-height:36px; padding:6px 12px; font-size:0.82rem;" data-action="open-sos">
            🆘 ${isEs ? 'Primeros Auxilios' : 'First Aid'}
          </button>
        </div>
      </div>

      <div class="page-header">
        <h1 id="triage-heading">${isEs ? '¿Urgencias o Esperar?' : 'ER Now or Wait?'}</h1>
        <p>${
          isEs
            ? `Marca los síntomas y constantes de <strong>${escapeHtml(activePet.name)}</strong> para obtener una orientación inmediata.`
            : `Select <strong>${escapeHtml(activePet.name)}</strong>’s symptoms and vitals for immediate guidance.`
        }</p>
      </div>

      <div class="card">
        <div class="card-title">1. ${isEs ? '¿Qué zona o tipo de síntoma notas?' : 'What area or symptom type do you notice?'}</div>
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
              <span>${cat.icon}</span>
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
                  <span>${isSelected ? '✓' : '+'}</span>
                  <span>${escapeHtml(sym.label[lang])}</span>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-title">2. ${isEs ? 'Señales de alarma vitales (Red Flags)' : 'Vital Red Flags'}</div>
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
                <span>${isSelected ? '⚠️' : '+'}</span>
                <span>${escapeHtml(rf.label[lang])}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-title">3. ${isEs ? 'Constantes Vitales Rápidas (Opcional pero muy útil)' : 'Quick Vitals Check (Optional, high value)'}</div>

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
          <div class="form-group">
            <label class="form-label" for="vitals-rpm">${isEs ? 'Respiraciones por min en reposo (RPM)' : 'Resting Breaths / min (RPM)'}</label>
            <div class="tap-pulse-box">
              <div style="display:flex; align-items:center; gap:8px;">
                <input
                  id="vitals-rpm"
                  type="number"
                  min="5"
                  max="120"
                  class="form-control"
                  style="width:92px;"
                  placeholder="24"
                  value="${escapeHtml(vitals.rpm)}"
                  data-action="change-vitals-rpm"
                />
                <span style="font-size:0.78rem; color:var(--text-muted);">${isEs ? 'Normal <30' : 'Normal <30'}</span>
              </div>
              <button type="button" id="btn-tap-rpm" class="tap-pulse-btn" data-action="tap-rpm">
                🫁 ${isEs ? 'Tocar al respirar' : 'Tap per breath'}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="vitals-temp">${isEs ? 'Temperatura rectal (°C, si tienes termómetro)' : 'Rectal Temp (°C, if available)'}</label>
            <input
              id="vitals-temp"
              type="number"
              step="0.1"
              min="34"
              max="43"
              class="form-control"
              placeholder="38.5 (Normal 38.0–39.2)"
              value="${escapeHtml(vitals.tempC)}"
              data-action="change-vitals-temp"
            />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">4. ${isEs ? 'Duración, intensidad y notas' : 'Duration, Intensity & Notes'}</div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label" for="triage-duration">${isEs ? '¿Desde hace cuántas horas?' : 'How many hours ago did it start?'}</label>
            <select id="triage-duration" class="form-control" data-action="change-duration">
              <option value="2" ${Number(triageDraft.durationHours) === 2 ? 'selected' : ''}>${isEs ? 'Menos de 4 horas' : 'Less than 4 hours'}</option>
              <option value="12" ${Number(triageDraft.durationHours) === 12 ? 'selected' : ''}>${isEs ? 'Entre 4 y 12 horas' : '4 to 12 hours'}</option>
              <option value="24" ${Number(triageDraft.durationHours) === 24 ? 'selected' : ''}>${isEs ? '12 a 24 horas' : '12 to 24 hours'}</option>
              <option value="48" ${Number(triageDraft.durationHours) === 48 ? 'selected' : ''}>${isEs ? 'Más de 24-48 horas' : 'More than 24-48 hours'}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">${isEs ? 'Estado general de tu mascota' : 'Overall energy & intensity'}</label>
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

        <div class="form-group">
          <label class="form-label" for="triage-notes">${isEs ? 'Notas adicionales (se incluirán en la Ficha Vet)' : 'Additional notes (included in Vet Brief)'}</label>
          <textarea
            id="triage-notes"
            class="form-control"
            placeholder="${isEs ? 'Ej: Vomitó espuma amarilla a las 22:30, comió algo del suelo en el parque...' : 'E.g., Vomited yellow foam at 10:30 PM, ate something off the ground...'}"
            data-action="change-triage-notes"
          >${escapeHtml(triageDraft.notes)}</textarea>
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button type="button" id="btn-run-triage" class="btn btn-primary" style="flex:1; min-width:200px;" data-action="run-triage">
            🩺 ${isEs ? `Evaluar ahora (${selectedChipsCount} marcados)` : `Evaluate now (${selectedChipsCount} selected)`}
          </button>
          <button type="button" id="btn-reset-triage" class="btn btn-secondary" data-action="reset-triage">
            ${isEs ? 'Limpiar' : 'Clear'}
          </button>
        </div>
      </div>

      ${renderTriageResult(triageDraft.result, lang)}
    </section>
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
      <p style="margin:0 0 10px; color:var(--text-secondary);">${escapeHtml(g.subtitle[lang])}</p>

      ${
        result.reasons.length > 0
          ? `<div style="font-size:0.85rem; margin-bottom:12px; font-weight:600;">
              ${result.reasons.map((r) => `• ${escapeHtml(r[lang])}`).join('<br/>')}
            </div>`
          : ''
      }

      <div class="result-lists">
        <div class="result-box">
          <h4>✅ ${isEs ? 'Qué hacer AHORA' : 'What to DO now'}</h4>
          <ul>
            ${g.dos[lang].map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
        <div class="result-box">
          <h4>⛔ ${isEs ? 'Qué NO hacer' : 'What NOT to do'}</h4>
          <ul>
            ${g.donts[lang].map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:16px;">
        <button type="button" id="btn-triage-to-brief" class="btn btn-primary" data-action="go-brief">
          📋 ${isEs ? 'Generar Ficha para el Vet' : 'Generate Vet-Visit Brief'}
        </button>
        <button type="button" id="btn-triage-to-costs" class="btn btn-secondary" data-action="go-costs">
          💶 ${isEs ? 'Ver coste estimado' : 'Check estimated cost'}
        </button>
      </div>
    </div>
  `;
}
