import { COST_REGIONS, COST_SCENARIOS, estimateCost } from '../data/clinicalData.js';
import { escapeHtml } from '../state/store.js';
import { icon } from '../utils/icons.js';

export function renderCostsView(state) {
  const { lang, costDraft } = state;
  const isEs = lang === 'es';
  const est = estimateCost(costDraft);
  const suffix = est.region.suffix || '';

  const monthlyBudget = Number(costDraft.insuranceMonthly || 28);
  const yearlySavings = Math.round(monthlyBudget * 12);
  const avgMidCost = Math.round((est.totalMin + est.totalMax) / 2);

  return `
    <section class="page-section" aria-labelledby="costs-heading">
      <div class="page-header">
        <h1 id="costs-heading">${isEs ? 'Estimador de Costes Veterinarios' : 'Vet Cost Estimator'}</h1>
        <p>${
          isEs
            ? 'Rangos orientativos transparentes para evitar sorpresas en la factura.'
            : 'Transparent price ranges so you never get hit with unexpected bill shock.'
        }</p>
      </div>

      <div class="card">
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label" for="cost-region">${isEs ? 'Región / Moneda' : 'Region / Currency'}</label>
            <select id="cost-region" class="form-control" data-action="change-cost-region">
              ${COST_REGIONS.map(
                (r) => `<option value="${r.id}" ${r.id === costDraft.regionId ? 'selected' : ''}>${escapeHtml(r.label[lang])}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="cost-scenario">${isEs ? 'Escenario o procedimiento' : 'Clinical scenario'}</label>
            <select id="cost-scenario" class="form-control" data-action="change-cost-scenario">
              ${COST_SCENARIOS.map(
                (s) => `<option value="${s.id}" ${s.id === costDraft.scenarioId ? 'selected' : ''}>${escapeHtml(s.label[lang])}</option>`
              ).join('')}
            </select>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">${isEs ? 'Tipo de clínica' : 'Clinic type'}</label>
            <div class="segmented-control">
              <button type="button" class="seg-btn ${costDraft.clinicType === 'regular' ? 'active' : ''}" data-action="set-cost-clinic" data-clinic="regular">
                ${icon('sun', 15)}
                <span>${isEs ? 'Diurna' : 'Daytime'}</span>
              </button>
              <button type="button" id="btn-cost-er" class="seg-btn ${costDraft.clinicType === 'emergency' ? 'active' : ''}" data-action="set-cost-clinic" data-clinic="emergency">
                ${icon('moon', 15)}
                <span>${isEs ? 'Urgencias (+65%)' : 'ER (+65%)'}</span>
              </button>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">${isEs ? 'Tamaño mascota' : 'Pet size'}</label>
            <div class="segmented-control">
              ${[
                { id: 'small', es: '<10 kg', en: '<10 kg' },
                { id: 'medium', es: '10-25 kg', en: '10-25 kg' },
                { id: 'large', es: '>25 kg', en: '>25 kg' },
              ]
                .map(
                  (sz) => `
                <button type="button" class="seg-btn ${costDraft.petSize === sz.id ? 'active' : ''}" data-action="set-cost-size" data-size="${sz.id}">
                  ${sz[lang]}
                </button>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="cost-total-banner">
          <div>
            <div style="font-size:0.82rem; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">
              ${isEs ? 'Rango total estimado' : 'Estimated Total Range'}
            </div>
            <div style="font-size:0.88rem; color:var(--text-secondary);">
              ${escapeHtml(est.scenario.label[lang])}
            </div>
          </div>
          <div class="cost-amount" id="cost-total-display">
            ${est.region.currency}${est.totalMin.toLocaleString()} – ${est.region.currency}${est.totalMax.toLocaleString()}${suffix}
          </div>
        </div>

        <div>
          ${est.breakdown
            .map(
              (row) => `
            <div class="cost-row">
              <span>${escapeHtml(row.name[lang])}</span>
              <span class="cost-range">${est.region.currency}${row.min.toLocaleString()} – ${est.region.currency}${row.max.toLocaleString()}${suffix}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">${icon('shield', 18)} <span>${isEs ? 'Simulador: ¿Seguro o Hucha propia?' : 'Simulator: Insurance vs. Self-Fund?'}</span></div>
          <div class="form-group">
            <label class="form-label" for="ins-slider">
              ${isEs ? 'Presupuesto mensual:' : 'Monthly budget:'} <strong id="ins-budget-label">${est.region.currency}${monthlyBudget}/${isEs ? 'mes' : 'mo'}</strong>
            </label>
            <input
              id="ins-slider"
              type="range"
              min="10"
              max="120"
              step="2"
              value="${monthlyBudget}"
              data-action="change-ins-budget"
              style="width:100%; accent-color:var(--primary);"
            />
          </div>
          <div style="font-size:0.88rem; color:var(--text-secondary); line-height:1.5;">
            <div>${isEs ? 'Ahorro acumulado en 1 año:' : '1-year saved fund:'} <strong id="ins-yearly-display">${est.region.currency}${yearlySavings.toLocaleString()}${suffix}</strong></div>
            <div id="ins-advice-display">${
              yearlySavings >= avgMidCost
                ? (isEs ? 'Tu hucha anual cubriría este escenario sin seguro.' : 'Your 1-year fund covers this scenario without insurance.')
                : (isEs ? 'Un seguro con cobertura de urgencias evitaría pagar la diferencia de golpe.' : 'Emergency pet insurance would buffer the gap.')
            }</div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">${icon('info', 18)} <span>${isEs ? '3 preguntas para evitar sorpresas' : '3 questions to prevent surprise bills'}</span></div>
          <ul style="margin:0; padding-left:18px; color:var(--text-secondary); font-size:0.88rem;">
            <li style="margin-bottom:5px;">${isEs ? '«¿Podemos acordar un presupuesto por escrito antes de pruebas extra?»' : '"Can we review a written estimate before extra diagnostics?"'}</li>
            <li style="margin-bottom:5px;">${isEs ? '«¿Qué pruebas son críticas hoy y cuáles opcionales?»' : '"Which tests are essential today vs. optional?"'}</li>
            <li>${isEs ? '«¿Existe alternativa en comprimidos si no necesita ingreso?»' : '"Is there an oral alternative if hospitalization isn’t needed?"'}</li>
          </ul>
        </div>
      </div>
    </section>
  `;
}
