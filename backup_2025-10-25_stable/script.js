// ========================================
// VARIABLES GLOBALES
// ========================================
let allData = null;
let currentChart = null;

// ========================================
// SISTEMA DE NOTIFICACIONES TOAST
// ========================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    info: 'fa-circle-info',
    warning: 'fa-triangle-exclamation'
  };
  
  toast.innerHTML = `
    <i class="fas ${icons[type] || icons.info}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ========================================
// GESTIÓN DE MODALES
// ========================================
function openModal(content) {
  console.log('🔓 Abriendo modal...');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  console.log('Modal element:', modal);
  console.log('Content element:', modalContent);
  modalContent.innerHTML = content;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  console.log('✅ Modal abierto');
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// ========================================
// CARGA DE DATOS
// ========================================
async function loadAll() {
  console.log('🔄 Iniciando carga de datos...');
  try {
    const res = await fetch('api.php?action=get_all');
    console.log('📡 Response status:', res.status);
    allData = await res.json();
    console.log('✅ Datos recibidos:', allData);
    renderMain();
    showToast('Datos cargados', 'success');
  } catch (error) {
    console.error('❌ Error completo:', error);
    showToast('Error al cargar datos: ' + error.message, 'error');
  }
}

// ========================================
// RENDERIZADO PRINCIPAL
// ========================================
function renderMain() {
  const list = document.getElementById('list');
  
  list.innerHTML = `
    <div class="section">
      <h2><i class="fas fa-building"></i> Instituciones</h2>
      <div id="instituciones-list" class="cards-grid"></div>
    </div>
    
    <div class="section">
      <h2><i class="fas fa-door-open"></i> Aulas</h2>
      <div id="aulas-list" class="cards-grid"></div>
    </div>
    
    <div class="section">
      <h2><i class="fas fa-chalkboard-teacher"></i> Profesores</h2>
      <div id="profesores-list" class="cards-grid"></div>
    </div>
    
    <div class="section">
      <h2><i class="fas fa-book"></i> Materias</h2>
      <div id="materias-list" class="cards-grid"></div>
    </div>
    
    <div class="section">
      <h2><i class="fas fa-user-graduate"></i> Alumnos</h2>
      <div id="alumnos-list" class="cards-grid"></div>
    </div>
    
    <div class="section">
      <h2><i class="fas fa-file-alt"></i> Pruebas</h2>
      <div id="pruebas-list" class="cards-grid"></div>
    </div>
  `;
  
  renderInstituciones();
  renderAulas();
  renderProfesores();
  renderMaterias();
  renderAlumnos();
  renderPruebas();
}

function renderInstituciones() {
  const container = document.getElementById('instituciones-list');
  if (!allData.instituciones || allData.instituciones.length === 0) {
    container.innerHTML = '<p class="empty">No hay instituciones</p>';
    return;
  }
  
  container.innerHTML = allData.instituciones.map(inst => `
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-school"></i> ${inst.nombre}</h3>
      </div>
      <div class="card-body">
        <p><i class="fas fa-map-marker-alt"></i> ${inst.direccion || 'Sin dirección'}</p>
        <p><i class="fas fa-envelope"></i> ${inst.correo || 'Sin correo'}</p>
      </div>
    </div>
  `).join('');
}

function renderAulas() {
  const container = document.getElementById('aulas-list');
  if (!allData.aulas || allData.aulas.length === 0) {
    container.innerHTML = '<p class="empty">No hay aulas</p>';
    return;
  }
  
  container.innerHTML = allData.aulas.map(aula => `
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-door-open"></i> ${aula.nombre}</h3>
      </div>
      <div class="card-body">
        <p><i class="fas fa-graduation-cap"></i> Grado: ${aula.grado || 'N/A'}</p>
        <p><i class="fas fa-chalkboard-teacher"></i> ${aula.profesor_name ? aula.profesor_name + ' ' + aula.profesor_apellido : 'Sin profesor'}</p>
      </div>
    </div>
  `).join('');
}

function renderProfesores() {
  const container = document.getElementById('profesores-list');
  if (!allData.profesores || allData.profesores.length === 0) {
    container.innerHTML = '<p class="empty">No hay profesores</p>';
    return;
  }
  
  container.innerHTML = allData.profesores.map(prof => `
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-chalkboard-teacher"></i> ${prof.nombre} ${prof.apellido}</h3>
      </div>
      <div class="card-body">
        <p><i class="fas fa-id-card"></i> DNI: ${prof.dni}</p>
      </div>
    </div>
  `).join('');
}

function renderMaterias() {
  const container = document.getElementById('materias-list');
  if (!allData.materias || allData.materias.length === 0) {
    container.innerHTML = '<p class="empty">No hay materias</p>';
    return;
  }
  
  container.innerHTML = allData.materias.map(mat => `
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-book"></i> ${mat.nombre}</h3>
      </div>
    </div>
  `).join('');
}

function renderAlumnos() {
  const container = document.getElementById('alumnos-list');
  if (!allData.alumnos || allData.alumnos.length === 0) {
    container.innerHTML = '<p class="empty">No hay alumnos</p>';
    return;
  }
  
  container.innerHTML = allData.alumnos.map(al => `
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-user-graduate"></i> ${al.nombre} ${al.apellido}</h3>
      </div>
      <div class="card-body">
        <p><i class="fas fa-id-card"></i> DNI: ${al.dni}</p>
        <p><i class="fas fa-calendar"></i> ${al.edad} años</p>
      </div>
    </div>
  `).join('');
}

function renderPruebas() {
  const container = document.getElementById('pruebas-list');
  if (!allData.pruebas || allData.pruebas.length === 0) {
    container.innerHTML = '<p class="empty">No hay pruebas</p>';
    return;
  }
  
  container.innerHTML = allData.pruebas.map(p => `
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-file-alt"></i> ${p.nombre}</h3>
      </div>
      <div class="card-body">
        <p><i class="fas fa-calendar"></i> ${p.fecha}</p>
        <p><i class="fas fa-weight"></i> Peso: ${p.peso}%</p>
      </div>
    </div>
  `).join('');
}

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
  });
  
  document.getElementById('refreshBtn').addEventListener('click', () => {
    const btn = document.getElementById('refreshBtn');
    btn.style.animation = 'rotate 0.5s ease';
    setTimeout(() => btn.style.animation = '', 500);
    loadAll();
  });
  
  setupButtons();
  loadAll();
});

function setupButtons() {
  setupNewInstitucion();
  setupNewProfesor();
  setupNewMateria();
  setupNewAula();
  setupNewAlumno();
  setupNewPrueba();
  setupNewNota();
  setupEstadisticas();
}

function setupNewInstitucion() {
  document.getElementById('newInstBtn').addEventListener('click', () => {
    openModal(`
      <div class="modal-card">
        <div class="modal-header">
          <h2><i class="fas fa-building"></i> Nueva Institución</h2>
          <button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="formInstitucion">
            <div class="form-group">
              <label><i class="fas fa-tag"></i> Nombre</label>
              <input type="text" name="nombre" required>
            </div>
            <div class="form-group">
              <label><i class="fas fa-map-marker-alt"></i> Dirección</label>
              <input type="text" name="direccion">
            </div>
            <div class="form-group">
              <label><i class="fas fa-envelope"></i> Correo</label>
              <input type="email" name="correo">
            </div>
            <div class="form-group">
              <label><i class="fas fa-map-pin"></i> Localidad</label>
              <input type="text" name="localidad">
            </div>
            <button type="submit" class="btn primary"><i class="fas fa-save"></i> Guardar</button>
          </form>
        </div>
      </div>
    `);
    
    document.getElementById('formInstitucion').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      
      try {
        const res = await fetch('api.php?action=add_institucion', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (result.ok) {
          showToast('Institución agregada', 'success');
          closeModal();
          loadAll();
        } else {
          showToast('Error al agregar', 'error');
        }
      } catch (error) {
        showToast('Error de conexión', 'error');
      }
    });
  });
}

function setupNewProfesor() {
  document.getElementById('newProfesorBtn').addEventListener('click', () => {
    openModal(`
      <div class="modal-card">
        <div class="modal-header">
          <h2><i class="fas fa-chalkboard-teacher"></i> Nuevo Profesor</h2>
          <button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="formProfesor">
            <div class="form-group">
              <label><i class="fas fa-user"></i> Nombre</label>
              <input type="text" name="nombre" required>
            </div>
            <div class="form-group">
              <label><i class="fas fa-user"></i> Apellido</label>
              <input type="text" name="apellido" required>
            </div>
            <div class="form-group">
              <label><i class="fas fa-id-card"></i> DNI</label>
              <input type="text" name="dni" required>
            </div>
            <button type="submit" class="btn primary"><i class="fas fa-save"></i> Guardar</button>
          </form>
        </div>
      </div>
    `);
    
    document.getElementById('formProfesor').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      
      try {
        const res = await fetch('api.php?action=add_profesor', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (result.ok) {
          showToast('Profesor agregado', 'success');
          closeModal();
          loadAll();
        } else {
          showToast('Error', 'error');
        }
      } catch (error) {
        showToast('Error de conexión', 'error');
      }
    });
  });
}

function setupNewMateria() {
  document.getElementById('newMateriaBtn').addEventListener('click', () => {
    openModal(`
      <div class="modal-card">
        <div class="modal-header">
          <h2><i class="fas fa-book"></i> Nueva Materia</h2>
          <button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="formMateria">
            <div class="form-group">
              <label><i class="fas fa-tag"></i> Nombre</label>
              <input type="text" name="nombre" required>
            </div>
            <button type="submit" class="btn primary"><i class="fas fa-save"></i> Guardar</button>
          </form>
        </div>
      </div>
    `);
    
    document.getElementById('formMateria').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      
      try {
        const res = await fetch('api.php?action=add_materia', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (result.ok) {
          showToast('Materia agregada', 'success');
          closeModal();
          loadAll();
        } else {
          showToast('Error', 'error');
        }
      } catch (error) {
        showToast('Error de conexión', 'error');
      }
    });
  });
}

function setupNewAula() {
  document.getElementById('newAulaBtn').addEventListener('click', () => {
    const optsInst = allData.instituciones.map(i => `<option value="${i.id}">${i.nombre}</option>`).join('');
    const optsProf = allData.profesores.map(p => `<option value="${p.id}">${p.nombre} ${p.apellido}</option>`).join('');
    
    openModal(`
      <div class="modal-card">
        <div class="modal-header">
          <h2><i class="fas fa-door-open"></i> Nueva Aula</h2>
          <button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="formAula">
            <div class="form-group">
              <label><i class="fas fa-tag"></i> Nombre</label>
              <input type="text" name="nombre" required>
            </div>
            <div class="form-group">
              <label><i class="fas fa-graduation-cap"></i> Grado</label>
              <input type="text" name="grado">
            </div>
            <div class="form-group">
              <label><i class="fas fa-building"></i> Institución</label>
              <select name="institucion_id" required>
                <option value="">Seleccione...</option>
                ${optsInst}
              </select>
            </div>
            <div class="form-group">
              <label><i class="fas fa-chalkboard-teacher"></i> Profesor</label>
              <select name="profesor_id">
                <option value="">Ninguno</option>
                ${optsProf}
              </select>
            </div>
            <button type="submit" class="btn primary"><i class="fas fa-save"></i> Guardar</button>
          </form>
        </div>
      </div>
    `);
    
    document.getElementById('formAula').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      
      try {
        const res = await fetch('api.php?action=add_aula', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (result.ok) {
          showToast('Aula agregada', 'success');
          closeModal();
          loadAll();
        } else {
          showToast('Error', 'error');
        }
      } catch (error) {
        showToast('Error de conexión', 'error');
      }
    });
  });
}

function setupNewAlumno() {
  document.getElementById('newAlumnoBtn').addEventListener('click', () => {
    const optsAula = allData.aulas.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('');
    
    openModal(`
      <div class="modal-card">
        <div class="modal-header">
          <h2><i class="fas fa-user-graduate"></i> Nuevo Alumno</h2>
          <button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="formAlumno">
            <div class="form-group">
              <label><i class="fas fa-user"></i> Nombre</label>
              <input type="text" name="nombre" required>
            </div>
            <div class="form-group">
              <label><i class="fas fa-user"></i> Apellido</label>
              <input type="text" name="apellido" required>
            </div>
            <div class="form-group">
              <label><i class="fas fa-id-card"></i> DNI</label>
              <input type="text" name="dni" required>
            </div>
            <div class="form-group">
              <label><i class="fas fa-calendar"></i> Edad</label>
              <input type="number" name="edad" required>
            </div>
            <div class="form-group">
              <label><i class="fas fa-venus-mars"></i> Género</label>
              <select name="genero" required>
                <option value="">Seleccione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div class="form-group">
              <label><i class="fas fa-door-open"></i> Aula</label>
              <select name="aula_id" required>
                <option value="">Seleccione...</option>
                ${optsAula}
              </select>
            </div>
            <button type="submit" class="btn primary"><i class="fas fa-save"></i> Guardar</button>
          </form>
        </div>
      </div>
    `);
    
    document.getElementById('formAlumno').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      
      try {
        const res = await fetch('api.php?action=add_alumno', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (result.ok) {
          showToast('Alumno agregado', 'success');
          closeModal();
          loadAll();
        } else {
          showToast('Error', 'error');
        }
      } catch (error) {
        showToast('Error de conexión', 'error');
      }
    });
  });
}

function setupNewPrueba() {
  document.getElementById('newPruebaBtn').addEventListener('click', () => {
    const optsInst = allData.instituciones.map(i => `<option value="${i.id}">${i.nombre}</option>`).join('');
    
    openModal(`
      <div class="modal-card">
        <div class="modal-header">
          <h2><i class="fas fa-file-alt"></i> Nueva Prueba</h2>
          <button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="formPrueba">
            <div class="form-group">
              <label><i class="fas fa-building"></i> 1. Seleccione Institución</label>
              <select id="selInstPrueba" required>
                <option value="">-- Seleccione --</option>
                ${optsInst}
              </select>
            </div>
            
            <div class="form-group" id="step2" style="display:none;">
              <label><i class="fas fa-door-open"></i> 2. Seleccione Aula</label>
              <select id="selAulaPrueba" name="aula_id" required>
                <option value="">-- Seleccione --</option>
              </select>
            </div>
            
            <div class="form-group" id="step3" style="display:none;">
              <label><i class="fas fa-book"></i> 3. Seleccione Materia</label>
              <select id="selMateriaPrueba" required>
                <option value="">-- Seleccione --</option>
              </select>
            </div>
            
            <div id="step4" style="display:none;">
              <hr>
              <div class="form-group">
                <label><i class="fas fa-tag"></i> Nombre de la Prueba</label>
                <input type="text" name="nombre" required>
              </div>
              <div class="form-group">
                <label><i class="fas fa-calendar"></i> Fecha</label>
                <input type="date" name="fecha" required>
              </div>
              <div class="form-group">
                <label><i class="fas fa-weight"></i> Peso (%)</label>
                <input type="number" name="peso" min="0" max="100" step="0.1" required>
              </div>
              <input type="hidden" name="aula_materia_id" id="aulaMateriId">
              <button type="submit" class="btn primary"><i class="fas fa-save"></i> Crear Prueba</button>
            </div>
          </form>
        </div>
      </div>
    `);
    
    document.getElementById('selInstPrueba').addEventListener('change', (e) => {
      const instId = e.target.value;
      document.getElementById('step2').style.display = 'none';
      document.getElementById('step3').style.display = 'none';
      document.getElementById('step4').style.display = 'none';
      
      if (instId) {
        const aulasInst = allData.aulas.filter(a => a.institucion_id == instId);
        const opts = aulasInst.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('');
        document.getElementById('selAulaPrueba').innerHTML = '<option value="">-- Seleccione --</option>' + opts;
        document.getElementById('step2').style.display = 'block';
      }
    });
    
    document.getElementById('selAulaPrueba').addEventListener('change', (e) => {
      const aulaId = e.target.value;
      document.getElementById('step3').style.display = 'none';
      document.getElementById('step4').style.display = 'none';
      
      if (aulaId) {
        const materias_aula = allData.aula_materia.filter(am => am.aula_id == aulaId);
        const opts = materias_aula.map(am => {
          const mat = allData.materias.find(m => m.id == am.materia_id);
          return mat ? `<option value="${am.id}">${mat.nombre}</option>` : '';
        }).join('');
        
        if (opts) {
          document.getElementById('selMateriaPrueba').innerHTML = '<option value="">-- Seleccione --</option>' + opts;
          document.getElementById('step3').style.display = 'block';
        } else {
          document.getElementById('selMateriaPrueba').innerHTML = '<option value="">Esta aula no tiene materias</option>';
          document.getElementById('step3').style.display = 'block';
        }
      }
    });
    
    document.getElementById('selMateriaPrueba').addEventListener('change', (e) => {
      const aulaMatId = e.target.value;
      if (aulaMatId) {
        document.getElementById('aulaMateriId').value = aulaMatId;
        document.getElementById('step4').style.display = 'block';
      } else {
        document.getElementById('step4').style.display = 'none';
      }
    });
    
    document.getElementById('formPrueba').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      
      try {
        const res = await fetch('api.php?action=add_prueba', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (result.ok) {
          showToast('Prueba creada', 'success');
          closeModal();
          loadAll();
        } else {
          showToast('Error', 'error');
        }
      } catch (error) {
        showToast('Error de conexión', 'error');
      }
    });
  });
}

function setupNewNota() {
  document.getElementById('newNotaBtn').addEventListener('click', () => {
    const optsPruebas = allData.pruebas.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');
    const optsAlumnos = allData.alumnos.map(a => `<option value="${a.id}">${a.nombre} ${a.apellido}</option>`).join('');
    
    openModal(`
      <div class="modal-card">
        <div class="modal-header">
          <h2><i class="fas fa-star"></i> Cargar Nota</h2>
          <button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="formNota">
            <div class="form-group">
              <label><i class="fas fa-file-alt"></i> Prueba</label>
              <select name="prueba_id" required>
                <option value="">Seleccione...</option>
                ${optsPruebas}
              </select>
            </div>
            <div class="form-group">
              <label><i class="fas fa-user-graduate"></i> Alumno</label>
              <select name="alumno_id" required>
                <option value="">Seleccione...</option>
                ${optsAlumnos}
              </select>
            </div>
            <div class="form-group">
              <label><i class="fas fa-star"></i> Nota (0-10)</label>
              <input type="number" name="nota" min="0" max="10" step="0.1" required>
            </div>
            <button type="submit" class="btn primary"><i class="fas fa-save"></i> Guardar</button>
          </form>
        </div>
      </div>
    `);
    
    document.getElementById('formNota').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      
      try {
        const res = await fetch('api.php?action=add_nota', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (result.ok) {
          showToast('Nota cargada', 'success');
          closeModal();
          loadAll();
        } else {
          showToast('Error', 'error');
        }
      } catch (error) {
        showToast('Error de conexión', 'error');
      }
    });
  });
}

function setupEstadisticas() {
  document.getElementById('viewStatsBtn').addEventListener('click', async () => {
    openModal(`
      <div class="modal-card">
        <div class="modal-header">
          <h2><i class="fas fa-chart-pie"></i> Estadísticas</h2>
          <button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="stats-grid">
            <div class="stat-card">
              <i class="fas fa-building"></i>
              <h3>${allData.instituciones.length}</h3>
              <p>Instituciones</p>
            </div>
            <div class="stat-card">
              <i class="fas fa-door-open"></i>
              <h3>${allData.aulas.length}</h3>
              <p>Aulas</p>
            </div>
            <div class="stat-card">
              <i class="fas fa-chalkboard-teacher"></i>
              <h3>${allData.profesores.length}</h3>
              <p>Profesores</p>
            </div>
            <div class="stat-card">
              <i class="fas fa-book"></i>
              <h3>${allData.materias.length}</h3>
              <p>Materias</p>
            </div>
            <div class="stat-card">
              <i class="fas fa-user-graduate"></i>
              <h3>${allData.alumnos.length}</h3>
              <p>Alumnos</p>
            </div>
            <div class="stat-card">
              <i class="fas fa-file-alt"></i>
              <h3>${allData.pruebas.length}</h3>
              <p>Pruebas</p>
            </div>
          </div>
          <div style="margin-top: 20px;">
            <canvas id="statsChart" width="400" height="200"></canvas>
          </div>
        </div>
      </div>
    `);
    
    if (currentChart) currentChart.destroy();
    
    const ctx = document.getElementById('statsChart').getContext('2d');
    currentChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Instituciones', 'Aulas', 'Profesores', 'Materias', 'Alumnos', 'Pruebas'],
        datasets: [{
          label: 'Cantidad',
          data: [
            allData.instituciones.length,
            allData.aulas.length,
            allData.profesores.length,
            allData.materias.length,
            allData.alumnos.length,
            allData.pruebas.length
          ],
          backgroundColor: ['#3498db', '#9b59b6', '#e74c3c', '#2ecc71', '#f39c12', '#1abc9c']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  });
}
