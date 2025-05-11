const activities = [
    { nombre: 'Futbol', profesor: 'Carlos Rodríguez', matricula: '3', espacios: '3', equipo: '3' },
    { nombre: 'Baloncesto', profesor: 'Ana Martínez', matricula: '3', espacios: '3', equipo: '3' },
    { nombre: 'Ajedrez', profesor: 'Miguel López', matricula: '3', espacios: '3', equipo: '3' }
  ];
  
  const table = document.getElementById('activityTable');
  
  function renderTable() {
    table.innerHTML = '';
    activities.forEach((a, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${a.nombre}</td>
        <td>${a.profesor}</td>
        <td>${a.matricula}</td>
        <td>${a.espacios}</td>
        <td>${a.equipo}</td>
        <td class="actions">
          <a href="5.html"><button class="edit-btn">Editar</button></a>
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
  
  renderTable();
  