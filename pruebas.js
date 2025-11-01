// Variables globales
let allPruebas = [];
let allAulas = [];
let allInstituciones = [];
let allAulaMateria = [];
let allMaterias = [];
let filteredPruebas = [];
let currentPage = 1;
const itemsPerPage = 10;
let searchQuery = '';
let selectedInstitucion = ''; // Filtro por institución
let selectedAula = ''; // Filtro por aula

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  loadPruebas();
  setupSearch();
  setupInstitucionFilter();
  setupAulaFilter();
  setupModalClose();
  setupFormSubmit();
});

// Configurar búsqueda
function setupSearch() {
  const searchBox = document.getElementById('searchBox');
  searchBox.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    currentPage = 1;
    filterAndRender();
  });
}

// Configurar filtro de institución
function setupInstitucionFilter() {
  const institucionFilter = document.getElementById('institucionFilter');
  institucionFilter.addEventListener('change', (e) => {
    selectedInstitucion = e.target.value;
    selectedAula = ''; // Reset aula filter
    currentPage = 1;
    
    // Actualizar opciones de aulas según institución
    populateAulaFilter();
    filterAndRender();
  });
}

// Configurar filtro de aula
function setupAulaFilter() {
  const aulaFilter = document.getElementById('aulaFilter');
  aulaFilter.addEventListener('change', (e) => {
    selectedAula = e.target.value;
    currentPage = 1;
    filterAndRender();
  });
}

// Configurar cierre de modal
function setupModalClose() {
  const modal = document.getElementById('editModal');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Configurar envío de formulario
function setupFormSubmit() {
  const form = document.getElementById('editForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    saveEdit();
  });
}

// Cargar pruebas desde la API
async function loadPruebas() {
  try {
    const response = await fetch('api.php?action=get_all');
    const data = await response.json();
    
    console.log('Datos recibidos:', data); // Debug
    
    if (data && data.pruebas !== undefined) {
      allPruebas = data.pruebas || [];
      allAulas = data.aulas || [];
      allInstituciones = data.instituciones || [];
      allAulaMateria = data.aula_materia || [];
      allMaterias = data.materias || [];
      
      console.log('Pruebas cargadas:', allPruebas.length); // Debug
      console.log('Primera prueba:', allPruebas[0]); // Debug
      
      // Llenar los selects de filtros
      populateInstitucionFilter();
      populateAulaFilter();
      populateAulaMateriaSelect(); // Para el modal de edición
      
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

// Llenar el select de aulas según institución seleccionada
function populateAulaFilter() {
  const select = document.getElementById('aulaFilter');
  select.innerHTML = '<option value="">Todas las aulas</option>';
  
  // Filtrar aulas por institución si hay una seleccionada
  let aulasToShow = allAulas;
  if (selectedInstitucion !== '') {
    aulasToShow = allAulas.filter(aula => aula.institucion_id == selectedInstitucion);
  }
  
  aulasToShow.forEach(aula => {
    const institucion = allInstituciones.find(i => i.id == aula.institucion_id);
    const institucionNombre = institucion ? ` - ${institucion.nombre}` : '';
    select.innerHTML += `<option value="${aula.id}">${aula.nombre}${institucionNombre}</option>`;
  });
  
  // Resetear el valor del select de aula
  select.value = selectedAula;
}

// Llenar el select de aula-materia en el modal de edición
function populateAulaMateriaSelect() {
  const select = document.getElementById('editAulaMateria');
  select.innerHTML = '<option value="">Seleccionar aula y materia...</option>';
  
  allAulaMateria.forEach(am => {
    const aula = allAulas.find(a => a.id == am.aula_id);
    const materia = allMaterias.find(m => m.id == am.materia_id);
    const institucion = aula ? allInstituciones.find(i => i.id == aula.institucion_id) : null;
    
    if (aula && materia) {
      const institucionNombre = institucion ? ` - ${institucion.nombre}` : '';
      select.innerHTML += `<option value="${am.id}">${aula.nombre} - ${materia.nombre}${institucionNombre}</option>`;
    }
  });
}

// Filtrar y renderizar
function filterAndRender() {
  // Aplicar filtro de búsqueda
  if (searchQuery === '') {
    filteredPruebas = [...allPruebas];
  } else {
    filteredPruebas = allPruebas.filter(prueba => {
      const nombre = (prueba.nombre || '').toLowerCase();
      return nombre.includes(searchQuery);
    });
  }
  
  // Aplicar filtro de institución
  if (selectedInstitucion !== '') {
    filteredPruebas = filteredPruebas.filter(prueba => {
      const aulaMateria = allAulaMateria.find(am => am.id == prueba.aula_materia_id);
      if (!aulaMateria) return false;
      const aula = allAulas.find(a => a.id == aulaMateria.aula_id);
      return aula && aula.institucion_id == selectedInstitucion;
    });
  }
  
  // Aplicar filtro de aula
  if (selectedAula !== '') {
    filteredPruebas = filteredPruebas.filter(prueba => {
      const aulaMateria = allAulaMateria.find(am => am.id == prueba.aula_materia_id);
      return aulaMateria && aulaMateria.aula_id == selectedAula;
    });
  }
  
  renderTable();
  updatePagination();
}

// Renderizar tabla
function renderTable() {
  const tbody = document.getElementById('pruebasTableBody');
  
  if (filteredPruebas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>No se encontraron pruebas</p>
        </td>
      </tr>
    `;
    return;
  }
  
  // Calcular índices de paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pruebasToShow = filteredPruebas.slice(startIndex, endIndex);
  
  tbody.innerHTML = pruebasToShow.map(prueba => {
    // Obtener información de aula_materia
    const aulaMateria = allAulaMateria.find(am => am.id == prueba.aula_materia_id);
    let aulaNombre = '<em style="color: #999;">Sin asignar</em>';
    let materiaNombre = '<em style="color: #999;">Sin asignar</em>';
    let institucionNombre = '<em style="color: #999;">Sin asignar</em>';
    
    if (aulaMateria) {
      const aula = allAulas.find(a => a.id == aulaMateria.aula_id);
      const materia = allMaterias.find(m => m.id == aulaMateria.materia_id);
      
      if (aula) {
        aulaNombre = aula.nombre;
        const institucion = allInstituciones.find(i => i.id == aula.institucion_id);
        if (institucion) {
          institucionNombre = institucion.nombre;
        }
      }
      
      if (materia) {
        materiaNombre = materia.nombre;
      }
    }
    
    // Mostrar nombre con valor por defecto
    const nombre = prueba.nombre && prueba.nombre.trim() !== '' ? prueba.nombre : '<em style="color: #999;">Sin nombre</em>';
    
    // Formatear fecha
    const fecha = prueba.fecha ? new Date(prueba.fecha).toLocaleDateString('es-AR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit'
    }) : '<em style="color: #999;">No definida</em>';
    
    // Mostrar peso
    const peso = prueba.peso || '1.0';
    
    return `
      <tr>
        <td>${prueba.id}</td>
        <td><strong>${nombre}</strong></td>
        <td>${aulaNombre}</td>
        <td>${materiaNombre}</td>
        <td>${institucionNombre}</td>
        <td>${fecha}</td>
        <td>${peso}</td>
        <td>
          <div class="actions">
            <button class="btn-action btn-edit" onclick="openEditModal(${prueba.id})">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn-action btn-delete" onclick="confirmDelete(${prueba.id})">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Abrir modal de edición
function openEditModal(id) {
  console.log('openEditModal llamado con ID:', id);
  console.log('Pruebas disponibles:', allPruebas.length);
  
  const prueba = allPruebas.find(p => p.id == id);
  console.log('Prueba encontrada:', prueba);
  
  if (!prueba) {
    console.error('Prueba no encontrada con ID:', id);
    showError('Prueba no encontrada');
    return;
  }
  
  document.getElementById('editPruebaId').value = prueba.id;
  document.getElementById('editNombre').value = prueba.nombre || '';
  document.getElementById('editAulaMateria').value = prueba.aula_materia_id || '';
  document.getElementById('editFecha').value = prueba.fecha || '';
  document.getElementById('editPeso').value = prueba.peso || 1.0;
  
  console.log('Valores asignados al formulario');
  console.log('Modal ID:', document.getElementById('editModal'));
  
  document.getElementById('editModal').classList.add('active');
  console.log('Modal abierto');
}

// Cerrar modal
function closeModal() {
  document.getElementById('editModal').classList.remove('active');
  document.getElementById('editForm').reset();
}

// Guardar edición
async function saveEdit() {
  console.log('saveEdit llamado');
  
  const id = document.getElementById('editPruebaId').value;
  const nombre = document.getElementById('editNombre').value.trim();
  const aula_materia_id = document.getElementById('editAulaMateria').value;
  const fecha = document.getElementById('editFecha').value;
  const peso = document.getElementById('editPeso').value;
  
  console.log('Datos del formulario:', { id, nombre, aula_materia_id, fecha, peso });
  
  if (!nombre || !aula_materia_id || !fecha) {
    showError('Por favor completa todos los campos obligatorios');
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append('action', 'update_prueba');
    formData.append('id', id);
    formData.append('nombre', nombre);
    formData.append('aula_materia_id', aula_materia_id);
    formData.append('fecha', fecha);
    formData.append('peso', peso);
    
    console.log('Enviando datos al servidor...');
    
    const response = await fetch('api.php', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    
    if (data.success) {
      showSuccess('Prueba actualizada correctamente');
      closeModal();
      loadPruebas();
    } else {
      showError(data.message || 'Error al actualizar la prueba');
    }
  } catch (error) {
    console.error('Error:', error);
    showError('Error de conexión con el servidor');
  }
}

// Confirmar eliminación
function confirmDelete(id) {
  console.log('confirmDelete llamado con ID:', id);
  
  const prueba = allPruebas.find(p => p.id == id);
  console.log('Prueba encontrada:', prueba);
  
  if (!prueba) {
    console.error('Prueba no encontrada con ID:', id);
    showError('Prueba no encontrada');
    return;
  }
  
  const nombre = prueba.nombre && prueba.nombre.trim() !== '' ? prueba.nombre : 'Prueba sin nombre';
  
  console.log('Mostrando confirmación para:', nombre);
  
  Swal.fire({
    title: '¿Estás seguro?',
    html: 'Se eliminará la prueba: <strong>' + nombre + '</strong>',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'animated-popup',
      confirmButton: 'btn-delete-confirm',
      cancelButton: 'btn-cancel-confirm'
    },
    buttonsStyling: false
  }).then((result) => {
    console.log('Resultado de confirmación:', result);
    if (result.isConfirmed) {
      deletePrueba(id);
    }
  });
}

// Eliminar prueba
async function deletePrueba(id) {
  console.log('deletePrueba llamado con ID:', id);
  
  try {
    const formData = new FormData();
    formData.append('action', 'delete_prueba');
    formData.append('id', id);
    
    console.log('Enviando solicitud de eliminación...');
    
    const response = await fetch('api.php', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    
    if (data.success) {
      showSuccess('Prueba eliminada correctamente');
      loadPruebas();
    } else {
      showError(data.message || 'Error al eliminar la prueba');
    }
  } catch (error) {
    console.error('Error:', error);
    showError('Error de conexión con el servidor');
  }
}

// Notificación de éxito
function showSuccess(message) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    customClass: {
      popup: 'animated-popup'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    background: '#d4edda',
    color: '#155724'
  });
}

// Notificación de error
function showError(message) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    customClass: {
      popup: 'animated-popup'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    background: '#f8d7da',
    color: '#721c24'
  });
}

// Actualizar paginación
function updatePagination() {
  const totalPages = Math.ceil(filteredPruebas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredPruebas.length);
  
  document.getElementById('currentPage').textContent = currentPage;
  document.getElementById('showingCount').textContent = endIndex - startIndex;
  document.getElementById('totalCount').textContent = filteredPruebas.length;
  
  // Habilitar/deshabilitar botones
  document.getElementById('prevBtn').disabled = currentPage === 1;
  document.getElementById('nextBtn').disabled = currentPage >= totalPages || totalPages === 0;
}

// Página siguiente
function nextPage() {
  const totalPages = Math.ceil(filteredPruebas.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
    updatePagination();
  }
}

// Página anterior
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
    updatePagination();
  }
}
