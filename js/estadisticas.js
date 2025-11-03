// Estadísticas - Página dedicada
let allData = null;
let currentChart = null;
let genderChart = null;
const PASS_GRADE = 6; // umbral de aprobación
let pageAulas = 1, pageMaterias = 1;
let perPageAulas = 7, perPageMaterias = 7;
let filter = { instId: '', aulaId: '' };

async function loadAll() {
  try {
    const res = await fetch('../api.php?action=get_all');
    allData = await res.json();

    // Poblar selector de instituciones
    const selInst = document.getElementById('statsInstSelect');
    selInst.innerHTML = '<option value="">Todas las instituciones</option>' +
      allData.instituciones.map(i => `<option value="${i.id}">${i.nombre}</option>`).join('');

    updateAulasSelect();
    renderAll();
  } catch (error) {
    console.error('Error al cargar datos:', error);
    document.getElementById('advStatsContent').innerHTML = '<p style="color: var(--danger);">Error al cargar los datos</p>';
  }
}

function computeScope() {
  const instId = filter.instId;
  const aulaId = filter.aulaId;

  const instituciones = instId ? allData.instituciones.filter(x => String(x.id) === String(instId)) : allData.instituciones;

  const aulas = allData.aulas.filter(a => {
    if (aulaId) return String(a.id) === String(aulaId);
    if (instId) return String(a.institucion_id) === String(instId);
    return true;
  });

  const profIds = new Set(aulas.map(a => a.profesor_id).filter(Boolean));
  const aulaIds = new Set(aulas.map(a => String(a.id)));
  const aulaMateria = allData.aula_materia.filter(am => aulaIds.has(String(am.aula_id)));
  const materiaIds = new Set(aulaMateria.map(am => String(am.materia_id)));
  const materias = allData.materias.filter(m => materiaIds.has(String(m.id)));

  const alumnos = allData.alumnos.filter(al => {
    if (aulaId) return String(al.aula_id) === String(aulaId);
    if (instId) return String(al.institucion_id) === String(instId);
    return true;
  });

  const amIds = new Set(aulaMateria.map(am => String(am.id)));
  const pruebas = allData.pruebas.filter(p => amIds.has(String(p.aula_materia_id)));
  const profesores = allData.profesores.filter(p => profIds.has(p.id));

  const pruebaIds = new Set(pruebas.map(p => String(p.id)));
  const alumnoIds = new Set(alumnos.map(al => String(al.id)));
  const notas = allData.notas.filter(n =>
    pruebaIds.has(String(n.prueba_id)) && alumnoIds.has(String(n.alumno_id))
  );

  return { instituciones, aulas, profesores, materias, alumnos, pruebas, notas };
}

function renderMetrics(scope){
  const row = document.getElementById('metricsRow');
  const items = [
    {label:'Instituciones', value: scope.instituciones.length, icon:'fa-building', cls:'mc-inst'},
    {label:'Aulas', value: scope.aulas.length, icon:'fa-door-open', cls:'mc-aula'},
    {label:'Profesores', value: scope.profesores.length, icon:'fa-chalkboard-teacher', cls:'mc-prof'},
    {label:'Materias', value: scope.materias.length, icon:'fa-book', cls:'mc-mat'},
    {label:'Alumnos', value: scope.alumnos.length, icon:'fa-user-graduate', cls:'mc-alum'}
  ];
  // Mostrar 4: alumnos sustituye instituciones si ya hay filtro por institución
  const show = items.slice(0,4);
  show[0] = items[4];
  row.innerHTML = show.map(m=>`
    <div class="metric-card">
      <div class="mc-icon ${m.cls}"><i class="fas ${m.icon}"></i></div>
      <div class="mc-body">
        <p class="mc-value">${m.value}</p>
        <div class="mc-label">${m.label.toUpperCase()}</div>
      </div>
    </div>
  `).join('');
}

function renderChart(scope) {
  const canvas = document.getElementById('statsChart');
  if (!canvas) return; // no hay gráfico de barras en esta versión
  if (currentChart) currentChart.destroy();
  const ctx = canvas.getContext('2d');
  currentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Instituciones', 'Aulas', 'Profesores', 'Materias', 'Alumnos', 'Pruebas'],
      datasets: [{
        label: 'Cantidad',
        data: [
          scope.instituciones.length,
          scope.aulas.length,
          scope.profesores.length,
          scope.materias.length,
          scope.alumnos.length,
          scope.pruebas.length
        ],
        backgroundColor: ['#3498db', '#9b59b6', '#e74c3c', '#2ecc71', '#f39c12', '#1abc9c']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: 12,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 }
        }
      },
      scales: {
        y: { beginAtZero: true, ticks: { font: { size: 12 } } },
        x: { ticks: { font: { size: 12 } } }
      }
    }
  });
}

function renderAdvanced(scope) {
  const div = document.getElementById('advStatsContent');
  if (!div) return; // sección opcional

  const generosMap = scope.alumnos.reduce((acc, al) => {
    const g = (al.genero || 'N/D');
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});
  const generos = Object.entries(generosMap).map(([k, v]) => `${k}: ${v}`).join(' · ');

  const notas = scope.notas.map(n => parseFloat(n.nota)).filter(x => !isNaN(x));
  const prom = notas.length ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2) : 'N/D';
  const max = notas.length ? Math.max(...notas).toFixed(2) : 'N/D';
  const min = notas.length ? Math.min(...notas).toFixed(2) : 'N/D';

  const edades = scope.alumnos.map(al => parseInt(al.edad)).filter(x => !isNaN(x));
  const promEdad = edades.length ? (edades.reduce((a, b) => a + b, 0) / edades.length).toFixed(1) : 'N/D';

  const notasPorMateria = {};
  scope.notas.forEach(n => {
    const prueba = scope.pruebas.find(p => String(p.id) === String(n.prueba_id));
    if (!prueba) return;
    const am = allData.aula_materia.find(x => String(x.id) === String(prueba.aula_materia_id));
    if (!am) return;
    const materia = allData.materias.find(m => String(m.id) === String(am.materia_id));
    if (!materia) return;
    const nota = parseFloat(n.nota);
    if (isNaN(nota)) return;
    if (!notasPorMateria[materia.nombre]) notasPorMateria[materia.nombre] = [];
    notasPorMateria[materia.nombre].push(nota);
  });

  const promediosMaterias = Object.entries(notasPorMateria)
    .map(([mat, ns]) => `${mat}: ${(ns.reduce((a, b) => a + b, 0) / ns.length).toFixed(2)}`)
    .join(' · ');

  div.innerHTML = `
    <p style="margin-bottom: 0.75rem;"><strong><i class="fas fa-calendar-alt"></i> Promedio de edades:</strong> ${promEdad} años</p>
    <p style="margin-bottom: 0.75rem;"><strong><i class="fas fa-star"></i> Promedio de notas:</strong> ${prom} &nbsp;·&nbsp; <strong>Máx:</strong> ${max} &nbsp;·&nbsp; <strong>Mín:</strong> ${min}</p>
    <p style="margin-bottom: 0.75rem;"><strong><i class="fas fa-venus-mars"></i> Distribución por género:</strong> ${generos || 'N/D'}</p>
    <p style="margin-bottom: 0;"><strong><i class="fas fa-chart-line"></i> Promedio por materia:</strong> ${promediosMaterias || 'N/D'}</p>
  `;
}

function renderPerformance(scope){
  const notas = scope.notas.map(n=> parseFloat(n.nota)).filter(x=>!isNaN(x));
  const prom = notas.length? notas.reduce((a,b)=>a+b,0)/notas.length : 0;
  const aprobados = scope.notas.filter(n=> parseFloat(n.nota)>=PASS_GRADE).length;
  const desaprobados = scope.notas.filter(n=> parseFloat(n.nota)<PASS_GRADE).length;
  document.getElementById('avgGeneral').textContent = prom? prom.toFixed(2) : 'N/D';
  const pct = Math.max(0, Math.min(100, prom*10));
  document.getElementById('progressAvg').style.width = pct+'%';
  document.getElementById('aprobadosCnt').textContent = aprobados;
  document.getElementById('desaprobadosCnt').textContent = desaprobados;
}

function renderGender(scope){
  const generoCounts = scope.alumnos.reduce((acc,al)=>{ const g=(al.genero||'N/D'); acc[g]=(acc[g]||0)+1; return acc; },{});
  const labels = Object.keys(generoCounts);
  const data = Object.values(generoCounts);
  if (genderChart) genderChart.destroy();
  const ctx = document.getElementById('genderChart').getContext('2d');
  genderChart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: ['#0ea5e9','#e11d48','#6366f1','#22c55e','#f59e0b'] }] },
    options: { plugins: { legend: { position: 'bottom' } } }
  });

  // leyenda con porcentajes y cantidades
  const total = data.reduce((a,b)=>a+b,0) || 1;
  const legend = document.getElementById('genderLegend');
  if (legend) {
    const colors = ['#0ea5e9','#e11d48','#6366f1','#22c55e','#f59e0b'];
    legend.innerHTML = labels.map((lbl, i)=>{
      const pct = ((data[i]*100)/total).toFixed(1);
      return `<span class="gl-item"><span class="dot" style="background:${colors[i%colors.length]}"></span>${lbl}: ${pct}% (${data[i]})</span>`;
    }).join('');
  }
}

function renderTableAulas(scope){
  const tbody = document.getElementById('tbodyAulas');
  const aulas = scope.aulas;
  const fullRows = aulas.map(a=>{
    const alumnosA = scope.alumnos.filter(al=> String(al.aula_id)===String(a.id));
    const masc = alumnosA.filter(al=> (al.genero||'').toLowerCase().startsWith('m')).length;
    const fem = alumnosA.filter(al=> (al.genero||'').toLowerCase().startsWith('f')).length;
    const total = alumnosA.length||1;
    const pctM = (masc*100/total).toFixed(1)+'%';
    const pctF = (fem*100/total).toFixed(1)+'%';
    const edades = alumnosA.map(x=> parseInt(x.edad)).filter(x=>!isNaN(x));
    const edadProm = edades.length? (edades.reduce((a,b)=>a+b,0)/edades.length).toFixed(1) : 'N/D';
    // notas del aula
    const amIds = allData.aula_materia.filter(am=> String(am.aula_id)===String(a.id)).map(x=> String(x.id));
    const notasA = scope.notas.filter(n=> amIds.includes(String(allData.pruebas.find(p=> String(p.id)===String(n.prueba_id))?.aula_materia_id)));
    const promNotas = notasA.length? (notasA.reduce((a,b)=> a+parseFloat(b.nota||0),0)/notasA.length).toFixed(2) : 'N/D';
    return `<tr>
      <td>${a.nombre||('Aula '+a.id)}</td>
      <td>${total===1? (alumnosA.length): alumnosA.length}</td>
      <td>${masc}</td>
      <td>${fem}</td>
      <td>${pctM}</td>
      <td>${pctF}</td>
      <td>${edadProm} años</td>
      <td>${promNotas}</td>
    </tr>`;
  }).join('');
  const totalRows = aulas.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / perPageAulas));
  if (pageAulas > pageCount) pageAulas = pageCount;
  const start = (pageAulas - 1) * perPageAulas;
  const end = start + perPageAulas;
  const paginated = aulas.slice(start, end);
  const rows = paginated.map(a=>{
    const alumnosA = scope.alumnos.filter(al=> String(al.aula_id)===String(a.id));
    const masc = alumnosA.filter(al=> (al.genero||'').toLowerCase().startsWith('m')).length;
    const fem = alumnosA.filter(al=> (al.genero||'').toLowerCase().startsWith('f')).length;
    const total = alumnosA.length||1;
    const pctM = (masc*100/total).toFixed(1)+'%';
    const pctF = (fem*100/total).toFixed(1)+'%';
    const edades = alumnosA.map(x=> parseInt(x.edad)).filter(x=>!isNaN(x));
    const edadProm = edades.length? (edades.reduce((a,b)=>a+b,0)/edades.length).toFixed(1) : 'N/D';
    const amIds = allData.aula_materia.filter(am=> String(am.aula_id)===String(a.id)).map(x=> String(x.id));
    const notasA = scope.notas.filter(n=> amIds.includes(String(allData.pruebas.find(p=> String(p.id)===String(n.prueba_id))?.aula_materia_id)));
    const promNotas = notasA.length? (notasA.reduce((a,b)=> a+parseFloat(b.nota||0),0)/notasA.length).toFixed(2) : 'N/D';
    return `<tr>
      <td>${a.nombre||('Aula '+a.id)}</td>
      <td>${total===1? (alumnosA.length): alumnosA.length}</td>
      <td>${masc}</td>
      <td>${fem}</td>
      <td>${pctM}</td>
      <td>${pctF}</td>
      <td>${edadProm} años</td>
      <td>${promNotas}</td>
    </tr>`;
  }).join('');
  tbody.innerHTML = rows || '<tr><td colspan="8">Sin datos para mostrar</td></tr>';
  const prev = document.getElementById('pagerAulasPrev');
  const next = document.getElementById('pagerAulasNext');
  const info = document.getElementById('pagerAulasInfo');
  if (prev && next && info){
    info.textContent = `${pageAulas} / ${pageCount}`;
    prev.disabled = pageAulas<=1;
    next.disabled = pageAulas>=pageCount;
    prev.onclick = ()=>{ if(pageAulas>1){ pageAulas--; renderTableAulas(scope); }};
    next.onclick = ()=>{ if(pageAulas<pageCount){ pageAulas++; renderTableAulas(scope); }};
  }
}

function renderTableMaterias(scope){
  const tbody = document.getElementById('tbodyMaterias');
  const entries = allData.aula_materia
    .filter(am=> scope.aulas.some(a=> String(a.id)===String(am.aula_id)));
  const pageCount = Math.max(1, Math.ceil(entries.length / perPageMaterias));
  if (pageMaterias > pageCount) pageMaterias = pageCount;
  const start = (pageMaterias - 1) * perPageMaterias;
  const paginated = entries.slice(start, start + perPageMaterias);
  const rows = paginated.map(am=>{
      const materia = allData.materias.find(m=> String(m.id)===String(am.materia_id));
      const aula = scope.aulas.find(a=> String(a.id)===String(am.aula_id));
      const profesor = allData.profesores.find(p=> String(p.id)===String(aula?.profesor_id));
      const pruebasAM = allData.pruebas.filter(p=> String(p.aula_materia_id)===String(am.id));
      const pruebaIds = new Set(pruebasAM.map(p=> String(p.id)));
      const notasAM = scope.notas.filter(n=> pruebaIds.has(String(n.prueba_id)));
      const totalNotas = notasAM.length;
      const promedio = totalNotas? (notasAM.reduce((a,b)=> a+parseFloat(b.nota||0),0)/totalNotas).toFixed(2) : 'N/D';
      const aprob = notasAM.filter(n=> parseFloat(n.nota)>=PASS_GRADE).length;
      const desap = totalNotas - aprob;
      const pctAprob = totalNotas? ((aprob*100/totalNotas).toFixed(1)+'%') : 'N/D';
      return `<tr>
        <td>${materia?.nombre||('Materia '+am.materia_id)}</td>
        <td>${aula?.nombre||('Aula '+am.aula_id)}</td>
        <td>${profesor?.nombre||'N/D'}</td>
        <td>${totalNotas}</td>
        <td><span class="badge ${promedio!=='N/D' && parseFloat(promedio)>=PASS_GRADE ? 'ok':'warn'}">${promedio}</span></td>
        <td>${aprob}</td>
        <td>${desap}</td>
        <td>${pctAprob}</td>
      </tr>`;
    }).join('');
  tbody.innerHTML = rows || '<tr><td colspan="8">Sin datos para mostrar</td></tr>';
  const prev = document.getElementById('pagerMateriasPrev');
  const next = document.getElementById('pagerMateriasNext');
  const info = document.getElementById('pagerMateriasInfo');
  if (prev && next && info){
    info.textContent = `${pageMaterias} / ${pageCount}`;
    prev.disabled = pageMaterias<=1;
    next.disabled = pageMaterias>=pageCount;
    prev.onclick = ()=>{ if(pageMaterias>1){ pageMaterias--; renderTableMaterias(scope); }};
    next.onclick = ()=>{ if(pageMaterias<pageCount){ pageMaterias++; renderTableMaterias(scope); }};
  }
}

function updateAulasSelect() {
  const selA = document.getElementById('statsAulaSelect');
  const selI = document.getElementById('statsInstSelect');
  const instId = selI.value;

  if (!instId) {
    selA.innerHTML = '<option value="">Todas las aulas</option>';
    selA.disabled = true;
    return;
  }

  const aulasInst = allData.aulas.filter(a => String(a.institucion_id) === String(instId));
  selA.innerHTML = '<option value="">Todas las aulas</option>' +
    aulasInst.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('');
  selA.disabled = false;
}

function renderAll() {
  if (!allData) return;
  const scope = computeScope();
  renderMetrics(scope);
  renderChart(scope); // opcional, puede no existir
  renderAdvanced(scope); // opcional, puede no existir
  renderPerformance(scope);
  renderGender(scope);
  renderTableAulas(scope);
  renderTableMaterias(scope);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  loadAll();

  document.getElementById('statsInstSelect').addEventListener('change', (e) => {
    filter.instId = e.target.value;
    filter.aulaId = '';
    document.getElementById('statsAulaSelect').value = '';
    updateAulasSelect();
    renderAll();
  });

  document.getElementById('statsAulaSelect').addEventListener('change', (e) => {
    filter.aulaId = e.target.value;
    renderAll();
  });

  document.getElementById('statsClearBtn').addEventListener('click', () => {
    filter = { instId: '', aulaId: '' };
    document.getElementById('statsInstSelect').value = '';
    document.getElementById('statsAulaSelect').value = '';
    updateAulasSelect();
    renderAll();
  });

  // Selectores de cantidad por página
  const selPerPageA = document.getElementById('perPageAulas');
  const selPerPageM = document.getElementById('perPageMaterias');
  if (selPerPageA) {
    selPerPageA.value = String(perPageAulas);
    selPerPageA.addEventListener('change', (e)=>{
      perPageAulas = parseInt(e.target.value)||7; pageAulas = 1; renderAll();
    });
  }
  if (selPerPageM) {
    selPerPageM.value = String(perPageMaterias);
    selPerPageM.addEventListener('change', (e)=>{
      perPageMaterias = parseInt(e.target.value)||7; pageMaterias = 1; renderAll();
    });
  }
});
