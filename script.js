// ========================================
// VARIABLES GLOBALES
// ========================================
let allData = null;
let currentChart = null;
// Handler global para cerrar modal con ESC
let _escHandler = null;
let searchQuery = '';

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
  
  // Enfocar el primer campo interactivo del modal
  setTimeout(() => {
    const firstField = modalContent.querySelector('input, select, textarea, button');
    if (firstField && typeof firstField.focus === 'function') {
      try { firstField.focus(); } catch (_) {}
    }
  }, 0);

  // Registrar Escape para cerrar modal
  if (_escHandler) {
    document.removeEventListener('keydown', _escHandler);
  }
  _escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  document.addEventListener('keydown', _escHandler);
  console.log('✅ Modal abierto');
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  if (_escHandler) {
    document.removeEventListener('keydown', _escHandler);
    _escHandler = null;
  }
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
    <div class="section collapsible collapsed" id="sec-instituciones">
      <div class="section-header" data-target="instituciones-list">
        <h2><i class="fas fa-building"></i> Instituciones</h2>
        <i class="fas fa-chevron-down chevron"></i>
      </div>
      <div class="section-body">
        <div id="instituciones-list" class="cards-grid"></div>
      </div>
    </div>
    
    <div class="section collapsible collapsed" id="sec-aulas">
      <div class="section-header" data-target="aulas-list">
        <h2><i class="fas fa-door-open"></i> Aulas</h2>
        <i class="fas fa-chevron-down chevron"></i>
      </div>
      <div class="section-body">
        <div id="aulas-list" class="cards-grid"></div>
      </div>
    </div>
    
    <div class="section collapsible collapsed" id="sec-profesores">
      <div class="section-header" data-target="profesores-list">
        <h2><i class="fas fa-chalkboard-teacher"></i> Profesores</h2>
        <i class="fas fa-chevron-down chevron"></i>
      </div>
      <div class="section-body">
        <div id="profesores-list" class="cards-grid"></div>
      </div>
    </div>
    
    <div class="section collapsible collapsed" id="sec-materias">
      <div class="section-header" data-target="materias-list">
        <h2><i class="fas fa-book"></i> Materias</h2>
        <i class="fas fa-chevron-down chevron"></i>
      </div>
      <div class="section-body">
        <div id="materias-list" class="cards-grid"></div>
      </div>
    </div>
    
    <div class="section collapsible collapsed" id="sec-alumnos">
      <div class="section-header" data-target="alumnos-list">
        <h2><i class="fas fa-user-graduate"></i> Alumnos</h2>
        <i class="fas fa-chevron-down chevron"></i>
      </div>
      <div class="section-body">
        <div id="alumnos-list" class="cards-grid"></div>
      </div>
    </div>
    
    <div class="section collapsible collapsed" id="sec-pruebas">
      <div class="section-header" data-target="pruebas-list">
        <h2><i class="fas fa-file-alt"></i> Pruebas</h2>
        <i class="fas fa-chevron-down chevron"></i>
      </div>
      <div class="section-body">
        <div id="pruebas-list" class="cards-grid"></div>
      </div>
    </div>
  `;
  // toggles acordeón
  document.querySelectorAll('.section.collapsible .section-header').forEach(h => {
    h.addEventListener('click', () => {
      const sec = h.closest('.section');
      sec.classList.toggle('collapsed');
    });
  });
  
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
  const term = (searchQuery || '').toLowerCase();
  const items = allData.instituciones.filter(inst => {
    if (!term) return true;
    return (inst.nombre||'').toLowerCase().includes(term) || (inst.localidad||'').toLowerCase().includes(term);
  });
  
  container.innerHTML = items.map(inst => `
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-school"></i> ${inst.nombre}</h3>
        <div class="card-actions">
          <button class="btn-mini edit" onclick="openEditInstitucionById(${inst.id})"><i class="fas fa-pen"></i></button>
          <button class="btn-mini del" onclick="confirmDelete('institucion', ${inst.id})"><i class="fas fa-trash"></i></button>
        </div>
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
  const term = (searchQuery || '').toLowerCase();
  const items = allData.aulas.filter(aula => {
    if (!term) return true;
    return (aula.nombre||'').toLowerCase().includes(term) || (aula.grado||'').toLowerCase().includes(term) || (aula.profesor_name||'').toLowerCase().includes(term) || (aula.profesor_apellido||'').toLowerCase().includes(term);
  });
  
  container.innerHTML = items.map(aula => `
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-door-open"></i> ${aula.nombre}</h3>
        <div class="card-actions">
          <button class="btn-mini edit" onclick="openEditAulaById(${aula.id})"><i class="fas fa-pen"></i></button>
          <button class="btn-mini del" onclick="confirmDelete('aula', ${aula.id})"><i class="fas fa-trash"></i></button>
        </div>
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
  const term = (searchQuery || '').toLowerCase();
  const items = allData.profesores.filter(prof => {
    if (!term) return true;
    return (prof.nombre||'').toLowerCase().includes(term) || (prof.apellido||'').toLowerCase().includes(term) || (prof.dni||'').toLowerCase().includes(term);
  });
  
  container.innerHTML = items.map(prof => `
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-chalkboard-teacher"></i> ${prof.nombre} ${prof.apellido}</h3>
        <div class="card-actions">
          <button class="btn-mini edit" onclick="openEditProfesorById(${prof.id})"><i class="fas fa-pen"></i></button>
          <button class="btn-mini del" onclick="confirmDelete('profesor', ${prof.id})"><i class="fas fa-trash"></i></button>
        </div>
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
  const term = (searchQuery || '').toLowerCase();
  const items = allData.materias.filter(mat => {
    if (!term) return true;
    return (mat.nombre||'').toLowerCase().includes(term);
  });
  
  container.innerHTML = items.map(mat => `
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-book"></i> ${mat.nombre}</h3>
        <div class="card-actions">
          <button class="btn-mini edit" onclick="openEditMateriaById(${mat.id})"><i class="fas fa-pen"></i></button>
          <button class="btn-mini del" onclick="confirmDelete('materia', ${mat.id})"><i class="fas fa-trash"></i></button>
        </div>
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
  const term = (searchQuery || '').toLowerCase();
  const items = allData.alumnos.filter(al => {
    if (!term) return true;
    return (al.nombre||'').toLowerCase().includes(term) || (al.apellido||'').toLowerCase().includes(term) || (al.dni||'').toLowerCase().includes(term);
  });
  
  container.innerHTML = items.map(al => `
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-user-graduate"></i> ${al.nombre} ${al.apellido}</h3>
        <div class="card-actions">
          <button class="btn-mini edit" onclick="openEditAlumnoById(${al.id})"><i class="fas fa-pen"></i></button>
          <button class="btn-mini del" onclick="confirmDelete('alumno', ${al.id})"><i class="fas fa-trash"></i></button>
        </div>
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
  const term = (searchQuery || '').toLowerCase();
  const items = allData.pruebas.filter(p => {
    if (!term) return true;
    return (p.nombre||'').toLowerCase().includes(term) || (p.fecha||'').toLowerCase().includes(term);
  });
  
  container.innerHTML = items.map(p => `
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-file-alt"></i> ${p.nombre}</h3>
        <div class="card-actions">
          <button class="btn-mini edit" onclick="openEditPruebaById(${p.id})"><i class="fas fa-pen"></i></button>
          <button class="btn-mini del" onclick="confirmDelete('prueba', ${p.id})"><i class="fas fa-trash"></i></button>
        </div>
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
  
  const search = document.getElementById('searchInput');
  if (search) {
    search.addEventListener('input', (e) => {
      searchQuery = e.target.value || '';
      renderMain();
    });
  }
  
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
      const nombre = (data.nombre || '').trim().toLowerCase();
      if (!nombre) {
        showToast('El nombre es obligatorio', 'warning');
        return;
      }
      // Validación de duplicados (case-insensitive)
      if (allData && Array.isArray(allData.instituciones)) {
        const existe = allData.instituciones.some(i => (i.nombre || '').trim().toLowerCase() === nombre);
        if (existe) {
          showToast('Ya existe una institución con ese nombre', 'error');
          return;
        }
      }
      
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
      const nombre = (data.nombre || '').trim().toLowerCase();
      if (!nombre) {
        showToast('El nombre es obligatorio', 'warning');
        return;
      }
      // Validación de duplicados en Materias (case-insensitive)
      if (allData && Array.isArray(allData.materias)) {
        const existe = allData.materias.some(m => (m.nombre || '').trim().toLowerCase() === nombre);
        if (existe) {
          showToast('Ya existe una materia con ese nombre', 'error');
          return;
        }
      }
      
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
          <div id="advStats" style="margin-top:20px;"></div>
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
    // Estadísticas avanzadas desde API
    try {
      const resp = await fetch('api.php?action=get_estadisticas');
      const adv = await resp.json();
      const div = document.getElementById('advStats');
      const generos = (adv.generos||[]).map(g=>`${g.genero||'N/D'}: ${g.cantidad}`).join(' · ');
      const pm = (adv.promedios_por_materia||[]).map(x=>`${x.materia}: ${x.promedio}`).join(' · ');
      div.innerHTML = `
        <hr style="margin:20px 0; border:none; height:2px; background: var(--bg);">
        <h3 style="margin-bottom:10px; color:#334155;"><i class="fas fa-signal"></i> Resumen avanzado</h3>
        <p><strong>Promedio de edades:</strong> ${adv.prom_edad ?? 'N/D'}</p>
        <p><strong>Promedio de notas:</strong> ${adv.prom_notas ?? 'N/D'} · <strong>Máx:</strong> ${adv.nota_alta ?? 'N/D'} · <strong>Mín:</strong> ${adv.nota_baja ?? 'N/D'}</p>
        <p><strong>Distribución por género:</strong> ${generos || 'N/D'}</p>
        <p><strong>Promedio por materia:</strong> ${pm || 'N/D'}</p>
      `;
    } catch (err) {
      console.error('Adv stats error', err);
    }
  });
}

// ========================================
// ACCIONES: EDITAR / ELIMINAR
// ========================================
async function confirmDelete(entity, id){
  if (typeof Swal === 'undefined') { if(!confirm('¿Eliminar?')) return; } else {
    const res = await Swal.fire({
      title: '¿Eliminar?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if(!res.isConfirmed) return;
  }
  const map = {
    institucion:'delete_institucion', aula:'delete_aula', alumno:'delete_alumno', profesor:'delete_profesor', materia:'delete_materia', prueba:'delete_prueba', nota:'delete_nota'
  };
  const action = map[entity];
  if(!action){ showToast('Acción no soportada', 'error'); return; }
  try{
    const r = await fetch(`api.php?action=${action}&id=${id}`);
    const j = await r.json();
    if(j.ok){ showToast('Eliminado', 'success'); loadAll(); } else { showToast('Error al eliminar', 'error'); }
  }catch(e){ showToast('Error de conexión', 'error'); }
}

function openEditInstitucion(inst){
  openModal(`
    <div class="modal-card">
      <div class="modal-header">
        <h2><i class="fas fa-building"></i> Editar Institución</h2>
        <button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body">
        <form id="formEditInstitucion">
          <div class="form-group"><label><i class="fas fa-tag"></i> Nombre</label><input type="text" name="nombre" value="${inst.nombre||''}" required></div>
          <div class="form-group"><label><i class="fas fa-map-marker-alt"></i> Dirección</label><input type="text" name="direccion" value="${inst.direccion||''}"></div>
          <div class="form-group"><label><i class="fas fa-envelope"></i> Correo</label><input type="email" name="correo" value="${inst.correo||''}"></div>
          <div class="form-group"><label><i class="fas fa-map-pin"></i> Localidad</label><input type="text" name="localidad" value="${inst.localidad||''}"></div>
          <button class="btn primary" type="submit"><i class="fas fa-save"></i> Guardar</button>
        </form>
      </div>
    </div>`);
  document.getElementById('formEditInstitucion').addEventListener('submit', async (e)=>{
    e.preventDefault(); const fd=new FormData(e.target); const data=Object.fromEntries(fd);
    try{ const r=await fetch(`api.php?action=update_institucion&id=${inst.id}`,{method:'POST', body: JSON.stringify(data)}); const j=await r.json(); if(j.ok){ showToast('Actualizado','success'); closeModal(); loadAll(); } else { showToast('Error','error'); } }catch(err){ showToast('Error de conexión','error'); }
  });
}

function openEditProfesor(prof){
  openModal(`
    <div class="modal-card"><div class="modal-header"><h2><i class="fas fa-chalkboard-teacher"></i> Editar Profesor</h2><button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button></div>
    <div class="modal-body"><form id="formEditProfesor">
      <div class="form-group"><label><i class="fas fa-user"></i> Nombre</label><input name="nombre" value="${prof.nombre||''}" required></div>
      <div class="form-group"><label><i class="fas fa-user"></i> Apellido</label><input name="apellido" value="${prof.apellido||''}" required></div>
      <div class="form-group"><label><i class="fas fa-id-card"></i> DNI</label><input name="dni" value="${prof.dni||''}" required></div>
      <button class="btn primary" type="submit"><i class="fas fa-save"></i> Guardar</button>
    </form></div></div>`);
  document.getElementById('formEditProfesor').addEventListener('submit', async (e)=>{
    e.preventDefault(); const data=Object.fromEntries(new FormData(e.target));
    try{ const r=await fetch(`api.php?action=update_profesor&id=${prof.id}`,{method:'POST', body: JSON.stringify(data)}); const j=await r.json(); if(j.ok){ showToast('Actualizado','success'); closeModal(); loadAll(); } else { showToast('Error','error'); } }catch(err){ showToast('Error de conexión','error'); }
  });
}

function openEditMateria(mat){
  openModal(`
    <div class="modal-card"><div class="modal-header"><h2><i class="fas fa-book"></i> Editar Materia</h2><button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button></div>
    <div class="modal-body"><form id="formEditMateria">
      <div class="form-group"><label><i class="fas fa-tag"></i> Nombre</label><input name="nombre" value="${mat.nombre||''}" required></div>
      <button class="btn primary" type="submit"><i class="fas fa-save"></i> Guardar</button>
    </form></div></div>`);
  document.getElementById('formEditMateria').addEventListener('submit', async (e)=>{
    e.preventDefault(); const data=Object.fromEntries(new FormData(e.target));
    try{ const r=await fetch(`api.php?action=update_materia&id=${mat.id}`,{method:'POST', body: JSON.stringify(data)}); const j=await r.json(); if(j.ok){ showToast('Actualizado','success'); closeModal(); loadAll(); } else { showToast('Error','error'); } }catch(err){ showToast('Error de conexión','error'); }
  });
}

function openEditAula(aula){
  const optsInst = allData.instituciones.map(i => `<option value="${i.id}" ${Number(aula.institucion_id)===Number(i.id)?'selected':''}>${i.nombre}</option>`).join('');
  const optsProf = allData.profesores.map(p => `<option value="${p.id}" ${Number(aula.profesor_id)===Number(p.id)?'selected':''}>${p.nombre} ${p.apellido}</option>`).join('');
  openModal(`
    <div class="modal-card"><div class="modal-header"><h2><i class="fas fa-door-open"></i> Editar Aula</h2><button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button></div>
    <div class="modal-body"><form id="formEditAula">
      <div class="form-group"><label><i class="fas fa-tag"></i> Nombre</label><input name="nombre" value="${aula.nombre||''}" required></div>
      <div class="form-group"><label><i class="fas fa-graduation-cap"></i> Grado</label><input name="grado" value="${aula.grado||''}"></div>
      <div class="form-group"><label><i class="fas fa-building"></i> Institución</label><select name="institucion_id" required><option value="">Seleccione...</option>${optsInst}</select></div>
      <div class="form-group"><label><i class="fas fa-chalkboard-teacher"></i> Profesor</label><select name="profesor_id"><option value="">Ninguno</option>${optsProf}</select></div>
      <button class="btn primary" type="submit"><i class="fas fa-save"></i> Guardar</button>
    </form></div></div>`);
  document.getElementById('formEditAula').addEventListener('submit', async (e)=>{
    e.preventDefault(); const data=Object.fromEntries(new FormData(e.target));
    try{ const r=await fetch(`api.php?action=update_aula&id=${aula.id}`,{method:'POST', body: JSON.stringify(data)}); const j=await r.json(); if(j.ok){ showToast('Actualizado','success'); closeModal(); loadAll(); } else { showToast('Error','error'); } }catch(err){ showToast('Error de conexión','error'); }
  });
}

function openEditAlumno(al){
  const optsAula = allData.aulas.map(a => `<option value="${a.id}" ${Number(al.aula_id)===Number(a.id)?'selected':''}>${a.nombre}</option>`).join('');
  openModal(`
    <div class="modal-card"><div class="modal-header"><h2><i class="fas fa-user-graduate"></i> Editar Alumno</h2><button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button></div>
    <div class="modal-body"><form id="formEditAlumno">
      <div class="form-group"><label><i class="fas fa-user"></i> Nombre</label><input name="nombre" value="${al.nombre||''}" required></div>
      <div class="form-group"><label><i class="fas fa-user"></i> Apellido</label><input name="apellido" value="${al.apellido||''}" required></div>
      <div class="form-group"><label><i class="fas fa-id-card"></i> DNI</label><input name="dni" value="${al.dni||''}" required></div>
      <div class="form-group"><label><i class="fas fa-calendar"></i> Edad</label><input type="number" name="edad" value="${al.edad||''}" required></div>
      <div class="form-group"><label><i class="fas fa-venus-mars"></i> Género</label>
        <select name="genero" required>
          <option value="">Seleccione...</option>
          <option ${al.genero==='Masculino'?'selected':''}>Masculino</option>
          <option ${al.genero==='Femenino'?'selected':''}>Femenino</option>
          <option ${al.genero==='Otro'?'selected':''}>Otro</option>
        </select>
      </div>
      <div class="form-group"><label><i class="fas fa-door-open"></i> Aula</label><select name="aula_id" required><option value="">Seleccione...</option>${optsAula}</select></div>
      <button class="btn primary" type="submit"><i class="fas fa-save"></i> Guardar</button>
    </form></div></div>`);
  document.getElementById('formEditAlumno').addEventListener('submit', async (e)=>{
    e.preventDefault(); const data=Object.fromEntries(new FormData(e.target));
    try{ const r=await fetch(`api.php?action=update_alumno&id=${al.id}`,{method:'POST', body: JSON.stringify(data)}); const j=await r.json(); if(j.ok){ showToast('Actualizado','success'); closeModal(); loadAll(); } else { showToast('Error','error'); } }catch(err){ showToast('Error de conexión','error'); }
  });
}

function openEditPrueba(p){
  openModal(`
    <div class="modal-card"><div class="modal-header"><h2><i class="fas fa-file-alt"></i> Editar Prueba</h2><button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button></div>
    <div class="modal-body"><form id="formEditPrueba">
      <div class="form-group"><label><i class="fas fa-tag"></i> Nombre</label><input name="nombre" value="${p.nombre||''}" required></div>
      <div class="form-group"><label><i class="fas fa-calendar"></i> Fecha</label><input type="date" name="fecha" value="${p.fecha||''}" required></div>
      <div class="form-group"><label><i class="fas fa-weight"></i> Peso (%)</label><input type="number" name="peso" min="0" max="100" step="0.1" value="${p.peso||''}" required></div>
      <button class="btn primary" type="submit"><i class="fas fa-save"></i> Guardar</button>
    </form></div></div>`);
  document.getElementById('formEditPrueba').addEventListener('submit', async (e)=>{
    e.preventDefault(); const data=Object.fromEntries(new FormData(e.target));
    try{ const r=await fetch(`api.php?action=update_prueba&id=${p.id}`,{method:'POST', body: JSON.stringify(data)}); const j=await r.json(); if(j.ok){ showToast('Actualizado','success'); closeModal(); loadAll(); } else { showToast('Error','error'); } }catch(err){ showToast('Error de conexión','error'); }
  });
}

// Wrappers para edición por id (evita problemas de comillas en HTML)
function openEditInstitucionById(id){ const inst = (allData?.instituciones||[]).find(x=> Number(x.id)===Number(id)); if(inst) openEditInstitucion(inst); }
function openEditProfesorById(id){ const prof = (allData?.profesores||[]).find(x=> Number(x.id)===Number(id)); if(prof) openEditProfesor(prof); }
function openEditMateriaById(id){ const mat = (allData?.materias||[]).find(x=> Number(x.id)===Number(id)); if(mat) openEditMateria(mat); }
function openEditAulaById(id){ const aula = (allData?.aulas||[]).find(x=> Number(x.id)===Number(id)); if(aula) openEditAula(aula); }
function openEditAlumnoById(id){ const al = (allData?.alumnos||[]).find(x=> Number(x.id)===Number(id)); if(al) openEditAlumno(al); }
function openEditPruebaById(id){ const p = (allData?.pruebas||[]).find(x=> Number(x.id)===Number(id)); if(p) openEditPrueba(p); }
