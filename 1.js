// const students = [
//     { control: 'A12345', nombre: 'Juan', apellido: 'Pérez García', carrera: 'Ingeniería en Sistemas', actividad: 'Fútbol', categoria: 'deportivas' },
//     { control: 'B67890', nombre: 'María', apellido: 'Rodriguez López', carrera: 'Arquitectura', actividad: 'Pintura', categoria: 'artisticas' },
//     { control: 'C13579', nombre: 'Carlos', apellido: 'Sánchez Martínez', carrera: 'Matemáticas', actividad: 'Club de Debate', categoria: 'academicas' },
//     { control: 'D24680', nombre: 'Ana', apellido: 'López Torres', carrera: 'Ingeniería Civil', actividad: 'Voleibol', categoria: 'deportivas' },
//     { control: 'E97531', nombre: 'Roberto', apellido: 'Gómez Bolaños', carrera: 'Comunicación', actividad: 'Teatro', categoria: 'artisticas' },
//     { control: 'F86420', nombre: 'Sofía', apellido: 'Martínez Ruiz', carrera: 'Biología', actividad: 'Robótica', categoria: 'academicas' }
//   ];

 let students= [];
 const fetchAllStudents = ()=>{
    fetch("http://localhost:3000/students")
        .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
        })
        .then(data => {
            students= data;
            console.log("Respuesta del servidor:", data);
            students.map(estudiante => {
              console.log(estudiante.usuario);
            })
            renderTable();
        })
        .catch(error => {
            console.error("Error en la petición:", error);
        });
      
 }
 
  const table = document.getElementById('studentTable');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  
  function renderTable() {
    const search = searchInput.value.toLowerCase();
    const filter = categoryFilter.value;
    table.innerHTML = '';
  
    const filteredStudents = students.filter(student =>
      (student?.usuario.nombres.toLowerCase().includes(search) || 
       student?.usuario.apellidos.toLowerCase().includes(search) || 
       student?.usuario.matricula.toLowerCase().includes(search)) &&
      (filter === '' || student?.curso.actividad.categoria.toLowerCase() === filter)
    );
  
    if (filteredStudents.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `
        <td colspan="7" class="empty-message">
          <div class="empty-state">
            <i class="fas fa-search"></i>
            <p>No se encontraron estudiantes con los criterios de búsqueda.</p>
          </div>
        </td>
      `;
      table.appendChild(emptyRow);
      return;
    }
  
    filteredStudents.forEach(student => {
      const row = document.createElement('tr');
      const categoryClass = getCategoryClass(student?.curso.actividad.categoria);
      
      row.innerHTML = `
        <td data-label="Núm. Control">
          <span class="td-content">${student?.usuario.matricula}</span>
        </td>
        <td data-label="Nombre">
          <span class="td-content">${student?.usuario.nombres}</span>
        </td>
        <td data-label="Apellidos">
          <span class="td-content">${student?.usuario.apellidos}</span>
        </td>
        <td data-label="Carrera">
          <span class="td-content">${student?.carrera.nombre}</span>
        </td>
        <td data-label="Actividad">
          <span class="td-content">${student?.curso.actividad.nombre}</span>
        </td>
        <td data-label="Categoría">
          <span class="td-content">
            <span class="category-badge ${categoryClass}">
              ${student?.curso.actividad.categoria}
            </span>
          </span>
        </td>
        <td data-label="Acciones">
          <div class="actions">
            <button class="action-btn view" title="Ver detalles" onclick="viewStudent('${student?.usuario.matricula}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit" title="Editar estudiante" onclick="editStudent('${student?.usuario.matricula}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" title="Eliminar estudiante" onclick="deleteStudent('${student?.usuario.matricula}')">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      `;
      table.appendChild(row);
    });
  }
  
  function getCategoryClass(category) {
    if (!category) return '';
    category = category.toLowerCase();
    // console.log(category);
    const classes = {
      'deportivas': 'category-sports',
      'artisticas': 'category-arts',
      'academicas': 'category-academic'
    };
    return classes[category] || '';
  }
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  function viewStudent(control) {
    // Oculta todas las filas excepto la seleccionada
    const rows = document.querySelectorAll('#studentTable tr');
    rows.forEach(row => {
      if (row.querySelector('.action-btn.view') && row.innerHTML.includes(control)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
    showNotification('Mostrando solo el estudiante seleccionado.', 'info');
  }
  
  function editStudent(control) {
    // Abre un formulario emergente para editar el estudiante
    // Se recomienda pasar el número de control por querystring
    window.open(
      `../editStudent/editStudent.html?control=${encodeURIComponent(control)}`,
      'Editar Estudiante',
      'width=600,height=600,modal=yes,alwaysRaised=yes'
    );
  }
  
  function deleteStudent(control) {
    if (confirm('¿Está seguro de que desea eliminar este estudiante?')) {
      const index = students.findIndex(s => s.control === control);
      if (index !== -1) {
        students.splice(index, 1);
        renderTable();
        showNotification('Estudiante eliminado correctamente', 'success');
      }
    }
  }
  
  function showNotification(message, type = 'info') {
    let notification = document.querySelector('.notification');
    
    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'notification';
      document.body.appendChild(notification);
    }
    
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
    
    setTimeout(() => {
      if (notification.classList.contains('show')) {
        notification.classList.remove('show');
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }, 5000);
  }
  
  function getNotificationIcon(type) {
    const icons = {
      'success': 'fa-check-circle',
      'error': 'fa-exclamation-circle',
      'warning': 'fa-exclamation-triangle',
      'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
  }
  
  function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        min-width: 300px;
        padding: 15px;
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
      }
      
      .notification.show {
        transform: translateY(0);
        opacity: 1;
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .notification.success {
        border-left: 4px solid var(--success-color);
      }
      
      .notification.error {
        border-left: 4px solid var(--danger-color);
      }
      
      .notification.warning {
        border-left: 4px solid var(--warning-color);
      }
      
      .notification.info {
        border-left: 4px solid var(--accent-color);
      }
      
      .notification i {
        font-size: 1.25rem;
      }
      
      .notification.success i {
        color: var(--success-color);
      }
      
      .notification.error i {
        color: var(--danger-color);
      }
      
      .notification.warning i {
        color: var(--warning-color);
      }
      
      .notification.info i {
        color: var(--accent-color);
      }
      
      .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        color: var(--text-light);
        padding: 5px;
      }
      
      .category-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
      }
      
      .category-sports {
        background-color: rgba(74, 144, 226, 0.1);
        color: #4a90e2;
      }
      
      .category-arts {
        background-color: rgba(142, 68, 173, 0.1);
        color: #8e44ad;
      }
      
      .category-academic {
        background-color: rgba(39, 174, 96, 0.1);
        color: #27ae60;
      }
      
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 0;
        color: var(--text-light);
      }
      
      .empty-state i {
        font-size: 3rem;
        margin-bottom: 15px;
        opacity: 0.5;
      }
    `;
    document.head.appendChild(style);
  }
  
  searchInput.addEventListener('input', renderTable);
  categoryFilter.addEventListener('change', renderTable);
  
  document.addEventListener('DOMContentLoaded', function() {
     fetchAllStudents();
    addNotificationStyles();
    renderTable();
    
    // Manejar el toggle del sidebar en dispositivos móviles
    const sidebarToggle = document.getElementById('sidebarToggle');
    const body = document.body;
    
    sidebarToggle.addEventListener('click', function() {
      body.classList.toggle('sidebar-open');
    });
    
    // Cerrar sidebar al hacer clic fuera de él en móviles
    document.addEventListener('click', function(e) {
      if (body.classList.contains('sidebar-open') && 
          !e.target.closest('.sidebar') && 
          !e.target.closest('#sidebarToggle')) {
        body.classList.remove('sidebar-open');
      }
    });
    
    // Cerrar sidebar al cambiar el tamaño de la ventana
    window.addEventListener('resize', function() {
      if (window.innerWidth > 992) {
        body.classList.remove('sidebar-open');
      }
    });

    document.querySelectorAll('.th-content').forEach(header => {
      header.addEventListener('click', function() {
        const column = this.querySelector('span').textContent;
        showNotification(`Ordenando por ${column}`, 'info');
      });
    });
    
    document.querySelectorAll('.page-number, .page-btn').forEach(btn => {
      if (!btn.disabled) {
        btn.addEventListener('click', function() {
          showNotification('Funcionalidad de paginación en desarrollo', 'info');
        });
      }
    });
  });
