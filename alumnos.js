// Variables globales
let allAlumnos = [];
let allAulas = [];
let allInstituciones = [];
let filteredAlumnos = [];
let currentPage = 1;
const itemsPerPage = 10; // Cambiado de 15 a 10
let searchQuery = '';
let selectedInstitucion = ''; // Filtro por institución

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
  loadAlumnos();
  setupSearch();
  setupInstitucionFilter();
  setupModalClose();
});

// Configurar búsqueda
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    currentPage = 1;
    filterAndRender();
  });
}

// Configurar filtro de institución
function setupInstitucionFilter() {
  const institucionFilter = document.getElementById('institucionFilter');
  institucionFilter.addEventListener('change', (e) => {
    selectedInstitucion = e.target.value;
    currentPage = 1;
    filterAndRender();
  });
}

// Configurar cierre de modal con clic fuera
function setupModalClose() {
  const editModal = document.getElementById('editModal');
  editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
      closeModal();
    }
  });
  
  const notasModal = document.getElementById('notasModal');
  notasModal.addEventListener('click', (e) => {
    if (e.target === notasModal) {
      closeNotasModal();
    }
  });
  
  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (editModal.classList.contains('active')) {
        closeModal();
      }
      if (notasModal.classList.contains('active')) {
        closeNotasModal();
      }
    }
  });
}

// Cargar alumnos desde la API
async function loadAlumnos() {
  try {
    const response = await fetch('api.php?action=get_all');
    const data = await response.json();
    
    // La API devuelve directamente los arrays, no un objeto con "ok"
    if (data && data.alumnos !== undefined) {
      allAlumnos = data.alumnos || [];
      allAulas = data.aulas || [];
      allInstituciones = data.instituciones || [];
      
      // Llenar el select de instituciones
      populateInstitucionFilter();
      
      filterAndRender();
    } else {
      showError('Formato de datos incorrecto');
    }
  } catch (error) {
    console.error('Error:', error);
    showError('Error de conexión con el servidor');
  }
}

// Llenar el select de instituciones
function populateInstitucionFilter() {
  const select = document.getElementById('institucionFilter');
  select.innerHTML = '<option value="">Todas las instituciones</option>';
  
  allInstituciones.forEach(inst => {
    select.innerHTML += `<option value="${inst.id}">${inst.nombre}</option>`;
  });
}

// Filtrar y renderizar
function filterAndRender() {
  // Aplicar filtro de búsqueda
  if (searchQuery === '') {
    filteredAlumnos = [...allAlumnos];
  } else {
    filteredAlumnos = allAlumnos.filter(alumno => {
      const nombre = (alumno.nombre || '').toLowerCase();
      const apellido = (alumno.apellido || '').toLowerCase();
      const dni = (alumno.dni || '').toString();
      
      return nombre.includes(searchQuery) || 
             apellido.includes(searchQuery) || 
             dni.includes(searchQuery);
    });
  }
  
  // Aplicar filtro de institución
  if (selectedInstitucion !== '') {
    filteredAlumnos = filteredAlumnos.filter(alumno => {
      const aula = allAulas.find(a => a.id == alumno.aula_id);
      return aula && aula.institucion_id == selectedInstitucion;
    });
  }
  
  renderTable();
  updatePagination();
}

// Renderizar tabla
function renderTable() {
  const tbody = document.getElementById('alumnosTableBody');
  
  if (filteredAlumnos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="empty-state">
          <i class="fas fa-user-slash"></i>
          <h2>No se encontraron alumnos</h2>
          <p>Intenta con otro término de búsqueda</p>
        </td>
      </tr>
    `;
    return;
  }
  
  // Calcular items de la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = filteredAlumnos.slice(startIndex, endIndex);
  
  let html = '';
  pageItems.forEach(alumno => {
    const aula = allAulas.find(a => a.id == alumno.aula_id);
    const aulaName = aula ? aula.nombre : 'Sin aula';
    
    // Obtener institución a través del aula
    let institucionName = 'Sin institución';
    if (aula && aula.institucion_id) {
      const institucion = allInstituciones.find(i => i.id == aula.institucion_id);
      institucionName = institucion ? institucion.nombre : 'Sin institución';
    }
    
    // Badge de género
    let genderBadge = '';
    let genderClass = '';
    let genderIcon = '';
    
    if (alumno.genero === 'Masculino') {
      genderClass = 'male';
      genderIcon = 'fa-mars';
    } else if (alumno.genero === 'Femenino') {
      genderClass = 'female';
      genderIcon = 'fa-venus';
    } else {
      genderClass = 'other';
      genderIcon = 'fa-venus-mars';
    }
    
    genderBadge = `<span class="gender-badge ${genderClass}"><i class="fas ${genderIcon}"></i> ${alumno.genero}</span>`;
    
    html += `
      <tr>
        <td>${alumno.id}</td>
        <td>${alumno.nombre}</td>
        <td>${alumno.apellido}</td>
        <td>${alumno.dni}</td>
        <td class="center">${alumno.edad}</td>
        <td class="center">${genderBadge}</td>
        <td>${institucionName}</td>
        <td>${aulaName}</td>
        <td class="center">
          <div class="action-buttons">
            <button class="btn-action btn-view" onclick="viewNotas(${alumno.id})" title="Ver Notas">
              <i class="fas fa-eye"></i> Notas
            </button>
            <button class="btn-action btn-edit" onclick="openEditModal(${alumno.id})" title="Editar">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn-action btn-delete" onclick="confirmDelete(${alumno.id})" title="Eliminar">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
}

// Actualizar controles de paginación
function updatePagination() {
  const totalPages = Math.ceil(filteredAlumnos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredAlumnos.length);
  
  // Info
  document.getElementById('paginationInfo').textContent = 
    `Mostrando ${startIndex + 1}-${endIndex} de ${filteredAlumnos.length} alumnos`;
  
  // Indicador de página
  document.getElementById('pageIndicator').textContent = 
    `Página ${currentPage}/${totalPages || 1}`;
  
  // Botones
  document.getElementById('btnPrev').disabled = currentPage <= 1;
  document.getElementById('btnNext').disabled = currentPage >= totalPages;
}

// Navegación de páginas
function nextPage() {
  const totalPages = Math.ceil(filteredAlumnos.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
    updatePagination();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
    updatePagination();
  }
}

// Abrir modal de edición
function openEditModal(id) {
  const alumno = allAlumnos.find(a => a.id == id);
  if (!alumno) {
    showError('Alumno no encontrado');
    return;
  }
  
  // Llenar formulario
  document.getElementById('editId').value = alumno.id;
  document.getElementById('editNombre').value = alumno.nombre || '';
  document.getElementById('editApellido').value = alumno.apellido || '';
  document.getElementById('editDni').value = alumno.dni || '';
  document.getElementById('editEdad').value = alumno.edad || '';
  document.getElementById('editGenero').value = alumno.genero || '';
  
  // Llenar select de aulas
  const aulaSelect = document.getElementById('editAula');
  aulaSelect.innerHTML = '<option value="">Seleccione...</option>';
  allAulas.forEach(aula => {
    const selected = aula.id == alumno.aula_id ? 'selected' : '';
    aulaSelect.innerHTML += `<option value="${aula.id}" ${selected}>${aula.nombre}</option>`;
  });
  
  // Mostrar modal
  document.getElementById('editModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Setup submit
  const form = document.getElementById('editForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    saveEdit();
  };
}

// Cerrar modal
function closeModal() {
  document.getElementById('editModal').classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('editForm').reset();
}

// Guardar edición
async function saveEdit() {
  const id = document.getElementById('editId').value;
  const data = {
    nombre: document.getElementById('editNombre').value,
    apellido: document.getElementById('editApellido').value,
    dni: document.getElementById('editDni').value,
    edad: document.getElementById('editEdad').value,
    genero: document.getElementById('editGenero').value,
    aula_id: document.getElementById('editAula').value
  };
  
  try {
    const response = await fetch(`api.php?action=update_alumno&id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.ok) {
      showSuccess('Alumno actualizado correctamente');
      closeModal();
      loadAlumnos(); // Recargar lista
    } else {
      showError(result.error || 'Error al actualizar el alumno');
    }
  } catch (error) {
    console.error('Error:', error);
    showError('Error de conexión con el servidor');
  }
}

// Confirmar eliminación
async function confirmDelete(id) {
  const alumno = allAlumnos.find(a => a.id == id);
  if (!alumno) return;
  
  const result = await Swal.fire({
    title: '¿Eliminar alumno?',
    html: `¿Está seguro de eliminar a <strong>${alumno.nombre} ${alumno.apellido}</strong>?<br><small style="color: #7f8c8d;">Esta acción no se puede deshacer.</small>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#95a5a6',
    confirmButtonText: '<i class="fas fa-trash"></i> Sí, eliminar',
    cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      popup: 'animated-popup',
      confirmButton: 'btn-delete-confirm',
      cancelButton: 'btn-cancel-confirm'
    }
  });
  
  if (result.isConfirmed) {
    deleteAlumno(id);
  }
}

// Eliminar alumno
async function deleteAlumno(id) {
  try {
    const response = await fetch(`api.php?action=delete_alumno&id=${id}`);
    const result = await response.json();
    
    if (result.ok) {
      showSuccess('Alumno eliminado correctamente');
      
      // Si la página actual queda vacía, ir a la anterior
      const totalPages = Math.ceil((filteredAlumnos.length - 1) / itemsPerPage);
      if (currentPage > totalPages && currentPage > 1) {
        currentPage--;
      }
      
      loadAlumnos(); // Recargar lista
    } else {
      showError(result.error || 'Error al eliminar el alumno');
    }
  } catch (error) {
    console.error('Error:', error);
    showError('Error de conexión con el servidor');
  }
}

// Notificaciones
function showSuccess(message) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    showClass: {
      popup: 'swal2-show'
    },
    hideClass: {
      popup: 'swal2-hide'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  
  Toast.fire({
    icon: 'success',
    title: message,
    background: '#d4edda',
    color: '#155724',
    iconColor: '#28a745'
  });
}

function showError(message) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    showClass: {
      popup: 'swal2-show'
    },
    hideClass: {
      popup: 'swal2-hide'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  
  Toast.fire({
    icon: 'error',
    title: message,
    background: '#f8d7da',
    color: '#721c24'
  });
}

// Ver notas del alumno
async function viewNotas(alumnoId) {
  console.log('viewNotas llamada con ID:', alumnoId);
  console.log('Alumnos disponibles:', allAlumnos.length);
  
  const alumno = allAlumnos.find(a => a.id == alumnoId);
  console.log('Alumno encontrado:', alumno);
  
  if (!alumno) {
    console.error('Alumno no encontrado con ID:', alumnoId);
    showError('Alumno no encontrado');
    return;
  }
  
  // Abrir modal
  const modal = document.getElementById('notasModal');
  console.log('Modal encontrado:', modal);
  
  if (!modal) {
    console.error('Modal de notas no encontrado en el DOM');
    showError('Error al abrir el modal');
    return;
  }
  
  modal.classList.add('active');
  console.log('Modal abierto');
  
  // Mostrar loading
  document.getElementById('notasContent').innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: #667eea;"></i>
      <p style="margin-top: 20px; color: #666;">Cargando notas...</p>
    </div>
  `;
  
  try {
    console.log('Cargando datos del API...');
    // Obtener todas las notas del alumno
    const response = await fetch(`api.php?action=get_all`);
    const data = await response.json();
    
    console.log('Datos recibidos del API:', data);
    
    if (!data || !data.notas) {
      throw new Error('Error al cargar los datos');
    }
    
    const allNotas = data.notas || [];
    const allPruebas = data.pruebas || [];
    const allAulaMateria = data.aula_materia || [];
    const allMaterias = data.materias || [];
    
    console.log('Notas totales:', allNotas.length);
    console.log('Pruebas totales:', allPruebas.length);
    
    // Filtrar notas del alumno
    const notasAlumno = allNotas.filter(n => n.alumno_id == alumnoId);
    console.log('Notas del alumno:', notasAlumno.length);
    
    // Obtener información del aula e institución
    const aula = allAulas.find(a => a.id == alumno.aula_id);
    const institucion = aula ? allInstituciones.find(i => i.id == aula.institucion_id) : null;
    
    // Agrupar notas por materia
    const notasPorMateria = {};
    
    notasAlumno.forEach(nota => {
      const prueba = allPruebas.find(p => p.id == nota.prueba_id);
      if (!prueba) return;
      
      const aulaMateria = allAulaMateria.find(am => am.id == prueba.aula_materia_id);
      if (!aulaMateria) return;
      
      const materia = allMaterias.find(m => m.id == aulaMateria.materia_id);
      if (!materia) return;
      
      if (!notasPorMateria[materia.id]) {
        notasPorMateria[materia.id] = {
          nombre: materia.nombre,
          notas: []
        };
      }
      
      notasPorMateria[materia.id].notas.push({
        prueba: prueba.nombre,
        fecha: prueba.fecha,
        nota: nota.nota,
        peso: prueba.peso || 1.0
      });
    });
    
    // Renderizar las notas
    renderNotas(alumno, aula, institucion, notasPorMateria);
    
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('notasContent').innerHTML = `
      <div class="no-notas">
        <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #e74c3c;"></i>
        <p style="margin-top: 20px;">Error al cargar las notas</p>
      </div>
    `;
  }
}

// Renderizar notas en el modal
function renderNotas(alumno, aula, institucion, notasPorMateria) {
  const nombreCompleto = `${alumno.nombre} ${alumno.apellido}`;
  const aulaNombre = aula ? aula.nombre : 'Sin aula';
  const institucionNombre = institucion ? institucion.nombre : 'Sin institución';
  
  let html = `
    <div class="notas-alumno-info">
      <h3><i class="fas fa-user-graduate"></i> ${nombreCompleto}</h3>
      <p><i class="fas fa-id-card"></i> DNI: ${alumno.dni}</p>
      <p><i class="fas fa-door-open"></i> Aula: ${aulaNombre}</p>
      <p><i class="fas fa-building"></i> Institución: ${institucionNombre}</p>
    </div>
  `;
  
  const materias = Object.values(notasPorMateria);
  
  if (materias.length === 0) {
    html += `
      <div class="no-notas">
        <i class="fas fa-inbox" style="font-size: 48px; color: #95a5a6;"></i>
        <p style="margin-top: 20px;">Este alumno no tiene notas registradas</p>
      </div>
    `;
  } else {
    materias.forEach(materia => {
      const notas = materia.notas;
      const promedio = calcularPromedio(notas);
      
      html += `
        <div class="materia-section">
          <h4><i class="fas fa-book"></i> ${materia.nombre}</h4>
          <table class="notas-table">
            <thead>
              <tr>
                <th>Prueba</th>
                <th>Fecha</th>
                <th>Peso</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      notas.forEach(nota => {
        const fecha = nota.fecha ? new Date(nota.fecha).toLocaleDateString('es-AR') : 'Sin fecha';
        const notaClass = nota.nota >= 6 ? 'nota-aprobado' : 'nota-desaprobado';
        
        html += `
          <tr>
            <td>${nota.prueba}</td>
            <td>${fecha}</td>
            <td>${nota.peso}</td>
            <td class="nota-valor ${notaClass}">${nota.nota}</td>
          </tr>
        `;
      });
      
      const promedioClass = promedio >= 6 ? 'nota-aprobado' : 'nota-desaprobado';
      
      html += `
            </tbody>
          </table>
          <div class="promedio-box">
            <strong>Promedio:</strong>
            <span class="promedio-valor ${promedioClass}">${promedio.toFixed(2)}</span>
          </div>
        </div>
      `;
    });
  }
  
  document.getElementById('notasContent').innerHTML = html;
}

// Calcular promedio ponderado
function calcularPromedio(notas) {
  if (notas.length === 0) return 0;
  
  let sumaNotas = 0;
  let sumaPesos = 0;
  
  notas.forEach(nota => {
    const peso = parseFloat(nota.peso) || 1.0;
    sumaNotas += parseFloat(nota.nota) * peso;
    sumaPesos += peso;
  });
  
  return sumaPesos > 0 ? sumaNotas / sumaPesos : 0;
}

// Cerrar modal de notas
function closeNotasModal() {
  document.getElementById('notasModal').classList.remove('active');
}
