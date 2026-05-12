// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function copyEl(id) {
  navigator.clipboard.writeText(document.getElementById(id).innerText)
    .then(() => showToast('✅ Prompt copiado!'));
}

// ── WHEELS DATA ──
const WHEELS = [
  { name: 'BBS CH-R',                 brand: 'BBS',      size: '18"', price: 4800,  style: 'multi-spoke' },
  { name: 'BBS RS-GT',                brand: 'BBS',      size: '19"', price: 7200,  style: 'mesh'        },
  { name: 'Vossen VFS-1',             brand: 'Vossen',   size: '19"', price: 6500,  style: 'concave'     },
  { name: 'Vossen VFS-2',             brand: 'Vossen',   size: '20"', price: 8500,  style: 'concave'     },
  { name: 'HRE P101',                 brand: 'HRE',      size: '20"', price: 12000, style: 'concave'     },
  { name: 'OZ Racing Ultraleggera',   brand: 'OZ',       size: '17"', price: 3200,  style: 'Y-spoke'     },
  { name: 'OZ Racing Superturismo GT',brand: 'OZ',       size: '18"', price: 4100,  style: 'multi-spoke' },
  { name: 'Enkei RPF1',               brand: 'Enkei',    size: '17"', price: 1800,  style: '5-spoke'     },
  { name: 'Enkei T6S',                brand: 'Enkei',    size: '18"', price: 2400,  style: 'Y-spoke'     },
  { name: 'Work Emotion CR Kiwami',   brand: 'Work',     size: '18"', price: 5500,  style: 'mesh'        },
  { name: 'Work VS-XX',               brand: 'Work',     size: '19"', price: 9000,  style: 'concave'     },
  { name: 'Rays TE37 SL',             brand: 'Rays',     size: '17"', price: 5800,  style: '6-spoke'     },
  { name: 'Rays Volk G25',            brand: 'Rays',     size: '19"', price: 8200,  style: 'multi-spoke' },
  { name: 'Rotiform BLQ',             brand: 'Rotiform', size: '19"', price: 4200,  style: 'mesh'        },
  { name: 'Rotiform LHR',             brand: 'Rotiform', size: '20"', price: 5900,  style: 'concave'     },
  { name: 'KMC Rockstar',             brand: 'KMC',      size: '18"', price: 1200,  style: '6-spoke'     },
  { name: 'Motegi MR116',             brand: 'Motegi',   size: '17"', price: 900,   style: '5-spoke'     },
  { name: 'Borbet Type C',            brand: 'Borbet',   size: '18"', price: 1600,  style: 'concave'     },
  { name: 'Aro Esportivo Nacional',   brand: 'Nacional', size: '15"', price: 550,   style: 'spoke'       },
  { name: 'ACT Phantom',              brand: 'ACT',      size: '17"', price: 800,   style: 'multi-spoke' },
  { name: 'Grid GD-07',               brand: 'Grid',     size: '18"', price: 2100,  style: 'mesh'        },
  { name: 'TSW Bathurst',             brand: 'TSW',      size: '18"', price: 2800,  style: '5-spoke'     },
  { name: 'TSW Ascent',               brand: 'TSW',      size: '20"', price: 3800,  style: 'concave'     },
];

// persists selection across functions on same page
let selectedWheel = null;

// ── WHEEL SVG ──
function getWheelSVG(style) {
  const counts = { '5-spoke': 5, '6-spoke': 6, 'Y-spoke': 3, 'multi-spoke': 10, 'mesh': 12, 'concave': 8, 'spoke': 5 };
  const n = counts[style] || 5;
  let lines = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    lines += `<line
      x1="${(20 + Math.cos(a) * 7).toFixed(1)}"
      y1="${(20 + Math.sin(a) * 7).toFixed(1)}"
      x2="${(20 + Math.cos(a) * 18).toFixed(1)}"
      y2="${(20 + Math.sin(a) * 18).toFixed(1)}"
      stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round"/>`;
  }
  return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" fill="none" stroke="#c9a84c" stroke-width="1"/>
    <circle cx="20" cy="20" r="6" fill="#1a1a1a" stroke="#c9a84c" stroke-width="0.8"/>
    ${lines}
  </svg>`;
}

// ── WHEEL LIST HELPERS ──
// ctxMin, ctxMax, ctxSearch, ctxList are element IDs on the page
function getFilteredWheels(minId, maxId, searchId) {
  const min = parseInt(document.getElementById(minId).value);
  const max = parseInt(document.getElementById(maxId).value);
  const q   = document.getElementById(searchId).value.toLowerCase();
  return WHEELS.filter(w =>
    w.price >= min && w.price <= max &&
    (w.name.toLowerCase().includes(q) || w.brand.toLowerCase().includes(q))
  );
}

function renderWheelList(minId, maxId, searchId, listId) {
  const list = document.getElementById(listId);
  const ws   = getFilteredWheels(minId, maxId, searchId);
  if (!ws.length) {
    list.innerHTML = '<div style="padding:1rem 1.5rem;color:#444;font-size:13px;">Nenhuma roda nesta faixa de preço</div>';
    return;
  }
  list.innerHTML = ws.map(w => `
    <div class="wheel-item ${selectedWheel && selectedWheel.name === w.name ? 'selected' : ''}"
         onmousedown="selectWheel('${w.name.replace(/'/g, "\\'")}', '${searchId}', '${listId}', '${minId}', '${maxId}')">
      <div class="wheel-thumb">${getWheelSVG(w.style)}</div>
      <div class="wheel-info">
        <div class="wheel-name">${w.name}</div>
        <div class="wheel-price">R$ ${w.price.toLocaleString('pt-BR')} · ${w.size}</div>
      </div>
      <div class="wheel-badge">${w.brand}</div>
    </div>`).join('');
}

function selectWheel(name, searchId, listId, minId, maxId) {
  selectedWheel = WHEELS.find(x => x.name === name);
  document.getElementById(searchId).value = name;
  document.getElementById(listId).classList.remove('open');
  // re-render to update selected highlight
  renderWheelList(minId, maxId, searchId, listId);
}

function openWheelList(minId, maxId, searchId, listId) {
  renderWheelList(minId, maxId, searchId, listId);
  document.getElementById(listId).classList.add('open');
}

function closeWheelListDelay(listId) {
  setTimeout(() => document.getElementById(listId).classList.remove('open'), 200);
}

// ── DUAL RANGE SLIDER ──
function updateDualRange(minId, maxId, minLabelId, maxLabelId, fillId) {
  const minEl = document.getElementById(minId);
  const maxEl = document.getElementById(maxId);
  let minV = parseInt(minEl.value);
  let maxV = parseInt(maxEl.value);
  if (minV > maxV - 500) { minEl.value = maxV - 500; minV = maxV - 500; }
  document.getElementById(minLabelId).textContent = 'R$ ' + minV.toLocaleString('pt-BR');
  document.getElementById(maxLabelId).textContent = 'R$ ' + maxV.toLocaleString('pt-BR');
  const p1 = (minV - 500) / 14500 * 100;
  const p2 = (maxV - 500) / 14500 * 100;
  const fill = document.getElementById(fillId);
  fill.style.left  = p1 + '%';
  fill.style.width = (p2 - p1) + '%';
}

// ── CAR MODELS DATA ──
const MODELOS = {
  Toyota:          ['Corolla', 'Hilux', 'Yaris', 'SW4', 'RAV4', 'Corolla Cross', 'Camry', 'Prius', 'Land Cruiser'],
  Honda:           ['Civic', 'HR-V', 'City', 'CR-V', 'Fit', 'WR-V', 'Accord', 'ZR-V'],
  Volkswagen:      ['Gol', 'Polo', 'Virtus', 'T-Cross', 'Tiguan', 'Amarok', 'Jetta', 'Nivus', 'Saveiro'],
  Chevrolet:       ['Onix', 'Tracker', 'Montana', 'Spin', 'Equinox', 'Cruze', 'Trailblazer', 'Trax', 'S10'],
  Fiat:            ['Argo', 'Cronos', 'Pulse', 'Strada', 'Toro', 'Mobi', 'Fastback', 'Doblo', 'Uno'],
  Hyundai:         ['HB20', 'Creta', 'Tucson', 'Santa Fe', 'i30', 'Elantra', 'ix35'],
  Renault:         ['Kwid', 'Sandero', 'Logan', 'Duster', 'Oroch', 'Captur', 'Stepway'],
  Ford:            ['Ranger', 'Territory', 'Bronco', 'Maverick'],
  Jeep:            ['Compass', 'Renegade', 'Commander', 'Wrangler'],
  Nissan:          ['Kicks', 'Versa', 'Frontier', 'March', 'Sentra'],
  BMW:             ['Série 3', 'Série 5', 'X1', 'X3', 'X5', 'M3', 'M5'],
  'Mercedes-Benz': ['Classe A', 'Classe C', 'GLA', 'GLC', 'GLB', 'AMG GT'],
  Audi:            ['A3', 'A4', 'Q3', 'Q5', 'TT', 'e-tron'],
  Mitsubishi:      ['Eclipse Cross', 'Outlander', 'L200', 'ASX'],
  Kia:             ['Sportage', 'Stinger', 'Sorento', 'Cerato'],
  Peugeot:         ['208', '2008', '3008', '5008'],
  'Citroën':       ['C3', 'C4', 'Cactus', 'Jumpy'],
  Subaru:          ['Forester', 'Impreza', 'Legacy', 'WRX', 'BRZ'],
  Volvo:           ['XC40', 'XC60', 'XC90', 'S60', 'V60'],
  'Land Rover':    ['Discovery Sport', 'Defender', 'Range Rover Evoque', 'Freelander'],
};
