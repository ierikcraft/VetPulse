import { escapeHtml } from '../state/store.js';
import { icon } from '../utils/icons.js';

function renderWeightSparkline(weights = [], lang = 'es') {
  if (!weights || weights.length < 2) {
    return `<div style="font-size:0.82rem; color:var(--text-muted);">${
      lang === 'es' ? 'Registra al menos 2 pesos para ver la tendencia.' : 'Log at least 2 weights to see trend.'
    }</div>`;
  }
  const vals = weights.map((w) => Number(w.kg));
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const w = 260;
  const h = 52;
  const pad = 6;

  const points = vals
    .map((v, i) => {
      const x = pad + (i / (vals.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / span) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return `
    <div class="sparkline-wrap">
      <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-secondary); margin-bottom:4px;">
        <span>${lang === 'es' ? 'Tendencia de peso' : 'Weight trend'}</span>
        <strong>${vals[0]} kg → ${vals[vals.length - 1]} kg</strong>
      </div>
      <svg viewBox="0 0 ${w} ${h}" style="width:100%; height:52px; display:block;" aria-hidden="true">
        <polyline
          fill="none"
          stroke="var(--primary)"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          points="${points}"
        />
      </svg>
    </div>
  `;
}

function getReminderStatus(dueDate, lang) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const diffDays = Math.round((new Date(dueDate) - new Date(todayStr)) / 86400000);
  if (Number.isNaN(diffDays)) {
    return { cls: 'ok', label: dueDate || '' };
  }
  if (diffDays <= 0) {
    return { cls: 'due', label: lang === 'es' ? (diffDays === 0 ? 'Hoy' : 'Vencido') : (diffDays === 0 ? 'Today' : 'Overdue') };
  }
  if (diffDays <= 7) {
    return { cls: 'soon', label: lang === 'es' ? `En ${diffDays}d` : `In ${diffDays}d` };
  }
  return { cls: 'ok', label: dueDate };
}

export function renderPetsView(state, activePet) {
  const { lang, pets } = state;
  const isEs = lang === 'es';
  const reminders = activePet.reminders || [];

  return `
    <section class="page-section" aria-labelledby="pets-heading">
      <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:10px;">
        <div>
          <h1 id="pets-heading">${isEs ? 'Mis Mascotas y Diario' : 'My Pets & Health Diary'}</h1>
          <p>${
            isEs
              ? 'Peso, recordatorios de medicación/vacunas y copia de seguridad.'
              : 'Weight, medication/vaccine reminders, and data backup.'
          }</p>
        </div>
        <button type="button" id="btn-export-backup" class="btn btn-secondary" style="min-height:38px; font-size:0.84rem;" data-action="export-backup">
          ${icon('download', 16)}
          <span>${isEs ? 'Exportar Backup JSON' : 'Export JSON Backup'}</span>
        </button>
      </div>

      <div class="grid-2" style="margin-bottom:18px;">
        ${pets
          .map((pet) => {
            const isActive = pet.id === activePet.id;
            const petIcon = pet.species === 'dog' ? icon('dog', 18) : icon('cat', 18);
            return `
              <div class="pet-card ${isActive ? 'active-pet' : ''}">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                  <div>
                    <div style="display:flex; align-items:center; gap:7px; font-size:1.15rem; font-weight:800; font-family:var(--font-display);">
                      <span style="color:var(--primary);">${petIcon}</span>
                      <span>${escapeHtml(pet.name)}</span>
                    </div>
                    <div style="font-size:0.84rem; color:var(--text-secondary);">
                      ${escapeHtml(pet.breed)} · ${escapeHtml(pet.ageYears)} ${isEs ? 'años' : 'yrs'} · <strong>${escapeHtml(pet.weightKg)} kg</strong>
                    </div>
                  </div>
                  ${
                    isActive
                      ? `<span style="background:var(--primary-soft); color:var(--primary); font-size:0.75rem; font-weight:700; padding:4px 9px; border-radius:999px;">${isEs ? 'Activa' : 'Active'}</span>`
                      : `<button type="button" class="btn btn-secondary" style="min-height:34px; padding:4px 10px; font-size:0.8rem;" data-action="select-pet" data-pet-id="${escapeHtml(pet.id)}">${isEs ? 'Seleccionar' : 'Select'}</button>`
                  }
                </div>

                <div style="margin-top:10px; font-size:0.84rem; color:var(--text-secondary);">
                  <div><strong>${isEs ? 'Alergias:' : 'Allergies:'}</strong> ${escapeHtml(pet.allergies || (isEs ? 'Ninguna' : 'None'))}</div>
                  <div><strong>${isEs ? 'Medicación:' : 'Meds:'}</strong> ${escapeHtml(pet.meds || (isEs ? 'Ninguna' : 'None'))}</div>
                </div>

                ${renderWeightSparkline(pet.weights, lang)}

                ${
                  pets.length > 1
                    ? `<div style="margin-top:10px; text-align:right;">
                        <button type="button" class="btn btn-danger-soft" style="min-height:32px; padding:4px 10px; font-size:0.78rem;" data-action="delete-pet" data-pet-id="${escapeHtml(pet.id)}">
                          ${isEs ? 'Eliminar' : 'Remove'}
                        </button>
                      </div>`
                    : ''
                }
              </div>
            `;
          })
          .join('')}
      </div>

      <div class="card">
        <div class="card-title">${icon('clock', 18)} <span>${isEs ? `Recordatorios de Cuidados (${escapeHtml(activePet.name)})` : `Care Reminders (${escapeHtml(activePet.name)})`}</span></div>
        ${
          reminders.length === 0
            ? `<div style="font-size:0.86rem; color:var(--text-muted); margin-bottom:12px;">${isEs ? 'No hay recordatorios aún.' : 'No reminders yet.'}</div>`
            : `<div style="margin-bottom:14px;">
                ${reminders
                  .map((r) => {
                    const st = getReminderStatus(r.dueDate, lang);
                    return `
                      <div class="reminder-row">
                        <div>
                          <div style="font-weight:600; font-size:0.92rem;">${escapeHtml(r.title)}</div>
                          <span class="rem-badge ${st.cls}">${escapeHtml(st.label)}</span>
                        </div>
                        <button type="button" class="btn btn-secondary" style="min-height:34px; padding:4px 12px; font-size:0.8rem;" data-action="complete-reminder" data-rem-id="${escapeHtml(r.id)}">
                          ${icon('check', 14)}
                          <span>${isEs ? 'Administrado' : 'Done'}</span>
                        </button>
                      </div>
                    `;
                  })
                  .join('')}
              </div>`
        }
        <form id="form-add-reminder" data-action="submit-reminder" style="display:flex; gap:8px; flex-wrap:wrap;">
          <input name="title" type="text" class="form-control" style="flex:2; min-width:180px;" required placeholder="${isEs ? 'Ej: Pipeta antipulgas' : 'E.g. Flea treatment'}" />
          <select name="freqDays" class="form-control" style="flex:1; min-width:130px;">
            <option value="1">${isEs ? 'Diario' : 'Daily'}</option>
            <option value="30" selected>${isEs ? 'Mensual (30d)' : 'Monthly (30d)'}</option>
            <option value="90">${isEs ? 'Trimestral (90d)' : 'Quarterly (90d)'}</option>
            <option value="365">${isEs ? 'Anual' : 'Yearly'}</option>
          </select>
          <button type="submit" class="btn btn-primary">${icon('plus', 15)} <span>${isEs ? 'Añadir' : 'Add'}</span></button>
        </form>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">${icon('clipboard', 18)} <span>${isEs ? `Registrar evento para ${escapeHtml(activePet.name)}` : `Log entry for ${escapeHtml(activePet.name)}`}</span></div>
          <form id="form-add-log" data-action="submit-log">
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label" for="log-type">${isEs ? 'Tipo' : 'Type'}</label>
                <select id="log-type" name="type" class="form-control">
                  <option value="weight">${isEs ? 'Nuevo peso (kg)' : 'New weight (kg)'}</option>
                  <option value="symptom">${isEs ? 'Síntoma / Episodio' : 'Symptom / Episode'}</option>
                  <option value="med">${isEs ? 'Medicación / Vacuna' : 'Medication / Vaccine'}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="log-weight">${isEs ? 'Peso (si aplica, kg)' : 'Weight (if applicable, kg)'}</label>
                <input id="log-weight" name="weightKg" type="number" step="0.1" min="0.1" class="form-control" placeholder="${escapeHtml(activePet.weightKg)}" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="log-note">${isEs ? 'Detalle o nota' : 'Details / note'}</label>
              <input id="log-note" name="note" type="text" class="form-control" required placeholder="${isEs ? 'Ej: Desparasitación interna, o pesaje mensual' : 'E.g. Monthly weigh-in or deworming'}" />
            </div>
            <button type="submit" id="btn-save-log" class="btn btn-primary btn-block">
              ${isEs ? 'Guardar en diario' : 'Save to diary'}
            </button>
          </form>

          <div style="margin-top:16px;">
            <div style="font-size:0.84rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">
              ${isEs ? 'Últimos registros' : 'Recent entries'}
            </div>
            ${
              (activePet.logs || []).length === 0
                ? `<div style="font-size:0.85rem; color:var(--text-muted);">${isEs ? 'Sin registros aún.' : 'No entries yet.'}</div>`
                : (activePet.logs || [])
                    .slice(0, 5)
                    .map(
                      (l) => `
                  <div style="padding:8px 0; border-bottom:1px solid var(--border-subtle); font-size:0.86rem;">
                    <span style="color:var(--text-muted); font-variant-numeric:tabular-nums;">${escapeHtml(l.date)}</span> —
                    <span>${escapeHtml(l.note)}</span>
                  </div>
                `
                    )
                    .join('')
            }
          </div>
        </div>

        <div class="card">
          <div class="card-title">${icon('plus', 18)} <span>${isEs ? 'Añadir nueva mascota' : 'Add a new pet'}</span></div>
          <form id="form-add-pet" data-action="submit-pet">
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label" for="pet-name">${isEs ? 'Nombre' : 'Name'}</label>
                <input id="pet-name" name="name" type="text" class="form-control" required placeholder="Coco" />
              </div>
              <div class="form-group">
                <label class="form-label" for="pet-species">${isEs ? 'Especie' : 'Species'}</label>
                <select id="pet-species" name="species" class="form-control">
                  <option value="dog">${isEs ? 'Perro' : 'Dog'}</option>
                  <option value="cat">${isEs ? 'Gato' : 'Cat'}</option>
                </select>
              </div>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label" for="pet-weight">${isEs ? 'Peso (kg)' : 'Weight (kg)'}</label>
                <input id="pet-weight" name="weightKg" type="number" step="0.1" min="0.1" class="form-control" required placeholder="8.5" />
              </div>
              <div class="form-group">
                <label class="form-label" for="pet-age">${isEs ? 'Edad (años)' : 'Age (years)'}</label>
                <input id="pet-age" name="ageYears" type="number" step="1" min="0" max="30" class="form-control" required placeholder="3" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="pet-breed">${isEs ? 'Raza' : 'Breed'}</label>
              <input id="pet-breed" name="breed" type="text" class="form-control" placeholder="${isEs ? 'Mestizo, Labrador, Siamés...' : 'Mixed, Lab, Siamese...'}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="pet-allergies">${isEs ? 'Alergias o condiciones' : 'Allergies or chronic conditions'}</label>
              <input id="pet-allergies" name="allergies" type="text" class="form-control" placeholder="${isEs ? 'Opcional' : 'Optional'}" />
            </div>
            <button type="submit" id="btn-create-pet" class="btn btn-primary btn-block">
              ${isEs ? 'Crear perfil de mascota' : 'Create pet profile'}
            </button>
          </form>
        </div>
      </div>
    </section>
  `;
}
