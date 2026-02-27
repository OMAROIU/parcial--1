class GradeCard extends HTMLElement {
  connectedCallback() {
    const subject  = this.getAttribute('subject')  || '—';
    const category = this.getAttribute('category') || '—';
    const grade    = parseFloat(this.getAttribute('grade')) || 0;
    const passing  = parseFloat(this.getAttribute('passing')) || 6;

    let badgeClass = 'fail';
    if (grade >= passing + 1) badgeClass = 'good';
    else if (grade >= passing)  badgeClass = 'pass';

    this.innerHTML = `
      <div class="gc-wrap">
        <div>
          <div class="gc-subject">${subject}</div>
          <div class="gc-meta">${category} · aprobación ≥ ${passing.toFixed(1)}</div>
        </div>
        <div class="gc-badge ${badgeClass}">${grade.toFixed(2)}</div>
      </div>
    `;
  }
}
customElements.define('grade-card', GradeCard);

const entries = [];

const form      = document.getElementById('grade-form');
const container = document.getElementById('cards-container');
const section   = document.getElementById('results-section');
const clearBtn  = document.getElementById('clear-btn');

function setError(id, msg) {
  const el  = document.getElementById('err-' + id);
  const inp = document.getElementById(id);
  if (el)  el.textContent = msg;
  if (inp) msg ? inp.classList.add('error') : inp.classList.remove('error');
  return !!msg;
}

function validateGrade(id) {
  const val = document.getElementById(id).value.trim();
  if (val === '')          return setError(id, 'Este campo es obligatorio.');
  const n = parseFloat(val);
  if (isNaN(n))            return setError(id, 'Debe ser un número.');
  if (n < 0 || n > 10)    return setError(id, 'Rango válido: 0 – 10.');
  return setError(id, '');
}

function validate() {
  let ok = true;

  const subject = document.getElementById('subject').value.trim();
  if (!subject) {
    setError('subject', 'Ingresa el nombre de la materia.'); ok = false;
  } else { setError('subject', ''); }

  const cat = document.getElementById('category').value;
  if (!cat) {
    setError('category', 'Selecciona una categoría.'); ok = false;
  } else { setError('category', ''); }

  if (validateGrade('partial1')) ok = false;
  if (validateGrade('partial2')) ok = false;
  if (validateGrade('final'))    ok = false;

  return ok;
}

function computeGrade(p1, p2, fin, w) {

  const pw = (1 - w) / 2;
  return p1 * pw + p2 * pw + fin * w;
}

function renderAll() {
  container.innerHTML = '';
  entries.forEach(e => {
    const card = document.createElement('grade-card');
    card.setAttribute('subject',  e.subject);
    card.setAttribute('category', e.category);
    card.setAttribute('grade',    e.grade);
    card.setAttribute('passing',  6);
    container.appendChild(card);
  });

  const avg    = entries.reduce((s, e) => s + e.grade, 0) / entries.length;
  const passed = entries.filter(e => e.grade >= 6).length;
  const failed = entries.length - passed;

  document.getElementById('stat-avg').textContent  = avg.toFixed(2);
  document.getElementById('stat-pass').textContent = passed;
  document.getElementById('stat-fail').textContent = failed;

  section.classList.add('visible');
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validate()) return;

  const subject  = document.getElementById('subject').value.trim();
  const category = document.getElementById('category').value;
  const p1       = parseFloat(document.getElementById('partial1').value);
  const p2       = parseFloat(document.getElementById('partial2').value);
  const fin      = parseFloat(document.getElementById('final').value);
  const weight   = parseFloat(document.getElementById('weight').value);

  const grade = computeGrade(p1, p2, fin, weight);

  entries.push({ subject, category, grade });
  renderAll();
  form.reset();
  ['subject','category','partial1','partial2','final'].forEach(id => setError(id, ''));
});

clearBtn.addEventListener('click', function() {
  entries.length = 0;
  container.innerHTML = '';
  section.classList.remove('visible');
});

['partial1','partial2','final'].forEach(id => {
  document.getElementById(id).addEventListener('blur', () => validateGrade(id));
});
