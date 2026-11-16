import { escapeHtml, MAX_PETS } from '../state/store.js';
import { icon, speciesIcon } from '../utils/icons.js';
import { SPECIES_LIST, getSpeciesLabel } from '../data/clinicalData.js';

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
  const atLimit = pets.length >= MAX_PETS;
  const hasPets = pets.length > 0;

  return `
    <section class="page-section" aria-labelledby="pets-heading">
      <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:10px;">
        <div>
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <h1 id="pets-heading" style="margin:0;">${isEs ? 'Mis Mascotas y Diario' : 'My Pets & Health Diary'}</h1>
            <span id="pet-count-badge" style="background:var(--primary-soft); color:var(--primary); font-size:0.8rem; font-weight:700; padding:4px 10px; border-radius:999px;">
              ${pets.length} / ${MAX_PETS} ${isEs ? 'mascotas' : 'pets'}
            </span>
          </div>
          <p>${
            isEs
              ? 'Añade hasta 5 mascotas reales (perros, gatos, conejos, aves, roedores y reptiles), guarda documentos y visitas.'
              : 'Add up to 5 real pets (dogs, cats, rabbits, birds, rodents, reptiles), save documents and vet visits.'
          }</p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          ${
            hasPets
              ? `<button type="button" id="btn-export-backup" class="btn btn-secondary" style="min-height:38px; font-size:0.84rem;" data-action="export-backup">
                  ${icon('download', 16)}
                  <span>${isEs ? 'Exportar Backup JSON' : 'Export JSON Backup'}</span>
                </button>`
              : ''
          }
          <button type="button" id="btn-reset-all-data" class="btn btn-danger-soft" style="min-height:38px; font-size:0.84rem;" data-action="open-reset-confirm">
            ${icon('trash', 15)}
            <span>${isEs ? 'Borrar todos los datos' : 'Erase all data'}</span>
          </button>
        </div>
      </div>

      ${
        state.showResetConfirm
          ? `<div id="reset-confirm-banner" class="card" style="background:var(--emergency-bg); border-color:var(--emergency-border);">
              <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                <div>
                  <strong style="color:var(--emergency-text); display:flex; align-items:center; gap:6px; font-size:0.96rem;">
                    ${icon('alert', 16)}
                    <span>${isEs ? '¿Seguro que quieres borrar todos los datos?' : 'Are you sure you want to erase all data?'}</span>
                  </strong>
                  <p style="margin:4px 0 0; font-size:0.86rem; color:var(--text-secondary);">
                    ${isEs ? 'Se eliminarán todas las mascotas, historial, visitas, documentos y volverás a la pantalla de configuración inicial.' : 'All pets, logs, vet visits, and documents will be deleted and the app will return to initial setup.'}
                  </p>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  <button type="button" id="btn-confirm-reset-all" class="btn" style="background:var(--emergency-solid); color:#fff; min-height:38px; font-size:0.84rem;" data-action="confirm-reset-all">
                    ${icon('trash', 14)}
                    <span>${isEs ? 'Sí, borrar todo' : 'Yes, erase everything'}</span>
                  </button>
                  <button type="button" id="btn-cancel-reset-all" class="btn btn-secondary" style="min-height:38px; font-size:0.84rem;" data-action="cancel-reset-all">
                    <span>${isEs ? 'Cancelar' : 'Cancel'}</span>
                  </button>
                </div>
              </div>
            </div>`
          : ''
      }

      <div id="add-pet-card" class="card" style="border-color:var(--primary-soft-border);">
        <div class="card-title">${icon('plus', 18)} <span>${isEs ? `Añadir nueva mascota (${pets.length}/${MAX_PETS})` : `Add a new pet (${pets.length}/${MAX_PETS})`}</span></div>
        ${
          atLimit
            ? `<div id="pet-limit-notice" style="padding:14px; border-radius:var(--radius-sm); background:var(--warning-soft, rgba(245,158,11,0.12)); border:1px solid var(--border-subtle); font-size:0.9rem; color:var(--text-primary);">
                <strong>${isEs ? 'Límite de 5 mascotas alcanzado.' : '5-pet limit reached.'}</strong>
                <p style="margin:6px 0 0; color:var(--text-secondary);">
                  ${isEs ? 'Elimina una mascota existente abajo si deseas añadir un perfil nuevo.' : 'Remove an existing pet below if you want to add a new profile.'}
                </p>
              </div>`
            : `<form id="form-add-pet" data-action="submit-pet">
                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label" for="pet-name">${isEs ? 'Nombre de tu mascota' : 'Pet name'}</label>
                    <input id="pet-name" name="name" type="text" class="form-control" required placeholder="${isEs ? 'Ej: Coco, Kira, Tuga...' : 'E.g. Coco, Kira, Tuga...'}" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="pet-species">${isEs ? 'Especie / Animal' : 'Species / Animal'}</label>
                    <select id="pet-species" name="species" class="form-control">
                      ${SPECIES_LIST.map(
                        (sp) => `<option value="${escapeHtml(sp.id)}">${escapeHtml(sp.label[lang])}</option>`
                      ).join('')}
                    </select>
                  </div>
                </div>
                <div class="grid-3">
                  <div class="form-group">
                    <label class="form-label" for="pet-weight">${isEs ? 'Peso (kg)' : 'Weight (kg)'}</label>
                    <input id="pet-weight" name="weightKg" type="number" step="0.01" min="0.02" class="form-control" required placeholder="2.5" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="pet-age">${isEs ? 'Edad (años)' : 'Age (years)'}</label>
                    <input id="pet-age" name="ageYears" type="number" step="1" min="0" max="60" class="form-control" required placeholder="3" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="pet-breed">${isEs ? 'Raza / Variedad' : 'Breed / Variety'}</label>
                    <input id="pet-breed" name="breed" type="text" class="form-control" placeholder="${isEs ? 'Belier, Agapornis, Mestizo...' : 'Lop, Lovebird, Mixed...'}" />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label" for="pet-allergies">${isEs ? 'Alergias o condiciones médicas' : 'Allergies or chronic conditions'}</label>
                  <input id="pet-allergies" name="allergies" type="text" class="form-control" placeholder="${isEs ? 'Opcional' : 'Optional'}" />
                </div>
                <button type="submit" id="btn-create-pet" class="btn btn-primary btn-block">
                  ${icon('plus', 16)}
                  <span>${isEs ? 'Crear perfil de mascota' : 'Create pet profile'}</span>
                </button>
              </form>`
        }
      </div>

      ${
        !hasPets
          ? `<div class="card" style="text-align:center; padding:28px 20px;">
              <div style="color:var(--primary); margin-bottom:8px;">${icon('paw', 28)}</div>
              <h2 style="font-size:1.1rem; margin-bottom:6px;">${isEs ? 'Aún no has añadido ninguna mascota' : 'You haven’t added any pets yet'}</h2>
              <p style="margin:0; font-size:0.9rem; color:var(--text-secondary);">
                ${isEs ? 'Rellena el formulario de arriba para registrar tu primera mascota real y activar su diario, recordatorios, visitas y documentos.' : 'Fill out the form above to register your first real pet and unlock their diary, reminders, vet visits, and documents.'}
              </p>
            </div>`
          : `
            <div class="grid-2" style="margin-bottom:18px;">
              ${pets
                .map((pet) => {
                  const isActive = pet.id === activePet.id;
                  const petIcon = speciesIcon(pet.species, 18);
                  const spLabel = getSpeciesLabel(pet.species, lang);
                  return `
                    <div class="pet-card ${isActive ? 'active-pet' : ''}">
                      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                        <div>
                          <div style="display:flex; align-items:center; gap:7px; font-size:1.15rem; font-weight:800; font-family:var(--font-display);">
                            <span style="color:var(--primary);">${petIcon}</span>
                            <span>${escapeHtml(pet.name)}</span>
                          </div>
                          <div style="font-size:0.84rem; color:var(--text-secondary);">
                            ${escapeHtml(spLabel)} · ${escapeHtml(pet.breed)} · ${escapeHtml(pet.ageYears)} ${isEs ? 'años' : 'yrs'} · <strong>${escapeHtml(pet.weightKg)} kg</strong>
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

                      <div style="margin-top:10px; text-align:right;">
                        <button type="button" class="btn btn-danger-soft" style="min-height:32px; padding:4px 10px; font-size:0.78rem;" data-action="delete-pet" data-pet-id="${escapeHtml(pet.id)}">
                          ${icon('trash', 13)}
                          <span>${isEs ? 'Eliminar' : 'Remove'}</span>
                        </button>
                      </div>
                    </div>
                  `;
                })
                .join('')}
            </div>

            <div class="grid-2">
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
                  <input name="title" type="text" class="form-control" style="flex:2; min-width:160px;" required placeholder="${isEs ? 'Ej: Pipeta antipulgas' : 'E.g. Flea treatment'}" />
                  <select name="freqDays" class="form-control" style="flex:1; min-width:120px;">
                    <option value="1">${isEs ? 'Diario' : 'Daily'}</option>
                    <option value="30" selected>${isEs ? 'Mensual (30d)' : 'Monthly (30d)'}</option>
                    <option value="90">${isEs ? 'Trimestral (90d)' : 'Quarterly (90d)'}</option>
                    <option value="365">${isEs ? 'Anual' : 'Yearly'}</option>
                  </select>
                  <button type="submit" class="btn btn-primary">${icon('plus', 15)} <span>${isEs ? 'Añadir' : 'Add'}</span></button>
                </form>
              </div>

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
                      <input id="log-weight" name="weightKg" type="number" step="0.01" min="0.02" class="form-control" placeholder="${escapeHtml(activePet.weightKg)}" />
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
            </div>

            ${renderVetVisitsAndDocs(activePet, lang)}
          `
      }
    </section>
  `;
}

function formatBytes(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function getDocCategoryLabel(cat, lang) {
  const map = {
    lab: { es: 'Analítica / Lab', en: 'Lab Result' },
    vaccine: { es: 'Cartilla / Vacuna', en: 'Vaccine Record' },
    rx: { es: 'Receta', en: 'Prescription' },
    imaging: { es: 'Radiografía / Eco', en: 'X-Ray / Ultrasound' },
    invoice: { es: 'Factura', en: 'Invoice' },
    other: { es: 'Otro', en: 'Other' },
  };
  return (map[cat] || map.other)[lang] || (map[cat] || map.other).es;
}

function renderVetVisitsAndDocs(activePet, lang) {
  const isEs = lang === 'es';
  const today = new Date().toISOString().slice(0, 10);
  const visits = activePet.vetVisits || [];
  const docs = activePet.documents || [];

  return `
    <div class="grid-2" style="margin-top:18px;">
      <div class="card">
        <div class="card-title">${icon('calendar', 18)} <span>${isEs ? `Visitas al Veterinario (${escapeHtml(activePet.name)})` : `Vet Visits (${escapeHtml(activePet.name)})`}</span></div>
        <form id="form-add-vet-visit" data-action="submit-vet-visit">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="visit-date">${isEs ? 'Fecha' : 'Date'}</label>
              <input id="visit-date" name="date" type="date" class="form-control" required value="${today}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="visit-cost">${isEs ? 'Coste (opcional)' : 'Cost (optional)'}</label>
              <input id="visit-cost" name="cost" type="number" step="0.01" min="0" class="form-control" placeholder="55" />
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="visit-clinic">${isEs ? 'Clínica / Veterinario' : 'Clinic / Vet'}</label>
              <input id="visit-clinic" name="clinic" type="text" class="form-control" placeholder="${isEs ? 'Clínica Central' : 'Central Vet Clinic'}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="visit-reason">${isEs ? 'Motivo' : 'Reason'}</label>
              <input id="visit-reason" name="reason" type="text" class="form-control" required placeholder="${isEs ? 'Vacuna, revisión, urgencia...' : 'Vaccine, checkup, ER...'}" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="visit-diagnosis">${isEs ? 'Diagnóstico / Tratamiento' : 'Diagnosis / Treatment'}</label>
            <input id="visit-diagnosis" name="diagnosis" type="text" class="form-control" placeholder="${isEs ? 'Medicación recetada, próxima revisión...' : 'Prescribed meds, follow-up notes...'}" />
          </div>
          <button type="submit" id="btn-save-visit" class="btn btn-primary btn-block">
            ${icon('plus', 15)}
            <span>${isEs ? 'Guardar visita' : 'Save vet visit'}</span>
          </button>
        </form>

        <div id="vet-visits-list" style="margin-top:16px;">
          <div style="font-size:0.84rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">
            ${isEs ? `Historial de visitas (${visits.length})` : `Visit history (${visits.length})`}
          </div>
          ${
            visits.length === 0
              ? `<div style="font-size:0.85rem; color:var(--text-muted);">${isEs ? 'Sin visitas registradas para esta mascota.' : 'No vet visits recorded for this pet yet.'}</div>`
              : visits
                  .map(
                    (v) => `
                <div class="visit-item" style="padding:10px 12px; border:1px solid var(--border-subtle); border-radius:var(--radius-sm); margin-bottom:8px;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                    <div>
                      <div style="font-weight:700; font-size:0.9rem;">${escapeHtml(v.reason)}</div>
                      <div style="font-size:0.8rem; color:var(--text-muted);">
                        ${escapeHtml(v.date)}${v.clinic ? ` · ${escapeHtml(v.clinic)}` : ''}${Number.isFinite(Number(v.cost)) && Number(v.cost) > 0 ? ` · <strong>${escapeHtml(v.cost)}</strong>` : ''}
                      </div>
                    </div>
                    <button type="button" class="btn btn-danger-soft" style="min-height:28px; padding:4px 8px; font-size:0.75rem;" data-action="delete-vet-visit" data-visit-id="${escapeHtml(v.id)}" aria-label="${isEs ? 'Eliminar visita' : 'Delete visit'}">
                      ${icon('trash', 13)}
                    </button>
                  </div>
                  ${v.diagnosis ? `<div style="font-size:0.84rem; color:var(--text-secondary); margin-top:6px;">${escapeHtml(v.diagnosis)}</div>` : ''}
                </div>
              `
                  )
                  .join('')
          }
        </div>
      </div>

      <div class="card">
        <div class="card-title">${icon('fileText', 18)} <span>${isEs ? `Documentos Clínicos (${escapeHtml(activePet.name)})` : `Clinical Documents (${escapeHtml(activePet.name)})`}</span></div>
        <form id="form-add-doc" data-action="submit-doc">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="doc-title">${isEs ? 'Título (opcional)' : 'Title (optional)'}</label>
              <input id="doc-title" name="title" type="text" class="form-control" placeholder="${isEs ? 'Analítica noviembre, Cartilla...' : 'Nov bloodwork, Vaccine card...'}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="doc-category">${isEs ? 'Categoría' : 'Category'}</label>
              <select id="doc-category" name="category" class="form-control">
                <option value="lab">${isEs ? 'Analítica / Lab' : 'Lab Result'}</option>
                <option value="vaccine">${isEs ? 'Cartilla / Vacuna' : 'Vaccine Record'}</option>
                <option value="rx">${isEs ? 'Receta' : 'Prescription'}</option>
                <option value="imaging">${isEs ? 'Radiografía / Eco' : 'X-Ray / Ultrasound'}</option>
                <option value="invoice">${isEs ? 'Factura' : 'Invoice'}</option>
                <option value="other">${isEs ? 'Otro' : 'Other'}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="doc-file">${isEs ? 'Archivo (PDF, imagen, texto — máx. 1.5 MB)' : 'File (PDF, image, text — max 1.5 MB)'}</label>
            <input id="doc-file" name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.doc,.docx" class="form-control" required />
          </div>
          <button type="submit" id="btn-save-doc" class="btn btn-primary btn-block">
            ${icon('upload', 15)}
            <span>${isEs ? 'Guardar documento' : 'Save document'}</span>
          </button>
        </form>

        <div id="pet-docs-list" style="margin-top:16px;">
          <div style="font-size:0.84rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">
            ${isEs ? `Documentos guardados (${docs.length})` : `Saved documents (${docs.length})`}
          </div>
          ${
            docs.length === 0
              ? `<div style="font-size:0.85rem; color:var(--text-muted);">${isEs ? 'Aún no hay documentos adjuntos para esta mascota.' : 'No documents attached for this pet yet.'}</div>`
              : docs
                  .map(
                    (d) => `
                <div class="doc-item" style="display:flex; justify-content:space-between; align-items:center; gap:8px; padding:10px 12px; border:1px solid var(--border-subtle); border-radius:var(--radius-sm); margin-bottom:8px;">
                  <div style="min-width:0;">
                    <div style="display:flex; align-items:center; gap:6px; font-weight:700; font-size:0.9rem;">
                      <span style="color:var(--primary); flex-shrink:0;">${icon('fileText', 15)}</span>
                      <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(d.title)}</span>
                    </div>
                    <div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">
                      ${escapeHtml(getDocCategoryLabel(d.category, lang))} · ${escapeHtml(formatBytes(d.sizeBytes))} · ${escapeHtml(d.uploadedAt)}
                    </div>
                  </div>
                  <div style="display:flex; gap:6px; flex-shrink:0;">
                    <a
                      href="${escapeHtml(d.dataUrl)}"
                      download="${escapeHtml(d.fileName)}"
                      class="btn btn-secondary"
                      style="min-height:30px; padding:4px 9px; font-size:0.78rem;"
                      title="${isEs ? 'Descargar documento' : 'Download document'}"
                    >
                      ${icon('download', 13)}
                    </a>
                    <button
                      type="button"
                      class="btn btn-danger-soft"
                      style="min-height:30px; padding:4px 8px; font-size:0.78rem;"
                      data-action="delete-doc"
                      data-doc-id="${escapeHtml(d.id)}"
                      aria-label="${isEs ? 'Eliminar documento' : 'Delete document'}"
                    >
                      ${icon('trash', 13)}
                    </button>
                  </div>
                </div>
              `
                  )
                  .join('')
          }
        </div>
      </div>
    </div>
  `;
}
