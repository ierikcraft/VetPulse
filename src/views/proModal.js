export function renderProModal(state) {
  if (!state.showProModal) return '';
  const isEs = state.lang === 'es';

  return `
    <div class="modal-backdrop" id="pro-modal-backdrop" data-action="close-pro-backdrop" role="dialog" aria-modal="true" aria-labelledby="pro-modal-title">
      <div class="modal-panel">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="background:var(--primary-soft); color:var(--primary); font-weight:800; font-size:0.78rem; padding:4px 10px; border-radius:999px;">
            VETPULSE PRO
          </span>
          <button type="button" id="btn-close-pro" class="btn btn-secondary" style="min-height:34px; padding:4px 10px;" data-action="close-pro" aria-label="Close">
            ✕
          </button>
        </div>

        <h2 id="pro-modal-title" style="font-size:1.35rem; margin-bottom:6px;">
          ${isEs ? 'Tranquilidad 24/7 para toda tu manada' : '24/7 Peace of Mind for Your Whole Pack'}
        </h2>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin:0 0 16px;">
          ${isEs
            ? 'Evita visitas innecesarias de urgencias y lleva el historial clínico siempre contigo.'
            : 'Avoid unnecessary ER trips and keep your pet’s clinical history ready anytime.'}
        </p>

        <ul style="margin:0 0 18px; padding-left:18px; font-size:0.9rem; color:var(--text-primary);">
          <li style="margin-bottom:6px;">✅ ${isEs ? 'Mascotas ilimitadas y alertas de medicación' : 'Unlimited pets & medication reminders'}</li>
          <li style="margin-bottom:6px;">✅ ${isEs ? 'Historial exportable en PDF para cualquier clínica' : 'Exportable PDF clinical history for any clinic'}</li>
          <li style="margin-bottom:6px;">✅ ${isEs ? 'Base completa de +150 alimentos y plantas tóxicas' : 'Full database of 150+ toxic foods & plants'}</li>
          <li>✅ ${isEs ? 'Comparador de presupuestos veterinarios por zona' : 'Local vet price benchmark comparison'}</li>
        </ul>

        <div style="background:var(--bg-subtle); border-radius:var(--radius-md); padding:14px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:800; font-size:1.1rem;">$39 / ${isEs ? 'año' : 'year'}</div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">${isEs ? '7 días gratis · Cancela en 1 clic' : '7-day free trial · Cancel anytime'}</div>
          </div>
          <span style="background:var(--primary); color:#fff; font-size:0.75rem; font-weight:700; padding:4px 8px; border-radius:6px;">
            ${isEs ? 'Ahorra 53%' : 'Save 53%'}
          </span>
        </div>

        <button type="button" id="btn-activate-pro" class="btn btn-primary btn-block" data-action="activate-pro">
          ${state.isPro ? (isEs ? '✓ Plan Pro Activo' : '✓ Pro Plan Active') : (isEs ? 'Probar 7 días gratis' : 'Start 7-Day Free Trial')}
        </button>
      </div>
    </div>
  `;
}
