import { SYMPTOM_CATEGORIES, RED_FLAGS, BRIEF_QUESTIONS, getSpeciesLabel } from '../data/clinicalData.js';
import { escapeHtml } from '../state/store.js';
import { icon, speciesIcon } from '../utils/icons.js';

export function buildBriefPlainText(state, activePet) {
  const { lang, triageDraft, toxinDraft } = state;
  const isEs = lang === 'es';

  const allSymMap = new Map();
  SYMPTOM_CATEGORIES.forEach((c) => c.symptoms.forEach((s) => allSymMap.set(s.id, s.label[lang])));
  const rfMap = new Map(RED_FLAGS.map((r) => [r.id, r.label[lang]]));

  const symLabels = triageDraft.selectedSymptoms.map((id) => allSymMap.get(id)).filter(Boolean);
  const rfLabels = triageDraft.redFlags.map((id) => rfMap.get(id)).filter(Boolean);

  const lines = [
    `${isEs ? 'FICHA CLÍNICA PARA CONSULTA VETERINARIA' : 'VET-VISIT CLINICAL BRIEF'} (VetPulse)`,
    `----------------------------------------`,
    `${isEs ? 'Paciente' : 'Patient'}: ${activePet.name} (${getSpeciesLabel(activePet.species, lang)}, ${activePet.breed})`,
    `${isEs ? 'Peso' : 'Weight'}: ${activePet.weightKg} kg | ${isEs ? 'Edad' : 'Age'}: ${activePet.ageYears} ${isEs ? 'años' : 'yrs'}`,
    `${isEs ? 'Medicación habitual' : 'Current meds'}: ${activePet.meds || (isEs ? 'Ninguna' : 'None')}`,
    `${isEs ? 'Alergias' : 'Allergies'}: ${activePet.allergies || (isEs ? 'Ninguna conocida' : 'None known')}`,
    ``,
    `${isEs ? 'Motivo de consulta / Triaje' : 'Chief Complaint / Triage'}:`,
    `- ${isEs ? 'Síntomas' : 'Symptoms'}: ${symLabels.length ? symLabels.join(', ') : (isEs ? 'No especificados' : 'None selected')}`,
    `- ${isEs ? 'Señales de alarma' : 'Red flags'}: ${rfLabels.length ? rfLabels.join(', ') : (isEs ? 'Ninguna' : 'None')}`,
    `- ${isEs ? 'Inicio' : 'Onset'}: ~${triageDraft.durationHours}h | ${isEs ? 'Intensidad' : 'Intensity'}: ${triageDraft.intensity}`,
  ];

  const vitals = triageDraft.vitals || {};
  const vitalsLine = [
    vitals.gums ? `${isEs ? 'Encías' : 'Gums'}: ${vitals.gums}` : '',
    vitals.rpm ? `${vitals.rpm} rpm` : '',
    vitals.tempC ? `${vitals.tempC}°C` : '',
  ].filter(Boolean).join(' · ');

  if (vitalsLine) {
    lines.push(`- ${isEs ? 'Constantes' : 'Vitals'}: ${vitalsLine}`);
  }
  if (triageDraft.notes.trim()) {
    lines.push(`- ${isEs ? 'Notas' : 'Notes'}: ${triageDraft.notes.trim()}`);
  }
  if (toxinDraft.result && toxinDraft.result.valid) {
    lines.push(
      ``,
      `${isEs ? 'Posible exposición tóxica' : 'Possible Toxin Exposure'}: ${toxinDraft.result.toxin.name[lang]} (~${toxinDraft.result.doseMgKg} mg/kg)`
    );
  }
  const latestVisit = (activePet.vetVisits || [])[0];
  if (latestVisit) {
    lines.push(
      ``,
      `${isEs ? 'Última visita al veterinario' : 'Last vet visit'}: ${latestVisit.date} — ${latestVisit.reason}${latestVisit.diagnosis ? ` (${latestVisit.diagnosis})` : ''}`
    );
  }

  const questions = BRIEF_QUESTIONS[lang] || BRIEF_QUESTIONS.es;
  lines.push(``, `${isEs ? 'Preguntas para el veterinario' : 'Questions for the vet'}:`);
  questions.forEach((q, idx) => lines.push(`${idx + 1}. ${q}`));

  return lines.join('\n');
}

export function renderBriefView(state, activePet) {
  const { lang, triageDraft, toxinDraft } = state;
  const isEs = lang === 'es';
  const vitals = triageDraft.vitals || {};
  const vitalsLine = [
    vitals.gums ? `${isEs ? 'Encías' : 'Gums'}: ${vitals.gums}` : '',
    vitals.rpm ? `${vitals.rpm} rpm` : '',
    vitals.tempC ? `${vitals.tempC}°C` : '',
  ].filter(Boolean).join(' · ');

  const allSymMap = new Map();
  SYMPTOM_CATEGORIES.forEach((c) => c.symptoms.forEach((s) => allSymMap.set(s.id, s.label[lang])));
  const symLabels = triageDraft.selectedSymptoms.map((id) => allSymMap.get(id)).filter(Boolean);
  const petIcon = speciesIcon(activePet.species, 18);

  return `
    <section class="page-section" aria-labelledby="brief-heading">
      <div class="page-header no-print">
        <h1 id="brief-heading">${isEs ? 'Ficha de Consulta Veterinaria' : 'Vet-Visit Clinical Brief'}</h1>
        <p>${
          isEs
            ? 'Resumen estructurado de 1 minuto para enviar por WhatsApp a tu clínica o imprimir.'
            : 'Structured 1-minute summary ready to send to your clinic or print.'
        }</p>
      </div>

      <div class="no-print" style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:16px;">
        <button type="button" id="btn-copy-brief" class="btn btn-primary" data-action="copy-brief">
          ${icon('copy', 16)}
          <span>${isEs ? 'Copiar para WhatsApp' : 'Copy for WhatsApp / SMS'}</span>
        </button>
        <button type="button" id="btn-print-brief" class="btn btn-secondary" data-action="print-brief">
          ${icon('printer', 16)}
          <span>${isEs ? 'Imprimir / Guardar PDF' : 'Print / Save PDF'}</span>
        </button>
      </div>

      <div class="brief-paper">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--primary); padding-bottom:12px; margin-bottom:14px;">
          <div>
            <div style="font-family:var(--font-display); font-weight:800; font-size:1.2rem; color:var(--primary);">
              VetPulse — ${isEs ? 'Resumen Clínico' : 'Clinical Brief'}
            </div>
            <div style="font-size:0.82rem; color:var(--text-muted);">
              ${new Date().toLocaleDateString(isEs ? 'es-ES' : 'en-US', { dateStyle: 'long' })}
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:6px; font-weight:700;">
            <span style="color:var(--primary);">${petIcon}</span>
            <span>${escapeHtml(activePet.name)} (${escapeHtml(activePet.weightKg)} kg)</span>
          </div>
        </div>

        <div class="brief-section">
          <h3 style="font-size:0.95rem; margin-bottom:6px;">1. ${isEs ? 'Datos del Paciente' : 'Patient Profile'}</h3>
          <div style="font-size:0.9rem; color:var(--text-secondary);">
            <strong>${isEs ? 'Raza / Edad:' : 'Breed / Age:'}</strong> ${escapeHtml(activePet.breed)} · ${escapeHtml(activePet.ageYears)} ${isEs ? 'años' : 'yrs'}<br/>
            <strong>${isEs ? 'Alergias:' : 'Allergies:'}</strong> ${escapeHtml(activePet.allergies || (isEs ? 'Ninguna conocida' : 'None known'))}<br/>
            <strong>${isEs ? 'Medicación actual:' : 'Current meds:'}</strong> ${escapeHtml(activePet.meds || (isEs ? 'Ninguna' : 'None'))}
          </div>
        </div>

        <div class="brief-section">
          <h3 style="font-size:0.95rem; margin-bottom:6px;">2. ${isEs ? 'Motivo de Consulta y Constantes' : 'Chief Complaint & Vitals'}</h3>
          <div style="font-size:0.9rem; color:var(--text-secondary);">
            <strong>${isEs ? 'Síntomas:' : 'Symptoms:'}</strong> ${symLabels.length ? escapeHtml(symLabels.join(', ')) : (isEs ? 'Sin síntomas marcados en Triaje' : 'No symptoms selected in Triage')}<br/>
            <strong>${isEs ? 'Duración e intensidad:' : 'Duration & intensity:'}</strong> ~${escapeHtml(triageDraft.durationHours)}h · ${escapeHtml(triageDraft.intensity)}<br/>
            ${vitalsLine ? `<strong>${isEs ? 'Constantes:' : 'Vitals:'}</strong> ${escapeHtml(vitalsLine)}<br/>` : ''}
            ${triageDraft.notes ? `<strong>${isEs ? 'Notas:' : 'Notes:'}</strong> ${escapeHtml(triageDraft.notes)}` : ''}
          </div>
        </div>

        ${
          toxinDraft.result && toxinDraft.result.valid
            ? `
          <div class="brief-section">
            <h3 style="font-size:0.95rem; margin-bottom:6px;">3. ${isEs ? 'Cálculo de Exposición Tóxica' : 'Toxin Exposure Estimate'}</h3>
            <div style="font-size:0.9rem; color:var(--emergency-text); font-weight:600;">
              ${escapeHtml(toxinDraft.result.toxin.name[lang])} — ~${toxinDraft.result.doseMgKg} mg/kg
            </div>
          </div>
        `
            : ''
        }

        <div class="brief-section">
          <h3 style="font-size:0.95rem; margin-bottom:6px;">${isEs ? 'Preguntas clave para el Veterinario' : 'Key Questions for the Vet'}</h3>
          <ol style="margin:0; padding-left:18px; font-size:0.9rem; color:var(--text-secondary);">
            ${(BRIEF_QUESTIONS[lang] || BRIEF_QUESTIONS.es).map((q) => `<li style="margin-bottom:4px;">${escapeHtml(q)}</li>`).join('')}
          </ol>
        </div>
      </div>
    </section>
  `;
}
