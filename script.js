// ========================================
// VARIABLES GLOBALES
// ========================================
let allData = null;
let currentChart = null;
// Handler global para cerrar modal con ESC
let _escHandler = null;
let searchQuery = '';
// Paginación de alumnos
let alumnosPage = 1;
const alumnosPerPage = 15;

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
  
  // Si estamos en la vista fullscreen de alumnos, aumentar z-index del modal
  const isFullViewActive = document.getElementById('alumnosFullView');
  if (isFullViewActive) {
    modal.style.zIndex = '99999'; // Mayor que el fullview (9999)
  } else {
    modal.style.zIndex = ''; // Reset al valor por defecto del CSS
  }
  
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
  // Alumnos se muestra en modal, no en acordeón
  // renderPruebas();
}

// Modal especial para lista de alumnos
async function openAlumnosModal() {
  // Guardar en sessionStorage que estamos en la vista de alumnos
  sessionStorage.setItem('alumnosFullViewActive', 'true');
  sessionStorage.setItem('alumnosPage', alumnosPage.toString());
  
  // Ocultar el contenido principal y mostrar vista de alumnos
  document.querySelector('.mainpanel').style.display = 'none';
  document.querySelector('.sidebar').style.display = 'none';
  document.querySelector('.topbar').style.display = 'none';
  
  // Crear vista fullscreen de alumnos
  const body = document.querySelector('body');
  const alumnosView = document.createElement('div');
  alumnosView.id = 'alumnosFullView';
  alumnosView.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #f0f4f8; z-index: 9999; overflow: hidden;';
  body.appendChild(alumnosView);
  
  // Asegurar datos cargados
  if (!allData || !allData.alumnos) {
    alumnosView.innerHTML = '<div style="padding: 40px; text-align: center;"><h2>Cargando...</h2></div>';
    try {
      await loadAll();
    } catch (_) {}
  }
  
  // Restaurar página guardada si existe
  const savedPage = sessionStorage.getItem('alumnosPage');
  if (savedPage) {
    alumnosPage = parseInt(savedPage);
  } else {
    alumnosPage = 1;
  }
  
  renderAlumnosFullView();
}

function renderAlumnosFullView() {
  const alumnosView = document.getElementById('alumnosFullView');
  if (!alumnosView) return;
  
  if (!allData.alumnos || allData.alumnos.length === 0) {
    alumnosView.innerHTML = `
      <div style="padding: 40px; text-align: center;">
        <h2>No hay alumnos</h2>
        <button onclick="closeAlumnosFullView()" style="margin-top: 20px; padding: 12px 24px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
          <i class="fas fa-arrow-left"></i> Volver
        </button>
      </div>
    `;
    return;
  }
  
  const term = (searchQuery || '').toLowerCase();
  const items = allData.alumnos.filter(al => {
    if (!term) return true;
    return (al.nombre||'').toLowerCase().includes(term) || (al.apellido||'').toLowerCase().includes(term) || (al.dni||'').toLowerCase().includes(term);
  });
  
  const totalPages = Math.ceil(items.length / alumnosPerPage);
  const start = (alumnosPage - 1) * alumnosPerPage;
  const end = start + alumnosPerPage;
  const pageItems = items.slice(start, end);
  
  let html = `
    <div style="height: 100vh; display: flex; flex-direction: column; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <!-- Header -->
      <div style="background: rgba(255,255,255,0.98); padding: 12px 30px; box-shadow: 0 2px 15px rgba(0,0,0,0.15); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
        <div style="display: flex; align-items: center; gap: 20px;">
          <button onclick="closeAlumnosFullView()" style="background: #e74c3c; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; font-weight: 600; transition: all 0.2s; box-shadow: 0 2px 8px rgba(231,76,60,0.3);">
            <i class="fas fa-arrow-left"></i> Volver
          </button>
          <h1 style="margin: 0; font-size: 22px; color: #2c3e50; font-weight: 700;">
            <i class="fas fa-user-graduate"></i> Lista de Alumnos
          </h1>
        </div>
        
        <div style="display: flex; align-items: center; gap: 15px;">
          <input type="text" id="searchAlumnosFullView" placeholder="🔍 Buscar alumno..." 
                 style="width: 280px; padding: 10px 15px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; transition: all 0.2s;"
                 value="${searchQuery || ''}"
                 onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102,126,234,0.1)'"
                 onblur="this.style.borderColor='#ddd'; this.style.boxShadow='none'">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button onclick="prevPageAlumnosModal()" ${alumnosPage <= 1 ? 'disabled' : ''} 
                    style="background: #3498db; color: white; border: none; padding: 10px 22px; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; font-weight: 600; transition: all 0.2s; ${alumnosPage <= 1 ? 'opacity: 0.3; cursor: not-allowed;' : 'box-shadow: 0 2px 8px rgba(52,152,219,0.35);'}"
                    ${alumnosPage <= 1 ? '' : 'onmouseover="this.style.transform=\'translateY(-2px)\'; this.style.boxShadow=\'0 4px 12px rgba(52,152,219,0.4)\'" onmouseout="this.style.transform=\'translateY(0)\'; this.style.boxShadow=\'0 2px 8px rgba(52,152,219,0.35)\'"'}>
              <i class="fas fa-chevron-left"></i> Anterior
            </button>
            <span style="font-size: 13px; font-weight: 700; color: #2c3e50; min-width: 160px; text-align: center; background: linear-gradient(135deg, #ecf0f1 0%, #d5dbdb 100%); padding: 10px 18px; border-radius: 8px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
              Página ${alumnosPage}/${totalPages}
            </span>
            <button onclick="nextPageAlumnosModal()" ${alumnosPage >= totalPages ? 'disabled' : ''} 
                    style="background: #3498db; color: white; border: none; padding: 10px 22px; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; font-weight: 600; transition: all 0.2s; ${alumnosPage >= totalPages ? 'opacity: 0.3; cursor: not-allowed;' : 'box-shadow: 0 2px 8px rgba(52,152,219,0.35);'}"
                    ${alumnosPage >= totalPages ? '' : 'onmouseover="this.style.transform=\'translateY(-2px)\'; this.style.boxShadow=\'0 4px 12px rgba(52,152,219,0.4)\'" onmouseout="this.style.transform=\'translateY(0)\'; this.style.boxShadow=\'0 2px 8px rgba(52,152,219,0.35)\'"'}>
              Siguiente <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Contenido - Tabla con altura calculada para 15 filas -->
      <div style="flex: 1; padding: 15px 30px; overflow: hidden; display: flex; flex-direction: column; justify-content: center;">
        <div style="background: white; border-radius: 12px; box-shadow: 0 10px 50px rgba(0,0,0,0.25); overflow: hidden; max-width: 100%; margin: 0 auto; width: 100%;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                <th style="padding: 14px 16px; text-align: left; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">Nombre</th>
                <th style="padding: 14px 16px; text-align: left; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">Apellido</th>
                <th style="padding: 14px 16px; text-align: left; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">DNI</th>
                <th style="padding: 14px 16px; text-align: center; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">Edad</th>
                <th style="padding: 14px 16px; text-align: center; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">Género</th>
                <th style="padding: 14px 16px; text-align: left; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">Aula</th>
                <th style="padding: 14px 16px; text-align: center; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; width: 140px;">Acciones</th>
              </tr>
            </thead>
            <tbody>
  `;
  
  pageItems.forEach((al, idx) => {
    const aula = allData.aulas.find(a => a.id == al.aula_id);
    const aulaName = aula ? aula.nombre : 'Sin aula';
    const rowColor = idx % 2 === 0 ? '#f8f9fa' : 'white';
    html += `
      <tr style="background: ${rowColor}; border-bottom: 1px solid #e9ecef; transition: all 0.2s;" onmouseover="this.style.background='#e3f2fd'" onmouseout="this.style.background='${rowColor}'">
        <td style="padding: 10px 12px; font-size: 14px; color: #2c3e50;">${al.nombre}</td>
        <td style="padding: 10px 12px; font-size: 14px; color: #2c3e50;">${al.apellido}</td>
        <td style="padding: 10px 12px; font-size: 14px; color: #7f8c8d;">${al.dni}</td>
        <td style="padding: 10px 12px; text-align: center; font-size: 14px; color: #2c3e50;">${al.edad}</td>
        <td style="padding: 10px 12px; text-align: center; font-size: 14px;">
          <span style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 12px; background: ${al.genero === 'Masculino' ? '#e3f2fd' : '#fce4ec'}; color: ${al.genero === 'Masculino' ? '#1976d2' : '#c2185b'}; font-weight: 600; font-size: 12px;">
            <i class="fas fa-${al.genero === 'Masculino' ? 'mars' : al.genero === 'Femenino' ? 'venus' : 'venus-mars'}"></i>
            ${al.genero}
          </span>
        </td>
        <td style="padding: 10px 12px; font-size: 14px; color: #2c3e50;">${aulaName}</td>
        <td style="padding: 10px 12px; text-align: center;">
          <button class="btn-mini edit" onclick="openEditAlumnoFromFullView(${al.id})" title="Editar" style="background: #3498db; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; margin-right: 5px;">
            <i class="fas fa-pen"></i>
          </button>
          <button class="btn-mini del" onclick="confirmDeleteFromFullView('alumno', ${al.id})" title="Eliminar" style="background: #e74c3c; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer;">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
  
  html += `
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  alumnosView.innerHTML = html;
  
  // Evento de búsqueda
  setTimeout(() => {
    const searchInput = document.getElementById('searchAlumnosFullView');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value || '';
        alumnosPage = 1;
        renderAlumnosFullView();
      });
    }
  }, 100);
}

function closeAlumnosFullView() {
  // Limpiar sessionStorage
  sessionStorage.removeItem('alumnosFullViewActive');
  sessionStorage.removeItem('alumnosPage');
  
  const alumnosView = document.getElementById('alumnosFullView');
  if (alumnosView) {
    alumnosView.remove();
  }
  document.querySelector('.mainpanel').style.display = 'block';
  document.querySelector('.sidebar').style.display = 'block';
  document.querySelector('.topbar').style.display = 'flex';
  searchQuery = '';
}

function renderAlumnosModal() {
  if (!allData.alumnos || allData.alumnos.length === 0) {
    openModal(`
      <div class="modal-card">
        <div class="modal-header">
          <h2><i class="fas fa-user-graduate"></i> Lista de Alumnos</h2>
          <button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <p class="empty">No hay alumnos</p>
        </div>
      </div>
    `);
    return;
  }
  
  const term = (searchQuery || '').toLowerCase();
  const items = allData.alumnos.filter(al => {
    if (!term) return true;
    return (al.nombre||'').toLowerCase().includes(term) || (al.apellido||'').toLowerCase().includes(term) || (al.dni||'').toLowerCase().includes(term);
  });
  
  // Paginación
  const totalPages = Math.ceil(items.length / alumnosPerPage);
  const start = (alumnosPage - 1) * alumnosPerPage;
  const end = start + alumnosPerPage;
  const pageItems = items.slice(start, end);
  
  let html = `
    <div class="modal-card modal-fullscreen">
      <div class="modal-header">
        <h2><i class="fas fa-user-graduate"></i> Lista de Alumnos</h2>
        <button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body">
        <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
          <input type="text" id="searchAlumnosModal" placeholder="🔍 Buscar alumno..." 
                 style="width: 300px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;"
                 value="${searchQuery || ''}">
          
          <!-- Controles de paginación arriba -->
          <div style="display: flex; align-items: center; gap: 15px;">
            <button onclick="prevPageAlumnosModal()" ${alumnosPage <= 1 ? 'disabled' : ''} 
                    style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: all 0.2s; ${alumnosPage <= 1 ? 'opacity: 0.4; cursor: not-allowed;' : ''}">
              <i class="fas fa-chevron-left"></i> Anterior
            </button>
            <span style="font-size: 14px; font-weight: 600; color: #333; min-width: 200px; text-align: center;">
              Página ${alumnosPage} de ${totalPages} | ${items.length} alumnos
            </span>
            <button onclick="nextPageAlumnosModal()" ${alumnosPage >= totalPages ? 'disabled' : ''} 
                    style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: all 0.2s; ${alumnosPage >= totalPages ? 'opacity: 0.4; cursor: not-allowed;' : ''}">
              Siguiente <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        
        <!-- Tabla de alumnos -->
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; background: white;">
            <thead>
              <tr style="background: var(--primary); color: white;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Nombre</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Apellido</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">DNI</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Edad</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Género</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Aula</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd; width: 120px;">Acciones</th>
              </tr>
            </thead>
            <tbody>
  `;
  
  pageItems.forEach((al, idx) => {
    const aula = allData.aulas.find(a => a.id == al.aula_id);
    const aulaName = aula ? aula.nombre : 'Sin aula';
    const rowColor = idx % 2 === 0 ? '#f9f9f9' : 'white';
    html += `
      <tr style="background: ${rowColor};">
        <td style="padding: 10px; border: 1px solid #ddd;">${al.nombre}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${al.apellido}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${al.dni}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${al.edad}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
          <i class="fas fa-${al.genero === 'Masculino' ? 'mars' : al.genero === 'Femenino' ? 'venus' : 'venus-mars'}" 
             style="color: ${al.genero === 'Masculino' ? '#3498db' : '#e91e63'};"></i>
          ${al.genero}
        </td>
        <td style="padding: 10px; border: 1px solid #ddd;">${aulaName}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
          <button class="btn-mini edit" onclick="openEditAlumnoById(${al.id})" title="Editar">
            <i class="fas fa-pen"></i>
          </button>
          <button class="btn-mini del" onclick="confirmDelete('alumno', ${al.id})" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
  
  html += `
            </tbody>
          </table>
        </div>
        
        <!-- Controles de paginación abajo -->
        <div style="margin-top: 15px; display: flex; justify-content: center; align-items: center; gap: 15px;">
          <button onclick="prevPageAlumnosModal()" ${alumnosPage <= 1 ? 'disabled' : ''} 
                  style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: all 0.2s; ${alumnosPage <= 1 ? 'opacity: 0.4; cursor: not-allowed;' : ''}">
            <i class="fas fa-chevron-left"></i> Anterior
          </button>
          <span style="font-size: 14px; font-weight: 600; color: #333; min-width: 200px; text-align: center;">
            Mostrando ${start + 1}-${Math.min(end, items.length)} de ${items.length}
          </span>
          <button onclick="nextPageAlumnosModal()" ${alumnosPage >= totalPages ? 'disabled' : ''} 
                  style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: all 0.2s; ${alumnosPage >= totalPages ? 'opacity: 0.4; cursor: not-allowed;' : ''}">
            Siguiente <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Abrir modal usando el gestor centralizado
  openModal(html);
  
  // Evento de búsqueda
  setTimeout(() => {
    const searchInput = document.getElementById('searchAlumnosModal');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value || '';
        alumnosPage = 1;
        renderAlumnosModal();
      });
      searchInput.focus();
    }
  }, 100);
  // El manejo de ESC lo hace openModal()
}

// Funciones de navegación del modal
function nextPageAlumnosModal() {
  const term = (searchQuery || '').toLowerCase();
  const items = allData.alumnos.filter(al => {
    if (!term) return true;
    return (al.nombre||'').toLowerCase().includes(term) || (al.apellido||'').toLowerCase().includes(term) || (al.dni||'').toLowerCase().includes(term);
  });
  const totalPages = Math.ceil(items.length / alumnosPerPage);
  if (alumnosPage < totalPages) {
    alumnosPage++;
    // Guardar página actual en sessionStorage
    sessionStorage.setItem('alumnosPage', alumnosPage.toString());
    // Verificar si estamos en vista fullscreen o modal
    const fullView = document.getElementById('alumnosFullView');
    if (fullView) {
      renderAlumnosFullView();
    } else {
      renderAlumnosModal();
    }
  }
}

function prevPageAlumnosModal() {
  if (alumnosPage > 1) {
    alumnosPage--;
    // Guardar página actual en sessionStorage
    sessionStorage.setItem('alumnosPage', alumnosPage.toString());
    // Verificar si estamos en vista fullscreen o modal
    const fullView = document.getElementById('alumnosFullView');
    if (fullView) {
      renderAlumnosFullView();
    } else {
      renderAlumnosModal();
    }
  }
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
  
  // Paginación
  const totalPages = Math.ceil(items.length / alumnosPerPage);
  const start = (alumnosPage - 1) * alumnosPerPage;
  const end = start + alumnosPerPage;
  const pageItems = items.slice(start, end);
  
  let html = '';
  
  // Controles de paginación arriba
  if (items.length > alumnosPerPage) {
    html += `
      <div class="pagination-controls">
        <button onclick="prevPageAlumnos()" ${alumnosPage <= 1 ? 'disabled' : ''} class="btn-page">
          <i class="fas fa-chevron-left"></i> Anterior
        </button>
        <span class="page-info">Página ${alumnosPage} de ${totalPages} | Total: ${items.length} alumnos</span>
        <button onclick="nextPageAlumnos()" ${alumnosPage >= totalPages ? 'disabled' : ''} class="btn-page">
          Siguiente <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    `;
  }
  
  // Cards de alumnos
  html += '<div class="cards-grid">';
  html += pageItems.map(al => `
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
        <p><i class="fas fa-${al.genero === 'Masculino' ? 'mars' : al.genero === 'Femenino' ? 'venus' : 'venus-mars'}"></i> ${al.genero}</p>
      </div>
    </div>
  `).join('');
  html += '</div>';
  
  // Controles de paginación abajo
  if (items.length > alumnosPerPage) {
    html += `
      <div class="pagination-controls">
        <button onclick="prevPageAlumnos()" ${alumnosPage <= 1 ? 'disabled' : ''} class="btn-page">
          <i class="fas fa-chevron-left"></i> Anterior
        </button>
        <span class="page-info">Mostrando ${start + 1}-${Math.min(end, items.length)} de ${items.length}</span>
        <button onclick="nextPageAlumnos()" ${alumnosPage >= totalPages ? 'disabled' : ''} class="btn-page">
          Siguiente <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    `;
  }
  
  container.innerHTML = html;
}

// Funciones de paginación
function nextPageAlumnos() {
  const term = (searchQuery || '').toLowerCase();
  const items = allData.alumnos.filter(al => {
    if (!term) return true;
    return (al.nombre||'').toLowerCase().includes(term) || (al.apellido||'').toLowerCase().includes(term) || (al.dni||'').toLowerCase().includes(term);
  });
  const totalPages = Math.ceil(items.length / alumnosPerPage);
  if (alumnosPage < totalPages) {
    alumnosPage++;
    renderAlumnos();
    // Scroll suave al inicio de la sección
    document.getElementById('sec-alumnos').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function prevPageAlumnos() {
  if (alumnosPage > 1) {
    alumnosPage--;
    renderAlumnos();
    document.getElementById('sec-alumnos').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
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
  
  // Botón Ver Alumnos - Redirige a página dedicada
  const viewAlumnosBtn = document.getElementById('viewAlumnosBtn');
  if (viewAlumnosBtn) {
    viewAlumnosBtn.addEventListener('click', () => {
      window.location.href = 'alumnos.html';
    });
  }
  
  // Botón Ver Pruebas - Redirige a página dedicada
  const viewPruebasBtn = document.getElementById('viewPruebasBtn');
  if (viewPruebasBtn) {
    viewPruebasBtn.addEventListener('click', () => {
      window.location.href = 'pruebas.html';
    });
  }
  
  const search = document.getElementById('searchInput');
  if (search) {
    search.addEventListener('input', (e) => {
      searchQuery = e.target.value || '';
      alumnosPage = 1; // Resetear a página 1 al buscar
      renderMain();
    });
  }
  
  setupButtons();
  loadAll();
  
  // Restaurar vista de alumnos si estaba activa antes de recargar
  setTimeout(() => {
    const wasActive = sessionStorage.getItem('alumnosFullViewActive');
    if (wasActive === 'true') {
      openAlumnosModal();
    }
  }, 500); // Esperar a que carguen los datos
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
      <div class="modal-card modal-narrow">
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
    const optsInst = allData.instituciones.map(i => `<option value="${i.id}">${i.nombre}</option>`).join('');
    
    openModal(`
      <div class="modal-card modal-narrow">
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
            <div class="form-group">
              <label><i class="fas fa-building"></i> Institución</label>
              <select name="institucion_id" required>
                <option value="">Seleccione...</option>
                ${optsInst}
              </select>
            </div>
            <div class="form-group">
              <label><i class="fas fa-graduation-cap"></i> Especialidad/Materias que dicta</label>
              <textarea name="especialidad" rows="3" placeholder="Ej: Matemática, Física, Química"></textarea>
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
          showToast(result.error || 'Error', 'error');
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
      <div class="modal-card modal-narrow">
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
      <div class="modal-card modal-narrow">
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
    const optsInst = allData.instituciones.map(i => `<option value="${i.id}">${i.nombre}</option>`).join('');
    
    openModal(`
      <div class="modal-card modal-narrow">
        <div class="modal-header">
          <h2><i class="fas fa-user-graduate"></i> Nuevo Alumno</h2>
          <button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form id="formAlumno">
            <div class="form-group">
              <label><i class="fas fa-building"></i> 1. Institución</label>
              <select id="selInstAlumno" required>
                <option value="">Seleccione...</option>
                ${optsInst}
              </select>
            </div>
            <div class="form-group" id="aulaGroupAlumno" style="display:none;">
              <label><i class="fas fa-door-open"></i> 2. Aula</label>
              <select name="aula_id" id="selAulaAlumno" required>
                <option value="">Seleccione...</option>
              </select>
            </div>
            <hr>
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
            <button type="submit" class="btn primary"><i class="fas fa-save"></i> Guardar</button>
          </form>
        </div>
      </div>
    `);
    
    // Filtrar aulas por institución
    document.getElementById('selInstAlumno').addEventListener('change', (e) => {
      const instId = e.target.value;
      const aulaGroup = document.getElementById('aulaGroupAlumno');
      const selAula = document.getElementById('selAulaAlumno');
      
      if (instId) {
        const aulasInst = allData.aulas.filter(a => a.institucion_id == instId);
        const opts = aulasInst.map(a => `<option value="${a.id}">${a.nombre} - ${a.grado||''}</option>`).join('');
        selAula.innerHTML = '<option value="">Seleccione...</option>' + opts;
        aulaGroup.style.display = 'block';
      } else {
        aulaGroup.style.display = 'none';
      }
    });
    
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
          showToast(result.error || 'Error', 'error');
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
      <div class="modal-card modal-narrow">
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
      <div class="modal-card modal-narrow">
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
  document.getElementById('viewStatsBtn').addEventListener('click', () => {
    window.location.href = 'estadisticas.html';
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

// Funciones especiales para edición/eliminación desde vista fullscreen de alumnos
window.openEditAlumnoFromFullView = function(id) {
  const al = (allData?.alumnos||[]).find(x=> Number(x.id)===Number(id));
  if (!al) return;
  
  const optsAula = allData.aulas.map(a => `<option value="${a.id}" ${Number(al.aula_id)===Number(a.id)?'selected':''}>${a.nombre}</option>`).join('');
  openModal(`
    <div class="modal-card"><div class="modal-header"><h2><i class="fas fa-user-graduate"></i> Editar Alumno</h2><button onclick="closeModal()" class="btn-close"><i class="fas fa-times"></i></button></div>
    <div class="modal-body"><form id="formEditAlumnoFullView">
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
    
  document.getElementById('formEditAlumnoFullView').addEventListener('submit', async (e)=>{
    e.preventDefault(); 
    const data = Object.fromEntries(new FormData(e.target));
    try { 
      const r = await fetch(`api.php?action=update_alumno&id=${al.id}`, {method:'POST', body: JSON.stringify(data)}); 
      const j = await r.json(); 
      if(j.ok) { 
        showToast('Actualizado','success'); 
        closeModal(); 
        await loadAll(); // Recargar datos
        renderAlumnosFullView(); // Re-renderizar la vista fullscreen
      } else { 
        showToast('Error','error'); 
      } 
    } catch(err) { 
      showToast('Error de conexión','error'); 
    }
  });
}

window.confirmDeleteFromFullView = async function(entity, id){
  if (typeof Swal === 'undefined') { 
    if(!confirm('¿Eliminar?')) return; 
  } else {
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
    if(j.ok) { 
      showToast('Eliminado', 'success'); 
      await loadAll(); // Recargar datos
      
      // Verificar si todavía hay items en la página actual después de eliminar
      const filtered = allData.alumnos.filter(a => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return a.nombre.toLowerCase().includes(q) || 
               a.apellido.toLowerCase().includes(q) || 
               a.dni.includes(q);
      });
      const totalPages = Math.ceil(filtered.length / 15);
      
      // Si la página actual ya no existe, ir a la última página disponible
      if (alumnosPage > totalPages && totalPages > 0) {
        alumnosPage = totalPages;
      }
      
      renderAlumnosFullView(); // Re-renderizar la vista fullscreen
    } else { 
      showToast('Error al eliminar', 'error'); 
    }
  } catch(e) { 
    showToast('Error de conexión', 'error'); 
  }
}

