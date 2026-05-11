const $ = (selector) => document.querySelector(selector);
const money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const today = new Date().toISOString().slice(0, 10);
const month = today.slice(0, 7);

const releaseStates = ['idea', 'producción', 'programado', 'en campaña', 'publicado'];
const contentStates = ['idea', 'grabado', 'editado', 'listo', 'publicado'];
const networks = ['TikTok', 'Instagram', 'YouTube Shorts', 'X'];
const categories = ['Producción', 'Mezcla/Master', 'Marketing', 'Arte', 'Video', 'Distribución', 'Equipo', 'Otros'];
const marketingTemplates = {
  single: ['Define un hook visual de 7 segundos y úsalo en 5 variaciones verticales.', 'Semana -3: anuncia portada, abre pre-save y comparte el concepto.', 'Semana -1: publica teaser del estribillo, letra destacada y behind the scenes.', 'Día 0: smartlink, live corto, stories con CTA y mensaje directo a fans clave.', 'Semana +1: versión acústica, dueto/remix UGC y prueba de anuncio con mejor clip.'],
  ep: ['Construye una narrativa por capítulos: una emoción o color para cada canción.', 'Semana -5: single foco + pre-save del EP y moodboard visual.', 'Semana -3: carrusel tracklist, snippets por canción y encuesta de favorita.', 'Día 0: listening party, vídeo manifiesto del EP y pitch a medios nicho.', 'Semana +2: contenido track-by-track, performance íntima y bundles de merch.'],
  album: ['Diseña una era completa: concepto, estética, paleta y calendario de 8 semanas.', 'Semana -8: anuncio de era, lead single, portada y lista de correos/WhatsApp.', 'Semana -4: segundo single, mini documental y colaboraciones con creadores.', 'Día 0: premiere, directo largo, campaña de prensa y contenido por territorios.', 'Semana +4: focus tracks, lyric videos, remixes, shows y retargeting a oyentes.'],
};

const firstReleaseId = crypto.randomUUID();
const defaults = {
  releases: [{ id: firstReleaseId, title: 'Neon Heart', artist: 'Luna Norte', releaseType: 'single', date: '2026-06-05', genre: 'Pop alternativo', mood: 'Nocturno', status: 'en campaña', budget: 1800, coverUrl: '', links: 'Drive assets, pre-save, smartlink', notes: 'Priorizar clips verticales y pitch a playlists independientes.', checklist: ['Master final', 'Canvas Spotify', 'Pitch editorial', 'Teasers semana -2'], tiktokIdeas: ['Hook del estribillo en POV', 'Historia del verso 1', 'Antes/después del demo'], editorialPitch: 'Canción pop alternativa nocturna sobre reconstruirse después de una ruptura, con producción sintética cálida y hook inmediato.', marketingPlan: '• Semana -4: assets y pre-save.\n• Semana -2: teasers diarios.\n• Semana 0: estreno + lives.\n• Semana +1: UGC y acústico.' }],
  expenses: [{ id: crypto.randomUUID(), date: today, concept: 'Diseño de portada', category: 'Arte', amount: 220, releaseId: firstReleaseId, provider: 'Estudio Prisma', status: 'pagado', notes: 'Incluye adaptaciones para plataformas.' }],
  contents: [{ id: crypto.randomUUID(), title: 'Teaser hook vertical', network: 'TikTok', releaseId: firstReleaseId, status: 'editado', publishDate: '2026-05-18', caption: 'El momento exacto en el que la canción cambió de color.', hashtags: '#newmusic #artistsoftiktok #indiepop', finalLink: 'Carpeta /Artist OS/Neon Heart/Teasers', notes: 'Añadir subtítulos grandes y CTA de pre-save.' }],
  monthlyLimit: 2500,
};

const state = {
  active: 'dashboard',
  releases: read('artist-os-releases', defaults.releases),
  expenses: read('artist-os-expenses', defaults.expenses),
  contents: read('artist-os-content', defaults.contents),
  monthlyLimit: read('artist-os-monthly-limit', defaults.monthlyLimit),
  ideaGenre: 'Pop alternativo',
  ideaMood: 'Eufórico',
  ideaGoal: 'pre-save',
};

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function persist() {
  localStorage.setItem('artist-os-releases', JSON.stringify(state.releases));
  localStorage.setItem('artist-os-expenses', JSON.stringify(state.expenses));
  localStorage.setItem('artist-os-content', JSON.stringify(state.contents));
  localStorage.setItem('artist-os-monthly-limit', JSON.stringify(state.monthlyLimit));
}
const esc = (value = '') => String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
const releaseName = (id) => state.releases.find((release) => release.id === id)?.title || 'Sin release';
const options = (items, selected = '') => items.map((item) => `<option ${item === selected ? 'selected' : ''} value="${esc(item)}">${esc(item)}</option>`).join('');
const releaseOptions = () => `<option value="">Sin asociar</option>${state.releases.map((release) => `<option value="${release.id}">${esc(release.title)}</option>`).join('')}`;
const trashButton = (type, id, label = 'Eliminar') => `<button class="icon-button danger-button" type="button" data-delete="${type}" data-id="${id}" title="${label}" aria-label="${label}">🗑️</button>`;

function stats() {
  const monthExpenses = state.expenses.filter((expense) => expense.date?.startsWith(month));
  const monthTotal = monthExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  return { monthExpenses, monthTotal, remaining: state.monthlyLimit - monthTotal, ratio: state.monthlyLimit ? Math.min((monthTotal / state.monthlyLimit) * 100, 140) : 0 };
}

function render() {
  const root = $('#root');
  root.innerHTML = `
    <main class="app-shell">
      <div class="background-art"><span></span><span></span><span></span></div>
      <aside class="sidebar glass-panel">
        <div class="brand"><div class="brand-mark">♫</div><div><strong>Artist OS</strong><span>Creative SaaS local</span></div></div>
        <nav>${nav('dashboard', 'Dashboard', '▦')}${nav('releases', 'Releases', '◎')}${nav('finance', 'Finanzas', '◍')}${nav('content', 'Contenido', '▣')}</nav>
        <div class="mini-card"><b>✦ Local-first</b><p>Todo se guarda en tu navegador con localStorage. Sin login, sin APIs y listo para Vercel.</p></div>
      </aside>
      <section class="workspace">
        <header class="hero glass-panel"><div><span class="eyebrow">Sistema operativo para artistas independientes</span><h1>Controla releases, dinero y contenido desde un estudio premium.</h1><p>Un dashboard claro para artistas, managers y equipos creativos que quieren lanzar mejor sin herramientas complejas.</p></div><div class="hero-orb">✦<span>2026</span></div></header>
        ${sections[state.active]()}
      </section>
    </main>`;
}

function nav(id, label, icon) {
  return `<button class="nav-button ${state.active === id ? 'active' : ''}" data-section="${id}"><span>${icon}</span><span>${label}</span></button>`;
}

const sections = {
  dashboard() {
    const { monthTotal, remaining, ratio } = stats();
    const next = [...state.releases].filter((release) => release.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
    const pending = state.contents.filter((item) => item.status !== 'publicado');
    const tasks = state.releases.flatMap((release) => (release.checklist || []).map((task) => ({ task, release: release.title, date: release.date }))).slice(0, 6);
    return `<div class="section-grid">
      ${metric('◍', 'Gasto musical del mes', money.format(monthTotal), `Límite: ${money.format(state.monthlyLimit)}`, ratio)}
      ${metric('◌', 'Dinero restante', money.format(remaining), `${Math.round(ratio)}% del límite usado`)}
      ${metric('◎', 'Próximos releases', next.length, 'Ordenados por fecha')}
      ${metric('▣', 'Contenidos pendientes', pending.length, 'Ideas, grabados, editados o listos')}
      ${panel('Próximos releases', '◎', next.length ? `<div class="release-row-list">${next.map(releaseRow).join('')}</div>` : empty('No hay lanzamientos próximos.'), 'wide')}
      ${panel('Tareas urgentes', '✓', tasks.length ? tasks.map((item) => `<div class="task-row"><span>${esc(item.task)}</span><small>${esc(item.release)} · ${item.date}</small></div>`).join('') : empty('Sin tareas todavía.'))}
      ${panel('Contenido pendiente', '✦', pending.length ? pending.slice(0, 5).map((item) => `<div class="content-row"><span class="badge">${esc(item.status)}</span><strong>${esc(item.title)}</strong><span>${esc(item.network)} · ${esc(releaseName(item.releaseId))}</span><small>${esc(item.publishDate)}</small>${trashButton('content', item.id, 'Eliminar contenido')}</div>`).join('') : empty('Tu calendario está limpio.'), 'wide')}
    </div>`;
  },
  releases() {
    return `<div class="two-column">
      ${panel('Nuevo release', '+', releaseForm(), 'form-panel')}
      <div class="stack">
        ${panel('Plantillas automáticas de marketing', '✦', `<label class="field"><span>Tipo</span><select id="template-type">${options(['single', 'ep', 'album'], 'single')}</select></label><ol class="template-list" id="template-list">${marketingTemplates.single.map((step) => `<li>${esc(step)}</li>`).join('')}</ol>`)}
        ${panel('Generador local de ideas de contenido', '💡', generatorHtml())}
        ${panel('Biblioteca de releases', '◎', state.releases.map(releaseCard).join('') || empty('Añade tu primer release.'))}
      </div>
    </div>`;
  },
  finance() {
    const data = stats();
    const byCategory = group(data.monthExpenses, 'category');
    const byRelease = data.monthExpenses.reduce((acc, expense) => { const name = releaseName(expense.releaseId); acc[name] = (acc[name] || 0) + Number(expense.amount || 0); return acc; }, {});
    return `<div class="two-column">
      ${panel('Control mensual', '◍', `<label class="field"><span>Límite mensual de gasto</span><input id="monthly-limit" type="number" value="${state.monthlyLimit}"></label><div class="budget-card ${data.ratio >= 100 ? 'danger' : data.ratio >= 80 ? 'warning' : ''}"><div><span>Usado este mes</span><strong>${money.format(data.monthTotal)}</strong><small>Restante: ${money.format(data.remaining)}</small></div><div class="progress"><i style="width:${Math.min(data.ratio, 100)}%"></i></div>${data.ratio >= 100 ? '<p>Has superado el límite mensual. Revisa campañas y pagos pendientes.</p>' : data.ratio >= 80 ? '<p>Estás cerca del límite. Prioriza gastos críticos del lanzamiento.</p>' : ''}</div>${chart('Gasto por categoría', byCategory)}${chart('Gasto por release', byRelease)}`)}
      ${panel('Nuevo gasto musical', '+', expenseForm() + `<div class="table-list">${state.expenses.map((expense) => `<div class="expense-row"><span class="badge">${esc(expense.status)}</span><strong>${esc(expense.concept)}</strong><span>${esc(expense.category)} · ${esc(releaseName(expense.releaseId))}</span><b>${money.format(expense.amount)}</b>${trashButton('expense', expense.id, 'Eliminar gasto')}</div>`).join('')}</div>`, 'form-panel')}
    </div>`;
  },
  content() {
    return `<div class="two-column">
      ${panel('Nueva pieza de contenido', '+', contentForm(), 'form-panel')}
      ${panel('Calendario creativo', '▣', `<div class="content-board">${contentStates.map((status) => `<div class="kanban-column"><h3>${status}</h3>${state.contents.filter((item) => item.status === status).map((item) => `<article class="kanban-card"><div class="card-actions"><span class="badge">${esc(item.network)}</span>${trashButton('content', item.id, 'Eliminar contenido')}</div><strong>${esc(item.title)}</strong><span>${esc(releaseName(item.releaseId))}</span><small>${esc(item.publishDate || 'Sin fecha')}</small><p>${esc(item.caption)}</p></article>`).join('')}</div>`).join('')}</div>`)}
    </div>`;
  },
};

function panel(title, icon, body, extra = '') { return `<section class="panel glass-panel ${extra}"><header><div class="panel-title"><span>${icon}</span>${title}</div></header>${body}</section>`; }
function metric(icon, label, value, detail, ratio = 0) { return `<article class="metric-card ${ratio >= 100 ? 'danger' : ratio >= 80 ? 'warning' : ''}"><div class="metric-icon">${icon}</div><span>${label}</span><strong>${value}</strong><p>${detail}</p></article>`; }
function empty(text) { return `<div class="empty-state"><b>✦</b><p>${esc(text)}</p></div>`; }
function field(name, label, type = 'text', value = '', extra = '') { return `<label class="field ${extra}"><span>${label}</span><input name="${name}" type="${type}" value="${esc(value)}"></label>`; }
function textarea(name, label, extra = '', placeholder = '') { return `<label class="field ${extra}"><span>${label}</span><textarea name="${name}" rows="4" placeholder="${esc(placeholder)}"></textarea></label>`; }
function select(name, label, list) { return `<label class="field"><span>${label}</span><select name="${name}">${options(list)}</select></label>`; }

function releaseForm() { return `<form id="release-form" class="form-grid">${field('title', 'Título')} ${field('artist', 'Artista')} ${select('releaseType', 'Tipo', ['single', 'ep', 'album'])} ${field('date', 'Fecha de lanzamiento', 'date')} ${field('genre', 'Género')} ${field('mood', 'Mood')} ${select('status', 'Estado', releaseStates)} ${field('budget', 'Presupuesto estimado', 'number')} ${field('coverUrl', 'URL de portada', 'url', '', 'full')} ${textarea('links', 'Links importantes')} ${textarea('notes', 'Notas')} ${textarea('checklist', 'Checklist de tareas', '', 'Una tarea por línea')} ${textarea('tiktokIdeas', 'Ideas de TikTok/Reels', '', 'Una idea por línea')} ${textarea('editorialPitch', 'Pitch editorial', 'full')} ${textarea('marketingPlan', 'Plan de marketing básico', 'full', 'Si lo dejas vacío, Artist OS usa la plantilla del tipo de release.')}<button class="primary-button full">+ Guardar release</button></form>`; }
function expenseForm() { return `<form id="expense-form" class="form-grid">${field('date', 'Fecha', 'date', today)} ${field('concept', 'Concepto')} ${select('category', 'Categoría', categories)} ${field('amount', 'Importe', 'number')}<label class="field"><span>Release asociado opcional</span><select name="releaseId">${releaseOptions()}</select></label>${field('provider', 'Proveedor/persona')} ${select('status', 'Estado', ['pendiente', 'pagado'])} ${textarea('notes', 'Notas', 'full')}<button class="primary-button full">+ Guardar gasto</button></form>`; }
function contentForm() { return `<form id="content-form" class="form-grid">${field('title', 'Título')} ${select('network', 'Red social objetivo', networks)}<label class="field"><span>Release asociado opcional</span><select name="releaseId">${releaseOptions()}</select></label>${select('status', 'Estado', contentStates)} ${field('publishDate', 'Fecha prevista', 'date')} ${textarea('caption', 'Caption')} ${textarea('hashtags', 'Hashtags')} ${field('finalLink', 'Enlace al archivo final o carpeta', 'text', '', 'full')} ${textarea('notes', 'Notas', 'full')}<button class="primary-button full">+ Guardar contenido</button></form>`; }
function generatorHtml() { return `<div class="mini-form">${field('ideaGenre', 'Género', 'text', state.ideaGenre)}${field('ideaMood', 'Mood', 'text', state.ideaMood)}${field('ideaGoal', 'Objetivo', 'text', state.ideaGoal)}</div><div class="idea-list">${ideas().map((idea) => `<p>${esc(idea)}</p>`).join('')}</div>`; }
function ideas() { return [`POV visual: cómo se siente ${state.ideaMood || 'la emoción'} cuando entra el hook de ${state.ideaGenre || 'tu sonido'}. Objetivo: ${state.ideaGoal || 'pre-save'}.`, `Storytime: cuenta en 30 segundos la línea más honesta y termina con CTA a ${state.ideaGoal || 'escuchar'}.`, 'De demo a final: compara la primera maqueta con el master y explica una decisión creativa.', `Reto para fans: invita a usar el audio en una escena que represente ${state.ideaMood || 'el mood'}.`, `Behind the scenes: muestra portada, sesión vocal o presupuesto y conecta el proceso con ${state.ideaGenre || 'el género'}.`]; }
function releaseRow(release) { return `<article class="release-row"><div class="cover placeholder">♫</div><div><strong>${esc(release.title)}</strong><span>${esc(release.artist)} · ${esc(release.genre)}</span></div><span class="badge">${esc(release.status)}</span><small>${esc(release.date)}</small>${trashButton('release', release.id, 'Eliminar release')}</article>`; }
function releaseCard(release) { return `<article class="release-card"><div class="cover placeholder">♫</div><div><div class="card-actions"><span class="badge">${esc(release.releaseType || 'single')}</span>${trashButton('release', release.id, 'Eliminar release')}</div><h3>${esc(release.title)}</h3><p>${esc(release.artist)} · ${esc(release.genre)} · ${esc(release.mood)}</p><small>${esc(release.date)} · ${money.format(release.budget || 0)}</small><details><summary>Plan, pitch e ideas</summary><p>${esc(release.editorialPitch)}</p><pre>${esc(release.marketingPlan)}</pre><ul>${(release.tiktokIdeas || []).map((idea) => `<li>${esc(idea)}</li>`).join('')}</ul></details></div></article>`; }
function chart(title, data) { const entries = Object.entries(data); const max = Math.max(...entries.map(([, value]) => value), 1); return `<div class="chart"><h3>${title}</h3>${entries.length ? entries.map(([label, value]) => `<div class="bar-row"><span>${esc(label)}</span><div><i style="width:${(value / max) * 100}%"></i></div><b>${money.format(value)}</b></div>`).join('') : empty('Sin datos este mes.')}</div>`; }
function group(items, key) { return items.reduce((acc, item) => { const label = item[key] || 'Sin categoría'; acc[label] = (acc[label] || 0) + Number(item.amount || 0); return acc; }, {}); }
function formObject(form) { return Object.fromEntries(new FormData(form).entries()); }

function deleteItem(type, id) {
  const labels = { release: 'este release', expense: 'este gasto', content: 'esta pieza de contenido' };
  if (!confirm(`¿Seguro que quieres eliminar ${labels[type] || 'este elemento'}?`)) return;

  if (type === 'release') {
    state.releases = state.releases.filter((release) => release.id !== id);
    state.expenses = state.expenses.map((expense) => expense.releaseId === id ? { ...expense, releaseId: '' } : expense);
    state.contents = state.contents.map((item) => item.releaseId === id ? { ...item, releaseId: '' } : item);
  }
  if (type === 'expense') state.expenses = state.expenses.filter((expense) => expense.id !== id);
  if (type === 'content') state.contents = state.contents.filter((item) => item.id !== id);
  persist();
  render();
}

window.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete]');
  if (deleteButton) {
    deleteItem(deleteButton.dataset.delete, deleteButton.dataset.id);
    return;
  }

  const button = event.target.closest('[data-section]');
  if (!button) return;
  state.active = button.dataset.section;
  render();
});

window.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const data = formObject(form);
  if (form.id === 'release-form') state.releases.unshift({ ...data, id: crypto.randomUUID(), budget: Number(data.budget || 0), checklist: data.checklist.split('\n').filter(Boolean), tiktokIdeas: data.tiktokIdeas.split('\n').filter(Boolean), marketingPlan: data.marketingPlan || `• ${marketingTemplates[data.releaseType].join('\n• ')}` });
  if (form.id === 'expense-form') state.expenses.unshift({ ...data, id: crypto.randomUUID(), amount: Number(data.amount || 0) });
  if (form.id === 'content-form') state.contents.unshift({ ...data, id: crypto.randomUUID() });
  persist();
  render();
});

window.addEventListener('input', (event) => {
  if (['ideaGenre', 'ideaMood', 'ideaGoal'].includes(event.target.name)) {
    state[event.target.name] = event.target.value;
    $('.idea-list').innerHTML = ideas().map((idea) => `<p>${esc(idea)}</p>`).join('');
  }
});

window.addEventListener('change', (event) => {
  if (event.target.id === 'monthly-limit') { state.monthlyLimit = Number(event.target.value || 0); persist(); render(); }
  if (event.target.id === 'template-type') $('#template-list').innerHTML = marketingTemplates[event.target.value].map((step) => `<li>${esc(step)}</li>`).join('');
});

render();
