import { TOXINS_DB, FOOD_PLANT_GUIDE, getSpeciesLabel } from '../data/clinicalData.js';
import { escapeHtml } from '../state/store.js';
import { icon } from '../utils/icons.js';

export function renderToxinsView(state, activePet) {
  const { lang, toxinDraft } = state;
  const isEs = lang === 'es';
  const selectedToxin = TOXINS_DB.find((t) => t.id === toxinDraft.toxinId) || TOXINS_DB[0];

  const q = (toxinDraft.guideQuery || '').trim().toLowerCase();
  const f = toxinDraft.guideFilter || 'all';
  const filteredGuide = FOOD_PLANT_GUIDE.filter((item) => {
    const matchCat = f === 'all' || item.cat === f;
    const matchQuery = !q || item.name[lang].toLowerCase().includes(q) || item.note[lang].toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  const spLabel = getSpeciesLabel(activePet.species, lang);

  return `
    <section class="page-section" aria-labelledby="toxins-heading">
      <div class="page-header">
        <h1 id="toxins-heading">${isEs ? 'Calculadora de Tóxicos y Guía Segura' : 'Toxin Calculator & Safety Guide'}</h1>
        <p>${
          isEs
            ? `Cálculo por peso para <strong>${escapeHtml(activePet.name)}</strong> (${escapeHtml(activePet.weightKg)} kg — ${escapeHtml(spLabel)}).`
            : `Weight-based check for <strong>${escapeHtml(activePet.name)}</strong> (${escapeHtml(activePet.weightKg)} kg — ${escapeHtml(spLabel)}).`
        }</p>
      </div>

      <div class="card">
        <div class="card-title">${icon('flask', 18)} <span>${isEs ? 'Calculadora de dosis tóxica (mg/kg)' : 'Toxic Dose Calculator (mg/kg)'}</span></div>
        <div class="form-group">
          <label class="form-label" for="toxin-select">${isEs ? '¿Qué ha ingerido o tocado?' : 'What did your pet ingest or touch?'}</label>
          <select id="toxin-select" class="form-control" data-action="change-toxin">
            ${TOXINS_DB.map(
              (t) => `
              <option value="${t.id}" ${t.id === selectedToxin.id ? 'selected' : ''}>
                ${escapeHtml(t.name[lang])}
              </option>
            `
            ).join('')}
          </select>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label" for="toxin-amount">
              ${isEs ? 'Cantidad aproximada en' : 'Approx. amount in'} ${escapeHtml(selectedToxin.unitLabel[lang])}
            </label>
            <input
              id="toxin-amount"
              type="number"
              min="0.1"
              step="any"
              class="form-control"
              value="${escapeHtml(toxinDraft.amount)}"
              data-action="change-toxin-amount"
            />
          </div>
          <div class="form-group">
            <label class="form-label" for="toxin-pet-weight">${isEs ? 'Peso usado (kg)' : 'Pet weight used (kg)'}</label>
            <input
              id="toxin-pet-weight"
              type="number"
              class="form-control"
              value="${escapeHtml(activePet.weightKg)}"
              disabled
              title="${isEs ? 'Edita el peso en la pestaña Mascotas' : 'Edit weight in the Pets tab'}"
            />
          </div>
        </div>

        <button type="button" id="btn-calc-toxin" class="btn btn-primary btn-block" data-action="calc-toxin">
          ${icon('flask', 17)}
          <span>${isEs ? 'Calcular riesgo tóxico' : 'Calculate Toxic Risk'}</span>
        </button>
      </div>

      ${renderToxinResult(toxinDraft.result, activePet, lang)}

      <div class="card" style="margin-top:16px;">
        <div class="card-title">${icon('search', 18)} <span>${isEs ? '¿Puede comer o tocar esto? (Buscador rápido)' : 'Can my pet eat or touch this? (Quick Finder)'}</span></div>
        <div class="form-group">
          <input
            id="guide-search"
            type="search"
            class="form-control"
            placeholder="${isEs ? 'Buscar alimento, planta o fármaco (ej: manzana, lirio, queso...)' : 'Search food, plant, or med (e.g., apple, lily, cheese...)'}"
            value="${escapeHtml(toxinDraft.guideQuery || '')}"
            data-action="search-guide"
          />
        </div>

        <div class="category-tabs" style="margin-bottom:12px;">
          ${[
            { id: 'all', es: 'Todos', en: 'All' },
            { id: 'fruit', es: 'Frutas/Verduras', en: 'Fruits/Veggies' },
            { id: 'human', es: 'Comida Humana', en: 'Human Food' },
            { id: 'plant', es: 'Plantas', en: 'Plants' },
            { id: 'meds', es: 'Fármacos', en: 'Meds' },
          ]
            .map(
              (cat) => `
            <button
              type="button"
              class="cat-pill ${f === cat.id ? 'active' : ''}"
              data-action="filter-guide"
              data-filter="${cat.id}"
            >
              ${cat[lang]}
            </button>
          `
            )
            .join('')}
        </div>

        <div id="guide-results-grid" class="guide-grid">
          ${renderGuideCards(filteredGuide, lang)}
        </div>
      </div>
    </section>
  `;
}

export function renderGuideCards(items, lang) {
  const isEs = lang === 'es';
  if (items.length === 0) {
    return `<div style="color:var(--text-muted); font-size:0.9rem;">${isEs ? 'Sin coincidencias. Si tienes duda, consulta con tu veterinario.' : 'No matches found. When in doubt, ask your vet.'}</div>`;
  }
  const badgeLabel = {
    safe: `${icon('check', 12)} <span>${isEs ? 'Seguro' : 'Safe'}</span>`,
    caution: `${icon('alert', 12)} <span>${isEs ? 'Precaución' : 'Caution'}</span>`,
    toxic: `${icon('ban', 12)} <span>${isEs ? 'Tóxico' : 'Toxic'}</span>`,
  };
  return items
    .map(
      (item) => `
    <div class="guide-item">
      <span class="status-pill ${item.status}">${badgeLabel[item.status]}</span>
      <strong style="font-size:0.94rem;">${escapeHtml(item.name[lang])}</strong>
      <span style="font-size:0.83rem; color:var(--text-secondary);">${escapeHtml(item.note[lang])}</span>
      ${
        item.toxinId
          ? `<button type="button" class="btn btn-secondary" style="min-height:34px; padding:4px 10px; font-size:0.78rem; margin-top:4px; width:fit-content;" data-action="pick-toxin" data-toxin-id="${item.toxinId}">
              ${isEs ? 'Calcular dosis arriba' : 'Calculate dose above'}
            </button>`
          : ''
      }
    </div>
  `
    )
    .join('');
}

function renderToxinResult(result, activePet, lang) {
  if (!result) return '';
  const isEs = lang === 'es';

  if (!result.valid) {
    return `
      <div class="result-card vet24h" role="alert">
        <strong>${isEs ? 'Introduce una cantidad y un peso válidos mayores que 0.' : 'Please enter a valid amount and pet weight greater than 0.'}</strong>
      </div>
    `;
  }

  const levelMap = {
    critical: {
      cls: 'emergency',
      badge: isEs ? 'RIESGO CRÍTICO / EMERGENCIA' : 'CRITICAL RISK / EMERGENCY',
      title: isEs ? 'Acude a urgencias veterinarias de inmediato' : 'Go to an emergency vet immediately',
    },
    moderate: {
      cls: 'vet24h',
      badge: isEs ? 'RIESGO MODERADO' : 'MODERATE RISK',
      title: isEs ? 'Llama a tu veterinario hoy mismo' : 'Call your veterinarian today',
    },
    low: {
      cls: 'monitor',
      badge: isEs ? 'DOSIS BAJA — VIGILAR' : 'LOW DOSE — MONITOR',
      title: isEs ? 'Dosis por debajo del umbral agudo habitual' : 'Dose below typical acute threshold',
    },
  };

  const info = levelMap[result.risk];

  return `
    <div id="toxin-result-card" class="result-card ${info.cls}" role="region" aria-live="polite" style="margin-top:16px;">
      <div class="result-badge">${escapeHtml(info.badge)}</div>
      <h2 class="result-title">${escapeHtml(info.title)}</h2>
      <p style="margin:0 0 10px; font-weight:600;">
        ${isEs ? 'Exposición estimada:' : 'Estimated exposure:'}
        <span style="font-variant-numeric:tabular-nums;">${result.doseMgKg} mg/kg</span>
        (${escapeHtml(activePet.weightKg)} kg)
      </p>
      <p style="margin:0 0 14px; color:var(--text-secondary);">
        ${escapeHtml(result.toxin.mechanism[lang])}
      </p>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button type="button" id="btn-toxin-to-brief" class="btn btn-primary" data-action="go-brief">
          ${icon('clipboard', 16)}
          <span>${isEs ? 'Añadir a Ficha Vet' : 'Include in Vet Brief'}</span>
        </button>
        <button type="button" id="btn-toxin-to-costs" class="btn btn-secondary" data-action="go-costs">
          ${icon('wallet', 16)}
          <span>${isEs ? 'Estimar coste de urgencias' : 'Estimate ER cost'}</span>
        </button>
      </div>
    </div>
  `;
}
