// const activities = [
//     { nombre: 'Futbol', profesor: 'Carlos Rodríguez', matricula: '3', espacios: '3', equipo: '3' },
//     { nombre: 'Baloncesto', profesor: 'Ana Martínez', matricula: '3', espacios: '3', equipo: '3' },
//     { nombre: 'Ajedrez', profesor: 'Miguel López', matricula: '3', espacios: '3', equipo: '3' }
//   ];
  
let activities=[];

  const fetchAllActivities = ()=>{
    fetch('http://localhost:3000/cursos')
    .then(response =>{
      if(response.status != 200){
        return new Error(response.status)
      }
      return response.json();
    })
    .then(data => {
        activities = data;
        console.log(activities);
        renderTable();
    })
    .catch(error => {
      console.log(error);
    })
  }

  fetchAllActivities();

  const table = document.getElementById('activityTable');
  const searchCourseInput = document.getElementById('searchCourse');
  const categoryFilter = document.getElementById('categoryFilter');

  function renderTable() {
    table.innerHTML = '';
    const searchText = searchCourseInput ? searchCourseInput.value.trim().toLowerCase() : '';
    const selectedCategory = categoryFilter ? categoryFilter.value.trim().toLowerCase() : '';

    // Filtrar actividades por nombre de curso y por categoría
    const filteredActivities = activities.filter(a => {
      const matchesName = a.curso_nombre && a.curso_nombre.toLowerCase().includes(searchText);
      const matchesCategory =
        !selectedCategory ||
        (a.actividad_categoria && a.actividad_categoria.toLowerCase() === selectedCategory) ||
        (a.categoria && a.categoria.toLowerCase() === selectedCategory); // fallback por si el campo es diferente
      return matchesName && matchesCategory;
    });

    // Agrega encabezado de la tabla si está vacío (opcional, si no lo tienes en HTML)
    // table.innerHTML = `<tr>
    //   <th>Nombre</th>
    //   <th>Actividad</th>
    //   <th>Profesor</th>
    //   <th>Periodo</th>
    //   <th>Inicio</th>
    //   <th>Fin</th>
    //   <th>Espacios disponibles</th>
    //   <th>Categoría</th>
    //   <th>Acciones</th>
    // </tr>`;

    filteredActivities.forEach((a, index) => {
      const inicio = a.curso_inicio ? a.curso_inicio.split('T')[0] : '';
      const fin = a.curso_fin ? a.curso_fin.split('T')[0] : '';
      // Determina la categoría de la actividad
      const categoria = a.actividad_categoria || a.categoria || '';
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${a.curso_nombre}</td>
        <td>${a.actividad_nombre}</td>
        <td>${a.usuario_nombre+" "+a.usuario_apellido }</td>
        <td>${a.curso_periodo}</td>
        <td>${inicio}</td>
        <td>${fin}</td>
        <td>${a.curso_espacios}</td>
        <td>${categoria}</td>
        <td class="actions">
          <a href="../activities/editActivity.html?nombre=${encodeURIComponent(a.curso_nombre)}&actividad=${encodeURIComponent(a.actividad_nombre)}&profesor=${encodeURIComponent(a.usuario_nombre+" "+a.usuario_apellido)}&matricula=${encodeURIComponent(a.usuario_matricula)}&periodo=${encodeURIComponent(a.curso_periodo)}&inicio=${encodeURIComponent(a.curso_inicio)}&fin=${encodeURIComponent(a.curso_fin)}&espacios_disponibles=${encodeURIComponent(a.curso_espacios)}"><button class="edit-btn">Editar</button></a>
          <button class="delete-btn" onclick="deleteActivity(${index})">Eliminar</button>
          <a href="5.html"><button class="details-btn">Ver Detalles</button></a>
        </td>
      `;
      table.appendChild(row);
    });
  }
  
  function editActivity(index) {
    alert(`Editar actividad: ${activities[index].nombre}`);
  }
  
  function deleteActivity(index) {
    if (confirm(`¿Deseas eliminar la actividad "${activities[index].nombre}"?`)) {
      activities.splice(index, 1);
      renderTable();
    }
  }
  
  function viewDetails(index) {
    alert(`Detalles de "${activities[index].nombre}" con el profesor ${activities[index].profesor}`);
  }
  
  // Evento para filtrar mientras se escribe
  if (searchCourseInput) {
    searchCourseInput.addEventListener('input', renderTable);
  }

  // Evento para filtrar por categoría
  if (categoryFilter) {
    categoryFilter.addEventListener('change', renderTable);
  }
