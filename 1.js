const students = [
    { control: 'A12345', nombre: 'Juan', apellido: 'Pérez García', carrera: 'Ingeniería en Sistemas', actividad: 'Fútbol', categoria: 'deportivas' },
    { control: 'B67890', nombre: 'María', apellido: 'Rodriguez López', carrera: 'Arquitectura', actividad: 'Pintura', categoria: 'artisticas' },
    { control: 'C13579', nombre: 'Carlos', apellido: 'Sánchez Martínez', carrera: 'Matemáticas', actividad: 'Club de Debate', categoria: 'academicas' }
  ];
  
  const table = document.getElementById('studentTable');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  
  function renderTable() {
    const search = searchInput.value.toLowerCase();
    const filter = categoryFilter.value;
    table.innerHTML = '';
  
    students
      .filter(s =>
        (s.nombre.toLowerCase().includes(search) || s.control.toLowerCase().includes(search)) &&
        (filter === '' || s.categoria === filter)
      )
      .forEach(s => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${s.control}</td>
          <td>${s.nombre}</td>
          <td>${s.apellido}</td>
          <td>${s.carrera}</td>
          <td>${s.actividad}</td>
          <td>${s.categoria}</td>
          <td class="actions">
            <button onclick="editStudent('${s.control}')">✏️</button>
            <button onclick="deleteStudent('${s.control}')">🗑️</button>
          </td>
        `;
        table.appendChild(row);
      });
  }
  
  function editStudent(control) {
    alert(`Editar estudiante ${control} (función no implementada)`);
  }
  
  function deleteStudent(control) {
    const index = students.findIndex(s => s.control === control);
    if (index !== -1) {
      students.splice(index, 1);
      renderTable();
    }
  }
  
  searchInput.addEventListener('input', renderTable);
  categoryFilter.addEventListener('change', renderTable);
  
  renderTable();
  